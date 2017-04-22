import nock from 'nock';
import path from 'path';
import os from 'os';
import fs from 'mz/fs';
import pageLoader from '../src';
import { getFileFixtureBefore, getFileFixtureAfter } from './helpers';

const host = 'http://localhost';

describe('test page loader', () => {
  let pathToTempDir;
  let getPathToFileInTempDir;

  beforeAll(() => {
    pathToTempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tmp'));
    getPathToFileInTempDir = pathToSrc => path.join(pathToTempDir, pathToSrc);

    nock(host)
      .get('/test')
      .reply(200, () => getFileFixtureBefore('index.html'))
      .get('/assets/style.css')
      .reply(200, () => getFileFixtureBefore('assets/style.css'))
      .get('/assets/hexlet-logo.svg')
      .reply(200, () => getFileFixtureBefore('assets/hexlet-logo.svg'))
      .get('/assets/script.js')
      .reply(200, () => getFileFixtureBefore('assets/script.js'));
  });

  it('loader is uploaded main html', (done) => {
    console.log(path.join(pathToTempDir, 'localhost-test_files/assets-hexlet-logo.svg'));
    pageLoader(`${host}/test`, pathToTempDir)
      .then(() => [
        getPathToFileInTempDir('localhost-test_files/assets-hexlet-logo.svg'),
        getPathToFileInTempDir('localhost-test_files/assets-style.css'),
        getPathToFileInTempDir('localhost-test_files/assets-script.js'),
      ])
      .then(([pathToSvg, pathToCss, pathToJs]) => Promise.all([
        fs.stat(pathToSvg),
        fs.stat(pathToCss),
        fs.stat(pathToJs),
      ]))
      .then(([statSvg, statCss, statJs]) => {
        // TODO: rewrite with test to check equals length files
        expect(statSvg.isFile()).toBe(true);
        expect(statCss.isFile()).toBe(true);
        expect(statJs.isFile()).toBe(true);
      })
      .then(() => Promise.all([
        fs.readFile(getPathToFileInTempDir('localhost-test.html'), 'utf8'),
        getFileFixtureAfter('localhost-test.html'),
      ]))
      .then(([dataFromTempFile, dataFromFixture]) =>
        expect(dataFromTempFile).toBe(dataFromFixture))
      .then(done)
      .catch(done.fail);
  });
});

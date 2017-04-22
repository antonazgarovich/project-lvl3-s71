import nock from 'nock';
import path from 'path';
import os from 'os';
import fs from 'mz/fs';
import pageLoader from '../src';
import { getFileFixtureBefore, getFileFixtureAfter } from './helpers';

const host = 'http://localhost';

describe('test page loader', () => {
  let pathToTempDir;
  let pathToTempFile;
  let loaderResult;
  beforeAll(() => {
    pathToTempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tmp'));
    pathToTempFile = path.join(pathToTempDir, 'localhost-test.html');

    nock(host)
      .get('/test')
      .reply(200, () => getFileFixtureBefore('index.html'))
      .get('/assets/style.css')
      .reply(200, () => getFileFixtureBefore('assets/style.css'))
      .get('/assets/hexlet-logo.svg')
      .reply(200, () => getFileFixtureBefore('assets/hexlet-logo.svg'))
      .get('/assets/script.js')
      .reply(200, () => getFileFixtureBefore('assets/script.js'));

    loaderResult = pageLoader(`${host}/test`, pathToTempDir);
  });

  it('loader is uploaded main html', (done) => {
    loaderResult
      .then(done)
      .catch(done.fail);
  });

  it('loader is uploaded assets and rename them', (done) => {
    const pathToSvg = path.join(pathToTempDir, 'localhost-test_files', 'assets-hexlet-logo.svg');
    const pathToCss = path.join(pathToTempDir, 'localhost-test_files', 'assets-style.css');
    const pathToJs = path.join(pathToTempDir, 'localhost-test_files', 'assets-script.js');

    Promise
      .all([fs.stat(pathToSvg), fs.stat(pathToCss), fs.stat(pathToJs)])
      .then(([statSvg, statCss, statJs]) => {
        expect(statSvg.isFile()).toBe(true);
        expect(statCss.isFile()).toBe(true);
        expect(statJs.isFile()).toBe(true);
      })
      .then(done)
      .catch(done.fail);
  });

  it('change assets path', (done) => {
    const localhostTestHtmlPath = getFileFixtureAfter('localhost-test.html');

    Promise
      .all([fs.readFile(pathToTempFile), localhostTestHtmlPath])
      .then(([dataFromTempFile, dataFromFixture]) =>
        expect(dataFromTempFile.toString()).toBe(dataFromFixture.toString()))
      .then(done)
      .catch(done.fail);
  });
});

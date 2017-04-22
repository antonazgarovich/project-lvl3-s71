import nock from 'nock';
import path from 'path';
import os from 'os';
import fs from 'mz/fs';
import pageLoader from '../src';
import { getPathToFileFixtureBefore, getPathToFileFixtureAfter } from './helpers';

const host = 'http://localhost';
process.env.DEBUG = 'page-loader:*';

describe('test page loader', () => {
  let pathToTempDir;
  let getPathToFileInTempDir;

  beforeAll(() => {
    pathToTempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tmp'));
    getPathToFileInTempDir = pathToSrc => path.join(pathToTempDir, pathToSrc);

    nock(host)
      .get('/test')
      .reply(200, () => fs.createReadStream(getPathToFileFixtureBefore('index.html')))
      .get('/assets/style.css')
      .reply(200, () => fs.createReadStream(getPathToFileFixtureBefore('assets/style.css')))
      .get('/assets/hexlet-logo.svg')
      .reply(200, () => fs.createReadStream(getPathToFileFixtureBefore('assets/hexlet-logo.svg')))
      .get('/assets/script.js')
      .reply(200, () => fs.createReadStream(getPathToFileFixtureBefore('assets/script.js')));
  });

  it('loader is uploaded main html', (done) => {
    pageLoader(`${host}/test`, pathToTempDir)
      .then(() => [
        [
          getPathToFileInTempDir('localhost-test_files/assets-hexlet-logo.svg'),
          getPathToFileInTempDir('localhost-test_files/assets-style.css'),
          getPathToFileInTempDir('localhost-test_files/assets-script.js'),
        ],
        [
          getPathToFileFixtureAfter('localhost-test_files/assets-hexlet-logo.svg'),
          getPathToFileFixtureAfter('localhost-test_files/assets-style.css'),
          getPathToFileFixtureAfter('localhost-test_files/assets-script.js'),
        ],
      ])
      .then(([tempDir, fixtureAfter]) => Promise.all([
        Promise.all(tempDir.map(asset => fs.stat(asset))),
        Promise.all(fixtureAfter.map(asset => fs.stat(asset))),
      ]))
      .then(([tempDir, fixtureAfter]) => {
        tempDir.forEach((stat, i) => expect(stat.size).toBe(fixtureAfter[i].size));
      })
      .then(() => Promise.all([
        fs.readFile(getPathToFileInTempDir('localhost-test.html'), 'utf8'),
        fs.readFile(getPathToFileFixtureAfter('localhost-test.html'), 'utf8'),
      ]))
      .then(([dataFromTempFile, dataFromFixture]) =>
        expect(dataFromTempFile).toBe(dataFromFixture))
      .then(done)
      .catch(done.fail);
  });
});

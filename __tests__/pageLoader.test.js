import nock from 'nock';
import path from 'path';
import os from 'os';
import fs from 'mz/fs';
import pageLoader from '../src';

const host = 'http://localhost';

const fixturesFolderBefore = path.join(__dirname, 'fixtures', 'before');
const fixturesFolderAfter = path.join(__dirname, 'fixtures', 'after');

describe('test page loader', () => {
  let pathToTempDir;
  let pathToTempFile;
  let loaderResult;
  beforeAll(() => {
    pathToTempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tmp'));
    pathToTempFile = path.join(pathToTempDir, 'localhost-test.html');

    nock(host)
      .get('/test')
      .reply(200, () => fs.createReadStream(path.join(fixturesFolderBefore, 'index.html')))
      .get('/test/assets/style.css')
      .reply(200, () => fs.createReadStream(path.join(fixturesFolderBefore, 'assets', 'style.css')))
      .get('/test/assets/hexlet-logo.svg')
      .reply(200, () => fs.createReadStream(path.join(fixturesFolderBefore, 'assets', 'hexlet-logo.svg')))
      .get('/test/assets/script.js')
      .reply(200, () => fs.createReadStream(path.join(fixturesFolderBefore, 'assets', 'script.js')));

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
    Promise.all([fs.stat(pathToSvg), fs.stat(pathToCss)])
      .then(([statSvg, statCss]) => {
        expect(statSvg).toBe(true);
        expect(statCss).toBe(true);
        done();
      })
      .catch(done.fail);
  });

  it('change assets path', (done) => {
    const localhostTestHtmlPath = path.join(fixturesFolderAfter, 'localhost-test.html');
    Promise.all([fs.readFile(pathToTempFile), fs.readFile(localhostTestHtmlPath)])
      .then(([dataFromTempFile, dataFromFixture]) => {
        expect(dataFromTempFile.toString()).toBe(dataFromFixture.toString());
        done();
      })
      .catch(done.fail);
  });
});

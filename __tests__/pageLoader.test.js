import nock from 'nock';
import path from 'path';
import os from 'os';
import fs from 'mz/fs';
import pageLoader from '../src';
import { getPathToFileFixtureBefore, getPathToFileFixtureAfter } from './helpers';

const host = 'http://localhost';

describe('test page loader', () => {
  let pathToTempDir;
  let getPathToFileInTempDir;

  beforeEach(() => {
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
      .reply(200, () => fs.createReadStream(getPathToFileFixtureBefore('assets/script.js')))
      .get('/not-found-asset')
      .reply(200, '<script src="/assets/not-found-asset.js"></script>')
      .get('/assets/not-found-asset.js')
      .reply(404)
      .get('/no-found')
      .reply(404)
      .get('/server-not-available')
      .reply(500);
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

  it('test file not found 404', (done) => {
    pageLoader(`${host}/no-found`, pathToTempDir)
      .then(done.fail)
      .catch((err) => {
        expect(err).toBe("Error: page isn't found");
        done();
      });
  });

  it('test server 500', (done) => {
    pageLoader(`${host}/server-not-available`, pathToTempDir)
      .then(done.fail)
      .catch((err) => {
        expect(err).toBe("Error: server isn't available");
        done();
      });
  });

  it('test not found assets', (done) => {
    pageLoader(`${host}/not-found-asset`, pathToTempDir)
      .then(done.fail)
      .catch((err) => {
        expect(err).toBe("Error: asset isn't found");
        done();
      });
  });

  it('test file exists', (done) => {
    pageLoader(`${host}/test`, pathToTempDir)
      .then(() => pageLoader(`${host}/test`, pathToTempDir))
      .then(done.fail)
      .catch((err) => {
        expect(err).toBe('Error: file already exists');
        done();
      });
  });

  it('test interrupted by user');
});


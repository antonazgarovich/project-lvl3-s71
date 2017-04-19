import nock from 'nock';
import fs from 'mz/fs';
import path from 'path';
import os from 'os';
import loader from '../src';
import axiosSetting from '../src/lib/axios';

const host = 'http://localhost';
axiosSetting(host);

const fixtureHello = path.join(__dirname, 'fixtures', 'hello.txt');


describe('test page loader', () => {
  let pathToTempDir;
  let pathToTempFile;
  beforeAll(() => {
    pathToTempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tmp'));
    pathToTempFile = path.join(pathToTempDir, 'localhost-test.html');
  });

  it('test upload file', (done) => {
    nock(host)
      .get('/test')
      .reply(200, () => fs.createReadStream(fixtureHello));

    loader(`${host}/test`, pathToTempDir)
      .then(() => fs.readFile(pathToTempFile))
      .then((data) => {
        expect(data.toString()).toBe('Hello World!');
        done();
      })
      .catch(err => done.fail(err));
  });
});

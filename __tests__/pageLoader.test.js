import nock from 'nock';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import fs from 'mz/fs';
import path from 'path';
import os from 'os';
import loader from '../src';

const host = 'http://localhost';

axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;

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
      .then(() => {
        fs.readFile(pathToTempFile).then((data) => {
          expect(data.toString()).toBe('Hello World!');
          done();
        });
      })
      .catch((err) => {
        console.error(err);
      });
  });
});

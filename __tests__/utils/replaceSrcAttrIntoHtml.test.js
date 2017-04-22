import fs from 'mz/fs';
import path from 'path';
import { replaceSrcAttrIntoHtml, generateNameFolderAssetsByUrl, generateNameFileAssetsBySrc } from '../../src/utils';
import { getPathToFileFixtureBefore, getPathToFileFixtureAfter } from '../helpers';

const getPathForAssets = src =>
  path.join(generateNameFolderAssetsByUrl('http://localhost/test'), generateNameFileAssetsBySrc(src));

describe('test replaceSrcAttrIntoHtml', () => {
  it('test', (done) => {
    Promise.all([
      fs.readFile(getPathToFileFixtureBefore('index.html'), 'utf8'),
      fs.readFile(getPathToFileFixtureAfter('localhost-test.html'), 'utf8'),
    ])
      .then(([indexBefore, indexAfter]) => [
        replaceSrcAttrIntoHtml(indexBefore, ['css', 'img', 'script'], getPathForAssets),
        indexAfter,
      ])
      .then(([indexBefore, indexAfter]) => expect(indexBefore).toBe(indexAfter))
      .then(done)
      .catch(done.fail)
    ;
  });
});

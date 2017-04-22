import path from 'path';
import { replaceSrcAttrIntoHtml, generateNameFolderAssetsByUrl, generateNameFileAssetsBySrc } from '../../src/utils';
import { getFileFixtureBefore, getFileFixtureAfter } from '../helpers';

const generatePathToLocalAssets = (url) => {
  const nameFolderAssets = generateNameFolderAssetsByUrl(url);
  return src => path.join(nameFolderAssets, generateNameFileAssetsBySrc(src));
};

describe('test replaceSrcAttrIntoHtml', () => {
  it('test', () => {
    const getPathForAssets = generatePathToLocalAssets('http://localhost/test');
    const indexBefore = getFileFixtureBefore('index.html');
    const indexAfter = getFileFixtureAfter('localhost-test.html');
    expect(replaceSrcAttrIntoHtml(indexBefore, ['css', 'img', 'script'], getPathForAssets)).toBe(indexAfter);
  });
});

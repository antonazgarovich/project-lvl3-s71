import { getSrcAttrByAssets } from '../../src/utils';
import { getFileFixtureBefore } from '../helpers';

describe('test getUrlsToAssetsFromHtml', () => {
  let htmlContent;

  beforeAll(() => {
    htmlContent = getFileFixtureBefore('index.html');
  });

  it('test', () => {
    const urlsToAssets = getSrcAttrByAssets(htmlContent, ['css', 'img', 'script']);
    const result = ['assets/style.css', 'assets/hexlet-logo.svg', 'assets/script.js'];
    expect(urlsToAssets).toEqual(result);
  });
});

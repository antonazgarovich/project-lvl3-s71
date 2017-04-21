import fs from 'fs';
import path from 'path';
import { getUrlsToAssetsFromHtml } from '../../src/utils';

describe('test getUrlsToAssetsFromHtml', () => {
  let htmlContent;

  beforeAll(() => {
    htmlContent = fs.readFileSync(path.resolve('__tests__/fixtures/before/index.html'));
  });

  it('test', () => {
    const urlsToAssets = getUrlsToAssetsFromHtml(htmlContent);
    const result = ['assets/style.css', 'assets/hexlet-logo.svg', 'assets/script.js'];
    expect(urlsToAssets).toEqual(result);
  });
});

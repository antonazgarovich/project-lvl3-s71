import fs from 'mz/fs';
import { getSrcAttrByAssets } from '../../src/utils';
import { getPathToFileFixtureBefore } from '../helpers';

describe('test getUrlsToAssetsFromHtml', () => {
  it('test', (done) => {
    fs.readFile(getPathToFileFixtureBefore('index.html'), 'utf8')
      .then(htmlContent => getSrcAttrByAssets(htmlContent, ['css', 'img', 'script']))
      .then(urlsToAssets =>
        expect(urlsToAssets).toEqual(['assets/style.css', 'assets/hexlet-logo.svg', 'assets/script.js']))
      .then(done)
      .then(done.fail);
  });
});

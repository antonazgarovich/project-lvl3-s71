import fs from 'mz/fs';
import path from 'path';
import axios from './lib/axios';
import { getNameFromUrl } from './utils';

// Common logic
// Page - it's mean html with assets(img, css, js).
// I.  downloadPage
// II. transformPageToLocalResource
// II. putsPage
//
// Details:
// 1. downloadPage(url)
//   1) downloadHtml(url)
//   2) downloadAssets(htmlContent)
//      1) getUrlsToAssetsFromHtml(htmlContent)
// 2. transformPageToLocalResource(htmlContent)
//   1) replaceSrcPathAtHtml
// 3. putsPage(htmlContent, assets)
//   1) putsHtmlToFile(pathToFile)
//      1) generateNameHtmlByUrl(url)
//   2) putsAssetsToFolder(pathToFolder)
//      1) generateNameFolderAssetsByUrl(url)

const pageLoader = (url, output = '.') => {
  const pathOutput = path.resolve(output, getNameFromUrl(url));
  return axios.get(url)
    .then(res => fs.writeFile(pathOutput, res.data))
    .then(() => Promise.resolve(pathOutput));
};

export default pageLoader;

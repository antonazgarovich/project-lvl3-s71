import downloadPage from './downloadPage';
import convertPageToLocal from './convertPageToLocal';
import putPage from './putPage';

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
// 3. putPage(pathToPut, htmlContent, assets)
//   1) putHtmlToFile(pathToFile)
//      1) generateNameHtmlByUrl(url)
//   2) putAssetsToFolder(pathToFolder)
//      1) generateNameFolderAssetsByUrl(url)

const pageLoader = (url, output = '.') => {
  const pugPageBinded = putPage.bind(null, output);
  return downloadPage(url)
    .then(convertPageToLocal)
    .then(pugPageBinded);
};

export default pageLoader;

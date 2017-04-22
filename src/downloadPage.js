import { resolve as resolveUrl } from 'url';
import { downloadFileByUrl, getUrlsToAssetsFromHtml } from './utils';

// 1. downloadPage(url)
//   1) downloadHtml(url)
//   2) downloadAssets(htmlContent)
//      1) getUrlsToAssetsFromHtml(htmlContent)
// TODO: rename to load all in file
const downloadHtml = url => downloadFileByUrl(url);

const downloadAssets = (urlToResource, htmlContent) => {
  const pathToSrcAssets = getUrlsToAssetsFromHtml(htmlContent);

  return Promise.all(
    pathToSrcAssets.map(pathToSrc =>
      downloadFileByUrl(resolveUrl(urlToResource, pathToSrc))
        .then(content => ({ type: 'assets', src: pathToSrc, content }))));
};

// TODO: add jsdoc
// TODO: rename to loadPage
const downloadPage = url =>
  downloadHtml(url)
    .then(htmlContent => Promise.all([htmlContent, downloadAssets(url, htmlContent)]))
    .then(([htmlContent, assets]) => [{ type: 'html', url, content: htmlContent }, assets]);
    // TODO: replace result to object Page


export default downloadPage;

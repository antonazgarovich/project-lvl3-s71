import { resolve as resolveUrl } from 'url';
import { downloadFileByUrl, getUrlsToAssetsFromHtml } from './utils';

// 1. downloadPage(url)
//   1) downloadHtml(url)
//   2) downloadAssets(htmlContent)
//      1) getUrlsToAssetsFromHtml(htmlContent)
const downloadHtml = url => downloadFileByUrl(url);

const downloadAssets = (urlToResource, htmlContent) => {
  const urlsOfAssets = getUrlsToAssetsFromHtml(htmlContent);

  return Promise.all(
    urlsOfAssets.map(assetUrl =>
      downloadFileByUrl(resolveUrl(urlToResource, assetUrl))
        .then(({ data }) => data)));
};

// TODO: add jsdoc
const downloadPage = url =>
  downloadHtml(url)
    .then(({ data: htmlContent }) => htmlContent)
    .then(htmlContent => Promise.all([htmlContent, downloadAssets(url, htmlContent)]));


export default downloadPage;

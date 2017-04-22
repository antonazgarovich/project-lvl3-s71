import { resolve as resolveUrl } from 'url';
import { downloadFileByUrl, getUrlsToAssetsFromHtml } from './utils';

const downloadHtml = url => downloadFileByUrl(url);

const downloadAssets = (urlToResource, htmlContent) => {
  const pathToSrcAssets = getUrlsToAssetsFromHtml(htmlContent);

  return Promise.all(
    pathToSrcAssets.map(pathToSrc =>
      downloadFileByUrl(resolveUrl(urlToResource, pathToSrc))
        .then(content => ({ src: pathToSrc, content }))));
};

const downloadPage = url =>
  downloadHtml(url)
    .then(htmlContent =>
      Promise.all([{ url, content: htmlContent }, downloadAssets(url, htmlContent)]));


export default downloadPage;

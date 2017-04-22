import { resolve as resolveUrl } from 'url';
import { getUrlsToAssetsFromHtml } from './utils';
import axios from './lib/axios';

const downloadAssets = (urlToResource, htmlContent) => {
  const pathToSrcAssets = getUrlsToAssetsFromHtml(htmlContent);

  return Promise.all(
    pathToSrcAssets.map(pathToSrc =>
      axios.get(resolveUrl(urlToResource, pathToSrc))
        .then(({ data }) => data)
        .then(content => ({ src: pathToSrc, content }))));
};

const downloadPage = url =>
  axios.get(url)
    .then(({ data }) => data)
    .then(htmlContent =>
      Promise.all([{ url, content: htmlContent }, downloadAssets(url, htmlContent)]));


export default downloadPage;

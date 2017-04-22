import { resolve as resolveUrl } from 'url';
import { getUrlsToAssetsFromHtml } from './utils';
import axios from './lib/axios';

const loadAsset = (urlToResource, pathToSrc) =>
  axios.get(resolveUrl(urlToResource, pathToSrc))
    .then(({ data }) => data)
    .then(content => ({ src: pathToSrc, content }));

const downloadPage = url =>
  axios
    .get(url)
    .then(({ data: content }) => ({ url, content }))
    .then((html) => {
      const pathsToSrcAssetsFromHtml = getUrlsToAssetsFromHtml(html.content);

      return Promise
        .all(pathsToSrcAssetsFromHtml.map(loadAsset.bind(null, html.url)))
        .then(assets => [html, assets]);
    });


export default downloadPage;

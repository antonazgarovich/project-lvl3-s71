import { resolve as resolveUrl } from 'url';
import debug from 'debug';
import { getSrcAttrByAssets } from './utils';
import axios from './lib/axios';

const http = debug('page-loader:http');

const loadAsset = (urlToResource, pathToSrc) => {
  http('start load asset %s', pathToSrc);
  return axios
    .get(resolveUrl(urlToResource, pathToSrc))
    .then(({ data }) => data)
    .then((response) => {
      http('finished load asset %s', pathToSrc);
      return response;
    })
    .then(content => ({ src: pathToSrc, content }));
};

export default (url) => {
  http('start load html %s', url);
  return axios
    .get(url)
    .then((response) => {
      http('finished load html %s', url);
      return response;
    })
    .then(({ data: content }) => ({ url, content }))
    .then((html) => {
      const pathsToSrcAssetsFromHtml = getSrcAttrByAssets(html.content, ['css', 'img', 'script']);

      return Promise
        .all(pathsToSrcAssetsFromHtml.map(loadAsset.bind(null, html.url)))
        .then(assets => [html, assets]);
    });
};

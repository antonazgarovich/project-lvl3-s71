import { resolve as resolveUrl } from 'url';
import { getSrcAttrOfAssets } from './utils';
import axios from './lib/axios';

const loadAsset = (urlToResource, pathToSrc) =>
  axios
    .get(resolveUrl(urlToResource, pathToSrc))
    .then(({ data }) => data)
    .then(content => ({ src: pathToSrc, content }));

export default url =>
  axios
    .get(url)
    .then(({ data: content }) => ({ url, content }))
    .then((html) => {
      const pathsToSrcAssetsFromHtml = getSrcAttrOfAssets(html.content, ['css', 'img', 'script']);

      return Promise
        .all(pathsToSrcAssetsFromHtml.map(loadAsset.bind(null, html.url)))
        .then(assets => [html, assets]);
    });

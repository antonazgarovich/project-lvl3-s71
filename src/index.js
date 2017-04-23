import { resolve as resolveUrl } from 'url';
import debug from 'debug';
import path from 'path';
import fs from 'mz/fs';
import axios from './lib/axios';
import {
  replaceSrcAttrIntoHtml, generateNameFolderAssetsByUrl, generateNameFileAssetsBySrc,
  generateNameHtmlByUrl, getSrcAttrByAssets,
} from './utils';

const http = debug('page-loader:http');
const app = debug('page-loader:app');
const fsDebug = debug('page-loader:fs');

const listrFiles = (ctx, data) => (ctx ? ctx.links = data : null); // eslint-disable-line
const listrPage = (ctx, data) => (ctx ? ctx.page = data : null); // eslint-disable-line

const loadAsset = (urlToResource, pathToSrc) => {
  http('start load asset: %s', pathToSrc);
  const url = resolveUrl(urlToResource, pathToSrc);
  return axios
    .get(url)
    .then(({ data }) => data)
    .then((response) => {
      http('finished load asset: %s', pathToSrc);
      return response;
    })
    .then(content => ({ url, src: pathToSrc, content }));
};


// FIXME: don't download page if file exists
export default (url, output = '.', ctx) => {
  app('start work');
  http('start load html: %s', url);
  return axios
    .get(url)
    .then((response) => {
      http('finished load html: %s', url);
      listrPage(ctx, url);
      return response;
    })
    .then(({ data: content }) => ({ url, content }))
    .then((html) => {
      const pathsToSrcAssetsFromHtml = getSrcAttrByAssets(html.content, ['css', 'img', 'script']);

      listrFiles(ctx, pathsToSrcAssetsFromHtml);
      return Promise
        .all(pathsToSrcAssetsFromHtml.map(loadAsset.bind(null, html.url)))
        .then(assets => [html, assets]);
    })
    .then(([html, assets]) => {
      const nameOfFolderAsset = generateNameFolderAssetsByUrl(html.url);
      app('finish generate name folder assets');

      const htmlContentWithLocalAssets = replaceSrcAttrIntoHtml(html.content, ['css', 'img', 'script'], src =>
        path.join(nameOfFolderAsset, generateNameFileAssetsBySrc(src)));
      app('finish replace src of assets into html');

      const localNameOfHtml = generateNameHtmlByUrl(html.url);
      app('finish generate name of html');

      const assetsWithLocalName = assets
        .map(asset => ({ ...asset, localName: generateNameFileAssetsBySrc(asset.src) }));
      app('finish add local name of assets');

      return [
        { url: html.url, localName: localNameOfHtml, content: htmlContentWithLocalAssets },
        { nameOfFolderAsset, assets: assetsWithLocalName },
      ];
    })
    .then(([html, { nameOfFolderAsset, assets }]) => {
      fsDebug('start create assets folder: %s', nameOfFolderAsset);
      return fs.mkdir(path.resolve(output, nameOfFolderAsset))
        .then(() => fsDebug('finish create assets folder: %s', nameOfFolderAsset))
        .then(() => assets.map(asset =>
          ({ ...asset, localPath: path.resolve(output, nameOfFolderAsset, asset.localName) })))
        .then(assetsWithLocalPaths => [
          ...assetsWithLocalPaths,
          { localPath: path.resolve(output, html.localName), content: html.content, url: html.url },
        ])
        .then(data =>
          Promise
            .all(data.map(({ localPath, content }) => {
              fsDebug('start write file to path: %s', localPath);
              return fs.writeFile(localPath, content)
                .then(() => fsDebug('finished write file to path: %s', localPath));
            }))
            .then(() => app('finish work'))
            .then(() => data))
        .then(data => data.map(asset => asset.localPath));
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 404) {
          return Promise.reject(`Error: file isn't found by url ${err.config.url}`);
        } else if (err.response.status === 500) {
          return Promise.reject("Error: server isn't available");
        }
      } else if (err.code === 'EEXIST') {
        return Promise.reject('Error: file already exists');
      }

      return Promise.reject(err);
    });
};

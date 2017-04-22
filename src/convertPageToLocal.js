import path from 'path';
import debug from 'debug';
import {
  replaceSrcAttrIntoHtml,
  generateNameFolderAssetsByUrl,
  generateNameFileAssetsBySrc,
  generateNameHtmlByUrl,
} from './utils';

const app = debug('page-loader:app');

const convertPageToLocal = ([html, assets]) => {
  const nameOfFolderAsset = generateNameFolderAssetsByUrl(html.url);
  app('finish generate name folder assets');

  const htmlContentWithLocalAssets = replaceSrcAttrIntoHtml(html.content, ['css', 'img', 'script'], src =>
    path.join(nameOfFolderAsset, generateNameFileAssetsBySrc(src)));
  app('finish replace src of assets into html');

  const localNameOfHtml = generateNameHtmlByUrl(html.url);
  app('finish generate name of html');

  const assetsWithLocalName = assets
    .map(({ src, content }) => ({ localName: generateNameFileAssetsBySrc(src), content }));
  app('finish add local name of assets');

  return [
    { url: html.url, localName: localNameOfHtml, content: htmlContentWithLocalAssets },
    { nameOfFolderAsset, assets: assetsWithLocalName },
  ];
};

export default convertPageToLocal;

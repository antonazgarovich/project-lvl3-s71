import path from 'path';
import {
  replaceSrcPathIntoHtml,
  generateNameFolderAssetsByUrl,
  generateNameFileAssetsBySrc,
  generateNameHtmlByUrl,
} from './utils';

const convertPageToLocal = ([html, assets]) => {
  const nameOfFolderAsset = generateNameFolderAssetsByUrl(html.url);

  const htmlContentWithLocalAssets = replaceSrcPathIntoHtml(html.content, src =>
    path.join(nameOfFolderAsset, generateNameFileAssetsBySrc(src)));
  const localNameOfHtml = generateNameHtmlByUrl(html.url);

  const assetsWithLocalName = assets
    .map(({ src, content }) => ({ localName: generateNameFileAssetsBySrc(src), content }));

  return [
    { url: html.url, localName: localNameOfHtml, content: htmlContentWithLocalAssets },
    { nameOfFolderAsset, assets: assetsWithLocalName },
  ];
};

export default convertPageToLocal;

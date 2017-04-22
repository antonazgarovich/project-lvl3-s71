import path from 'path';
import { replaceSrcPathIntoHtml, generateNameFolderAssetsByUrl, generateNameFileAssetsBySrc, generateNameHtmlByUrl } from './utils';


const generatePathToLocalAssets = (url) => {
  const nameFolderAssets = generateNameFolderAssetsByUrl(url);
  return src => path.join(nameFolderAssets, generateNameFileAssetsBySrc(src));
};

const convertHtmlToLocal = (html) => {
  const getPathForAssets = generatePathToLocalAssets(html.url);

  const newHtmlContent = replaceSrcPathIntoHtml(html.content, getPathForAssets);
  const localPath = generateNameHtmlByUrl(html.url);
  const pathToFolderAsset = generateNameFolderAssetsByUrl(html.url);

  return { ...html, content: newHtmlContent, localPath, pathToFolderAsset };
};

const convertAssetsToLocal = (assets, url) => {
  const getPathForAssets = generatePathToLocalAssets(url);
  return assets.map(asset => ({ ...asset, localPath: getPathForAssets(asset.src) }));
};

const convertPageToLocal = ([html, assets]) =>
  [convertHtmlToLocal(html), convertAssetsToLocal(assets, html.url)];

export default convertPageToLocal;

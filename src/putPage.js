import path from 'path';
import fs from 'mz/fs';
import debug from 'debug';

const fsDebug = debug('page-loader:fs');
const app = debug('page-loader:app');

const putPage = (output, [html, { nameOfFolderAsset, assets }]) => {
  fsDebug('start create assets folder: %s', nameOfFolderAsset);
  return fs.mkdir(path.resolve(output, nameOfFolderAsset))
    .then(() => fsDebug('finish create assets folder: %s', nameOfFolderAsset))
    .then(() => assets.map(asset =>
      ({ ...asset, localPath: path.resolve(output, nameOfFolderAsset, asset.localName) })))
    .then(assetsWithLocalPaths => [
      ...assetsWithLocalPaths,
      { localPath: path.resolve(output, html.localName), content: html.content },
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
};

export default putPage;

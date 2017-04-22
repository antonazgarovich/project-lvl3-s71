import path from 'path';
import fs from 'mz/fs';

const putPage = (output, [html, { nameOfFolderAsset, assets }]) =>
  fs.mkdir(path.resolve(output, nameOfFolderAsset))
    .then(() => assets.map(asset =>
      ({ ...asset, localPath: path.resolve(output, nameOfFolderAsset, asset.localName) })))
    .then(assetsWithLocalPaths => [
      ...assetsWithLocalPaths,
      { localPath: path.resolve(output, html.localName), content: html.content },
    ])
    .then(data =>
      Promise
        .all(data.map(({ localPath, content }) => fs.writeFile(localPath, content)))
        .then(() => data))
    .then(data => data.map(asset => asset.localPath));

export default putPage;

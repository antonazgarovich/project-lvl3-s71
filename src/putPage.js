import path from 'path';
import fs from 'mz/fs';

// TODO: added report when put page
const putPage = (output, [html, assets]) =>
  fs.mkdir(path.resolve(output, assets.nameOfFolderAsset))
    .then(() => assets.assets.map(asset =>
      ({ ...asset, localPath: path.resolve(output, assets.nameOfFolderAsset, asset.localName) })))
    .then(assetsWithLocalPaths => [
      ...assetsWithLocalPaths,
      { localPath: path.resolve(output, html.localName), content: html.content },
    ])
    .then(data => Promise.all(data.map(({ localPath, content }) =>
      fs.writeFile(localPath, content))))
    .then(() => console.log('success', output));

export default putPage;

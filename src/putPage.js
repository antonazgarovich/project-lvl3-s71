import path from 'path';
import fs from 'mz/fs';

const getPathToPut = (output, pathToPut) => path.resolve(output, pathToPut);

const createFolderForAssets = pathToFolder => fs.mkdir(pathToFolder);

const putPage = (output, [html, assets]) => {
  const getPathToPutBinded = getPathToPut.bind(null, output);

  const writeFile = asset => fs.writeFile(getPathToPutBinded(asset.localPath), asset.content);

  return createFolderForAssets(getPathToPutBinded(html.pathToFolderAsset))
    .then(() => Promise.all([html, ...assets].map(writeFile)));
};

export default putPage;

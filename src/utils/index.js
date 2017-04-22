import { parse } from 'url';
import cheerio from 'cheerio';

export const generateNameHtmlByUrl = (url) => {
  const { hostname, path } = parse(url);
  const hostName = hostname.split('.').join('-');
  if (path.length === 1) {
    return `${hostName}.html`;
  }

  const pathName = path.split('.')[0]
    .split('/').join('-');

  return `${hostName}${pathName}.html`;
};

export const generateNameFolderAssetsByUrl = (url) => {
  const { hostname, path } = parse(url);
  const hostName = hostname.split('.').join('-');
  if (path.length === 1) {
    return `${hostName}_files`;
  }

  const pathName = path.split('.')[0]
    .split('/').join('-');

  return `${hostName}${pathName}_files`;
};

export const generateNameFileAssetsBySrc = src =>
  src.split('/').filter(path => path).join('-');

const listOfTypeAssets = {
  css: {
    selector: 'link[rel=stylesheet]',
    attrSrc: 'href',
  },
  img: {
    selector: 'img',
    attrSrc: 'src',
  },
  script: {
    selector: 'script',
    attrSrc: 'src',
  },
};

export const getSrcAttrByAssets = (htmlContent, typesAssets) => {
  const $ = cheerio.load(htmlContent);

  return typesAssets.reduce((acc, type) => {
    const asset = listOfTypeAssets[type];

    const listOfAssets = $(`${asset.selector}[${asset.attrSrc}]`)
      .filter((e, el) =>
        $(el).attr(asset.attrSrc))
      .map((e, el) =>
        $(el).attr(asset.attrSrc))
      .get();

    return [...acc, ...listOfAssets];
  }, []);
};

export const replaceSrcAttrIntoHtml = (htmlContent, typesAssets, func) => {
  const $ = cheerio.load(htmlContent);

  typesAssets.forEach((type) => {
    const asset = listOfTypeAssets[type];

    $(`${asset.selector}[${asset.attrSrc}]`)
      .filter((e, el) =>
        $(el).attr(asset.attrSrc))
      .map((e, el) =>
        $(el).attr(asset.attrSrc, func($(el).attr(asset.attrSrc))));
  });

  return $.html();
};

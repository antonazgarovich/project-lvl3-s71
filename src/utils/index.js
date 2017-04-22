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

// TODO: use polymorphism
export const getUrlsToAssetsFromHtml = (htmlContent) => {
  const $ = cheerio.load(htmlContent);

  const links = $('link[rel=stylesheet]')
    .filter((e, el) => $(el).attr('href'))
    .map((e, el) => $(el).attr('href'))
    .get();

  const images = $('img[src]')
    .filter((e, el) => $(el).attr('src'))
    .map((e, el) => $(el).attr('src'))
    .get();

  const scripts = $('script[src]')
    .filter((e, el) => $(el).attr('src'))
    .map((e, el) => $(el).attr('src'))
    .get();

  return links.concat(images, scripts);
};

// TODO: use polymorphism
export const replaceSrcPathIntoHtml = (htmlContent, func) => {
  const $ = cheerio.load(htmlContent);

  $('link[rel=stylesheet]')
    .filter((e, el) => $(el).attr('href'))
    .map((e, el) => $(el).attr('href', func($(el).attr('href'))));

  $('img[src]')
    .filter((e, el) => $(el).attr('src'))
    .map((e, el) => $(el).attr('src', func($(el).attr('src'))));

  $('script[src]')
    .filter((e, el) => $(el).attr('src'))
    .map((e, el) => $(el).attr('src', func($(el).attr('src'))));

  return $.html();
};

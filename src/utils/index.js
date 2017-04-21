import { parse } from 'url';
import cheerio from 'cheerio';
import axios from '../lib/axios';

const downloadFileByUrl = url => axios.get(url);

const getNameFromUrl = (url) => {
  const { hostname, path } = parse(url);
  const hostName = hostname.split('.').join('-');
  if (path.length === 1) {
    return `${hostName}.html`;
  }

  const pathName = path.split('.')[0]
    .split('/').join('-');

  return `${hostName}${pathName}.html`;
};

const getUrlsToAssetsFromHtml = (htmlContent) => {
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

export { downloadFileByUrl, getNameFromUrl, getUrlsToAssetsFromHtml };

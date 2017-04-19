import { parse } from 'url';

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

export { getNameFromUrl }; // eslint-disable-line

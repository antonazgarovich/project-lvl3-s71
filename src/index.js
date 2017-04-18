import axios from 'axios';
import fs from 'mz/fs';
import path from 'path';
import { getNameFromUrl } from './utils';

const loader = (url, output = '.') => {
  const pathOutput = path.resolve(output, getNameFromUrl(url));
  return axios.get(url)
    .then(res => fs.writeFile(pathOutput, res.data))
    .then(() => Promise.resolve(pathOutput))
    .catch((err) => {
      console.error(err);
      return Promise.reject(err);
    });
};

module.exports = loader;

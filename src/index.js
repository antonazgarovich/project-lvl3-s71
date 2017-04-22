import downloadPage from './downloadPage';
import convertPageToLocal from './convertPageToLocal';
import putPage from './putPage';

const pageLoader = (url, output = '.') => {
  const pugPageBinded = putPage.bind(null, output);
  return downloadPage(url)
    .then(convertPageToLocal)
    .then(pugPageBinded);
};

export default pageLoader;

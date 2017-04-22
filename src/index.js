import downloadPage from './downloadPage';
import convertPageToLocal from './convertPageToLocal';
import putPage from './putPage';

export default (url, output = '.') =>
  downloadPage(url)
    .then(convertPageToLocal)
    .then(putPage.bind(null, output));

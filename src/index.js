import downloadPage from './downloadPage';
import convertPageToLocal from './convertPageToLocal';
import putPage from './putPage';

// FIXME: don't download page if file exists
export default (url, output = '.') =>
  downloadPage(url)
    .then(convertPageToLocal)
    .then(putPage.bind(null, output));

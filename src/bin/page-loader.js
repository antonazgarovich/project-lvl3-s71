#!/usr/bin/env node

import program from 'commander';
import pageLoader from '..';

program
  .version('0.0.0')
  .arguments('<url>')
  .description('Downloads the page from the network and puts it in the current folder.')
  .option('-o, --output', 'output folder')
  .action((url, { output }) =>
    pageLoader(url, output)
      .then(pathToFile => console.log('Uploaded to:', pathToFile))
      .catch(err => console.error('Errors: ', err)))
  .parse(process.argv);

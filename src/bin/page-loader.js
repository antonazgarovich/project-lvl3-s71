#!/usr/bin/env node

import program from 'commander';
import pageLoader from '..';

let run = false;

program
  .version('0.0.0')
  .arguments('<url>')
  .description('Downloads the page from the network and puts it in the current folder.')
  .option('-o, --output', 'output folder')
  .action((url, { output = './' }) => {
    run = true;
    console.log('Start download url:', url, 'path:', output);
    pageLoader(url, output)
      .then((pathsFiles) => {
        if (!process.env.DEBUG) {
          pathsFiles.forEach(path => console.log(path));
        }
        console.log('Finish download');
      })
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });
  })
  .parse(process.argv);

if (!run) {
  console.error('Error: added url');
  process.exit(1);
}

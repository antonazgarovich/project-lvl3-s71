#!/usr/bin/env node

import Listr from 'listr';
import program from 'commander';
import colors from 'colors'; // eslint-disable-line
import pageLoader from '..';

let run = false;

program
  .version('0.0.0')
  .arguments('<url>')
  .description('Downloads the page from the network and puts it in the current folder.')
  .option('-o, --output', 'output folder')
  .action((url, { output = './' }) => {
    run = true;

    const tasks = new Listr([
      {
        title: `Saving page ${url}`.green,
        task: () =>
          new Listr([
            {
              title: 'Uploading'.cyan,
              task: ctx =>
                pageLoader(url, output, ctx)
                  .then(res => (ctx.res = res))
                  .then(() => new Listr([
                    {
                      title: 'Loading page'.cyan,
                      task: () => console.log((` ${'✔'.green}  Page ${ctx.page} is ready\n`)),
                    },
                    {
                      title: 'Loading files'.cyan,
                      task: () => ctx.links.forEach(link =>
                        console.log((` ${'✔'.green}  File ${link} is ready`))),
                    },
                  ])),
            },

          ]),
      },
    ]);

    return tasks.run()
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

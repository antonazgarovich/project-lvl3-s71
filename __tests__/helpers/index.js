import path from 'path';
import fs from 'mz/fs';

const fixturesFolderBefore = path.join(__dirname, '..', 'fixtures', 'before');
const fixturesFolderAfter = path.join(__dirname, '..', 'fixtures', 'after');

const getFileFixtureBefore = pathToFile =>
  fs.createReadStream(path.resolve(fixturesFolderBefore, pathToFile));

const getFileFixtureAfter = pathToFile =>
  fs.createReadStream(path.resolve(fixturesFolderAfter, pathToFile));

export { getFileFixtureBefore, getFileFixtureAfter }; // eslint-disable-line
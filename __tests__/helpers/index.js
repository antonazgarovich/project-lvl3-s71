import path from 'path';

const fixtures = path.join(__dirname, '..', 'fixtures');

export const getPathToFileFixtureBefore = pathToFile =>
  path.join(fixtures, 'before', pathToFile);

export const getPathToFileFixtureAfter = pathToFile =>
  path.join(fixtures, 'after', pathToFile);

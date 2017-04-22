import { generateNameHtmlByUrl } from '../../src/utils/index';

describe('test getNameFromUrl', () => {
  it('only hostName', () => {
    expect(generateNameHtmlByUrl('https://hexlet.io/')).toBe('hexlet-io.html');
  });

  it('without format', () => {
    expect(generateNameHtmlByUrl('https://hexlet.io/courses/1/2')).toBe('hexlet-io-courses-1-2.html');
  });

  it('with format html', () => {
    expect(generateNameHtmlByUrl('https://hexlet.io/courses/1/2.html')).toBe('hexlet-io-courses-1-2.html');
  });
});

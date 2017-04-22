import { generateNameFileAssetsBySrc } from '../../src/utils';

describe('test generateNameFileAssetsBySrc', () => {
  it('test', () => {
    expect(generateNameFileAssetsBySrc('/assets/application.css')).toBe('assets-application.css');
  });
});

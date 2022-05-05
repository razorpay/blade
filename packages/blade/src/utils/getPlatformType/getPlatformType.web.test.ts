import getPlatformType from './getPlatformType';

describe('getPlatformType', () => {
  it(`should return 'browser'`, () => {
    expect(getPlatformType()).toEqual('browser');
  });

  it(`should return 'node'`, () => {
    Object.defineProperty(global, 'document', {});
    expect(getPlatformType()).toEqual('node');
  });
});

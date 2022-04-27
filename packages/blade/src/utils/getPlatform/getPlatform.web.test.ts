import getPlatform from './getPlatform';

describe('getPlatform', () => {
  it(`should return 'browser'`, () => {
    expect(getPlatform()).toEqual('browser');
  });

  it(`should return 'node'`, () => {
    Object.defineProperty(global, 'document', {});
    expect(getPlatform()).toEqual('node');
  });
});

import { getPlatformType } from './getPlatformType';

describe('getPlatformType', () => {
  it(`should return 'browser'`, () => {
    expect(getPlatformType()).toEqual('browser');
  });

  it(`should return 'node'`, () => {
    Object.defineProperty(global, 'document', {});
    expect(getPlatformType()).toEqual('node');
  });

  it(`should return 'unknown' when none of the platform matches`, () => {
    Object.defineProperty(global, 'document', {});
    Object.defineProperty(global, 'process', {});
    expect(getPlatformType()).toEqual('unknown');
  });
});

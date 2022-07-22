import { getPlatformType } from './getPlatformType';

describe('getPlatformType', () => {
  it(`should return 'react-native'`, () => {
    expect(getPlatformType()).toEqual('react-native');
  });
});

import getPlatform from './getPlatform';

describe('getPlatform', () => {
  it(`should return 'react-native'`, () => {
    expect(getPlatform()).toEqual('react-native');
  });
});

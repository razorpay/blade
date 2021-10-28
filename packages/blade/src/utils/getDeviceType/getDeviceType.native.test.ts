import getDeviceType from './';

describe('getDeviceType', () => {
  Object.defineProperty(global.navigator, 'product', {
    value: 'ReactNative',
  });
  it(`should return "mobile" when request is served from react native application`, () => {
    const deviceType = getDeviceType();
    expect(deviceType).toEqual('mobile');
  });
});

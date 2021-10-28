import { clear, mockUserAgent } from 'jest-useragent-mock';
import getDeviceType from './';

describe('getDeviceType', () => {
  afterEach(() => {
    clear();
  });

  it(`should return "mobile" when request is served from mobile`, () => {
    const mobileUserAgent =
      'Mozilla/5.0 (Linux; Android 6.0.1; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Mobile Safari/537.36';
    mockUserAgent(mobileUserAgent);
    const deviceType = getDeviceType();
    expect(deviceType).toEqual('mobile');
  });

  it(`should return "mobile" when request is served from tablet`, () => {
    const tabletUserAgent =
      'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1';
    mockUserAgent(tabletUserAgent);
    const deviceType = getDeviceType();
    expect(deviceType).toEqual('mobile');
  });

  it(`should return "desktop" when request is served from desktop`, () => {
    const desktopUserAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36';
    mockUserAgent(desktopUserAgent);
    const deviceType = getDeviceType();
    expect(deviceType).toEqual('desktop');
  });
});

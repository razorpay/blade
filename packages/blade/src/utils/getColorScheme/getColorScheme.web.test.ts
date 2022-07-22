import MatchMediaMock from 'jest-matchmedia-mock';
import { getColorScheme } from './getColorScheme';

const mediaQueryLight = '(prefers-color-scheme: light)';
const mediaQueryDark = '(prefers-color-scheme: dark)';

describe('getColorScheme', () => {
  let matchMedia: MatchMediaMock;

  beforeEach(() => {
    matchMedia = new MatchMediaMock();
  });
  afterEach(() => {
    matchMedia.clear();
  });

  it(`should return "light" when passed "light"`, () => {
    const colorScheme = getColorScheme('light');
    expect(colorScheme).toBe('light');
  });

  it(`should return "dark" when passed "dark"`, () => {
    const colorScheme = getColorScheme('dark');
    expect(colorScheme).toBe('dark');
  });

  it(`should return "light" when passed "system" and OS scheme is "light"`, () => {
    matchMedia.useMediaQuery(mediaQueryLight);
    const colorScheme = getColorScheme('system');
    expect(colorScheme).toBe('light');
  });

  it(`should return "dark" when passed "system" and OS scheme is "dark"`, () => {
    matchMedia.useMediaQuery(mediaQueryDark);
    const colorScheme = getColorScheme('system');
    expect(colorScheme).toBe('dark');
  });

  it(`should return "light" when nothing is passed`, () => {
    const colorScheme = getColorScheme();
    expect(colorScheme).toBe('light');
  });
});

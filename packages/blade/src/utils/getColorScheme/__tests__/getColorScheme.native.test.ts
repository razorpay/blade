import getColorScheme from '../../getColorScheme';

describe('getColorScheme', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`should return "light" when passed "light"`, () => {
    const colorScheme = getColorScheme('light');
    expect(colorScheme).toBe('light');
  });

  it(`should return "dark" when passed "dark"`, () => {
    const colorScheme = getColorScheme('dark');
    expect(colorScheme).toBe('dark');
  });

  // it(`should return "light" when passed "system" and OS scheme is "light"`, () => {
  //   jest.fn().mockResolvedValueOnce('light');
  //   const colorScheme = getColorScheme('system');
  //   expect(colorScheme).toBe('light');
  // });

  // it(`should return "dark" when passed "system" and OS scheme is "dark"`, () => {
  //   const colorScheme = getColorScheme('system');
  //   expect(colorScheme).toBe('dark');
  // });

  it(`should return "light" when nothing is passed`, () => {
    const colorScheme = getColorScheme();
    expect(colorScheme).toBe('light');
  });
});

import { getMediaQuery } from './getMediaQuery';

describe('getMediaQuery', () => {
  it(`should return only min-width when only min is passed`, () => {
    expect(getMediaQuery({ min: 1024 })).toBe('screen and (min-width: 1024px)');
  });

  it('should return min-width and max-width when both are passed', () => {
    expect(getMediaQuery({ min: 1024, max: 2034 })).toBe(
      'screen and (min-width: 1024px) and (max-width: 2034px)',
    );
  });
});

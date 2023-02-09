import type { Breakpoints } from '~tokens/global';

export const getMediaQuery = (
  breakpointsEntryArray: [keyof Breakpoints, number][],
  index: number,
): string => {
  const breakpointKey = breakpointsEntryArray[index][0];
  const breakpointValue = breakpointsEntryArray[index][1];

  let mediaQuery = '';

  // @TODO: confirm about the breakpoints. Normally I've seen libraries only define breakpoints on min-width and be mobile-first
  if (breakpointKey === 'max') {
    mediaQuery = `screen and (min-width: ${breakpointValue}px)`;
  } else if (breakpointsEntryArray[index - 1]) {
    mediaQuery = `screen and (min-width: ${
      breakpointsEntryArray[index - 1][1] + 1
    }px) and (max-width: ${breakpointValue}px)`;
  } else {
    mediaQuery = `screen and (max-width: ${breakpointValue}px)`;
  }

  return mediaQuery;
};

import type { Breakpoints } from '../../tokens/global/breakpoints';
import { getMediaQuery } from './getMediaQuery';

export type Breakpoint = keyof Breakpoints;

export type BreakpointQuery = {
  token: Breakpoint;
  mediaQuery: string;
};

/**
 * One exclusive media query per breakpoint token, so exactly one matches at any width.
 * Relies on `Breakpoints` keys being declared in ascending order.
 */
export const getBreakpointQueries = (breakpoints: Breakpoints): BreakpointQuery[] => {
  const entries = Object.entries(breakpoints) as [Breakpoint, number][];
  return entries.map(([token, min], index) => {
    const nextMin = entries[index + 1]?.[1];
    return {
      token,
      mediaQuery: getMediaQuery({ min, max: nextMin ? nextMin - 1 : undefined }),
    };
  });
};

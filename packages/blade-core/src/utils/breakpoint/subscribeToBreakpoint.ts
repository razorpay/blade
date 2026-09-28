import type { Breakpoints } from '../../tokens/global/breakpoints';
import type { Breakpoint } from './getBreakpointQueries';
import { getBreakpointQueries } from './getBreakpointQueries';

type MediaQueryChange = { media: string; matches: boolean };

const supportsMatchMedia = (): boolean =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function';

/**
 * Framework-agnostic breakpoint subscription. Calls `onChange` synchronously with the
 * currently matched token, then again whenever the viewport crosses a breakpoint.
 * Returns an unsubscribe function. Never calls back when `matchMedia` is unavailable (SSR).
 */
export const subscribeToBreakpoint = (
  breakpoints: Breakpoints,
  onChange: (matchedBreakpoint: Breakpoint | undefined) => void,
): (() => void) => {
  if (!supportsMatchMedia()) {
    return () => undefined;
  }

  const queries = getBreakpointQueries(breakpoints);

  const findMatched = (): Breakpoint | undefined =>
    queries.find(({ mediaQuery }) => window.matchMedia(mediaQuery).matches)?.token;

  const handleChange = (event: MediaQueryChange): void => {
    // Each crossing fires two events: one for the query being left (matches: false)
    // and one for the query being entered. Only the latter carries new information.
    if (!event.matches) {
      return;
    }
    onChange(findMatched());
  };

  const instances = queries.map(({ mediaQuery }) => {
    const instance = window.matchMedia(mediaQuery);
    instance.addEventListener('change', handleChange);
    return instance;
  });

  onChange(findMatched());

  return () => {
    instances.forEach((instance) => instance.removeEventListener('change', handleChange));
  };
};

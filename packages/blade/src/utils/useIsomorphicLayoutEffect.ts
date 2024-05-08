import * as React from 'react';
import { getPlatformType } from './getPlatformType';

const isBrowser = getPlatformType() == 'browser';

/**
 * useIsomorphicLayoutEffect enables us to safely call `useLayoutEffect` on the browser
 * (for SSR reasons)
 *
 * React currently throws a warning when using useLayoutEffect on the server.
 * To get around it, we can conditionally useEffect on the server (no-op) and
 * useLayoutEffect in the browser.
 *
 * @see https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85
 */
export const useIsomorphicLayoutEffect = isBrowser ? React.useLayoutEffect : React.useEffect;

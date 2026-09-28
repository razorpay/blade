import { describe, expect, it, vi, afterEach } from 'vitest';
import { breakpoints } from '../../tokens/global/breakpoints';
import { getMediaQuery } from './getMediaQuery';
import { getBreakpointQueries } from './getBreakpointQueries';
import { getDeviceType } from './getDeviceType';
import { subscribeToBreakpoint } from './subscribeToBreakpoint';

describe('getMediaQuery', () => {
  it('returns only min-width when only min is passed', () => {
    expect(getMediaQuery({ min: 1024 })).toBe('screen and (min-width: 1024px)');
  });

  it('returns min-width and max-width when both are passed', () => {
    expect(getMediaQuery({ min: 1024, max: 2034 })).toBe(
      'screen and (min-width: 1024px) and (max-width: 2034px)',
    );
  });
});

describe('getBreakpointQueries', () => {
  it('builds non-overlapping ranges in token order, last one open-ended', () => {
    expect(getBreakpointQueries(breakpoints)).toEqual([
      { token: 'base', mediaQuery: 'screen and (min-width: 0px) and (max-width: 319px)' },
      { token: 'xs', mediaQuery: 'screen and (min-width: 320px) and (max-width: 479px)' },
      { token: 's', mediaQuery: 'screen and (min-width: 480px) and (max-width: 767px)' },
      { token: 'm', mediaQuery: 'screen and (min-width: 768px) and (max-width: 1023px)' },
      { token: 'l', mediaQuery: 'screen and (min-width: 1024px) and (max-width: 1199px)' },
      { token: 'xl', mediaQuery: 'screen and (min-width: 1200px)' },
    ]);
  });
});

describe('getDeviceType', () => {
  it('treats base/xs/s (incl. tablet) as mobile', () => {
    expect(getDeviceType('base')).toBe('mobile');
    expect(getDeviceType('xs')).toBe('mobile');
    expect(getDeviceType('s')).toBe('mobile');
  });

  it('treats m/l/xl as desktop', () => {
    expect(getDeviceType('m')).toBe('desktop');
    expect(getDeviceType('l')).toBe('desktop');
    expect(getDeviceType('xl')).toBe('desktop');
  });

  it('defaults to desktop when nothing matched (SSR)', () => {
    expect(getDeviceType(undefined)).toBe('desktop');
  });
});

// blade-core tests run in a node environment, so `window` is stubbed per test.
describe('subscribeToBreakpoint', () => {
  type Listener = (event: { media: string; matches: boolean }) => void;
  const installMatchMedia = (
    matchingQuery: string,
  ): { listeners: Map<string, Listener>; removed: string[] } => {
    const listeners = new Map<string, Listener>();
    const removed: string[] = [];
    vi.stubGlobal('window', {
      matchMedia: (query: string) => ({
        matches: query === matchingQuery,
        media: query,
        addEventListener: (_: string, cb: Listener) => listeners.set(query, cb),
        removeEventListener: (_: string) => removed.push(query),
      }),
    });
    return { listeners, removed };
  };

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls back with the matching token immediately', () => {
    installMatchMedia('screen and (min-width: 1024px) and (max-width: 1199px)');
    const cb = vi.fn();
    subscribeToBreakpoint(breakpoints, cb);
    expect(cb).toHaveBeenCalledWith('l');
  });

  it('calls back with the new token when a media query fires', () => {
    const { listeners } = installMatchMedia('screen and (min-width: 1200px)');
    const cb = vi.fn();
    subscribeToBreakpoint(breakpoints, cb);
    cb.mockClear();

    const sQuery = 'screen and (min-width: 480px) and (max-width: 767px)';
    // Simulate resize xl -> s: s query now reports a match.
    vi.stubGlobal('window', {
      matchMedia: (query: string) => ({ matches: query === sQuery, media: query }),
    });
    listeners.get(sQuery)?.({ media: sQuery, matches: true });

    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith('s');
  });

  it('ignores the change event of the query being left', () => {
    const { listeners } = installMatchMedia('screen and (min-width: 1200px)');
    const cb = vi.fn();
    subscribeToBreakpoint(breakpoints, cb);
    cb.mockClear();

    listeners.get('screen and (min-width: 1200px)')?.({
      media: 'screen and (min-width: 1200px)',
      matches: false,
    });

    expect(cb).not.toHaveBeenCalled();
  });

  it('removes every listener on unsubscribe', () => {
    const { removed } = installMatchMedia('screen and (min-width: 1200px)');
    const unsubscribe = subscribeToBreakpoint(breakpoints, vi.fn());
    unsubscribe();
    expect(removed).toHaveLength(Object.keys(breakpoints).length);
  });

  it('is a no-op without matchMedia (SSR)', () => {
    const cb = vi.fn();
    const unsubscribe = subscribeToBreakpoint(breakpoints, cb);
    expect(cb).not.toHaveBeenCalled();
    expect(() => unsubscribe()).not.toThrow();
  });
});

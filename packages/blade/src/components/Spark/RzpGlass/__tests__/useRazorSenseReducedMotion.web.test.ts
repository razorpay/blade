import { act, renderHook } from '@testing-library/react-hooks';
import { useRazorSenseReducedMotion } from '../useRazorSenseReducedMotion';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

type MediaQueryListener = (event: MediaQueryListEvent) => void;

const createMediaQueryList = ({
  initialMatches,
  supportsEventTarget = true,
}: {
  initialMatches: boolean;
  supportsEventTarget?: boolean;
}): {
  mediaQueryList: MediaQueryList;
  setMatches: (matches: boolean) => void;
  addEventListener: jest.Mock;
  removeEventListener: jest.Mock;
  addListener: jest.Mock;
  removeListener: jest.Mock;
} => {
  let matches = initialMatches;
  const listeners = new Set<MediaQueryListener>();
  const addEventListener = jest.fn((eventName: string, listener: MediaQueryListener) => {
    if (eventName === 'change') listeners.add(listener);
  });
  const removeEventListener = jest.fn((eventName: string, listener: MediaQueryListener) => {
    if (eventName === 'change') listeners.delete(listener);
  });
  const addListener = jest.fn((listener: MediaQueryListener) => listeners.add(listener));
  const removeListener = jest.fn((listener: MediaQueryListener) => listeners.delete(listener));
  const mediaQueryList = ({
    get matches() {
      return matches;
    },
    media: REDUCED_MOTION_QUERY,
    onchange: null,
    addEventListener: supportsEventTarget ? addEventListener : undefined,
    removeEventListener: supportsEventTarget ? removeEventListener : undefined,
    addListener,
    removeListener,
    dispatchEvent: jest.fn(() => true),
  } as unknown) as MediaQueryList;

  return {
    mediaQueryList,
    setMatches: (nextMatches) => {
      matches = nextMatches;
      const event = { matches, media: REDUCED_MOTION_QUERY } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    },
    addEventListener,
    removeEventListener,
    addListener,
    removeListener,
  };
};

describe('useRazorSenseReducedMotion', () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: originalMatchMedia,
    });
  });

  it('returns false when matchMedia is unavailable', () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: undefined,
    });

    const { result } = renderHook(() => useRazorSenseReducedMotion());

    expect(result.current).toBe(false);
  });

  it('tracks the reduced-motion media query and removes the change listener', () => {
    const mediaQuery = createMediaQueryList({ initialMatches: false });
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: jest.fn(() => mediaQuery.mediaQueryList),
    });

    const { result, unmount } = renderHook(() => useRazorSenseReducedMotion());

    expect(window.matchMedia).toHaveBeenCalledWith(REDUCED_MOTION_QUERY);
    expect(result.current).toBe(false);

    act(() => mediaQuery.setMatches(true));
    expect(result.current).toBe(true);

    unmount();
    expect(mediaQuery.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('supports legacy MediaQueryList listeners', () => {
    const mediaQuery = createMediaQueryList({
      initialMatches: true,
      supportsEventTarget: false,
    });
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: jest.fn(() => mediaQuery.mediaQueryList),
    });

    const { result, unmount } = renderHook(() => useRazorSenseReducedMotion());

    expect(result.current).toBe(true);
    expect(mediaQuery.addListener).toHaveBeenCalledWith(expect.any(Function));

    act(() => mediaQuery.setMatches(false));
    expect(result.current).toBe(false);

    unmount();
    expect(mediaQuery.removeListener).toHaveBeenCalledWith(expect.any(Function));
  });

  it('shares one browser listener across mounted instances', () => {
    const mediaQuery = createMediaQueryList({ initialMatches: false });
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: jest.fn(() => mediaQuery.mediaQueryList),
    });

    const first = renderHook(() => useRazorSenseReducedMotion());
    const second = renderHook(() => useRazorSenseReducedMotion());

    expect(mediaQuery.addEventListener).toHaveBeenCalledTimes(1);
    first.unmount();
    expect(mediaQuery.removeEventListener).not.toHaveBeenCalled();
    second.unmount();
    expect(mediaQuery.removeEventListener).toHaveBeenCalledTimes(1);
  });
});

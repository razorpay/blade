import { renderHook, act } from '@testing-library/react-hooks';
import breakpoints from '../../tokens/global/breakpoints';
import useBreakpoint from './';

describe('useBreakpoint', () => {
  const setupMatchMediaMock = (customArgs = {}): void => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: jest.fn(),
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
        ...customArgs,
      })),
    });
  };

  it('should detect mobile and return smallest breakpoint of mobile devices', () => {
    setupMatchMediaMock({
      matches: true,
    });

    const { result } = renderHook(() => useBreakpoint({ breakpoints }));

    expect(result.current.matchedBreakpoint).toBe('xs');
    expect(result.current.matchedDeviceType).toBe('mobile');
  });

  it('should match a specific media query and return the device type accordingly', () => {
    const addEventListenerMock = jest
      .fn()
      .mockImplementation((_, callback: (arg: { media: string }) => void) => {
        callback({ media: 'screen and (min-width: 769px) and (max-width: 1024px)' });
      });
    setupMatchMediaMock({
      // return matches true for initial state because event object is set only once useEffect runs
      matches: false,
      addEventListener: addEventListenerMock,
    });

    const { result } = renderHook(() => useBreakpoint({ breakpoints }));

    expect(result.current.matchedBreakpoint).toBe('l');
    expect(result.current.matchedDeviceType).toBe('desktop');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const addEventListenerMockCallback = addEventListenerMock.mock.calls[0][1] as (arg: {
      media: string;
    }) => void;
    act(() => {
      addEventListenerMockCallback({
        media: 'screen and (max-width: 320px)',
      });
    });

    expect(result.current.matchedBreakpoint).toBe('xs');
    expect(result.current.matchedDeviceType).toBe('mobile');
  });
});

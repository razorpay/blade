import { renderHook, act } from '@testing-library/react-hooks';
import breakpoints from '../../tokens/global/breakpoints';
import { setupMatchMediaMock } from '../mocks/setupMatchMediaMock';
import { useBreakpoint } from './';

describe('useBreakpoint', () => {
  it('should detect mobile and return smallest breakpoint of mobile devices', () => {
    setupMatchMediaMock({
      matches: true,
    });

    const { result } = renderHook(() => useBreakpoint({ breakpoints }));

    expect(result.current.matchedBreakpoint).toBe('base');
    expect(result.current.matchedDeviceType).toBe('mobile');
  });

  it('should match a specific media query and return the device type accordingly', () => {
    const addEventListenerMock = jest
      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      .fn<void, ((arg: { media: string }) => void)[]>()
      .mockImplementation((_, callback: (arg: { media: string }) => void) => {
        callback({ media: 'screen and (min-width: 1024px) and (max-width: 1199px)' });
      });
    setupMatchMediaMock({
      // return matches true for initial state because event object is set only once useEffect runs
      matches: false,
      addEventListener: addEventListenerMock,
    });

    const { result } = renderHook(() => useBreakpoint({ breakpoints }));

    expect(result.current.matchedBreakpoint).toBe('l');
    expect(result.current.matchedDeviceType).toBe('desktop');

    const addEventListenerMockCallback = addEventListenerMock.mock.calls[0][1] as (arg: {
      media: string;
    }) => void;
    act(() => {
      addEventListenerMockCallback({
        media: 'screen and (min-width: 320px) and (max-width: 479px)',
      });
    });

    expect(result.current.matchedBreakpoint).toBe('xs');
    expect(result.current.matchedDeviceType).toBe('mobile');
  });
});

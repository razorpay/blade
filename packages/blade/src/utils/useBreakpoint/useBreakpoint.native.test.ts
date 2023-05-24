import { renderHook } from '@testing-library/react-hooks';
import { useBreakpoint } from './';
import { breakpoints } from '~tokens/global';

describe('useBreakpoint', () => {
  it('should detect mobile and return breakpoint as undefined', () => {
    const { result } = renderHook(() => useBreakpoint({ breakpoints }));
    expect(result.current.matchedBreakpoint).toBe(undefined);
    expect(result.current.matchedDeviceType).toBe('mobile');
  });
});

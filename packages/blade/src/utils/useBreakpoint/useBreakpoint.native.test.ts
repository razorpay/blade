import { renderHook } from '@testing-library/react-hooks';
import breakpoints from '../../tokens/global/breakpoints';
import { useBreakpoint } from './';

describe('useBreakpoint', () => {
  it('should detect mobile and return breakpoint as undefined', () => {
    const { result } = renderHook(() => useBreakpoint({ breakpoints }));
    expect(result.current.matchedBreakpoint).toBe(undefined);
    expect(result.current.matchedDeviceType).toBe('mobile');
  });
});

import { renderHook, act } from '@testing-library/react-hooks';
import { useColorScheme } from './';

describe('useColorScheme', () => {
  it('should change color scheme', () => {
    const { result } = renderHook(() => useColorScheme('light'));
    expect(result.current.colorScheme).toBe('light');

    act(() => {
      result.current.setColorScheme('dark');
    });

    expect(result.current.colorScheme).toBe('dark');
  });
});

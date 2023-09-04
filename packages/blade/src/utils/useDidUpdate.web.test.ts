import { renderHook } from '@testing-library/react';
import { useDidUpdate } from './useDidUpdate';

describe('useDidUpdate', () => {
  it('should run the effect only when the component is updated', () => {
    const effect = jest.fn();
    const { rerender } = renderHook(() => {
      return useDidUpdate(effect, [{}]);
    });

    expect(effect).not.toHaveBeenCalled();

    rerender();

    expect(effect).toHaveBeenCalledTimes(1);
  });

  it('should not run the effect on the first render', () => {
    const effect = jest.fn();
    renderHook(() => useDidUpdate(effect, [{}]));

    expect(effect).not.toHaveBeenCalled();
  });

  it('should not run the effect when the dependencies do not change', () => {
    const effect = jest.fn();
    const { rerender } = renderHook(() => useDidUpdate(effect, [1, 2, 3]));

    expect(effect).not.toHaveBeenCalled();

    rerender();

    expect(effect).not.toHaveBeenCalled();
  });
});

import { renderHook } from '@testing-library/react-hooks';
import { useDidUpdate } from './useDidUpdate';

describe('useDidUpdate', () => {
  it('should invoke effectCallback after first render', () => {
    const effectCallback = jest.fn();

    const { rerender } = renderHook(
      ({ dependencies }) => useDidUpdate(effectCallback, dependencies),
      { initialProps: { dependencies: ['a'] } },
    );

    // Should not be called on initial render
    expect(effectCallback).not.toHaveBeenCalled();

    rerender({ dependencies: ['b'] });

    // Should be called after first render, anytime dependencies change
    expect(effectCallback).toHaveBeenCalledTimes(1);
  });

  it('should not run the effect when the dependencies do not change', () => {
    const effectCallback = jest.fn();
    const { rerender } = renderHook(
      ({ dependencies }) => useDidUpdate(effectCallback, dependencies),
      { initialProps: { dependencies: ['a'] } },
    );

    expect(effectCallback).not.toHaveBeenCalled();

    rerender({ dependencies: ['a'] });

    expect(effectCallback).not.toHaveBeenCalled();
  });
});

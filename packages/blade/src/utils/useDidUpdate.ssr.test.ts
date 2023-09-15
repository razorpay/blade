import { renderHook } from '@testing-library/react-hooks';
import { useDidUpdate } from './useDidUpdate';

describe('useDidUpdate', () => {
  it('should not invoke effectCallback on server', () => {
    const effectCallback = jest.fn();

    renderHook(({ dependencies }) => useDidUpdate(effectCallback, dependencies), {
      initialProps: { dependencies: ['a'] },
    });

    // Should not be called on initial render
    expect(effectCallback).not.toHaveBeenCalled();
  });
});

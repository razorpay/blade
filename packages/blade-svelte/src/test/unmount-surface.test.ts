import { describe, it, expect } from 'vitest';
import { render, waitFor } from '@testing-library/svelte';
import UnmountSheetHarness from './fixtures/UnmountSheetHarness.svelte';

describe('a surface its app unmounts', () => {
  it('leaves the overlay host when unmounted open', async () => {
    const { getByTestId, queryByTestId, rerender } = render(UnmountSheetHarness, {
      props: { isOpen: false },
    });
    await rerender({ isOpen: true });
    await waitFor(() =>
      expect(getByTestId('host-surfaces').contains(getByTestId('sheet'))).toBe(true),
    );
    await rerender({ isMounted: false });
    expect(queryByTestId('sheet')).toBeNull();
    expect(getByTestId('host-surfaces').children).toHaveLength(0);
  });

  it('leaves the overlay host when unmounted mid-exit', async () => {
    const { getByTestId, queryByTestId, rerender } = render(UnmountSheetHarness, {
      props: { isOpen: false },
    });
    await rerender({ isOpen: true });
    await waitFor(() =>
      expect(getByTestId('host-surfaces').contains(getByTestId('sheet'))).toBe(true),
    );
    await rerender({ isOpen: false });
    await rerender({ isMounted: false });
    expect(queryByTestId('sheet')).toBeNull();
    expect(getByTestId('host-surfaces').children).toHaveLength(0);
  });
});

import { render, screen, waitFor } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import DropdownTestHarness from './DropdownTestHarness.svelte';

describe('Dropdown option registry', () => {
  it('keeps an option at its index when its props change', async () => {
    // Selection is index-based, so an option that re-registers at the end of the
    // registry on a prop change would silently move the selection to a different row.
    const { rerender } = render(DropdownTestHarness, { props: { defaultValue: 'inr' } });

    await waitFor(() => expect(screen.getByRole('button')).toHaveTextContent('Rupee'));

    await rerender({ defaultValue: 'inr', firstTitle: 'Indian Rupee' });

    await waitFor(() => expect(screen.getByRole('button')).toHaveTextContent('Indian Rupee'));
  });
});

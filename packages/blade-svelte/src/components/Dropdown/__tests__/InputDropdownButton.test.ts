import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import DropdownTestHarness from './DropdownTestHarness.svelte';

describe('<InputDropdownButton /> onChange', () => {
  it('does not fire onChange while seeding defaultValue', async () => {
    const onChange = vi.fn();
    render(DropdownTestHarness, { props: { onChange, defaultValue: 'inr' } });

    await waitFor(() => expect(screen.getByRole('button')).toHaveTextContent('Rupee'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not fire onChange while seeding a controlled value', async () => {
    const onChange = vi.fn();
    render(DropdownTestHarness, { props: { onChange, value: 'usd' } });

    await waitFor(() => expect(screen.getByRole('button')).toHaveTextContent('Dollar'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('fires onChange on a user selection', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(DropdownTestHarness, { props: { onChange, defaultValue: 'inr' } });

    await waitFor(() => expect(screen.getByRole('button')).toHaveTextContent('Rupee'));
    await user.click(screen.getByRole('button'));
    await user.click(await screen.findByRole('option', { name: /Dollar/i }));

    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    expect(onChange).toHaveBeenCalledWith({ name: 'currency', value: 'usd' });
  });
});

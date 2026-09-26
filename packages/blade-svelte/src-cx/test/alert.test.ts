import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import Alert from '../components/alert/Alert.svelte';
import AlertHarness from './fixtures/AlertHarness.svelte';
import { expectClass } from './classes';
import { createRawSnippet } from 'svelte';

const children = createRawSnippet(() => ({
  render: () => '<span>Note</span>',
}));

describe('Alert', () => {
  it('renders the icon, title, description, with the caller’s class last', () => {
    const problem = render(AlertHarness).getByTestId('problem');
    expect(problem.getAttribute('role')).toBeTruthy();
    expect(problem.textContent).toContain('Payment failed');
    expect(problem.textContent).toContain('Try another method');
    expect(problem.querySelector('[aria-hidden="true"]')).toBeTruthy();
    expect(problem.className.endsWith('mt-2')).toBe(true);
    expectClass(problem, 'rounded-small');
    expect(problem.querySelector('button')).toBeNull();
  });

  it('has a dismiss button only when it has a name; the owner closes it', () => {
    const onDismiss = vi.fn();
    const { getByRole, queryByTestId, rerender } = render(AlertHarness, {
      props: { closeLabel: 'Dismiss', onDismiss },
    });
    return fireEvent
      .click(getByRole('button', { name: 'Dismiss' }))
      .then(() => {
        expect(onDismiss).toHaveBeenCalledTimes(1);
        expect(queryByTestId('problem')).toBeTruthy();
        return rerender({ isOpen: false });
      })
      .then(() => waitFor(() => expect(queryByTestId('problem')).toBeNull()));
  });

  it('carries actions under the description', () => {
    const { getByRole, getByTestId } = render(AlertHarness, {
      props: { withActions: true },
    });
    const retry = getByRole('button', { name: 'Retry' });
    expectClass(retry.parentElement, 'flex-wrap');
    expect(getByTestId('problem').contains(retry)).toBe(true);
  });

  it('waits its turn by default and interrupts for a problem', () => {
    const calm = render(Alert, { props: { children, testID: 'calm' } });
    expect(calm.getByTestId('calm').getAttribute('role')).toBe('status');
    const urgent = render(Alert, {
      props: { children, color: 'negative', testID: 'urgent' },
    });
    const alert = urgent.getByTestId('urgent');
    expect(alert.getAttribute('role')).toBe('alert');
    expect(alert.className).toContain('bg-feedback-negative-subtle');
    expect(alert.className).not.toContain('text-feedback-');
  });
});

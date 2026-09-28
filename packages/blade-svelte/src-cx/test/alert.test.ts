import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import Alert from '../components/alert/Alert.svelte';
import { alertOctagon, alertTriangle, checkCircle, info } from '../components/icons';
import AlertHarness from './fixtures/AlertHarness.svelte';
import { expectClass } from './classes';

const description = 'Note';

describe('Alert', () => {
  it('renders the icon, title and description, with the caller’s class last', () => {
    const problem = render(AlertHarness).getByTestId('problem');
    expect(problem.getAttribute('role')).toBeTruthy();
    expect(problem.textContent).toContain('Payment failed');
    expect(problem.textContent).toContain('Try another method');
    expect(problem.querySelector('[aria-hidden="true"]')).toBeTruthy();
    expect(problem.className.endsWith('mt-2')).toBe(true);
  });

  it('is dismissible by default: Blade’s label, onDismiss, then it closes', async () => {
    const onDismiss = vi.fn();
    const { getByRole, getByTestId, queryByTestId } = render(AlertHarness, {
      props: { onDismiss },
    });
    await fireEvent.click(getByRole('button', { name: 'Dismiss alert' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(getByTestId('open').textContent).toBe('closed');
    await waitFor(() => expect(queryByTestId('problem')).toBeNull());
  });

  it('has no dismiss button with isDismissible false, and takes a closeLabel', () => {
    const fixed = render(AlertHarness, { props: { isDismissible: false } });
    expect(fixed.getByTestId('problem').querySelector('button')).toBeNull();
    fixed.unmount();
    const { getByRole } = render(AlertHarness, {
      props: { closeLabel: 'Schließen' },
    });
    expect(getByRole('button', { name: 'Schließen' })).toBeTruthy();
  });

  it('takes the description as a snippet', () => {
    const snippet = createRawSnippet(() => ({
      render: () => '<span data-testid="rich">Rich</span>',
    }));
    const { getByTestId } = render(Alert, { props: { description: snippet } });
    expect(getByTestId('rich')).toBeTruthy();
  });

  it('waits its turn by default and interrupts for a problem; notice is polite', () => {
    const calm = render(Alert, { props: { description, testID: 'calm' } });
    expect(calm.getByTestId('calm').getAttribute('role')).toBe('status');
    const urgent = render(Alert, {
      props: { description, color: 'negative', testID: 'urgent' },
    });
    expect(urgent.getByTestId('urgent').getAttribute('role')).toBe('alert');
    const notice = render(Alert, {
      props: { description, color: 'notice', testID: 'notice' },
    });
    expect(notice.getByTestId('notice').getAttribute('role')).toBe('alert');
    expect(notice.getByTestId('notice').getAttribute('aria-live')).toBe('polite');
  });
});

describe('Alert (blade)', () => {
  it('a 12px box with a 12px radius, no border, no width of its own', () => {
    const { getByTestId } = render(Alert, { props: { description, testID: 'a' } });
    const root = getByTestId('a');
    expectClass(root, 'p-3');
    expectClass(root, 'rounded-medium');
    expect(root.className).not.toContain('max-w-');
    expectClass(root, 'bg-feedback-neutral-subtle');
    expect(root.className).not.toContain('border');
  });

  it('is Blade’s full-width alert: centred on desktop', () => {
    const { getByTestId } = render(Alert, { props: { description, testID: 'a' } });
    expectClass(getByTestId('a'), 'm:items-center');
    expect(getByTestId('a').className).not.toContain('w-full');
  });

  it('subtle: the colour’s fill and icon, gray text', () => {
    const { getByTestId } = render(Alert, {
      props: { description, title: 'T', color: 'positive', testID: 'a' },
    });
    const root = getByTestId('a');
    expectClass(root, 'bg-feedback-positive-subtle');
    expectClass(root.firstElementChild as HTMLElement, 'icon-feedback-positive-intense');
    expectClass(root.querySelector('p') as HTMLElement, 'text-surface-gray-normal');
  });

  it('intense: the colour’s intense fill, everything white', () => {
    const { getByTestId } = render(Alert, {
      props: { description, title: 'T', color: 'negative', emphasis: 'intense', testID: 'a' },
    });
    const root = getByTestId('a');
    expectClass(root, 'bg-feedback-negative-intense');
    expectClass(root.firstElementChild as HTMLElement, 'icon-surface-static-white-normal');
    expectClass(root.querySelector('p') as HTMLElement, 'text-surface-static-white-normal');
    expectClass(root.querySelector('button') as HTMLElement, 'icon-interactive-static-white-normal');
  });

  it('primary uses the surface’s primary pair', () => {
    const { getByTestId } = render(Alert, {
      props: { description, color: 'primary', testID: 'a' },
    });
    const root = getByTestId('a');
    expectClass(root, 'bg-surface-primary-subtle');
    expectClass(root.firstElementChild as HTMLElement, 'icon-surface-primary-normal');
  });

  it.each([
    ['neutral', info],
    ['information', info],
    ['primary', info],
    ['positive', checkCircle],
    ['notice', alertTriangle],
    ['negative', alertOctagon],
  ] as const)('%s defaults to its icon', (color, glyph) => {
    const { getByTestId } = render(Alert, {
      props: { description, color, testID: 'a' },
    });
    const path = getByTestId('a').firstElementChild?.querySelector('path');
    expect(path?.getAttribute('d')).toBe(/ d="([^"]+)"/.exec(glyph)?.[1]);
  });

  it('a lone description centres the icon; a title puts it on the first line', () => {
    const lone = render(Alert, { props: { description, testID: 'a' } });
    expectClass(lone.getByTestId('a').firstElementChild as HTMLElement, 'self-center');
    const titled = render(Alert, { props: { description, title: 'T', testID: 'b' } });
    expectClass(titled.getByTestId('b').firstElementChild as HTMLElement, 'self-start');
  });
});

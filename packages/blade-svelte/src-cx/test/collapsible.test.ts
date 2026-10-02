import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import CollapsibleHarness from './fixtures/CollapsibleHarness.svelte';
import Link from '../components/link/Link.svelte';
import { createRawSnippet } from 'svelte';
import { expectClass, expectNoClass } from './classes';

describe('Collapsible', () => {
  it('the wrapper toggles on a press of an unwired trigger, which reads isExpanded', async () => {
    const onExpandChange = vi.fn();
    const { getByTestId } = render(CollapsibleHarness, { props: { onExpandChange } });
    expect(getByTestId('trigger-state').textContent).toBe('false');
    await fireEvent.click(getByTestId('trigger'));
    expect(getByTestId('trigger-state').textContent).toBe('true');
    await fireEvent.click(getByTestId('trigger'));
    expect(getByTestId('trigger-state').textContent).toBe('false');
    // Once per press: nothing else toggles it.
    expect(onExpandChange).toHaveBeenCalledTimes(2);
  });

  it('shows the body on the trigger, binds and reports, with the aria state', async () => {
    const onExpandChange = vi.fn();
    const { getByTestId, queryByText } = render(CollapsibleHarness, {
      props: { onExpandChange },
    });
    const trigger = getByTestId('trigger');
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    // The body is not mounted: nothing to control yet.
    expect(trigger.getAttribute('aria-controls')).toBeNull();
    expect(queryByText('Actual amount')).toBeNull();

    await fireEvent.click(trigger);
    expect(onExpandChange).toHaveBeenCalledExactlyOnceWith({ isExpanded: true });
    expect(getByTestId('bound').textContent).toBe('true');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    const body = queryByText('Actual amount')?.closest('[id]') as HTMLElement;
    expect(trigger.getAttribute('aria-controls')).toBe(body.id);
  });

  it('flips the chevron while expanded', async () => {
    const { getByTestId } = render(CollapsibleHarness);
    const chevron = getByTestId('trigger').querySelector('[aria-hidden="true"]') as HTMLElement;
    expectClass(chevron, 'rotate-0');
    await fireEvent.click(getByTestId('trigger'));
    expectClass(chevron, '-rotate-180');
  });

  it('follows isExpanded from the host, and opens above with direction top', () => {
    const { getByTestId, getByText } = render(CollapsibleHarness, {
      props: { isExpanded: true, direction: 'top' },
    });
    expect(getByText('Actual amount')).toBeTruthy();
    expectClass(getByTestId('collapsible'), 'flex-col-reverse');
  });
});

describe('Link variant="button"', () => {
  const label = createRawSnippet(() => ({ render: () => '<span>Act</span>' }));

  it('is a button that acts, reads as a link and can be disabled', async () => {
    const onClick = vi.fn();
    const { getByRole, rerender } = render(Link, {
      props: { variant: 'button', onClick, children: label },
    });
    const button = getByRole('button', { name: 'Act' });
    // Blade underlines only the anchor.
    expectNoClass(button, 'hover:underline');
    await fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);

    await rerender({ variant: 'button', onClick, children: label, isDisabled: true });
    expect(getByRole('button', { name: 'Act' })).toHaveProperty('disabled', true);
  });
});

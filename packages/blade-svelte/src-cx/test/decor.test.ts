import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import DecorHarness from './fixtures/DecorHarness.svelte';

describe('Divider (preset component)', () => {
  it('is a separator with one border per orientation', () => {
    const { getByTestId } = render(DecorHarness);
    const rule = getByTestId('rule');
    expect(rule.tagName).toBe('HR');
    expect(rule.className).toContain('border-t-thin');
    expect(rule.hasAttribute('aria-orientation')).toBe(false);
    expect(rule.className.endsWith('my-2')).toBe(true);

    const upright = getByTestId('upright');
    expect(upright.getAttribute('aria-orientation')).toBe('vertical');
    expect(upright.className).toContain('border-l-thin');
    expect(upright.className).not.toContain('border-t-thin');
    expect(upright.className).toContain('border-dashed');
  });
});

describe('TrustBadge (preset component)', () => {
  it('is the shield and its line in a pill; the shield is decoration', () => {
    const badge = render(DecorHarness).getByTestId('trust');
    expect(badge.className).toContain('rounded-max');
    expect(badge.className).toContain('select-none');
    expect(badge.className.endsWith('mt-1')).toBe(true);
    expect(badge.textContent?.trim()).toBe('Razorpay Trusted Business');
    expect(badge.querySelector('svg')).toBeTruthy();
    expect(badge.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
  });

  it('icon-only drops the pill and names the shield with the label', () => {
    const { getByTestId, getByRole } = render(DecorHarness);
    const badge = getByTestId('trust-icon');
    expect(badge.className).not.toContain('rounded-max');
    expect(badge.textContent?.trim()).toBe('');
    expect(
      badge.contains(getByRole('img', { name: 'Razorpay Trusted Business' }))
    ).toBe(true);
  });
});

describe('Screen and FooterBar (preset components)', () => {
  it('a screen scrolls its body, pins its footer, and goes inert when disabled', () => {
    const { getByTestId } = render(DecorHarness);
    const screen = getByTestId('screen');
    expect(screen.getAttribute('aria-label')).toBe('Card');
    expect((screen as HTMLElement & { inert: boolean }).inert).toBe(true);
    expect(screen.className).toContain('grayscale');
    expect(screen.className.endsWith('mt-3')).toBe(true);
    expect(screen.firstElementChild?.className).toContain('overflow-y-auto');
    expect(screen.lastElementChild).toBe(getByTestId('bar'));
  });

  it('the bar sticks on mobile and joins the flow on desktop', () => {
    const bar = render(DecorHarness).getByTestId('bar');
    expect(bar.tagName).toBe('FOOTER');
    expect(bar.className).toContain('sticky');
    expect(bar.className).toContain('m:static');
    expect(bar.firstElementChild?.textContent).toBe('Total');
    expect(bar.lastElementChild?.textContent).toBe('Pay');
  });
});

describe('EmptyState (preset component)', () => {
  it('stacks a tinted media disc, the title, the message and the actions', () => {
    const empty = render(DecorHarness).getByTestId('empty');
    const [media, title, message, actions] = Array.from(empty.children);
    expect(empty.className.endsWith('mt-4')).toBe(true);
    expect(media.getAttribute('aria-hidden')).toBe('true');
    expect(media.className).toContain('bg-feedback-negative-subtle');
    expect(title.tagName).toBe('H2');
    expect(title.textContent).toBe('Payment failed');
    expect(message.textContent).toBe('Your money is safe');
    expect(actions.textContent?.trim()).toBe('Retry');
  });

  it('renders only the parts it was given', () => {
    const empty = render(DecorHarness).getByTestId('empty-bare');
    expect(empty.children.length).toBe(1);
  });
});

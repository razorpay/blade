import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import BadgeHarness from './fixtures/BadgeHarness.svelte';
import { expectClass } from './classes';

const label = (badge: HTMLElement): HTMLElement => badge.lastElementChild as HTMLElement;

describe('Badge', () => {
  it('is a neutral subtle medium pill by default; the caller class comes last', () => {
    const badge = render(BadgeHarness, { props: { class: 'ml-1' } }).getByTestId('badge');
    expectClass(badge, 'rounded-max');
    expectClass(badge, 'h-5');
    expectClass(badge, 'bg-feedback-neutral-subtle');
    expectClass(badge, 'text-feedback-neutral-intense');
    expect(badge.className).not.toContain('border');
    expect(badge.className.endsWith('ml-1')).toBe(true);
    expect(badge.hasAttribute('role')).toBe(false);
  });

  it.each([
    ['small', 'h-4', 'px-1', 'mx-0.5', 'text-25'],
    ['medium', 'h-5', 'px-1', 'mx-1', 'text-75'],
    ['large', 'h-6', 'px-2', 'mx-1', 'text-75'],
  ] as const)(
    '%s: Blade’s height, padding, text margin and type',
    (size, height, pad, margin, type) => {
      const badge = render(BadgeHarness, { props: { size } }).getByTestId('badge');
      expectClass(badge, height);
      expectClass(badge, pad);
      expectClass(label(badge), margin);
      expectClass(label(badge), type);
      expectClass(label(badge), 'tracking-50');
    },
  );

  it('subtle is medium weight, intense regular on the colour’s fill in white', () => {
    const subtle = render(BadgeHarness, { props: { color: 'positive' } }).getByTestId('badge');
    expectClass(label(subtle), 'font-medium');
    expectClass(subtle, 'bg-feedback-positive-subtle');
    subtle.remove();
    const intense = render(BadgeHarness, {
      props: { color: 'positive', emphasis: 'intense' },
    }).getByTestId('badge');
    expectClass(label(intense), 'font-normal');
    expectClass(intense, 'bg-feedback-positive-intense');
    expectClass(intense, 'text-surface-static-white-normal');
  });

  it('primary uses the surface’s primary pair', () => {
    const badge = render(BadgeHarness, { props: { color: 'primary' } }).getByTestId('badge');
    expectClass(badge, 'bg-surface-primary-subtle');
    expectClass(badge, 'text-surface-primary-normal');
  });

  it('draws an icon before the label, 8px up to small and 12px above', () => {
    const small = render(BadgeHarness, { props: { size: 'small', withIcon: true } }).getByTestId(
      'badge',
    );
    expectClass(small.querySelector('[aria-hidden="true"]'), 'w-2');
    small.remove();
    const large = render(BadgeHarness, { props: { size: 'large', withIcon: true } }).getByTestId(
      'badge',
    );
    expectClass(large.querySelector('[aria-hidden="true"]'), 'w-3');
  });

  it('clamps the label to one line, titled only while it is cut off', () => {
    const badge = render(BadgeHarness).getByTestId('badge');
    expectClass(label(badge), 'clamp-1');
    // jsdom lays nothing out, so nothing overflows: no title.
    expect(label(badge).hasAttribute('title')).toBe(false);
  });
});

import { describe, it, expect, vi } from 'vitest';
import { createRawSnippet } from 'svelte';
import { fireEvent, render } from '@testing-library/svelte';
import Card from '../components/card/Card.svelte';
import { expectClass, expectNoClass } from './classes';

const children = createRawSnippet(() => ({
  render: () => '<span>HDFC Bank</span>',
}));
const surfaceOf = (card: HTMLElement) => card.firstElementChild as HTMLElement;

describe('Card', () => {
  it('is a plain box, a named group when labelled', () => {
    const { getByTestId, rerender } = render(Card, {
      props: { children, testID: 'card', class: 'mt-2' },
    });
    const card = getByTestId('card');
    expect(card.tagName).toBe('DIV');
    expect(card.hasAttribute('role')).toBe(false);
    expect(card.className.endsWith('mt-2')).toBe(true);
    return rerender({
      children,
      testID: 'card',
      accessibilityLabel: 'Banks',
    }).then(() => {
      expect(card.getAttribute('role')).toBe('group');
      expect(card.getAttribute('aria-label')).toBe('Banks');
    });
  });

  it('with onClick an overlay button covers the card; controls inside sit above it', async () => {
    const onClick = vi.fn();
    const { getByRole, getByTestId } = render(Card, {
      props: { children, onClick, accessibilityLabel: 'Pay with HDFC', testID: 'card' },
    });
    const overlay = getByRole('button', { name: 'Pay with HDFC' });
    expect(overlay.getAttribute('type')).toBe('button');
    expect(overlay.getAttribute('aria-pressed')).toBe('false');
    expectClass(overlay, 'before:absolute');
    expectClass(overlay, 'focus-visible:before:shadow-focus');
    // The card is not itself a button: it may hold controls of its own.
    expect(getByTestId('card').tagName).toBe('DIV');
    expectClass(overlay.nextElementSibling as HTMLElement, '[&_button]:z-5');
    await fireEvent.click(overlay);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('with href the overlay is a link; _blank gets Blade’s rel', () => {
    const { getByRole } = render(Card, {
      props: { children, href: '/bank', target: '_blank', accessibilityLabel: 'HDFC' },
    });
    const link = getByRole('link', { name: 'HDFC' });
    expect(link.getAttribute('href')).toBe('/bank');
    expect(link.getAttribute('rel')).toBe('noreferrer noopener');
  });

  it('a disabled card has no overlay and is aria-disabled', () => {
    const onClick = vi.fn();
    const { queryByRole, getByTestId } = render(Card, {
      props: { children, onClick, isDisabled: true, isSelected: true, testID: 'card' },
    });
    expect(queryByRole('button')).toBeNull();
    const card = getByTestId('card');
    expect(card.getAttribute('aria-disabled')).toBe('true');
    // Disabled beats selected.
    expectNoClass(card, 'outline-surface-primary-normal');
  });

  it('selected: Blade’s 2px primary ring, and the surface drops its rim', () => {
    const { getByTestId } = render(Card, {
      props: { children, isSelected: true, testID: 'card' },
    });
    const card = getByTestId('card');
    expectClass(card, 'outline-thicker');
    expectClass(card, 'outline-surface-primary-normal');
    expectClass(surfaceOf(card), 'surface-raised-borderless');
  });

  it('as label: the card is a <label>', () => {
    const { getByTestId } = render(Card, {
      props: { children, as: 'label', testID: 'card' },
    });
    expect(getByTestId('card').tagName).toBe('LABEL');
  });

  it('primary is Blade’s raised surface, 24px in by default; padding steps', () => {
    const primary = render(Card, { props: { children, testID: 'a' } }).getByTestId('a');
    expectClass(surfaceOf(primary), 'surface-raised');
    expectClass(surfaceOf(primary), 'bg-surface-gray-intense');
    expectClass(surfaceOf(primary), 'rounded-medium');
    expectClass(surfaceOf(primary), 'p-6');
    primary.remove();
    const tight = render(Card, {
      props: { children, padding: 'spacing.4', variant: 'secondary', testID: 'b' },
    }).getByTestId('b');
    expectClass(surfaceOf(tight), 'p-3');
    expectClass(surfaceOf(tight), 'bg-surface-gray-moderate');
    expect(surfaceOf(tight).className).not.toContain('surface-raised');
  });

  it('header and footer sit on hairlines, 12px either side; children between', () => {
    const header = createRawSnippet(() => ({
      render: () => '<span data-testid="head">Order</span>',
    }));
    const footer = createRawSnippet(() => ({
      render: () => '<span data-testid="foot">Total</span>',
    }));
    const { getByTestId } = render(Card, {
      props: { header, footer, children, testID: 'card' },
    });
    const head = getByTestId('head').parentElement as HTMLElement;
    const foot = getByTestId('foot').parentElement as HTMLElement;
    expectClass(head, 'border-b-thin');
    expectClass(head, 'pb-3');
    expectClass(head, 'mb-3');
    expectClass(foot, 'border-t-thin');
    expectClass(foot, 'pt-3');
    expect(getByTestId('card').textContent).toMatch(/Order\s*HDFC Bank\s*Total/);
  });

  it('a colour replaces the variant’s surface, never joins it', () => {
    const { getByTestId } = render(Card, {
      props: { children, color: 'negative', testID: 'card' },
    });
    const surface = surfaceOf(getByTestId('card'));
    expect(surface.className).toContain('bg-feedback-negative-subtle');
    expect(surface.className).not.toContain('bg-surface-gray-intense');
  });
});

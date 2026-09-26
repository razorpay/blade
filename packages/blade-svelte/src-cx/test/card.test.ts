import { describe, it, expect, vi } from 'vitest';
import { createRawSnippet } from 'svelte';
import { fireEvent, render } from '@testing-library/svelte';
import Card from '../components/card/Card.svelte';
import { expectClass, expectNoClass } from './classes';

const children = createRawSnippet(() => ({
  render: () => '<span>HDFC Bank</span>',
}));

describe('Card', () => {
  it('is a plain box, a named group when labelled', () => {
    const { getByTestId, rerender } = render(Card, {
      props: { children, testID: 'card', class: 'mt-2' },
    });
    const card = getByTestId('card');
    expect(card.tagName).toBe('DIV');
    expect(card.hasAttribute('role')).toBe(false);
    expectNoClass(card, 'cursor-pointer');
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

  it('with onPress the whole card is one button', () => {
    const onPress = vi.fn();
    const { getByRole } = render(Card, {
      props: { children, onPress, accessibilityLabel: 'Pay with HDFC' },
    });
    const card = getByRole('button', { name: 'Pay with HDFC' });
    expect(card.getAttribute('type')).toBe('button');
    expectClass(card, 'cursor-pointer');
    return fireEvent.click(card).then(() => {
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  it('a disabled pressable card does not fire', () => {
    const onPress = vi.fn();
    const { getByRole } = render(Card, {
      props: { children, onPress, isDisabled: true },
    });
    return fireEvent.click(getByRole('button')).then(() => {
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  it('sections pad and divide; raw children skip them and win over body', () => {
    const header = createRawSnippet(() => ({
      render: () => '<span data-testid="head">Order</span>',
    }));
    const body = createRawSnippet(() => ({
      render: () => '<span data-testid="middle">Items</span>',
    }));
    const footer = createRawSnippet(() => ({
      render: () => '<span data-testid="foot">Total</span>',
    }));
    const sectioned = render(Card, {
      props: { header, body, footer, testID: 'card' },
    });
    const head = sectioned.getByTestId('head').parentElement as HTMLElement;
    const middle = sectioned.getByTestId('middle').parentElement as HTMLElement;
    const foot = sectioned.getByTestId('foot').parentElement as HTMLElement;
    expect(head.tagName).toBe('SPAN');
    expectClass(head, 'border-b-thin');
    expectClass(middle, 'px-6');
    expectClass(foot, 'border-t-thin');
    expect(Array.from(sectioned.getByTestId('card').children)).toEqual([
      head,
      middle,
      foot,
    ]);
    // The card itself carries no padding: the sections do.
    expectNoClass(sectioned.getByTestId('card'), 'p-4');
    sectioned.unmount();

    const raw = render(Card, { props: { children, body, testID: 'card' } });
    expect(raw.getByTestId('card').firstElementChild?.tagName).toBe('SPAN');
    expect(raw.getByTestId('card').textContent?.trim()).toBe('HDFC Bank');
    expect(raw.queryByTestId('middle')).toBeNull();
  });

  it('a colour replaces the variant’s surface, never joins it', () => {
    const { getByTestId } = render(Card, {
      props: { children, color: 'negative', testID: 'card' },
    });
    const card = getByTestId('card');
    expect(card.className).toContain('bg-feedback-negative-subtle');
    expect(card.className).not.toContain('bg-surface-gray-intense');
  });
});

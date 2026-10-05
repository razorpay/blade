import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { Amount } from '../index';
import { expectClass } from './classes';

const shownParts = (root: HTMLElement): (string | null)[] =>
  Array.from(root.children[1]?.children ?? []).map((part) => part.textContent);
const part = (root: HTMLElement, index: number): HTMLElement =>
  root.children[1]?.children[index] as HTMLElement;

describe('Amount', () => {
  it('gives a reader the whole text and hides the styled parts', () => {
    const { getByTestId } = render(Amount, {
      props: { value: 123456.5, locale: 'en-IN', testID: 'total' },
    });
    const total = getByTestId('total');
    expect(total.tagName).toBe('SPAN');
    const [text, parts] = Array.from(total.children);
    // INR by default, 2 decimals.
    expect(text?.textContent).toBe('₹1,23,456.50');
    expect(text?.className).toContain('sr-only');
    expect(parts?.getAttribute('aria-hidden')).toBe('true');
    expect(shownParts(total)).toEqual(['₹', '1,23,456', '.50']);
  });

  it('makes the currency and the decimals subtle by default', () => {
    const subtle = render(Amount, { props: { value: 10.5, locale: 'en-IN', testID: 'a' } });
    const a = subtle.getByTestId('a');
    expectClass(part(a, 0), 'opacity-800');
    expect(part(a, 1).className).not.toContain('opacity-800');
    expectClass(part(a, 2), 'opacity-800');
    const plain = render(Amount, {
      props: { value: 10.5, locale: 'en-IN', isAffixSubtle: false, testID: 'b' },
    });
    const b = plain.getByTestId('b');
    // Plain decimals stay with the integer.
    expect(shownParts(b)).toEqual(['₹', '10.50']);
    expect(part(b, 0).className).not.toContain('opacity-800');
  });

  it('humanize keeps the compact suffix with the number, not as an affix', () => {
    const { getByTestId } = render(Amount, {
      props: { value: 150000, locale: 'en-IN', suffix: 'humanize', testID: 'a' },
    });
    expect(shownParts(getByTestId('a'))).toEqual(['₹', '1.5L']);
  });

  it('shows the code with currencyIndicator, on the locale’s side', () => {
    const { getByTestId } = render(Amount, {
      props: {
        value: 12.5,
        currency: 'EUR',
        locale: 'de-DE',
        currencyIndicator: 'currency-code',
        testID: 'a',
      },
    });
    const a = getByTestId('a');
    expect(shownParts(a)).toEqual(['12', ',50', 'EUR']);
    expectClass(part(a, 2), 'ml-0.5');
  });

  it('draws the minus sign apart, first', () => {
    const { getByTestId } = render(Amount, {
      props: { value: -12.5, currency: 'USD', locale: 'en-US', testID: 'a' },
    });
    const a = getByTestId('a');
    expect(shownParts(a)).toEqual(['-', '$', '12', '.50']);
    expectClass(part(a, 0), 'mx-1');
  });

  it('takes no text style of its own: size, weight, colour and face are inherited', () => {
    const { getByTestId } = render(Amount, {
      props: { value: 10, locale: 'en-IN', class: 'ml-2', testID: 'a' },
    });
    const a = getByTestId('a');
    expect(a.className).toBe('inline-flex ml-2');
    for (const el of [a, ...a.querySelectorAll('*')]) {
      const own = el.className.toString().split(/\s+/);
      expect(own.filter((name) => /^(?:text-\d|text-surface|leading-|font-)/.test(name))).toEqual(
        [],
      );
    }
  });

  it('subtle affixes are relative, so they follow the text', () => {
    const { getByTestId } = render(Amount, {
      props: { value: 10.5, locale: 'en-IN', testID: 'a' },
    });
    expectClass(part(getByTestId('a'), 0), '[font-size:0.75em]');
  });

  it('an old price is a <del>, whose own line follows the text', () => {
    const { getByTestId } = render(Amount, {
      props: { value: 10, locale: 'en-IN', isStrikethrough: true, testID: 'a' },
    });
    const a = getByTestId('a');
    expect(a.tagName).toBe('DEL');
    expect(a.className).not.toContain('text-decoration');
  });

  it('takes minor units and an app symbol', () => {
    const { getByTestId } = render(Amount, {
      props: { value: 499900, unit: 'minor', symbol: 'Rs', locale: 'en-IN', testID: 'a' },
    });
    expect(getByTestId('a').children[0]?.textContent).toBe('Rs4,999.00');
  });
});

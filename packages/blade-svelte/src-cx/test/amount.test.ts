import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { Amount } from '../index';

describe('Amount', () => {
  it('gives a reader the whole text and hides the styled parts', () => {
    const { getByTestId } = render(Amount, {
      props: {
        value: 123456.5,
        currency: 'INR',
        locale: 'en-IN',
        testID: 'total',
      },
    });
    const total = getByTestId('total');
    expect(total.tagName).toBe('SPAN');
    const [text, parts] = Array.from(total.children);
    expect(text?.textContent).toBe('₹1,23,456.50');
    expect(text?.className).toContain('sr-only');
    expect(parts?.getAttribute('aria-hidden')).toBe('true');
    // No whitespace between the parts: it would show as gaps.
    expect(parts?.textContent?.trim()).toBe('₹1,23,456.50');
    expect(
      Array.from(parts?.children ?? []).map((part) => part.textContent)
    ).toEqual(['₹', '1,23,456', '.50']);
  });

  it('makes the currency and the decimals subtle by default', () => {
    const { getByTestId, rerender } = render(Amount, {
      props: { value: 10.5, currency: 'INR', locale: 'en-IN', testID: 'total' },
    });
    const spans = () =>
      Array.from(getByTestId('total').children[1]?.children ?? []);
    expect(spans()[0]?.className).toContain('opacity-800');
    expect(spans()[1]?.className).toBe('');
    expect(spans()[2]?.className).toContain('opacity-800');

    return rerender({
      value: 10.5,
      currency: 'INR',
      locale: 'en-IN',
      testID: 'total',
      affix: 'normal',
    }).then(() => {
      expect(spans()[0]?.className).toBe('');
    });
  });

  it('inherits size, weight and colour when the axes are unset', () => {
    const { getByTestId } = render(Amount, {
      props: { value: 10, currency: 'INR', locale: 'en-IN', testID: 'total' },
    });
    expect(getByTestId('total').className).toBe(
      'inline-flex items-baseline whitespace-pre font-text tabular-nums'
    );
  });

  it('takes minor units, pinned decimals and the axes; class comes last', () => {
    const { getByTestId } = render(Amount, {
      props: {
        value: 499900,
        currency: 'INR',
        unit: 'minor',
        fractionDigits: 0,
        locale: 'en-IN',
        size: '2xlarge',
        weight: 'semibold',
        color: 'white',
        class: 'ml-2',
        testID: 'total',
      },
    });
    const total = getByTestId('total');
    expect(total.children[0]?.textContent).toBe('₹4,999');
    expect(total.className).toContain('text-500');
    expect(total.className).toContain('font-semibold');
    expect(total.className).toContain('text-surface-static-white-normal');
    expect(total.className).toContain('tabular-nums');
    expect(total.className.endsWith('ml-2')).toBe(true);
  });

  it('renders an old price as a struck <del>', () => {
    const { getByTestId } = render(Amount, {
      props: {
        value: 999,
        currency: 'INR',
        locale: 'en-IN',
        isStrikethrough: true,
        testID: 'old',
      },
    });
    const old = getByTestId('old');
    expect(old.tagName).toBe('DEL');
    expect(old.className).toContain('line-through');
  });
});

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Counter from '../components/counter/Counter.svelte';

describe('Counter', () => {
  it('reads max+ above max', () => {
    const { getByTestId } = render(Counter, { props: { value: 120, max: 99, testID: 'c' } });
    expect(getByTestId('c').textContent?.trim()).toBe('99+');
  });

  it('honours max={0}: any count reads 0+', () => {
    const { getByTestId } = render(Counter, { props: { value: 3, max: 0, testID: 'c' } });
    expect(getByTestId('c').textContent?.trim()).toBe('0+');
  });

  it('shows the value without max, and passes data-analytics-*', () => {
    const { getByTestId } = render(Counter, {
      props: { value: 3, testID: 'c', 'data-analytics-count': 'cart' },
    });
    expect(getByTestId('c').textContent?.trim()).toBe('3');
    expect(getByTestId('c').dataset.analyticsCount).toBe('cart');
  });
});

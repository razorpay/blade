import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import CardGroupUnboundHarness from './fixtures/CardGroupUnboundHarness.svelte';

describe('CardGroup unbound', () => {
  it('closes an open item on a second press without bind:value', () => {
    const { getByTestId, queryByTestId } = render(CardGroupUnboundHarness);
    return fireEvent
      .click(getByTestId('faq-0'))
      .then(() =>
        waitFor(() => expect(getByTestId('content-refund')).toBeTruthy())
      )
      .then(() => fireEvent.click(getByTestId('faq-0')))
      .then(() =>
        waitFor(() => expect(queryByTestId('content-refund')).toBeNull())
      );
  });

  it('an item without a value is known by its index', () => {
    const onChange = vi.fn();
    const { getByTestId } = render(CardGroupUnboundHarness, {
      props: { onChange },
    });
    return fireEvent
      .click(getByTestId('faq-1'))
      .then(() => {
        expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: 1 }));
        expect(getByTestId('content-saved')).toBeTruthy();
        return fireEvent.click(getByTestId('faq-0'));
      })
      .then(() => expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: 0 })));
  });
});

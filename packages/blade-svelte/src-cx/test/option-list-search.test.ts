import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import OptionListSearchHarness from './fixtures/OptionListSearchHarness.svelte';
import { expectClass, expectNoClass } from './classes';

describe('OptionList: search, sections and action rows, headless of ActionList', () => {
  it('sections are labelled groups in the default look', () => {
    const { getByRole, getByTestId } = render(OptionListSearchHarness);
    expect(getByRole('group', { name: 'Popular' })).toBe(getByTestId('popular'));
    expect(getByRole('group', { name: 'More' })).toBe(getByTestId('more'));
  });

  it('a query unmounts the options that fail it, matching text before title', async () => {
    const { queryByTestId, getByTestId, rerender } = render(OptionListSearchHarness);
    await rerender({ query: 'phonepe' });
    expect(getByTestId('wallet')).toBeTruthy();
    expect(queryByTestId('upi')).toBeNull();
    expect(queryByTestId('emi')).toBeNull();
    expectClass(getByTestId('popular'), 'hidden');
    expectNoClass(getByTestId('more'), 'hidden');
  });

  it('a search that leaves nothing hides the box and fills the status region', async () => {
    const { getByTestId, rerender } = render(OptionListSearchHarness);
    await rerender({ query: 'zzz' });
    expect(getByTestId('methods-empty').textContent).toContain('Nothing for zzz');
    expectClass(getByTestId('popular').parentElement, 'hidden');
  });

  it('a hidden option leaves the keyboard: the tab stop moves to the first shown', async () => {
    const { getByTestId, rerender } = render(OptionListSearchHarness);
    await rerender({ query: 'cards' });
    expect(getByTestId('card').tabIndex).toBe(0);
  });

  it('selectionType="none" works on a plain OptionList', async () => {
    const onChange = vi.fn();
    const { getByTestId } = render(OptionListSearchHarness, {
      props: { selectionType: 'none', onChange },
    });
    expect(getByTestId('emi').tagName).toBe('BUTTON');
    await fireEvent.click(getByTestId('emi'));
    expect(onChange).toHaveBeenCalledWith({ name: undefined, value: 'emi' });
  });

  it('an ActionList link row takes part in the search too', async () => {
    const { queryByTestId, getByTestId, rerender } = render(OptionListSearchHarness);
    await rerender({ query: 'terms' });
    expect(queryByTestId('help')).toBeNull();
    expect(getByTestId('terms').getAttribute('href')).toBe('/terms');
  });
});

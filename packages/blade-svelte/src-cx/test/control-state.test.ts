import { describe, it, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import ControlStateHarness from './fixtures/ControlStateHarness.svelte';

// The selection controls hand their snippets `{ isChecked, isDisabled }`,
// and their groups take a labelArea and snippet hint lines, as the inputs do.
describe('selection controls: snippet state, label area and rich hints', () => {
  it("chip snippets follow the chip's state", async () => {
    const { getByTestId, queryByTestId } = render(ControlStateHarness);
    expect(getByTestId('chip-leading').dataset.checked).toBe('false');
    expect(queryByTestId('chip-picked')).toBeNull();
    await fireEvent.click(getByTestId('chip-10').querySelector('input')!);
    expect(getByTestId('chip-leading').dataset.checked).toBe('true');
    expect(getByTestId('chip-picked')).toBeTruthy();
  });

  it("radio snippets follow the radio's state", async () => {
    const { getByTestId } = render(ControlStateHarness);
    expect(getByTestId('radio-trailing').dataset.checked).toBe('false');
    await fireEvent.click(getByTestId('radio-monthly'));
    expect(getByTestId('radio-trailing').dataset.checked).toBe('true');
    expect(getByTestId('radio-yearly').dataset.disabled).toBe('true');
  });

  it('checkbox and switch labels follow their state', async () => {
    const { getByTestId, queryByTestId, getByText } = render(ControlStateHarness);
    expect(queryByTestId('terms-checked')).toBeNull();
    await fireEvent.click(getByTestId('terms'));
    expect(getByTestId('terms-checked')).toBeTruthy();
    expect(getByText('Notify off')).toBeTruthy();
    await fireEvent.click(getByTestId('notify'));
    expect(getByText('Notify on')).toBeTruthy();
  });

  it('ChipGroup and RadioGroup take a labelArea', () => {
    const { getByTestId, getByText } = render(ControlStateHarness);
    expect(getByTestId('chips-extra').parentElement).toBe(
      getByText('Tip').parentElement?.parentElement
    );
    expect(getByTestId('plans-extra').parentElement).toBe(
      getByText('Plan').parentElement?.parentElement
    );
  });

  it('hint lines may be snippets, and still describe their control', () => {
    const { getByTestId } = render(ControlStateHarness);
    const chips = getByTestId('chips');
    const chipsHint = document.getElementById(chips.getAttribute('aria-describedby')!)!;
    expect(chipsHint.contains(getByTestId('chips-link'))).toBe(true);
    const terms = getByTestId('terms');
    const termsHelp = document.getElementById(terms.getAttribute('aria-describedby')!)!;
    expect(termsHelp.contains(getByTestId('terms-link'))).toBe(true);
    expect(getByTestId('radio-help-link')).toBeTruthy();
  });
});

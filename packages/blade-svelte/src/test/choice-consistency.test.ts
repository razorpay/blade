import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import Harness from './fixtures/ChoiceConsistencyHarness.svelte';

describe('choice components, one way', () => {
  it("an item without a test id of its own gets an id from the group's testID and its index", () => {
    const { getByTestId } = render(Harness);
    expect(getByTestId('pay-0').getAttribute('value')).toBe('qr');
    expect(getByTestId('pay-1').getAttribute('value')).toBe('web');
    expect(getByTestId('own').getAttribute('value')).toBe('upi');
    expect(getByTestId('type-1').textContent).toContain('B');
  });

  it('a required single ChipGroup says so on the radiogroup, not on each chip', async () => {
    const { getByRole, getAllByRole, rerender } = render(Harness);
    const group = getByRole('radiogroup', { name: 'Type' });
    expect(group.getAttribute('aria-required')).toBe('true');
    for (const chip of getAllByRole('radio').filter((radio) => group.contains(radio))) {
      expect(chip.hasAttribute('required')).toBe(false);
    }
    await rerender({ chipSelection: 'multiple' });
    const boxes = getByRole('group', { name: 'Type' });
    expect(boxes.hasAttribute('aria-required')).toBe(false);
    expect(boxes.querySelector('[required]')).toBeNull();
  });

  it("ChipGroup's line is the group's one line: help, else the error, and the group is invalid", async () => {
    const { getByRole, getByText, queryByText, rerender } = render(Harness);
    const group = getByRole('radiogroup', { name: 'Type' });
    expect(getByText('Pick one').closest('[id]')?.id).toBe(group.getAttribute('aria-describedby'));
    await rerender({ chipError: true });
    expect(queryByText('Pick one')).toBeNull();
    expect(getByText('Required')).toBeTruthy();
    expect(group.getAttribute('aria-invalid')).toBe('true');
  });

  it('Switch has a value: on the input, and in onChange', async () => {
    const onSwitchChange = vi.fn();
    const { getByTestId } = render(Harness, { props: { onSwitchChange } });
    const control = getByTestId('save') as HTMLInputElement;
    expect(control.value).toBe('yes');
    await fireEvent.click(control);
    expect(onSwitchChange).toHaveBeenCalledWith({ isChecked: true, value: 'yes' });
  });

  it("data-analytics-* lands where React's does", () => {
    const { getByTestId, getByRole } = render(Harness);
    expect(getByTestId('pay').getAttribute('data-analytics-group')).toBe('pay');
    expect(getByTestId('pay-0').getAttribute('data-analytics-option')).toBe('qr');
    expect(getByTestId('type').getAttribute('data-analytics-group')).toBe('type');
    expect(
      getByTestId('type-0').querySelector('input')?.getAttribute('data-analytics-option'),
    ).toBe('a');
    // Checkbox: on the input; Switch: on its root; Link: on the anchor.
    expect(getByTestId('terms').getAttribute('data-analytics-field')).toBe('terms');
    expect(getByTestId('save').closest('label')?.getAttribute('data-analytics-field')).toBe('save');
    expect(getByRole('link', { name: 'Go' }).getAttribute('data-analytics-link')).toBe('x');
  });
});

describe('haptics', async () => {
  const HapticsHarness = (await import('./fixtures/HapticsHarness.svelte')).default;

  it('a toggle reports `toggle`, a pick `select`; a refused one nothing', async () => {
    const haptics = vi.fn();
    const { getByTestId } = render(HapticsHarness, { props: { haptics } });
    await fireEvent.click(getByTestId('box'));
    await fireEvent.click(getByTestId('switch'));
    expect(haptics.mock.calls).toEqual([['toggle'], ['toggle']]);
    await fireEvent.click(getByTestId('radios-0'));
    await fireEvent.click(getByTestId('chips-0').querySelector('input')!);
    expect(haptics.mock.calls.slice(2)).toEqual([['select'], ['select']]);
    // The pick again changes nothing; a disabled box refuses.
    await fireEvent.click(getByTestId('radios-0'));
    await fireEvent.click(getByTestId('off'));
    expect(haptics).toHaveBeenCalledTimes(4);
  });
});

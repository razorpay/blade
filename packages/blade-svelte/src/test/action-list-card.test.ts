import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import BankListHarness from './fixtures/BankListHarness.svelte';
import { expectClass } from './classes';

describe("ActionList's card look", () => {
  it('each section is its own box, its heading above; sections 24px apart', () => {
    const { getByTestId, getByText } = render(BankListHarness);
    const suggested = getByTestId('suggested');
    const heading = getByText('Suggested Banks');
    const box = heading.nextElementSibling as HTMLElement;
    expect(heading.parentElement).toBe(suggested);
    expectClass(box, 'rounded-small');
    expectClass(box, 'border-thin');
    expectClass(box, '[&>*+*]:border-t-thin');
    expect(box.contains(getByTestId('sbi'))).toBe(true);
    expectClass(suggested.parentElement, 'gap-6');
  });

  it('without sections the list itself is the box', () => {
    const { getByTestId } = render(BankListHarness, { props: { withSections: false } });
    // The test id is on the row's radio; the row is its label.
    const box = getByTestId('sbi').closest('label')!.parentElement!;
    expectClass(box, 'rounded-small');
    expectClass(box, 'border-thin');
  });

  it('rows are 16px in and 12px tall; the leading box is 24px, centred', () => {
    const { getByTestId } = render(BankListHarness);
    const row = getByTestId('sbi').closest('label');
    expectClass(row, 'px-4');
    expectClass(row, 'py-3');
    expectClass(getByTestId('logo').parentElement, 'w-6');
    expectClass(getByTestId('logo').parentElement, 'self-center');
    expect(getByTestId('icici-corp').closest('label')?.textContent).toContain('For Businesses');
  });
});

describe('A bank list where a pick submits (onPick)', () => {
  it('every pick reports, the same bank again too; the row is a radio with the pick look', async () => {
    const onPick = vi.fn();
    const onChange = vi.fn();
    const onSbiClick = vi.fn();
    const { getByRole, getByTestId } = render(BankListHarness, {
      props: { onPick, onChange, onSbiClick },
    });
    expect(getByRole('radiogroup', { name: 'Banks' })).toBeTruthy();
    const sbi = getByTestId('sbi');
    expect(sbi.getAttribute('type')).toBe('radio');
    await fireEvent.click(sbi);
    await fireEvent.click(sbi);
    expect(onPick).toHaveBeenCalledTimes(2);
    expect(onPick).toHaveBeenLastCalledWith({ name: undefined, value: 'sbi' });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onSbiClick).toHaveBeenCalledTimes(2);
  });

  it("Enter picks the row the keyboard is on, and calls the row's onClick", async () => {
    const onPick = vi.fn();
    const onSbiClick = vi.fn();
    const { getByTestId } = render(BankListHarness, { props: { onPick, onSbiClick } });
    const sbi = getByTestId('sbi');
    await fireEvent.focus(sbi);
    await fireEvent.keyDown(sbi, { key: 'Enter' });
    expect(onPick).toHaveBeenCalledWith({ name: undefined, value: 'sbi' });
    expect(onSbiClick).toHaveBeenCalledTimes(1);
  });

  it('one tab stop; the arrows move focus across sections', async () => {
    const { getByTestId } = render(BankListHarness);
    const stops = ['sbi', 'icici-corp', 'airtel'].map((id) => getByTestId(id).tabIndex);
    expect(stops).toEqual([0, -1, -1]);
    getByTestId('icici-corp').focus();
    await fireEvent.focus(getByTestId('icici-corp'));
    await fireEvent.keyDown(getByTestId('icici-corp'), { key: 'ArrowDown' });
    await waitFor(() => expect(document.activeElement).toBe(getByTestId('airtel')));
  });
});

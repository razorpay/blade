import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import ChipHarness from './fixtures/ChipHarness.svelte';
import { expectClass, expectNoClass } from './classes';
import { resolveChip } from '../components/chip/styles';

const flush = (): Promise<unknown> => new Promise((resolve) => setTimeout(resolve, 0));
const input = (chip: HTMLElement): HTMLInputElement => chip.querySelector('input')!;
const frame = (chip: HTMLElement): HTMLElement => input(chip).nextElementSibling as HTMLElement;

describe('ChipGroup', () => {
  it('single is a radiogroup of native radios sharing a name', () => {
    const { getByRole, getByTestId } = render(ChipHarness);
    expect(getByRole('radiogroup', { name: 'Business type' })).toBe(getByTestId('group'));
    const first = input(getByTestId('chip-0'));
    expect(first.type).toBe('radio');
    expect(first.name).toBe('type');
    expect(input(getByTestId('chip-1')).name).toBe('type');
  });

  it('a pick binds the value, reports onChange and draws the picked look', async () => {
    const onChange = vi.fn();
    const { getByTestId } = render(ChipHarness, { props: { onChange } });
    await fireEvent.click(input(getByTestId('chip-1')));
    expect(onChange).toHaveBeenCalledExactlyOnceWith({ name: 'type', values: ['public'] });
    expect(getByTestId('bound').textContent).toBe('public');
    expectClass(frame(getByTestId('chip-1')), 'border-interactive-primary-default');
    expectNoClass(frame(getByTestId('chip-0')), 'border-interactive-primary-default');

    await fireEvent.click(input(getByTestId('chip-0')));
    expect(getByTestId('bound').textContent).toBe('proprietorship');
    expect(input(getByTestId('chip-1')).checked).toBe(false);
  });

  it('multiple is a group of checkboxes collecting an array', async () => {
    const { getByRole, getByTestId } = render(ChipHarness, {
      props: { selectionType: 'multiple', value: [] },
    });
    expect(getByRole('group', { name: 'Business type' })).toBeTruthy();
    expect(input(getByTestId('chip-0')).type).toBe('checkbox');
    await fireEvent.click(input(getByTestId('chip-0')));
    await fireEvent.click(input(getByTestId('chip-1')));
    expect(getByTestId('bound').textContent).toBe('proprietorship,public');
    await fireEvent.click(input(getByTestId('chip-0')));
    expect(getByTestId('bound').textContent).toBe('public');
  });

  it("a chip's own colour wins over the group's", async () => {
    const { getByTestId } = render(ChipHarness, { props: { color: 'positive', value: 'public' } });
    expectClass(frame(getByTestId('chip-1')), 'border-interactive-positive-default');
    await fireEvent.click(input(getByTestId('chip-3')));
    expectClass(frame(getByTestId('chip-3')), 'border-interactive-negative-default');
  });

  it('a disabled chip, or group, refuses picks', async () => {
    const onChange = vi.fn();
    const { getByTestId } = render(ChipHarness, { props: { onChange } });
    const closed = input(getByTestId('chip-2'));
    expect(closed.disabled).toBe(true);
    closed.disabled = false;
    await fireEvent.click(closed);
    expect(onChange).not.toHaveBeenCalled();
    expect(closed.checked).toBe(false);

    const off = render(ChipHarness, { props: { isDisabled: true } });
    expect(input(off.getAllByTestId('chip-0')[1]).disabled).toBe(true);
  });

  it('shrinks while pressed, as Blade does', async () => {
    const { getByTestId } = render(ChipHarness);
    const label = input(getByTestId('chip-0')).parentElement!;
    await fireEvent.pointerDown(label);
    expectClass(frame(getByTestId('chip-0')), 'scale-[.92]');
    await fireEvent.pointerUp(label);
    expectNoClass(frame(getByTestId('chip-0')), 'scale-[.92]');
  });

  it('shows the necessity marker and the help text', () => {
    const { getByText } = render(ChipHarness, {
      props: { necessityIndicator: 'optional', helpText: 'Pick one' },
    });
    expect(getByText('(optional)', { exact: false })).toBeTruthy();
    expect(getByText('Pick one')).toBeTruthy();
  });

  it('inside a Form a required group blocks submit, then submits the pick', async () => {
    const onSubmit = vi.fn();
    const { getByTestId, getByText, queryByText } = render(ChipHarness, {
      props: { inForm: true, necessityIndicator: 'required', onSubmit },
    });
    await fireEvent.click(getByTestId('continue'));
    await flush();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(getByText('msg:required')).toBeTruthy();

    await fireEvent.click(input(getByTestId('chip-1')));
    await flush();
    expect(queryByText('msg:required')).toBeNull();
    await fireEvent.click(getByTestId('continue'));
    await flush();
    expect(onSubmit.mock.calls[0][0]).toEqual({ type: 'public' });
  });

  it.each([
    ['xsmall', 'font-blade-text font-blade-regular text-75 leading-75'],
    ['small', 'font-blade-text font-blade-regular text-100 leading-100'],
    ['medium', 'font-blade-text font-blade-regular text-200 leading-200'],
    // Figma's _Chip sets the large label in Heading/MediumRegular, 20/26.
    ['large', 'font-heading font-blade-regular text-400 leading-400 tracking-100'],
  ] as const)('%s: the label in Figma\'s type, on one unbroken row', (size, type) => {
    const classes = resolveChip(size, 'unchecked', 'primary');
    expect(classes.text).toContain(type);
    expect(classes.text).toContain('px-1');
    expect(classes.inner).toContain('flex-row');
    expect(classes.inner).toContain('whitespace-nowrap');
  });
});

import { describe, it, expect, vi } from 'vitest';
import { createOptionListCore, nativeOptionState } from './option-list';

describe('nativeOptionState', () => {
  it('emits only the attributes that are on', () => {
    expect(nativeOptionState(false, false)).toEqual({});
    expect(nativeOptionState(true, false)).toEqual({ checked: 'true' });
    expect(nativeOptionState(true, true)).toEqual({
      checked: 'true',
      disabled: 'true',
    });
  });
});

describe('createOptionListCore', () => {
  interface Bank {
    id: string;
    disabled?: boolean;
  }
  const banks: Bank[] = [
    { id: 'axis' },
    { id: 'hdfc', disabled: true },
    { id: 'icici' },
  ];
  const compare = (a: Bank, b: Bank) => a.id === b.id;

  it('mirrors a controlled value, toggles on click and skips disabled options', () => {
    let value: Bank | null = null;
    const onChange = vi.fn((next: Bank | null) => {
      value = next;
    });
    const list = createOptionListCore({
      items: () => banks,
      compare,
      isDisabled: (o) => Boolean(o.disabled),
      value: () => value,
      onChange,
    });
    list.select({ id: 'axis' });
    expect(value).toEqual({ id: 'axis' });
    expect(list.selectedIndex()).toBe(0);
    expect(list.activeIndex()).toBe(0);
    list.select({ id: 'hdfc' });
    expect(value).toEqual({ id: 'axis' });
    list.select({ id: 'axis' });
    expect(value).toBeNull();
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('strictOption keeps the selection, and optionState projects checked/disabled', () => {
    const list = createOptionListCore({
      items: () => banks,
      compare,
      strictOption: true,
      isDisabled: (o) => Boolean(o.disabled),
      defaultValue: { id: 'icici' },
    });
    list.select({ id: 'icici' });
    expect(list.selected()).toEqual({ id: 'icici' });
    expect(list.optionState(banks[2], 2)).toEqual({ checked: 'true' });
    expect(list.optionState(banks[1], 1)).toEqual({ disabled: 'true' });
  });

  it('handleKey moves, then Enter selects the active option', () => {
    const list = createOptionListCore({
      items: () => banks,
      compare,
      isDisabled: (o) => Boolean(o.disabled),
    });
    expect(list.handleKey('ArrowDown')).toBe('next');
    expect(list.handleKey('ArrowDown')).toBe('next');
    expect(list.active()).toEqual(banks[2]);
    expect(list.handleKey('Enter')).toBe('select');
    expect(list.selected()).toEqual({ id: 'icici' });
    expect(list.handleKey('x')).toBeNull();
    expect(list.handleKey('Escape')).toBe('close');
    expect(list.selected()).toEqual({ id: 'icici' });
  });
});

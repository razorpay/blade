import { describe, it, expect, vi } from 'vitest';
import { createField } from '../form/field.svelte';
import { createOptionChoice } from './list.svelte';

interface Bank {
  code: string;
}
const hdfc: Bank = { code: 'hdfc' };
const icici: Bank = { code: 'icici' };
const byCode = (a: Bank, b: Bank) => a?.code === b?.code;

function bankField(props: Record<string, unknown> = {}, onTouch = vi.fn()) {
  const field = createField(props, undefined, { kind: 'radio', onTouch });
  field.updateProps({ name: 'bank', ...props });
  return { field, onTouch };
}

describe('createOptionChoice', () => {
  it('a single pick replaces the value, notifies and counts as a visit', () => {
    const { field, onTouch } = bankField();
    const choice = createOptionChoice<Bank>(field, { compare: byCode });
    const onValue = vi.fn();

    expect(choice.toggle(hdfc, 0, onValue)).toBe(true);
    expect(field.record.value).toBe(hdfc);
    expect(field.record.touched).toBe(true);
    expect(onValue).toHaveBeenCalledWith(hdfc);
    expect(onTouch).toHaveBeenCalledTimes(1);

    choice.toggle(icici, 1);
    expect(choice.isSelected({ code: 'icici' })).toBe(true);
    expect(choice.isSelected(hdfc)).toBe(false);
  });

  it('keeps the pick when it is picked again, unless deselectable', () => {
    const { field } = bankField({ defaultValue: hdfc });
    let deselectable = false;
    const choice = createOptionChoice<Bank>(field, {
      compare: byCode,
      deselectable: () => deselectable,
    });
    expect(choice.toggle(hdfc, 0)).toBe(true);
    deselectable = true;
    expect(choice.toggle(hdfc, 0)).toBe(false);
    expect(field.record.value).toBeNull();
  });

  it('multiple collects picks into an array and removes on a second pick', () => {
    const { field } = bankField();
    const choice = createOptionChoice<Bank>(field, {
      compare: byCode,
      multiple: () => true,
    });
    choice.toggle(hdfc, 0);
    choice.toggle(icici, 1);
    expect(field.record.value).toEqual([hdfc, icici]);
    expect(choice.toggle({ code: 'hdfc' }, 0)).toBe(false);
    expect(field.record.value).toEqual([icici]);
  });

  it('refuses a disabled option or list and reports it to native', () => {
    const { field, onTouch } = bankField();
    const choice = createOptionChoice<Bank>(field, {
      compare: byCode,
      isOptionDisabled: (option) => option.code === 'icici',
    });
    expect(choice.toggle(icici, 1)).toBe(false);
    expect(field.record.value ?? null).toBeNull();
    expect(onTouch).not.toHaveBeenCalled();
    expect(choice.optionState(icici, 1)).toEqual({ disabled: 'true' });

    choice.toggle(hdfc, 0);
    expect(choice.optionState(hdfc, 0)).toEqual({ checked: 'true' });

    const off = createOptionChoice<Bank>(field, { disabled: () => true });
    expect(off.toggle(icici, 1)).toBe(false);
  });

  describe('keyboard', () => {
    const sbi: Bank = { code: 'sbi' };
    const banks = [hdfc, icici, sbi];

    function keyed(multiple: boolean, props: Record<string, unknown> = {}) {
      const { field } = bankField(props);
      const choice = createOptionChoice<Bank>(field, {
        items: () => banks,
        compare: byCode,
        multiple: () => multiple,
        isOptionDisabled: (option) => option.code === 'icici',
        typeahead: (option) => option.code,
      });
      return { field, choice };
    }

    it.each([false, true])(
      'arrows move and pick nothing; Enter and Space pick (multiple: %s)',
      (multiple) => {
        const { field, choice } = keyed(multiple);
        choice.setActive(0);
        expect(choice.handleKey('ArrowDown')).toBe(true);
        // icici is disabled: the keyboard skips it.
        expect(choice.activeIndex()).toBe(2);
        expect(field.record.value ?? null).toBeNull();

        const onValue = vi.fn();
        expect(choice.handleKey('Enter', undefined, onValue)).toBe(true);
        expect(onValue).toHaveBeenCalledTimes(1);
        expect(choice.isSelected(sbi)).toBe(true);

        choice.handleKey('Home');
        expect(choice.activeIndex()).toBe(0);
        choice.handleKey(' ');
        expect(choice.isSelected(hdfc)).toBe(true);
        expect(choice.isSelected(sbi)).toBe(multiple);
      }
    );

    it('stops at the ends, types ahead, and leaves other keys alone', () => {
      const { choice } = keyed(false);
      choice.setActive(2);
      choice.handleKey('ArrowDown');
      expect(choice.activeIndex()).toBe(2);
      expect(choice.handleKey('h')).toBe(true);
      expect(choice.activeIndex()).toBe(0);
      expect(choice.handleKey('Tab')).toBe(false);
      expect(choice.handleKey('Escape')).toBe(false);
    });

    it("Enter before the list was entered is not the list's key", () => {
      const { choice } = keyed(false);
      expect(choice.handleKey('Enter')).toBe(false);
    });

    it('the tab stop is the active row, else the pick, else the first enabled', () => {
      const { choice } = keyed(false, { defaultValue: sbi });
      expect(choice.tabStop()).toBe(2);
      choice.setActive(0);
      expect(choice.tabStop()).toBe(0);
      expect(keyed(false).choice.tabStop()).toBe(0);
    });
  });
});

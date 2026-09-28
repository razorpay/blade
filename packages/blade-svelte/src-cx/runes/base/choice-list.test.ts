import { describe, it, expect, vi } from 'vitest';
import { createField } from '../form/field.svelte';
import { createChoiceList, type ChoiceEntry } from './choice-list.svelte';

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

describe('createChoiceList', () => {
  it('a single pick replaces the value, notifies and counts as a visit', () => {
    const { field, onTouch } = bankField();
    const choice = createChoiceList<Bank>(field, { compare: byCode });
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
    const choice = createChoiceList<Bank>(field, {
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
    const choice = createChoiceList<Bank>(field, {
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
    const choice = createChoiceList<Bank>(field, {
      items: () => [hdfc, icici],
      compare: byCode,
      isItemDisabled: (option) => option.code === 'icici',
    });
    expect(choice.toggle(icici, 1)).toBe(false);
    expect(field.record.value ?? null).toBeNull();
    expect(onTouch).not.toHaveBeenCalled();
    expect(choice.optionState(icici, 1)).toEqual({ disabled: 'true' });

    choice.toggle(hdfc, 0);
    expect(choice.optionState(hdfc, 0)).toEqual({ checked: 'true' });

    const off = createChoiceList<Bank>(field, { disabled: () => true });
    expect(off.toggle(icici, 1)).toBe(false);
  });

  describe('keyboard', () => {
    const sbi: Bank = { code: 'sbi' };
    const banks = [hdfc, icici, sbi];

    function keyed(multiple: boolean, props: Record<string, unknown> = {}) {
      const { field } = bankField(props);
      const choice = createChoiceList<Bank>(field, {
        items: () => banks,
        compare: byCode,
        multiple: () => multiple,
        isItemDisabled: (option) => option.code === 'icici',
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
  describe('as an accordion: deselectable, looping', () => {
    function open(props: Record<string, unknown> = {}) {
      const { field, onTouch } = bankField(props);
      const choice = createChoiceList<string | number>(field, {
        deselectable: () => true,
        loop: true,
      });
      return { field, choice, onTouch };
    }

    it('opens one item at a time and closes it on a second press', () => {
      const { field, choice, onTouch } = open();
      const onValue = vi.fn();
      choice.toggle('upi', 0, onValue);
      expect(field.record.value).toBe('upi');
      expect(onValue).toHaveBeenCalledWith('upi');
      expect(onTouch).toHaveBeenCalledTimes(1);

      choice.toggle('wallet', 1);
      expect(choice.isSelected('upi')).toBe(false);
      expect(choice.isSelected('wallet')).toBe(true);

      choice.toggle('wallet', 1, onValue);
      expect(field.record.value).toBeNull();
      expect(onValue).toHaveBeenLastCalledWith(null);
    });

    it('takes an index as the value, and reads the initial value', () => {
      expect(open().choice.toggle(0, 0)).toBe(true);
      expect(open({ value: 'wallet' }).choice.isSelected('wallet')).toBe(true);
    });
  });

  describe('registered entries', () => {
    function entry(
      value: Bank,
      element?: HTMLElement,
      disabled = false
    ): ChoiceEntry<Bank> {
      return {
        value: () => value,
        isDisabled: () => disabled,
        text: () => value.code,
        getElement: () => element,
      };
    }

    it('reads entries back in document order, whatever the mount order', () => {
      const { field } = bankField();
      const choice = createChoiceList<Bank>(field, { compare: byCode });
      const box = document.createElement('div');
      const first = box.appendChild(document.createElement('span'));
      const second = box.appendChild(document.createElement('span'));
      const b = entry(icici, second);
      const a = entry(hdfc, first);
      choice.register(b);
      const off = choice.register(a);
      expect(choice.items()).toEqual([hdfc, icici]);
      expect(choice.indexOf(b)).toBe(1);
      off();
      expect(choice.items()).toEqual([icici]);
    });

    it('skips a disabled entry and types ahead over entry text', () => {
      const { field } = bankField();
      const choice = createChoiceList<Bank>(field, { compare: byCode });
      const box = document.createElement('div');
      const els = [0, 1, 2].map(() => box.appendChild(document.createElement('span')));
      choice.register(entry(hdfc, els[0]));
      choice.register(entry(icici, els[1], true));
      choice.register(entry({ code: 'sbi' }, els[2]));
      choice.setActive(0);
      choice.handleKey('ArrowDown');
      expect(choice.activeIndex()).toBe(2);
      choice.handleKey('h');
      expect(choice.activeIndex()).toBe(0);
    });

    it('moves focus between elements on movement keys only', () => {
      const { field } = bankField();
      const choice = createChoiceList<Bank>(field, { compare: byCode, loop: true });
      const box = document.body.appendChild(document.createElement('div'));
      const buttons = [0, 1].map(() => box.appendChild(document.createElement('button')));
      choice.register(entry(hdfc, buttons[0]));
      choice.register(entry(icici, buttons[1]));
      choice.setActive(1);
      expect(choice.handleMoveKey('ArrowDown')).toBe(true);
      expect(document.activeElement).toBe(buttons[0]);
      expect(choice.handleMoveKey('Enter')).toBe(false);
      expect(field.record.value ?? null).toBeNull();
      box.remove();
    });
  });
});

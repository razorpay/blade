import { describe, it, expect, vi } from 'vitest';
import { createCompositeInput } from './otp.svelte';
import type { CompositeInputModel } from './otp.svelte';

function otp(
  overrides: {
    onChange?: (v: string) => void;
    onFill?: (m: string) => void;
  } = {},
): CompositeInputModel {
  return createCompositeInput({ length: 6, ...overrides });
}

describe('typing', () => {
  it('sets the cell and advances focus, staying on the last cell', () => {
    const model = otp();
    expect(model.keyAt(0, '1')).toBe('set');
    expect(model.state).toMatchObject({ value: '1', focusIndex: 1 });
    for (const [i, key] of [...'23456'].entries()) {
      model.keyAt(i + 1, key);
    }
    expect(model.state).toMatchObject({
      value: '123456',
      filled: true,
      focusIndex: 5,
    });
  });

  it('rejects non-digits and chords', () => {
    const model = otp();
    expect(model.keyAt(0, 'a')).toBe('reject');
    expect(model.keyAt(0, 'v', { ctrl: true })).toBeNull();
    expect(model.keyAt(0, 'r', { meta: true })).toBeNull();
    expect(model.keyAt(0, 'Enter')).toBe('submit');
    expect(model.value()).toBe('');
  });

  it('emits onChange only when the value actually changes', () => {
    const onChange = vi.fn();
    const model = otp({ onChange });
    model.keyAt(0, '1');
    model.keyAt(1, 'ArrowLeft');
    model.keyAt(0, 'ArrowRight');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('1');
  });
});

describe('deletion', () => {
  it('clears a filled cell in place, keeping focus on it', () => {
    const model = otp();
    model.keyAt(0, '1');
    model.keyAt(1, '2');
    // Deleting inside a filled cell empties it without moving focus.
    expect(model.keyAt(1, 'Delete')).toBe('clear');
    expect(model.state).toMatchObject({ value: '1', focusIndex: 1 });
    expect(model.state.cells[1]).toBe('');
  });

  it('backspace on an empty cell deletes the previous cell and moves there', () => {
    const model = otp();
    model.keyAt(0, '1');
    const action = model.keyAt(1, 'Backspace');
    expect(action).toBe('retreat');
    expect(model.state).toMatchObject({ value: '', focusIndex: 0 });
  });

  it('backspace on the empty first cell is inert', () => {
    const model = otp();
    expect(model.keyAt(0, 'Backspace')).toBe('clear');
    expect(model.state).toMatchObject({ value: '', focusIndex: 0 });
  });
});

describe('navigation', () => {
  it('arrows and Tab move focus with clamping at the edges', () => {
    const model = otp();
    expect(model.keyAt(0, 'ArrowLeft')).toBe('prev');
    expect(model.state.focusIndex).toBe(0);
    expect(model.keyAt(0, 'ArrowRight')).toBe('next');
    expect(model.state.focusIndex).toBe(1);
    expect(model.keyAt(1, 'Tab', { shift: true })).toBe('prev');
    expect(model.state.focusIndex).toBe(0);
    expect(model.keyAt(5, 'ArrowDown')).toBe('next');
    expect(model.state.focusIndex).toBe(5);
  });
});

describe('paste', () => {
  it('fills forward from the pasted cell, strips junk and truncates', () => {
    const onFill = vi.fn();
    const onChange = vi.fn();
    const model = createCompositeInput({ length: 6, onFill, onChange });
    model.pasteAt(2, '12-34-5678');
    expect(model.state).toMatchObject({
      value: '1234',
      cells: ['', '', '1', '2', '3', '4'],
      focusIndex: 5,
    });
    expect(onFill).toHaveBeenCalledWith('paste');
    expect(onChange).toHaveBeenCalledWith('1234');
  });

  it('a paste with no accepted characters does nothing', () => {
    const onFill = vi.fn();
    const model = createCompositeInput({ length: 6, onFill });
    model.pasteAt(0, 'abc');
    expect(model.value()).toBe('');
    expect(onFill).not.toHaveBeenCalled();
  });
});

describe('platform text commits (inputAt)', () => {
  it('a full-length commit distributes from the first cell and reports autofill', () => {
    const onFill = vi.fn();
    const model = createCompositeInput({ length: 6, onFill });
    model.keyAt(0, '9'); // focus sits on cell 1 when autofill types into it
    model.inputAt(1, '123456');
    expect(model.state).toMatchObject({
      value: '123456',
      filled: true,
      focusIndex: 5,
    });
    expect(onFill).toHaveBeenCalledWith('autofill');
  });

  it('a partial multi-char commit fills forward from the edited cell, silently', () => {
    const onFill = vi.fn();
    const model = createCompositeInput({ length: 6, onFill });
    model.inputAt(2, '12');
    expect(model.state).toMatchObject({
      cells: ['', '', '1', '2', '', ''],
      focusIndex: 3,
    });
    expect(onFill).not.toHaveBeenCalled();
  });

  it('a single committed char sets and advances; a rejected one republishes for resync', () => {
    const model = otp();
    model.inputAt(0, '7');
    expect(model.state).toMatchObject({ value: '7', focusIndex: 1 });

    const before = model.state;
    model.inputAt(1, 'x');
    expect(model.value()).toBe('7');
    expect(model.state).not.toBe(before);
  });

  it('an empty commit clears the cell in place — the only delete native can send', () => {
    const onChange = vi.fn();
    const model = otp({ onChange });
    model.setValue('12');
    onChange.mockClear();

    model.inputAt(1, '');

    expect(model.state).toMatchObject({ value: '1', focusIndex: 1 });
    expect(onChange).toHaveBeenCalledWith('1');
  });
});

describe('setValue', () => {
  it('replaces all cells and clears with an empty string', () => {
    const onChange = vi.fn();
    const model = createCompositeInput({ length: 4, onChange });
    model.setValue('1234');
    expect(model.state).toMatchObject({ value: '1234', filled: true });
    model.setValue('');
    expect(model.state).toMatchObject({ value: '', filled: false });
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('accepts a custom per-character sanitizer', () => {
    const model = createCompositeInput({
      length: 4,
      accept: (char) => (/^[a-z]$/.test(char) ? char.toUpperCase() : ''),
    });
    model.pasteAt(0, 'ab1c');
    expect(model.value()).toBe('ABC');
  });
});

import { describe, it, expect, vi } from 'vitest';
import type { Mock } from 'vitest';
import { createField } from '../form/field.svelte';
import type { FieldModel } from '../form/field.svelte';
import { compileRules } from './format';
import { createInput } from './text-control.svelte';

const parse = compileRules([['\\D', 'g', '']]);
const format = compileRules([
  ['\\D', 'g', ''],
  ['(\\d{4})(?=\\d)', 'g', '$1 '],
]);

function cardField(onTouch = vi.fn()): { field: FieldModel; onTouch: Mock } {
  const field = createField({}, undefined, { kind: 'text', onTouch });
  field.updateProps({ name: 'card.number', parse, format });
  return { field, onTouch };
}

describe('createInput accept', () => {
  it('passes clean input through without a rewrite', () => {
    const { field } = cardField();
    const input = createInput(field);
    expect(input.accept('4111', 4)).toEqual({
      display: '4111',
      caret: null,
      rewrite: false,
    });
    expect(field.record.value).toBe('4111');
  });

  it('rewrites when the format inserts a separator, caret left alone at the end', () => {
    const { field } = cardField();
    const input = createInput(field);
    expect(input.accept('41112', 5)).toEqual({
      display: '4111 2',
      caret: null,
      rewrite: true,
    });
  });

  it('restores the caret after the same digits on a mid-string edit', () => {
    const { field } = cardField();
    const input = createInput(field);
    input.accept('4111 2222', 9);
    // '5' typed after '4111 ': the display regroups, the caret follows '41115'.
    const result = input.accept('4111 52222', 6);
    expect(result.display).toBe('4111 5222 2');
    expect(result.rewrite).toBe(true);
    expect(result.caret).toBe(6);
  });

  it('notifies onValue only when the parsed value changes', () => {
    const { field } = cardField();
    const input = createInput(field);
    const onValue = vi.fn();
    input.accept('4111', 4, onValue);
    // A rewritten separator round-trips to the same parsed value.
    input.accept('4111', 4, onValue);
    expect(onValue).toHaveBeenCalledTimes(1);
    expect(onValue).toHaveBeenCalledWith('4111');
  });
});

describe('createInput leave', () => {
  it('skips the touch exactly once for an auto-focused field', () => {
    const { field, onTouch } = cardField();
    const input = createInput(field, { autoFocus: true });
    expect(input.leave()).toEqual({ touched: false });
    expect(onTouch).not.toHaveBeenCalled();
    expect(input.leave()).toEqual({ touched: true });
    expect(field.record.touched).toBe(true);
    expect(onTouch).toHaveBeenCalledTimes(1);
  });

  it('touches on the first blur without autoFocus', () => {
    const { field } = cardField();
    const input = createInput(field);
    expect(input.leave()).toEqual({ touched: true });
    expect(field.record.touched).toBe(true);
  });
});

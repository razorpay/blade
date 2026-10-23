import { describe, it, expect, vi } from 'vitest';
import { createField } from '../form/field.svelte';
import type { FieldModel } from '../form/field.svelte';
import { maskValue } from './mask';
import { createInput } from './text-control.svelte';

const parse = (value: unknown): string => String(value ?? '').replace(/\D/g, '');
const format = (value: unknown): string => parse(value).replace(/(\d{4})(?=\d)/g, '$1 ');

function cardField(): FieldModel {
  const field = createField(undefined, { kind: 'text' });
  field.updateProps({ name: 'card.number', parse, format });
  return field;
}

describe('createInput accept', () => {
  it('passes clean input through without a rewrite', () => {
    const field = cardField();
    const input = createInput(field);
    expect(input.accept('4111', 4)).toEqual({
      display: '4111',
      caret: null,
      rewrite: false,
    });
    expect(field.record.value).toBe('4111');
  });

  it('rewrites when the format inserts a separator, caret left alone at the end', () => {
    const input = createInput(cardField());
    expect(input.accept('41112', 5)).toEqual({
      display: '4111 2',
      caret: null,
      rewrite: true,
    });
  });

  it('restores the caret after the same digits on a mid-string edit', () => {
    const input = createInput(cardField());
    input.accept('4111 2222', 9);
    // '5' typed after '4111 ': the display regroups, the caret follows '41115'.
    const result = input.accept('4111 52222', 6);
    expect(result.display).toBe('4111 5222 2');
    expect(result.rewrite).toBe(true);
    expect(result.caret).toBe(6);
  });

  it('notifies onValue only when the parsed value changes', () => {
    const input = createInput(cardField());
    const onValue = vi.fn();
    input.accept('4111', 4, onValue);
    // A rejected character parses to the same value.
    input.accept('4111a', 5, onValue);
    expect(onValue).toHaveBeenCalledTimes(1);
    expect(onValue).toHaveBeenCalledWith('4111');
  });
});

describe('createInput with a mask', () => {
  const pattern = '##/##';
  function expiryField(): FieldModel {
    const field = createField(undefined, { kind: 'text' });
    field.updateProps({ name: 'expiry', parse: (v: unknown) => maskValue(v, pattern) });
    return field;
  }

  it('lays typing into the pattern and stores the formatted text, as Blade', () => {
    const field = expiryField();
    const input = createInput(field, { mask: () => pattern });
    expect(input.accept('12', 2)).toEqual({ display: '12/', caret: null, rewrite: true });
    expect(input.accept('12/3', 4)).toMatchObject({ display: '12/3', rewrite: false });
    expect(field.record.value).toBe('12/3');
  });

  it('deleting a delimiter deletes the character before it', () => {
    const field = expiryField();
    const input = createInput(field, { mask: () => pattern });
    input.accept('1234', 4);
    // Backspace over the `/` of `12/34`: the control holds `1234`, caret at 2.
    expect(input.accept('1234', 2)).toEqual({ display: '13/4', caret: 1, rewrite: true });
  });
});

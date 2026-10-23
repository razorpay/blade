import { describe, it, expect, vi } from 'vitest';
import { createField, defaultCompare } from './field.svelte';

describe('createField', () => {
  it('parses values and notifies only when the parsed value changes', () => {
    const onChange = vi.fn();
    const field = createField(undefined);

    field.updateProps({ name: 'amount', parse: Number });
    field.updateValue('10', onChange);
    field.updateValue('10', onChange);
    field.updateValue('12', onChange);

    expect(onChange.mock.calls).toEqual([[10], [12]]);
    expect(field.record.value).toBe(12);
  });

  it('takes the value prop as it changes, and keeps its own without one', () => {
    const onValueChange = vi.fn();
    const field = createField(onValueChange);
    field.updateProps({ name: 'a', value: 'controlled' });
    expect(field.record.value).toBe('controlled');
    expect(onValueChange).toHaveBeenCalledWith('controlled');
    field.updateValue('typed');
    field.updateProps({ name: 'a' });
    expect(field.record.value).toBe('typed');
  });

  it('touch marks the record touched and reports it', () => {
    const onTouch = vi.fn();
    const field = createField(undefined, { onTouch });

    field.touch();

    expect(field.record.touched).toBe(true);
    expect(onTouch).toHaveBeenCalledWith(field.record);
  });

  it('defaultCompare is strict equality', () => {
    expect(defaultCompare(1, 1)).toBe(true);
    expect(defaultCompare('1', 1)).toBe(false);
  });
});

describe('createField constraints', () => {
  const props = (extra: Record<string, unknown>): { name: string } => ({ name: 'f', ...extra });

  it('derives constraints from the control props', () => {
    const field = createField(undefined, { kind: 'text' });
    field.updateProps(props({ required: true, pattern: /\d+/, type: 'email' }));
    expect(field.record.constraints).toEqual({
      kind: 'text',
      required: true,
      pattern: '\\d+',
      email: true,
    });
  });

  it('registers no constraints for disabled, readonly or hidden controls, or without a kind', () => {
    const field = createField(undefined, { kind: 'text' });
    field.updateProps(props({ required: true, disabled: true }));
    expect(field.record.constraints).toBeUndefined();
    field.updateProps(props({ required: true, readonly: true }));
    expect(field.record.constraints).toBeUndefined();
    field.updateProps(props({ required: true, type: 'hidden' }));
    expect(field.record.constraints).toBeUndefined();

    const button = createField(undefined);
    button.updateProps(props({ required: true }));
    expect(button.record.constraints).toBeUndefined();
  });

  it('displays the formatted value and exposes the element lazily', () => {
    const field = createField(undefined, { kind: 'text' });
    field.updateProps(props({ format: (v: string) => v.replace(/(\d{4})(?=\d)/g, '$1 ') }));
    field.updateValue('41111111');
    expect(field.record.getDisplayValue?.()).toBe('4111 1111');

    const holder: { element?: HTMLElement } = {};
    field.locate(() => holder.element);
    expect(field.record.element()).toBeUndefined();
    field.record.reveal();
    holder.element = document.createElement('input');
    expect(field.record.element()).toBe(holder.element);
  });

  it('reveals by focusing without a jump, then centring it — smoothly unless motion is reduced', () => {
    const field = createField(undefined, { kind: 'text' });
    const row = document.body.appendChild(document.createElement('label'));
    const control = row.appendChild(document.createElement('input'));
    const scrollIntoView = vi.fn();
    control.scrollIntoView = scrollIntoView;
    const focus = vi.spyOn(control, 'focus');
    field.locate(
      () => row,
      () => control,
    );
    expect(field.record.element()).toBe(row);

    field.record.reveal();
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
    expect(document.activeElement).toBe(control);
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'center', behavior: 'smooth' });

    const matchMedia = vi
      .spyOn(window, 'matchMedia')
      .mockImplementation((query) => ({ matches: query.includes('reduce') } as MediaQueryList));
    field.record.reveal();
    expect(scrollIntoView).toHaveBeenLastCalledWith({ block: 'center', behavior: 'auto' });
    matchMedia.mockRestore();
    row.remove();
  });
});

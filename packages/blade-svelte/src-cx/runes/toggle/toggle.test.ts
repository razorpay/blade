import { describe, it, expect, vi } from 'vitest';
import { createField } from '../form/field.svelte';
import { createCheckbox } from './toggle.svelte';

function consentField(props: Record<string, unknown> = {}, onTouch = vi.fn()) {
  const field = createField(props, undefined, { kind: 'checkbox', onTouch });
  field.updateProps({ name: 'consent', ...props });
  return { field, onTouch };
}

describe('createCheckbox', () => {
  it('a toggle updates the field, notifies and counts as a visit', () => {
    const { field, onTouch } = consentField();
    const checkbox = createCheckbox(field);
    const onValue = vi.fn();

    expect(checkbox.toggle(true, onValue)).toBe(true);

    expect(field.record.value).toBe(true);
    expect(field.record.touched).toBe(true);
    expect(onValue).toHaveBeenCalledWith(true);
    expect(onTouch).toHaveBeenCalledTimes(1);
  });

  it('reads checked through a parsed value', () => {
    const { field } = consentField({ parse: Number });
    const checkbox = createCheckbox(field);

    checkbox.toggle(true);
    expect(field.record.value).toBe(1);
    expect(checkbox.isChecked()).toBe(true);

    checkbox.toggle(false);
    expect(field.record.value).toBe(0);
    expect(checkbox.isChecked()).toBe(false);
  });

  it('starts from defaultValue when uncontrolled', () => {
    const { field } = consentField({ defaultValue: true });
    expect(createCheckbox(field).isChecked()).toBe(true);
  });

  it('refuses a toggle while disabled and reports what to show', () => {
    const { field, onTouch } = consentField();
    const checkbox = createCheckbox(field, { disabled: () => true });
    const onValue = vi.fn();

    expect(checkbox.toggle(true, onValue)).toBe(false);

    expect(field.record.value).toBeNull();
    expect(onValue).not.toHaveBeenCalled();
    expect(onTouch).not.toHaveBeenCalled();
  });
});

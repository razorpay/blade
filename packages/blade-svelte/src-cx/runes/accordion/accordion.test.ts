import { describe, it, expect, vi } from 'vitest';
import { createField } from '../form/field.svelte';
import { createAccordionModel } from './accordion.svelte';

function setup(props: Record<string, unknown> = {}) {
  const onTouch = vi.fn();
  const field = createField(props, undefined, { kind: 'radio', onTouch });
  field.updateProps({ name: 'instrument', ...props });
  return { field, accordion: createAccordionModel(field), onTouch };
}

describe('createAccordionModel', () => {
  it('opens one item at a time and closes it on a second press', () => {
    const { field, accordion, onTouch } = setup();
    const onValue = vi.fn();

    accordion.toggle('upi', onValue);
    expect(field.record.value).toBe('upi');
    expect(onValue).toHaveBeenCalledWith('upi');
    expect(onTouch).toHaveBeenCalledTimes(1);

    accordion.toggle('wallet');
    expect(accordion.isExpanded('upi')).toBe(false);
    expect(accordion.isExpanded('wallet')).toBe(true);

    accordion.toggle('wallet', onValue);
    expect(field.record.value).toBeNull();
    expect(onValue).toHaveBeenLastCalledWith(null);
  });

  it('takes an index as the value', () => {
    const { accordion } = setup();
    accordion.toggle(0);
    expect(accordion.isExpanded(0)).toBe(true);
    expect(accordion.isExpanded(1)).toBe(false);
  });

  it('reads the initial value as the open item', () => {
    const { accordion } = setup({ value: 'wallet' });
    expect(accordion.isExpanded('wallet')).toBe(true);
    expect(accordion.isExpanded('upi')).toBe(false);
  });
});

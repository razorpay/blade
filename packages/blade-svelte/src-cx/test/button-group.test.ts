import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import ButtonGroupHarness from './fixtures/ButtonGroupHarness.svelte';
import { expectClass, expectNoClass } from './classes';

describe('ButtonGroup', () => {
  it('is a role=group row, clipped to the group radius; not a toolbar', () => {
    const { getByTestId, getByRole } = render(ButtonGroupHarness);
    const group = getByTestId('group');
    expect(getByRole('group')).toBe(group);
    expectClass(group, 'inline-flex');
    expectClass(group, 'overflow-hidden');
    expectClass(group, 'rounded-small');
    // The end buttons keep their outer corners.
    expectClass(group, '[&>:first-child]:rounded-tl-small');
    expectClass(group, '[&>:last-child]:rounded-br-small');
    expectClass(group, '[&_button]:rounded-none');
    for (const id of ['one', 'two']) {
      expect(getByTestId(id).hasAttribute('tabindex')).toBe(false);
    }
  });

  it('the group’s variant, size and colour win over each button’s', () => {
    const { getByTestId } = render(ButtonGroupHarness, {
      props: { variant: 'primary', size: 'small', color: 'positive' },
    });
    const one = getByTestId('one');
    expectClass(one, 'bg-interactive-positive-default');
    expectClass(one, 'min-h-8');
    expectNoClass(one, 'shadow-button-outlined');
  });

  it('filled buttons are split by a 1px divider; outlined ones overlap their rims', () => {
    const filled = render(ButtonGroupHarness).getByTestId('group');
    expectClass(filled, 'gap-px');
    expectClass(filled, 'bg-divider-gray-subtle');
    filled.remove();
    const outlined = render(ButtonGroupHarness, {
      props: { variant: 'secondary' },
    }).getByTestId('group');
    expectClass(outlined, '[&>*+*]:-ml-px');
    expectNoClass(outlined, 'gap-px');
  });

  it('large rounds 12px, its end buttons too', () => {
    const group = render(ButtonGroupHarness, {
      props: { size: 'large' },
    }).getByTestId('group');
    expectClass(group, 'rounded-medium');
    expectClass(group, '[&>:first-child]:rounded-bl-medium');
  });

  it('disabled joins: the group disables all, a button may disable itself', async () => {
    const onClick = vi.fn();
    const enabled = render(ButtonGroupHarness, { props: { onClick } });
    expect((enabled.getByTestId('one') as HTMLButtonElement).disabled).toBe(false);
    expect((enabled.getByTestId('three') as HTMLButtonElement).disabled).toBe(true);
    enabled.unmount();
    const all = render(ButtonGroupHarness, { props: { onClick, isDisabled: true } });
    const one = all.getByTestId('one') as HTMLButtonElement;
    expect(one.disabled).toBe(true);
    await fireEvent.click(one);
    expect(onClick).not.toHaveBeenCalled();
  });
});

import { describe, it, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import InputGroupHarness from './fixtures/InputGroupHarness.svelte';
import { expectClass, expectNoClass } from './classes';

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('InputGroup', () => {
  it('names the group by its label and each member by its own', () => {
    const { getByRole, getByLabelText, getByTestId, queryByText } =
      render(InputGroupHarness);
    expect(getByRole('group', { name: 'Card details' })).toBe(
      getByTestId('group')
    );
    // A member's label is its control's name, not visible text.
    expect(queryByText('Card number')).toBeNull();
    expect(getByLabelText('Card number')).toBe(getByTestId('number'));
  });

  it('shares one hint line that every member is described by', () => {
    const { getByText, getByTestId } = render(InputGroupHarness, {
      props: { helpText: 'As printed on the card' },
    });
    const line = getByText('As printed on the card');
    for (const id of ['number', 'expiry', 'cvv']) {
      expect(getByTestId(id).getAttribute('aria-describedby')).toBe(line.closest('[id]')?.id);
    }
  });

  it('mirrors the first visible member error; only that member is invalid', async () => {
    const { getByText, queryByText, getByTestId } = render(InputGroupHarness, {
      props: { helpText: 'Help' },
    });
    await fireEvent.click(getByTestId('pay'));
    await flush();

    expect(getByText('cvv:required')).toBeTruthy();
    expect(queryByText('Help')).toBeNull();
    expect(getByTestId('cvv').getAttribute('aria-invalid')).toBe('true');
    expect(getByTestId('number').hasAttribute('aria-invalid')).toBe(false);
  });

  it('lays members out by their span of the row, full by default', () => {
    const { getByTestId } = render(InputGroupHarness);
    const box = getByTestId('number').closest('.grid');
    expectClass(box, 'grid-cols-12');
    expect(box?.children).toHaveLength(3);
    expectClass(box?.children[0], 'col-span-full');
    expectClass(box?.children[1], 'col-span-8');
    expectClass(box?.children[2], 'col-span-4');
    // Each member draws its own frame, joined to its neighbours' by the group.
    expectNoClass(box, 'border-');
    expectClass(box?.children[0], '-ml-px');
    // The grid sizes a member: with a width of its own it would end a pixel
    // short of its cell and its frame would sit beside the next one's.
    expectClass(box?.children[1], 'min-w-0');
    expectNoClass(box?.children[1], 'w-full');
    expectClass(getByTestId('number').parentElement, 'border-thin');
  });

  it('rounds only the members that hold a corner, worked out from the spans', () => {
    const { getByTestId } = render(InputGroupHarness);
    const frame = (id: string) => getByTestId(id).parentElement;
    expectClass(frame('number'), 'rounded-tl-small');
    expectClass(frame('number'), 'rounded-tr-small');
    expectNoClass(frame('number'), 'rounded-bl-small');
    expectClass(frame('expiry'), 'rounded-bl-small');
    expectNoClass(frame('expiry'), 'rounded-br-small');
    expectClass(frame('cvv'), 'rounded-br-small');
    expectNoClass(frame('cvv'), 'rounded-tr-small');
  });

  it('stacks a member over its neighbours by state: focus, then error, then hover', async () => {
    const { getByTestId } = render(InputGroupHarness);
    const frame = (id: string) => getByTestId(id).parentElement;
    expect(frame('number')?.closest('.grid')?.className).toContain('isolate');

    await fireEvent.click(getByTestId('pay'));
    await flush();
    await fireEvent.focus(getByTestId('number'));

    expect(frame('number')?.className).toContain('z-30');
    expect(frame('number')?.className).toContain('border-interactive-primary-default');
    expect(frame('cvv')?.className).toContain('z-20');
    expect(frame('cvv')?.className).toContain('!border-interactive-negative-default');
    expect(frame('cvv')?.className).not.toContain('z-30');
    expect(frame('expiry')?.className).toContain('hover:z-10');
    expect(frame('expiry')?.className).not.toContain('z-20');
    expect(frame('expiry')?.className).not.toContain('z-30');
  });

  it('hands members its disabled state', () => {
    const { getByTestId } = render(InputGroupHarness, {
      props: { isDisabled: true },
    });
    expect((getByTestId('expiry') as HTMLInputElement).disabled).toBe(true);
  });

  it('an explicit validationState colours every member', () => {
    const { getByTestId } = render(InputGroupHarness, {
      props: { validationState: 'error', errorText: 'Card declined' },
    });
    for (const id of ['number', 'expiry', 'cvv']) {
      expect(getByTestId(id).getAttribute('aria-invalid')).toBe('true');
      expectClass(getByTestId(id).parentElement, 'border-interactive-negative-default');
    }
  });
});

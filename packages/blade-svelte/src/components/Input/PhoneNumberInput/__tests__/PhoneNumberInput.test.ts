import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import PhoneNumberInput from '../PhoneNumberInput.svelte';

async function findInput(): Promise<HTMLElement> {
  return screen.findByRole('textbox');
}

describe('<PhoneNumberInput /> onChange', () => {
  // Regression test for CB-091: onChange was wired to BaseInput's `onChange`
  // prop, which binds the native `change` DOM event (fires on blur/commit
  // only). It must use `onInput` instead, like every other Blade input, so
  // consumers get a payload per keystroke.
  it('fires onChange on every keystroke (not just on blur)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(PhoneNumberInput, {
      props: { label: 'Phone', name: 'phone', defaultCountry: 'IN', onChange },
    });

    const input = await findInput();
    await user.type(input, '123');

    expect(onChange.mock.calls.length).toBeGreaterThanOrEqual(3);
    expect(onChange.mock.calls[0][0]).toMatchObject({ value: '1', country: 'IN' });
    expect(onChange.mock.calls[2][0]).toMatchObject({ value: '123', country: 'IN' });
  });

  it('does not fire onChange when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(PhoneNumberInput, {
      props: { label: 'Phone', name: 'phone', defaultCountry: 'IN', isDisabled: true, onChange },
    });

    const input = await findInput();
    await user.type(input, '1');

    expect(onChange).not.toHaveBeenCalled();
  });
});

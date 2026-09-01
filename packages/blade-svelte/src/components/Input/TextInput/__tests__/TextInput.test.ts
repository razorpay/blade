import { tick } from 'svelte';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import TextInput from '../TextInput.svelte';
import TextInputControlled from './TextInputControlled.svelte';

describe('<TextInput />', () => {
  it('fires onChange on every keystroke (not just on blur)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(TextInput, { props: { label: 'Name', onChange } });

    const input = screen.getByLabelText('Name');
    await user.type(input, 'abc');

    expect(onChange.mock.calls).toHaveLength(3);
    expect(onChange).toHaveBeenNthCalledWith(1, { name: undefined, value: 'a' });
    expect(onChange).toHaveBeenNthCalledWith(3, { name: undefined, value: 'abc' });
  });

  it('formats the value on every keystroke and reports rawValue', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(TextInput, {
      props: { label: 'Expiry', format: '##/##', onChange },
    });

    const input = screen.getByLabelText('Expiry');
    await user.type(input, '1225');

    // Value is formatted as the user types (per keystroke, not only on blur).
    expect(input).toHaveValue('12/25');
    // onChange receives the formatted value + the cleaned raw value.
    const lastCall = onChange.mock.calls.at(-1)?.[0];
    expect(lastCall?.value).toBe('12/25');
    expect(lastCall?.rawValue).toBe('1225');
  });

  it('behaves as a controlled component when `value` is supplied', async () => {
    render(TextInputControlled);

    // The wrapper supplies `value` after mount (on the next tick). Wait for it.
    await tick();

    const input = screen.getByLabelText('Card');
    // A `value` supplied *after* mount is still respected: the input switches
    // to controlled and renders the value instead of staying uncontrolled.
    expect(input).toHaveValue('1234');
  });
});

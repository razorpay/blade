import { tick } from 'svelte';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import TextInput from '../TextInput.svelte';
import TextInputControlled from './TextInputControlled.svelte';
import TextInputFormattedControlled from './TextInputFormattedControlled.svelte';
import { format } from '../useFormattedInput';

async function findInput(): Promise<HTMLElement> {
  return screen.findByRole('textbox');
}

describe('<TextInput /> isReadOnly & spellCheck', () => {
  it('does not render readonly by default', async () => {
    render(TextInput, { props: { label: 'Email', value: 'a@b.com' } });
    const input = await findInput();
    expect(input).not.toHaveAttribute('readonly');
  });

  it('renders readonly when isReadOnly is set', async () => {
    render(TextInput, { props: { label: 'Email', value: 'a@b.com', isReadOnly: true } });
    const input = await findInput();
    expect(input).toHaveAttribute('readonly');
  });

  it('renders spellcheck off when spellCheck is set', async () => {
    render(TextInput, { props: { label: 'Email', value: 'a@b.com', spellCheck: false } });
    const input = await findInput();
    expect(input).toHaveAttribute('spellcheck', 'false');
  });

  it('renders spellcheck on when spellCheck is true', async () => {
    render(TextInput, { props: { label: 'Email', value: 'a@b.com', spellCheck: true } });
    const input = await findInput();
    expect(input).toHaveAttribute('spellcheck', 'true');
  });

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

  describe('formatted + controlled value stays in sync', () => {
    it('reflects consumer sanitisation (letters stripped) on screen', async () => {
      const user = userEvent.setup();
      render(TextInputFormattedControlled);

      const input = screen.getByLabelText('Card');
      // Parent strips non-digits in onChange and feeds the cleaned value back.
      await user.type(input, '4111abcd2222');
      await tick();

      // Screen must match the sanitised store value, not the typed letters.
      // No trailing delimiter: value ends exactly on a group boundary.
      expect(input).toHaveValue('4111 2222');
    });

    it('rejects letters immediately even when the sanitised value is unchanged', async () => {
      // Letters typed after a digit boundary sanitise to the SAME stored value
      // (digits only), so the `value` prop reference never changes. The display
      // must still snap back to digits instead of leaking "1234 abc".
      const user = userEvent.setup();
      render(TextInputFormattedControlled);

      const input = screen.getByLabelText('Card');

      await user.type(input, '1234');
      await tick();
      expect(input).toHaveValue('1234');

      // Type letters only — no digit changes the sanitised store value.
      await user.type(input, 'abc');
      await tick();
      await Promise.resolve();
      expect(input).toHaveValue('1234');

      // A following digit continues formatting cleanly.
      await user.type(input, '1');
      await tick();
      await Promise.resolve();
      expect(input).toHaveValue('1234 1');
    });

    it('reflects programmatic prefill after mount', async () => {
      const user = userEvent.setup();
      render(TextInputFormattedControlled);

      await user.click(screen.getByText('prefill'));
      await tick();

      const input = screen.getByLabelText('Card');
      expect(input).toHaveValue('3782 8224 6310 005');
    });

    it('clears the field on programmatic reset', async () => {
      const user = userEvent.setup();
      render(TextInputFormattedControlled);

      const input = screen.getByLabelText('Card');
      await user.type(input, '4111');
      await tick();
      expect(input).toHaveValue('4111');

      await user.click(screen.getByText('reset'));
      await tick();
      expect(input).toHaveValue('');
    });
  });

  describe('formatted + uncontrolled value', () => {
    it('formats the value into groups as the user types', async () => {
      const user = userEvent.setup();
      render(TextInput, {
        props: { label: 'Card', format: '#### #### #### ####' },
      });

      const input = screen.getByLabelText('Card');
      await user.type(input, '4111222');
      await tick();

      expect(input).toHaveValue('4111 222');
    });

    it('does not show a trailing delimiter when the value fills all groups exactly', async () => {
      const user = userEvent.setup();
      render(TextInput, {
        props: { label: 'Card', format: '#### #### #### ####' },
      });

      const input = screen.getByLabelText('Card');
      await user.type(input, '4111111111111111');
      await tick();

      expect(input).toHaveValue('4111 1111 1111 1111');
    });

    it('does not show a trailing delimiter when value ends on a group boundary with extra slots remaining', async () => {
      const user = userEvent.setup();
      render(TextInput, {
        props: { label: 'Card', format: '#### #### #### #### ###' },
      });

      const input = screen.getByLabelText('Card');
      await user.type(input, '4111111111111111');
      await tick();

      expect(input).toHaveValue('4111 1111 1111 1111');
    });

    it('keeps the caret after the typed char when formatting inserts a delimiter at a group boundary', async () => {
      const user = userEvent.setup();
      render(TextInput, {
        props: { label: 'Card', format: '#### #### #### ####' },
      });

      const inputEl = screen.getByLabelText('Card');
      await user.type(inputEl, '12345');
      await tick();
      await Promise.resolve();

      expect(inputEl.value).toBe('1234 5');
      expect(inputEl.selectionStart).toBe(inputEl.value.length);
    });
  });

  it('inputEl.value matches the state stored by onChange after typing a letter', async () => {
    // Reproduction recipe from the bug report:
    //   1. Render TextInput with `format` and `value` bound to $state.
    //   2. In onChange, write a sanitised (digits-only) version back to state.
    //   3. Type a letter mixed with digits.
    //   4. Assert inputEl.value === what onChange stored — the two must agree.
    //
    // Uses TextInputFormattedControlled which owns the $state so the `value`
    // prop actually updates on each onChange call (plain JS var doesn't trigger
    // re-renders).
    const user = userEvent.setup();
    render(TextInputFormattedControlled);

    const inputEl = screen.getByLabelText('Card');

    await user.type(inputEl, '4111a2222');
    await tick();

    // DOM and state must agree — before the fix, DOM kept letters while state had digits.
    expect(inputEl.value).not.toContain('a');
    // Digits only: "41112222" formatted → "4111 2222" (no trailing delimiter).
    expect(inputEl.value).toBe('4111 2222');
  });

  it('keeps the caret after the typed char when formatting inserts a delimiter at a group boundary', async () => {
    // Regression: typing the 5th digit turns "1234" into "1234 5". The inserted
    // space shifted the typed char forward, but the caret used the pre-format
    // selectionStart (5) and landed *before* the "5" instead of after it.
    const user = userEvent.setup();
    render(TextInputFormattedControlled);

    const inputEl = screen.getByLabelText('Card');

    await user.type(inputEl, '12345');
    await tick();
    await Promise.resolve(); // flush the microtask that applies the caret

    expect(inputEl.value).toBe('1234 5');
    // Caret must sit at the end (after "5"), i.e. index 6 — not 5.
    expect(inputEl.selectionStart).toBe(inputEl.value.length);
  });
});

describe('format() — no trailing delimiter on group boundary', () => {
  const cardMask = '#### #### #### #### ###'; // 19-slot, e.g. Maestro/UnionPay

  it('does not append a trailing delimiter when value ends on a group boundary', () => {
    // 16 digits fill 4 groups exactly; the 5th group's slots stay empty.
    expect(format('6759640123456785', cardMask)).toBe('6759 6401 2345 6785');
  });

  it('keeps formatting once the next group is partially filled', () => {
    expect(format('67596401234567851', cardMask)).toBe('6759 6401 2345 6785 1');
  });

  it('still fills exact-length masks with no trailing delimiter', () => {
    expect(format('4111111111111111', '#### #### #### ####')).toBe('4111 1111 1111 1111');
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
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

describe('<PhoneNumberInput /> countries', () => {
  const countries = [
    { code: 'IN', dialCode: '91' },
    { code: 'XK', dialCode: '+383', name: 'Kosovo' },
    { code: 'DO', dialCode: '1849', name: 'Dominican Republic' },
  ];

  it('uses the custom list for the prefix and emits its dial code', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(PhoneNumberInput, {
      props: { label: 'Phone', name: 'phone', defaultCountry: 'DO', countries, onChange },
    });

    const input = await findInput();
    expect(screen.getByText('+1849')).toBeInTheDocument();

    await user.type(input, '5');
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ value: '5', country: 'DO', dialCode: '+1849' }),
    );
  });

  it('renders a code unknown to i18nify from the custom list and lets the user select it', async () => {
    const user = userEvent.setup();
    const onCountryChange = vi.fn();
    const onChange = vi.fn();
    render(PhoneNumberInput, {
      props: { label: 'Phone', name: 'phone', countries, onCountryChange, onChange },
    });

    await user.click(screen.getByRole('button', { name: 'India - Select Country' }));
    const kosovo = await screen.findByRole('option', { name: /Kosovo/ });
    expect(kosovo).toHaveTextContent('+383');
    // fireEvent, not user.click: the sheet's DragGesture reads user-event's
    // pointerdown/up (no layout in jsdom) as a dismiss before `click` lands.
    await fireEvent.click(kosovo);

    expect(onCountryChange).toHaveBeenCalledWith({ country: 'XK' });
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ country: 'XK', dialCode: '+383' }),
    );
    // The sheet row also reads '+383' while it transitions out; check the prefix only.
    expect(screen.getAllByText('+383').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: 'Kosovo - Select Country' })).toBeInTheDocument();
  });

  it('does not throw for a country code unknown to i18nify without a custom list', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    // 'ZZ' has neither a flag nor a dial code in i18nify; 'XK' has a dial code but
    // no flag (getFlagOfCountry throws), so cover both.
    expect(() =>
      render(PhoneNumberInput, {
        props: { label: 'Phone', name: 'phone', defaultCountry: 'ZZ', onChange },
      }),
    ).not.toThrow();

    const trigger = screen.getByRole('button', { name: /Select Country$/ });
    expect(trigger.querySelector('img')).toBeNull();
    expect(screen.queryByText(/^\+/)).toBeNull();

    const input = await findInput();
    await user.type(input, '44');
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ value: '44', country: 'ZZ', dialCode: '', phoneNumber: '44' }),
    );
  });

  it('renders a code i18nify has a dial code but no flag for (XK) without throwing', () => {
    expect(() =>
      render(PhoneNumberInput, {
        props: { label: 'Phone', name: 'phone', defaultCountry: 'XK' },
      }),
    ).not.toThrow();

    const trigger = screen.getByRole('button', { name: 'Kosovo - Select Country' });
    expect(trigger.querySelector('img')).toBeNull();
    expect(screen.getByText('+383')).toBeInTheDocument();
  });

  it('keeps i18nify data when countries is omitted', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(PhoneNumberInput, {
      props: { label: 'Phone', name: 'phone', defaultCountry: 'IN', onChange },
    });

    expect(screen.getByText('+91')).toBeInTheDocument();
    const trigger = screen.getByRole('button', { name: 'India - Select Country' });
    expect(trigger.querySelector('img')?.getAttribute('src')).toMatch(/\/in\.svg$/);

    const input = await findInput();
    await user.type(input, '9876543210');
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ country: 'IN', dialCode: '+91', phoneNumber: '9876 543210' }),
    );
  });

  it('filters the custom list with allowedCountries', async () => {
    const user = userEvent.setup();
    render(PhoneNumberInput, {
      props: { label: 'Phone', name: 'phone', countries, allowedCountries: ['XK'] },
    });

    await user.click(screen.getByRole('button', { name: 'India - Select Country' }));
    const items = await screen.findAllByRole('option');
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent('Kosovo');
    expect(screen.getByText('+91')).toBeInTheDocument();
  });
});

import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import PhoneNumberInputHarness from './fixtures/PhoneNumberInputHarness.svelte';
import { glyphsIn } from './classes';
import { ChevronUpDownIcon, InfoIcon } from '../icons';

function type(control: HTMLElement, text: string): Promise<boolean> {
  (control as HTMLInputElement).value = text;
  return fireEvent.input(control);
}

describe('PhoneNumberInput', () => {
  it('takes a trailing glyph, as Figma draws one', () => {
    const { container } = render(PhoneNumberInputHarness, { props: { trailingIcon: InfoIcon } });
    expect(glyphsIn(container, InfoIcon)).toHaveLength(1);
  });

  it('shows the national number and stores the whole one', () => {
    const onChange = vi.fn();
    const { getByTestId } = render(PhoneNumberInputHarness, {
      props: { onChange },
    });
    const control = getByTestId('phone') as HTMLInputElement;
    expect(control.type).toBe('tel');

    return type(control, '98765 43210').then(() => {
      expect(control.value).toBe('9876543210');
      expect(getByTestId('value').textContent).toBe('+919876543210');
      expect(onChange).toHaveBeenLastCalledWith({
        country: 'IN',
        dialCode: '+91',
        nationalNumber: '9876543210',
        value: '+919876543210',
      });
    });
  });

  it('reads the country off a value that carries a dial code', () => {
    const { getByTestId } = render(PhoneNumberInputHarness, {
      props: { value: '+60123456789', country: 'IN' },
    });
    expect((getByTestId('phone') as HTMLInputElement).value).toBe('123456789');
    expect(getByTestId('country').textContent).toBe('MY');
    expect(getByTestId('phone-country').getAttribute('aria-label')).toContain('+60');
  });

  it('names the country button and keeps label clicks on the number', () => {
    const { getByTestId } = render(PhoneNumberInputHarness);
    const button = getByTestId('phone-country');
    expect(button.getAttribute('aria-label')).toBe('Country: India +91');
    expect(button.getAttribute('aria-haspopup')).toBe('dialog');
    expect(button.closest('label')?.getAttribute('for')).toBe(getByTestId('phone').id);
  });

  it('picks a country from the picker, keeping the number', () => {
    const onChange = vi.fn();
    const onCountryChange = vi.fn();
    const { getByTestId, getByText, queryByTestId } = render(PhoneNumberInputHarness, {
      props: { value: '9876543210', onChange, onCountryChange },
    });
    expect(queryByTestId('phone-picker')).toBeNull();

    return fireEvent
      .click(getByTestId('phone-country'))
      .then(() => waitFor(() => expect(getByText('Malaysia')).toBeTruthy()))
      .then(() => {
        expect(getByTestId('phone-picker')).toBeTruthy();
        return fireEvent.click(getByText('Malaysia'));
      })
      .then(() => waitFor(() => expect(onCountryChange).toHaveBeenCalledWith({ country: 'MY' })))
      .then(() => {
        expect(onChange).toHaveBeenLastCalledWith(
          expect.objectContaining({ country: 'MY', value: '+609876543210' }),
        );
        expect(getByTestId('value').textContent).toBe('+609876543210');
        expect(getByTestId('country').textContent).toBe('MY');
        expect((getByTestId('phone') as HTMLInputElement).value).toBe('9876543210');
      });
  });

  it('reports a missing ModalStack instead of failing silently', () => {
    const captureError = vi.fn();
    const { getByTestId, queryByTestId } = render(PhoneNumberInputHarness, {
      props: { withStack: false, captureError },
    });
    return fireEvent.click(getByTestId('phone-country')).then(() => {
      expect(captureError).toHaveBeenCalledTimes(1);
      expect(String(captureError.mock.calls[0]?.[0])).toContain('ModalStack');
      expect(queryByTestId('phone-picker')).toBeNull();
    });
  });

  it("opens the picker as the app's Modal defaults say: a modal, or a sheet", () => {
    const plain = render(PhoneNumberInputHarness);
    return fireEvent
      .click(plain.getByTestId('phone-country'))
      .then(() => waitFor(() => expect(plain.getByTestId('phone-picker')).toBeTruthy()))
      .then(() => {
        expect(plain.queryByTestId('phone-picker-drag-zone')).toBeNull();
        plain.unmount();
        const sheet = render(PhoneNumberInputHarness, {
          props: { defaults: { Modal: { variant: 'sheet' } } },
        });
        return fireEvent
          .click(sheet.getByTestId('phone-country'))
          .then(() =>
            waitFor(() => expect(sheet.getByTestId('phone-picker-drag-zone')).toBeTruthy()),
          );
      });
  });

  it('filters the picker by name or dial code', () => {
    const { getByTestId, queryByText, getByText } = render(PhoneNumberInputHarness, {
      props: { searchLabel: 'Search country' },
    });
    return fireEvent
      .click(getByTestId('phone-country'))
      .then(() => waitFor(() => expect(getByTestId('phone-search')).toBeTruthy()))
      .then(() => type(getByTestId('phone-search'), 'mal'))
      .then(() => {
        expect(getByText('Malaysia')).toBeTruthy();
        expect(queryByText('United States')).toBeNull();
        return type(getByTestId('phone-search'), 'zzz');
      })
      .then(() => {
        expect(getByText('No country found')).toBeTruthy();
      });
  });

  it('lets the host focus the number control', () => {
    const { getByTestId } = render(PhoneNumberInputHarness);
    return fireEvent.click(getByTestId('focus')).then(() => {
      expect(document.activeElement).toBe(getByTestId('phone'));
    });
  });

  it('hides the dial code when asked, and keeps it in the country name', () => {
    const { container, getByTestId } = render(PhoneNumberInputHarness, {
      props: { showDialCode: false },
    });
    expect(container.textContent).not.toContain('+91');
    expect(getByTestId('phone-country').getAttribute('aria-label')).toBe('Country: India +91');
  });

  it('has no picker when the country is fixed or only one is allowed', () => {
    const fixed = render(PhoneNumberInputHarness, {
      props: { isCountryFixed: true },
    });
    expect(fixed.queryByTestId('phone-country')).toBeNull();
    expect(fixed.container.textContent).toContain('+91');
    fixed.unmount();

    const single = render(PhoneNumberInputHarness, {
      props: { allowedCountries: ['MY'], country: 'MY' },
    });
    expect(single.queryByTestId('phone-country')).toBeNull();
    expect(single.container.textContent).toContain('+60');
  });

  it('validates the national pattern and submits the whole number', () => {
    const onSubmit = vi.fn();
    const { getByTestId, container } = render(PhoneNumberInputHarness, {
      props: { onSubmit, isRequired: true },
    });
    const control = getByTestId('phone');
    const form = container.querySelector('form')!;

    return type(control, '12345')
      .then(() => fireEvent.submit(form))
      .then(() => {
        expect(onSubmit).not.toHaveBeenCalled();
        expect(control.getAttribute('aria-invalid')).toBe('true');
        return type(control, '9876543210');
      })
      .then(() => fireEvent.submit(form))
      .then(() => waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1)))
      .then(() => {
        expect(onSubmit.mock.calls[0]?.[0]).toEqual({
          contact: '+919876543210',
        });
      });
  });

  it.each([
    ['medium', 'h-7', '[padding-inline:6.5px]', '[border-radius:6px]', 'w-5'],
    ['large', 'h-9', '[padding-inline:9px]', 'rounded-small', 'w-6'],
  ] as const)(
    "%s: Figma's selector — on the field's padding, a 12px chevron, the dial code 4px on",
    (size, height, inset, radius, flag) => {
      const { getByTestId } = render(PhoneNumberInputHarness, { props: { size } });
      const button = getByTestId('phone-country');
      expect(button.className).toContain(height);
      expect(button.className).toContain(inset);
      expect(button.className).toContain(radius);
      expect(button.className).not.toContain('-ml-2');
      expect(button.className).toContain('hover:enabled:bg-interactive-gray-faded');
      expect(glyphsIn(button, ChevronUpDownIcon)[0]?.className).toContain('w-3');
      expect(button.querySelector('img')?.className).toContain(flag);
      expect((button.nextElementSibling as HTMLElement).className).toContain('ml-1');
    },
  );
});

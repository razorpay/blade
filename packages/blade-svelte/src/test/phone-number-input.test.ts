import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import PhoneNumberInputHarness from './fixtures/PhoneNumberInputHarness.svelte';
import InputGroupHarness from './fixtures/InputGroupHarness.svelte';
import { glyphsIn } from './classes';
import { ChevronUpDownIcon, InfoIcon } from '../icons';
import type { FieldRecord } from '../runes/form/types';
import { resolveActionList } from '../components/action-list/styles';
import { OVERLAY_GUTTER } from '../components/layer/styles';
import OverlayGutterHarness from './fixtures/OverlayGutterHarness.svelte';

function type(control: HTMLElement, text: string): Promise<boolean> {
  (control as HTMLInputElement).value = text;
  return fireEvent.input(control);
}

describe('PhoneNumberInput', () => {
  it('takes a trailing glyph, as Figma draws one', () => {
    const { container } = render(PhoneNumberInputHarness, { props: { trailing: InfoIcon } });
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

  it('a country pick tells the form, as typing does', async () => {
    const input = vi.fn();
    const reports = (): unknown[][] => input.mock.calls;
    const form = {
      register: () => () => undefined,
      input,
      blur: vi.fn(),
      errorOf: () => undefined,
      isSubmitting: false,
      submit: () => Promise.resolve({ ok: true, errors: {} }),
      validate: () => Promise.resolve({ ok: true, errors: {} }),
      invalid: () => undefined,
    };
    const { getByTestId, getByText } = render(PhoneNumberInputHarness, {
      props: { value: '9876543210', form },
    });
    await type(getByTestId('phone'), '98765432');
    expect(reports()).toHaveLength(1);
    // A rejected character changes nothing: the form does not hear it.
    await type(getByTestId('phone'), '98765432a');
    expect(reports()).toHaveLength(1);

    await fireEvent.click(getByTestId('phone-country'));
    await waitFor(() => expect(getByText('Malaysia')).toBeTruthy());
    await fireEvent.click(getByText('Malaysia'));
    await waitFor(() => expect(reports()).toHaveLength(2));
    expect(reports()[1]).toEqual(['contact', undefined]);
    expect(getByTestId('value').textContent).toBe('+6098765432');
  });

  it('the country list is no field of the form: it neither registers nor reports', async () => {
    const register = vi.fn((_field: FieldRecord) => () => undefined);
    const input = vi.fn();
    const form = {
      register,
      input,
      blur: vi.fn(),
      errorOf: () => undefined,
      isSubmitting: false,
      submit: () => Promise.resolve({ ok: true, errors: {} }),
      validate: () => Promise.resolve({ ok: true, errors: {} }),
      invalid: () => undefined,
    };
    const { getByTestId, getByText } = render(PhoneNumberInputHarness, {
      props: { value: '9876543210', form },
    });
    await fireEvent.click(getByTestId('phone-country'));
    await waitFor(() => expect(getByText('Malaysia')).toBeTruthy());
    await fireEvent.click(getByText('Malaysia'));
    await waitFor(() => expect(getByTestId('country').textContent).toBe('MY'));
    expect(register.mock.calls.map(([field]) => field.name)).toEqual(['contact']);
    expect(input.mock.calls.every(([name]) => name === 'contact')).toBe(true);
  });

  it("defaults the placeholder to Blade's example number for the country", async () => {
    const { getByTestId, rerender } = render(PhoneNumberInputHarness);
    const control = getByTestId('phone') as HTMLInputElement;
    expect(control.placeholder).toBe('1234 567890');
    await rerender({ placeholder: 'Phone number' });
    expect(control.placeholder).toBe('Phone number');
  });

  it('opens the list in a dropdown under the field, as wide as it', () => {
    const { getByTestId, queryByTestId } = render(PhoneNumberInputHarness);
    const button = getByTestId('phone-country');
    return fireEvent
      .click(button)
      .then(() => waitFor(() => expect(getByTestId('phone-countries')).toBeTruthy()))
      .then(() => {
        const panel = getByTestId('phone-picker');
        expect(panel.getAttribute('role')).toBe('dialog');
        expect(panel.getAttribute('aria-label')).toBe('Country');
        expect(button.getAttribute('aria-expanded')).toBe('true');
        expect(button.getAttribute('aria-controls')).toBe(panel.id);
        return fireEvent.click(button);
      })
      .then(() => waitFor(() => expect(queryByTestId('phone-countries')).toBeNull()))
      .then(() => {
        expect(button.getAttribute('aria-expanded')).toBe('false');
      });
  });

  it('mounts only the country rows in view', async () => {
    const { getByTestId } = render(PhoneNumberInputHarness, { props: { extraCountries: 250 } });
    await fireEvent.click(getByTestId('phone-country'));
    await waitFor(() => expect(getByTestId('phone-countries')).toBeTruthy());
    const list = getByTestId('phone-countries');
    const mounted = list.querySelectorAll('input').length;
    expect(mounted).toBeGreaterThan(0);
    expect(mounted).toBeLessThan(50);
    expect(list.querySelector('[style*="padding-bottom"]')).toBeTruthy();
  });

  it('lets an app present the list its own way (adapters.presentDropdown)', () => {
    const onCountryChange = vi.fn();
    const { getByTestId, getByText } = render(PhoneNumberInputHarness, {
      props: { presenter: true, onCountryChange },
    });
    return fireEvent
      .click(getByTestId('phone-country'))
      .then(() => waitFor(() => expect(getByTestId('phone-picker-drag-zone')).toBeTruthy()))
      .then(() => fireEvent.click(getByText('Malaysia')))
      .then(() => waitFor(() => expect(onCountryChange).toHaveBeenCalledWith({ country: 'MY' })));
  });

  it('keeps Blade’s dropdown when the presenter declines', () => {
    const presentDropdown = vi.fn(() => undefined);
    const { getByTestId } = render(PhoneNumberInputHarness, {
      props: { presentDropdown: presentDropdown as never },
    });
    return fireEvent.click(getByTestId('phone-country')).then(() => {
      expect(presentDropdown).toHaveBeenCalledWith(
        'dial-code',
        expect.objectContaining({ label: 'Country', testID: 'phone' }),
      );
      return waitFor(() => expect(getByTestId('phone-countries')).toBeTruthy());
    });
  });

  it('cancels a presented list when the field goes, or opens another', async () => {
    const flush = (): Promise<unknown> => new Promise((resolve) => setTimeout(resolve));
    const cancelled: boolean[] = [];
    const presentDropdown = vi.fn((_kind: string, request: { cancelled: Promise<void> }) => {
      const index = cancelled.push(false) - 1;
      void request.cancelled.then(() => {
        cancelled[index] = true;
      });
      return new Promise(() => undefined);
    });
    const { getByTestId, unmount } = render(PhoneNumberInputHarness, {
      props: { presentDropdown: presentDropdown as never },
    });
    await fireEvent.click(getByTestId('phone-country'));
    await flush();
    expect(cancelled).toEqual([false]);
    await fireEvent.click(getByTestId('phone-country'));
    await flush();
    expect(cancelled).toEqual([true, false]);
    unmount();
    await flush();
    expect(cancelled).toEqual([true, true]);
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

describe("the country list's gutter: the overlay's `--overlay-gutter`", () => {
  it('is 20px on a modal or a drawer, 16px on a sheet, a popover or a menu', () => {
    expect(OVERLAY_GUTTER).toEqual({
      modal: '[--overlay-gutter:20px]',
      drawer: '[--overlay-gutter:20px]',
      'left-drawer': '[--overlay-gutter:20px]',
      sheet: '[--overlay-gutter:16px]',
      popover: '[--overlay-gutter:16px]',
      menu: '[--overlay-gutter:16px]',
    });
    // `overlay`: the rows read it, none outside an overlay.
    expect(resolveActionList({ inset: 'overlay' }).options).toContain(
      'px-[var(--overlay-gutter,0px)]',
    );
  });

  it.each([
    ['modal', '20px'],
    ['sheet', '16px'],
  ] as const)('on a %s, the panel sets %s and the rows pad by it', async (layout, gutter) => {
    const { findByTestId, container } = render(OverlayGutterHarness, { props: { layout } });
    const panel = await findByTestId('overlay');
    expect(panel.className).toContain(`[--overlay-gutter:${gutter}]`);
    const rows = Array.from(
      container.ownerDocument.querySelectorAll<HTMLElement>('*'),
    ).find((element) => element.getAttribute('class')?.includes('px-[var(--overlay-gutter,0px)]'));
    expect(rows && panel.contains(rows)).toBe(true);
  });

  it('under the field, Blade’s own dropdown sets none', async () => {
    const { getByTestId } = render(PhoneNumberInputHarness);
    await fireEvent.click(getByTestId('phone-country'));
    await waitFor(() =>
      expect(
        Array.from(document.querySelectorAll<HTMLElement>('*')).some((element) =>
          element.getAttribute('class')?.includes('[--overlay-gutter:0px]'),
        ),
      ).toBe(true),
    );
  });
});

describe('PhoneNumberInput in an InputGroup', () => {
  it('a disabled group disables the country picker as well as the number', () => {
    const { getByTestId } = render(InputGroupHarness, {
      props: { isDisabled: true, withPhone: true },
    });
    expect((getByTestId('phone-country') as HTMLButtonElement).disabled).toBe(true);
    expect((getByTestId('phone') as HTMLInputElement).disabled).toBe(true);
  });
});

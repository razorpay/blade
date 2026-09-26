import type { Attachment } from 'svelte/attachments';
import {
  allowedPhoneCountries,
  findPhoneCountry,
  joinPhoneNumber,
  splitPhoneNumber,
  type PhoneCountry,
  type PhoneParts,
} from './parts';
import { getAdapters } from '../../adapters';
import type { ModalHandle } from '../modal/overlays.svelte';

export interface PhoneOptions {
  countries: () => readonly PhoneCountry[];
  allowedCountries: () => readonly string[] | undefined;
  value: () => string;
  country: () => string | undefined;
  /** The bindable writes. */
  onValue: (value: string) => void;
  onCountry: (country: string) => void;
  onChange?: (change: PhoneParts) => void;
  onCountryChange?: (country: string) => void;
  isCountryFixed: () => boolean;
  /**
   * Opens the country picker for the selectable countries; resolves with
   * the pick, or undefined when dismissed. The component supplies it: the
   * picker is a modal on the library's overlay stack.
   */
  openPicker: (
    selectable: readonly PhoneCountry[],
    selected: PhoneCountry | undefined
  ) => ModalHandle<unknown, PhoneCountry> | undefined;
}

export interface PhoneFormat {
  parse: (text: unknown) => string;
  format: (stored: unknown) => string;
}

export interface Phone {
  readonly selectable: readonly PhoneCountry[];
  readonly parts: PhoneParts | undefined;
  readonly selected: PhoneCountry | undefined;
  /** Whether there is a country to pick, so a button shows. */
  readonly canPick: boolean;
  /** TextInput's `format`: the whole number stored, the national part shown. */
  readonly format: PhoneFormat;
  /** A user edit of the number. */
  handleNumber(next: unknown): void;
  handlePickerClick(): void;
  /** Focuses the number control. */
  focus(): void;
  /** On the number control, through TextInput's `attach`. */
  readonly attach: Attachment<HTMLInputElement>;
}

/**
 * The phone number behaviour: the selectable countries, the number split
 * into its country and national part, and the pick from the picker. Call
 * during component initialisation.
 */
export function createPhone(options: PhoneOptions): Phone {
  const adapters = getAdapters();
  let control: HTMLInputElement | undefined;

  const selectable = $derived(
    allowedPhoneCountries(options.countries(), options.allowedCountries())
  );
  const parts = $derived(
    splitPhoneNumber(options.value(), selectable, options.country())
  );
  const selected = $derived(findPhoneCountry(selectable, parts?.country));
  const canPick = $derived(!options.isCountryFixed() && selectable.length > 1);

  // A value with a plus decides the country: keep the bindable in step.
  $effect.pre(() => {
    if (parts && parts.country !== options.country()) {
      options.onCountry(parts.country);
    }
  });

  // The field stores the whole number and shows the national part, so a
  // Form submits what a backend wants and the dial code is never typed.
  // `parse` also sees stored values, so it must leave a whole number as it
  // is; the same rule lets a pasted `+60…` switch the country.
  const format: PhoneFormat = $derived({
    parse: (text: unknown) =>
      splitPhoneNumber(String(text ?? ''), selectable, selected?.code)?.value ??
      '',
    format: (stored: unknown) =>
      splitPhoneNumber(String(stored ?? ''), selectable, selected?.code)
        ?.nationalNumber ?? '',
  });

  function pick(next: PhoneCountry) {
    if (next.code === selected?.code) {
      return;
    }
    const change = joinPhoneNumber(next, parts?.nationalNumber ?? '');
    options.onCountry(next.code);
    options.onValue(change.value);
    options.onCountryChange?.(next.code);
    options.onChange?.(change);
  }

  return {
    get selectable() {
      return selectable;
    },
    get parts() {
      return parts;
    },
    get selected() {
      return selected;
    },
    get canPick() {
      return canPick;
    },
    get format() {
      return format;
    },
    handleNumber(next) {
      const change = splitPhoneNumber(
        String(next ?? ''),
        selectable,
        selected?.code
      );
      if (change) {
        options.onChange?.(change);
      }
    },
    handlePickerClick() {
      const handle = options.openPicker(selectable, selected);
      handle?.result
        .then((next) => {
          if (next) {
            pick(next);
          }
        })
        .catch((error: unknown) => adapters.captureError?.(error));
    },
    focus() {
      control?.focus();
    },
    attach(node) {
      control = node;
      return () => {
        control = undefined;
      };
    },
  };
}

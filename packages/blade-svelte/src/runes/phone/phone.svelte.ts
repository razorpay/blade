import type { Attachment } from 'svelte/attachments';
import {
  allowedPhoneCountries,
  findPhoneCountry,
  joinPhoneNumber,
  splitPhoneNumber,
} from './parts';
import type { PhoneCountry, PhoneParts } from './parts';
import { getAdapters } from '../../adapters';
import { createCancel } from '../base/cancel';
import type { Cancel } from '../base/cancel';

export interface PhoneOptions {
  countries: () => readonly PhoneCountry[];
  allowedCountries: () => readonly string[] | undefined;
  value: () => string;
  country: () => string | undefined;
  /** The bindable country write. */
  onCountry: (country: string) => void;
  onChange?: (change: PhoneParts) => void;
  onCountryChange?: (country: string) => void;
  /**
   * Sets the whole number as a user edit would, through the number field
   * (so its form hears it); false when that changed nothing.
   */
  edit: (value: string) => boolean;
  isCountryFixed: () => boolean;
  /**
   * Opens the country picker for the selectable countries; resolves with
   * the pick, or undefined when dismissed. The component supplies it: the
   * picker is Blade's dropdown, or the app's presenter's; `cancelled`
   * resolves when the field goes or opens another.
   */
  openPicker: (
    selectable: readonly PhoneCountry[],
    selected: PhoneCountry | undefined,
    cancelled: Promise<void>,
  ) => Promise<PhoneCountry | undefined>;
}

export interface PhoneTransform {
  parse: (text: unknown) => string;
  format: (stored: unknown) => string;
}

export interface Phone {
  readonly selectable: readonly PhoneCountry[];
  readonly parts: PhoneParts | undefined;
  readonly selected: PhoneCountry | undefined;
  /** Whether there is a country to pick, so a button shows. */
  readonly canPick: boolean;
  /** TextInput's `transform`: the whole number stored, the national part shown. */
  readonly transform: PhoneTransform;
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
    allowedPhoneCountries(options.countries(), options.allowedCountries()),
  );
  const parts = $derived(splitPhoneNumber(options.value(), selectable, options.country()));
  const selected = $derived(findPhoneCountry(selectable, parts?.country));
  const canPick = $derived(!options.isCountryFixed() && selectable.length > 1);
  // The pick pending in an app's presentation of the list: closed when the
  // field goes.
  let pending: Cancel | undefined;
  $effect(() => () => pending?.cancel());

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
  const transform: PhoneTransform = $derived({
    parse: (text: unknown) =>
      splitPhoneNumber(String(text ?? ''), selectable, selected?.code)?.value ?? '',
    format: (stored: unknown) =>
      splitPhoneNumber(String(stored ?? ''), selectable, selected?.code)?.nationalNumber ?? '',
  });

  function pick(next: PhoneCountry): void {
    if (next.code === selected?.code) {
      return;
    }
    const change = joinPhoneNumber(next, parts?.nationalNumber ?? '');
    options.onCountry(next.code);
    options.onCountryChange?.(next.code);
    // The number changes as typing changes it. Without a number nothing
    // changed, but the host still hears the pick, as Blade's onChange.
    if (!options.edit(change.value)) {
      options.onChange?.(change);
    }
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
    get transform() {
      return transform;
    },
    handleNumber(next) {
      const change = splitPhoneNumber(String(next ?? ''), selectable, selected?.code);
      if (change) {
        options.onChange?.(change);
      }
    },
    handlePickerClick() {
      pending?.cancel();
      pending = createCancel();
      options
        .openPicker(selectable, selected, pending.cancelled)
        .then((next) => {
          if (next) {
            pick(next);
          }
        })
        .catch((error: unknown) => adapters.reportError?.(error));
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

## Component Name

PhoneNumberInput

## Description

PhoneNumberInput is the phone number field: a country button (flag and chevron) and the dial code before a `tel` control for the national number, with a clear button while there is a number. Its value is the whole number with its dial code (`+919876543210`), and picking a country opens Blade's country dropdown under the field, or the app's own presenter through `adapters.presentDropdown`, which can render the exported PhoneCountryList, the same virtualized country list, in a sheet or a modal.

## Important Constraints

- `countryLabel` is required and localized: it names the country button (`Country: India +91`) and the list; the library ships no copy
- `value` (bindable) is the whole number with the plus and dial code, `+919876543210`, which is also what the app's form submits under `name`; a value without a plus is read as national to `country`
- `country` (bindable) is an ISO code (`IN`); a `value` with a plus names its own country and wins
- `onChange` is the exception to `{ name, value }`: it receives `{ country, dialCode, nationalNumber, value }` (`PhoneNumberChange`), with no `name`, on every edit and country pick; `onCountryChange` receives `{ country }` on a pick
- Typing keeps digits only; pasting a number that starts with `+` switches the country to match
- Without `countries` the field offers `defaultPhoneCountries()`: every country `@razorpay/i18nify-js` (a peer dependency) knows, by English name, with no `pattern` or `maxLength`. A country's `pattern` validates the national number and `maxLength` caps it; richer validation is the app's, through `validationState` and the texts
- `allowedCountries` narrows the list by ISO code; with one country left there is no picker. `isCountryFixed` shows the country as text with no button
- `leading` sits after the country button, before the dial code; `trailing` sits last. Each takes an icon or a snippet
- `size` is `medium` (default) or `large`
- PhoneCountryList is only for an app's own presenter (see `Adapters.md`): its container must bound its height (the list is virtualized), and `onPick` returns the country

## Props

```typescript
interface PhoneCountry {
  /** ISO 3166-1 alpha-2, the identity: `IN`. */
  code: string;
  name: string;
  /** With the plus: `+91`. */
  dialCode: string;
  flag?: string;
  /** Validates the national number. */
  pattern?: string | RegExp;
  maxLength?: number;
}

interface PhoneNumberChange {
  country: string;
  dialCode: string;
  /** Digits only, without the dial code. */
  nationalNumber: string;
  /** `dialCode` + `nationalNumber`; empty while there is no number. */
  value: string;
}

interface PhoneNumberInputProps {
  /** The selectable countries, in display order. @default defaultPhoneCountries() (i18nify's, by name) */
  countries?: readonly PhoneCountry[];
  /** ISO codes narrowing `countries`; one left means no picker. */
  allowedCountries?: readonly string[];
  /** Bindable: the whole number with its dial code (`+919876543210`). @default '' */
  value?: string;
  /** Bindable ISO code. A `value` with a plus names its own country and wins. */
  country?: string;
  /** Every edit and country pick: `{ country, dialCode, nationalNumber, value }`, no `name`. */
  onChange?: (change: PhoneNumberChange) => void;
  /** A country was picked. */
  onCountryChange?: (change: { country: string }) => void;
  /** Plain text above the field. */
  label?: string;
  /** After the label: `*` or `(optional)`. @default 'none' */
  necessityIndicator?: 'required' | 'optional' | 'none';
  /** @default Blade's example number for the country, `1234 567890` for India */
  placeholder?: string;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onClick?: (event: MouseEvent) => void;
  /** The clear button (shown while there is a number) was pressed. */
  onClearButtonClick?: () => void;
  /** The return key's label on a virtual keyboard. */
  enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
  /** An HTML autofill token. @default 'tel' */
  autoComplete?: string;
  /** Off hides the country button; the dial code still shows. @default true */
  showCountrySelector?: boolean;
  /** After the country button, before the dial code: an icon or a snippet. */
  leading?: IconSource | Snippet;
  /** After the number, last: an icon or a snippet (a Link, a button). */
  trailing?: IconSource | Snippet;
  /** @default false */
  isDisabled?: boolean;
  /** @default false */
  isRequired?: boolean;
  /** The country as text only: no button, no picker. @default false */
  isCountryFixed?: boolean;
  /** The dial code beside the flag. @default true */
  showDialCode?: boolean;
  /** Omit inside the app's form to mirror its error. @default 'none' */
  validationState?: 'none' | 'error' | 'success';
  helpText?: string | Snippet;
  errorText?: string | Snippet;
  successText?: string | Snippet;
  /** @default false */
  autoFocus?: boolean;
  /** Inside an InputGroup: this field's share of its row. */
  span?: 'full' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4';
  /** The key the app's form submits the whole number under. */
  name?: string;
  /** Required, localized: names the country button and the list. */
  countryLabel: string;
  /** Localized; handed to the app's presenter for its close button. */
  closeLabel?: string;
  /** Names the number control when there is no visible `label`. */
  accessibilityLabel?: string;
  /** Lands on the number control; `-country`, `-picker` and `-countries` suffix the button, dropdown and list. */
  testID?: string;
  /** Placement only. */
  class?: string;
  /** @default 'medium' (or BladeProvider's `size`) */
  size?: 'medium' | 'large';
}

interface PhoneCountryListProps {
  /** The countries to pick from (the request's `items`). */
  items: readonly PhoneCountry[];
  /** The country picked now (the request's `value`). */
  value?: PhoneCountry;
  /** Localized; the list's accessible name (the request's `label`). */
  label: string;
  /** Lands on the list; rows are `${testID}-${index}`. */
  testID?: string;
  /** A row was picked, the current one too. */
  onPick: (country: PhoneCountry) => void;
  /** @default 'medium' */
  size?: 'medium' | 'large';
}
```

## Guidelines

- Store and submit the bound `value` (E.164-style `+919876543210`); read `nationalNumber` from `onChange` only when the backend wants the parts.
- Always pass a localized `countryLabel` (and `closeLabel` if the app presents the list itself).
- Use `allowedCountries` for markets you serve, and `country` for the initial country.
- Add `pattern`/`maxLength` to `defaultPhoneCountries()` entries for the countries you validate, or validate with i18nify and drive `validationState`.
- Present the list your own way (a BottomSheet on phones) through `adapters.presentDropdown`, rendering PhoneCountryList; don't render PhoneCountryList beside the field.
- Don't parse the number from a plain TextInput `type="tel"` when a country matters: use PhoneNumberInput.

## Examples

### A phone field with India as the default

```svelte
<script lang="ts">
  import { PhoneNumberInput } from '@razorpay/blade-svelte/components';

  let phone = $state('');
  let country = $state('IN');
</script>

<PhoneNumberInput
  bind:value={phone}
  bind:country
  label="Mobile number"
  name="phone"
  necessityIndicator="required"
  countryLabel="Country"
  helpText="We'll send an OTP to this number"
  onChange={({ nationalNumber, dialCode }) => console.debug(dialCode, nationalNumber)}
/>
```

### Allowed countries and a fixed country

```svelte
<script lang="ts">
  import { PhoneNumberInput } from '@razorpay/blade-svelte/components';

  let gulf = $state('');
  let local = $state('');
</script>

<div class="flex flex-col gap-blade-5">
  <PhoneNumberInput
    bind:value={gulf}
    allowedCountries={['AE', 'SA', 'KW', 'BH', 'QA']}
    country="AE"
    label="Phone"
    countryLabel="Country"
  />
  <PhoneNumberInput bind:value={local} country="IN" isCountryFixed label="Phone (India only)" countryLabel="Country" />
</div>
```

### Validating with country patterns

```svelte
<script lang="ts">
  import { PhoneNumberInput, defaultPhoneCountries } from '@razorpay/blade-svelte/components';

  const countries = defaultPhoneCountries().map((c) =>
    c.code === 'IN' ? { ...c, pattern: /^[6-9]\d{9}$/, maxLength: 10 } : c
  );
  let phone = $state('');
  let national = $state('');
  const invalid = $derived(national.length > 0 && !/^[6-9]\d{9}$/.test(national));
</script>

<PhoneNumberInput
  {countries}
  bind:value={phone}
  country="IN"
  label="Mobile number"
  countryLabel="Country"
  validationState={invalid ? 'error' : 'none'}
  errorText="Enter a 10-digit mobile number"
  onChange={({ nationalNumber }) => (national = nationalNumber)}
/>
```

### The app presents the country list in a BottomSheet

```svelte
<script lang="ts">
  import {
    BladeProvider,
    BottomSheet,
    BottomSheetBody,
    BottomSheetHeader,
    PhoneCountryList,
    PhoneNumberInput,
    type ActionListRequest,
    type PhoneCountry,
    type PresentDropdownAdapter,
  } from '@razorpay/blade-svelte/components';

  let request = $state<ActionListRequest<PhoneCountry> | null>(null);
  let resolvePick: (country: PhoneCountry | undefined) => void = () => {};
  let phone = $state('');

  const presentDropdown: PresentDropdownAdapter = (_kind, next) =>
    new Promise((resolve) => {
      request = next;
      resolvePick = (country) => {
        request = null;
        resolve(country);
      };
      void next.cancelled.then(() => resolvePick(undefined));
    });
</script>

<BladeProvider adapters={{ presentDropdown }}>
  <PhoneNumberInput bind:value={phone} label="Mobile number" countryLabel="Country" closeLabel="Close" />
  <BottomSheet
    isOpen={request !== null}
    closeLabel={request?.closeLabel ?? 'Close'}
    onDismiss={() => resolvePick(undefined)}
  >
    <BottomSheetHeader title={request?.label ?? ''} />
    <BottomSheetBody padding="spacing.0">
      {#if request}
        <PhoneCountryList
          items={request.items}
          value={request.value}
          label={request.label}
          onPick={(country) => resolvePick(country)}
        />
      {/if}
    </BottomSheetBody>
  </BottomSheet>
</BladeProvider>
```

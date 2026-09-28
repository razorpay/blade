# Phone number input

A composition, not a new field: a `TextInput` (`type="tel"`) for the national
number, a country button in its `leading` slot, and a picker — a
Modal given `bottomSheetLook` with `adaptive` (a bottom sheet on phones, a
centred modal on desktop) holding a `VirtualOptionList`. The picker
opens through `openModal` and its body (`PhoneCountryPicker.svelte`) is its
own chunk, loaded on the first tap: a phone field costs no list, no virtual
window and no search box until then. All the
field behaviour (Form registration, hint line, validation state, InputGroup
membership) is TextInput's.

The library ships **no country data**. The app passes `countries`
(`PhoneCountry[]`: `code`, `name`, `dialCode`, optional `flag`, `pattern`,
`maxLength`) in display order — see `countries.ts` here, which builds the list
from i18nify's dial codes and flags and the platform's localized region names.

| Prop | Notes |
| --- | --- |
| `countries` | Required. Order is the picker's order |
| `allowedCountries` | ISO codes narrowing `countries`. With one left there is no picker |
| `value` (bindable) | The whole number, `+919876543210` — also what a Form submits under `name`. A value without a plus is read as national to `country` |
| `country` (bindable) | ISO code. A `value` with a plus names its own country and wins; shared dial codes (+1) resolve to `country` |
| `onChange` | `{ value, country, dialCode, nationalNumber }` on every edit and country pick |
| `onCountryChange` | The ISO code, on a pick |
| `isCountryFixed` | Dial code as text: no button, no picker |
| `showDialCode` | Default on; off hides the code beside the flag (the country's name still carries it) |
| `countryLabel` | Required, localized: names the button (`Country: India +91`) and titles the picker |
| `searchLabel`, `emptyText`, `closeLabel` | Localized. The picker has a search box only with `searchLabel`; it matches name, ISO code and dial code |
| `label`, `placeholder`, `helpText`, `errorText`, `successText`, `validationState`, `isRequired`, `isDisabled`, `autoFocus`, `span`, `name`, `accessibilityLabel`, `class` | As on TextInput |
| `testID` | The number control; `-country`, `-picker`, `-search`, `-countries` suffix the parts |

Typing keeps digits only. Pasting a number that starts with `+` switches the
country to match it. `country.pattern` validates the national number and
`country.maxLength` caps it. Anything richer (i18nify's `isValidPhoneNumber`)
stays with the app: lazy-load it and drive `validationState` and the texts.

`bind:this` exposes `focus()` (TextInput has it too). Needs a mounted `ModalStack` and `LayerHost` for the picker; without the
stack a tap reports to the `captureError` adapter instead of opening.

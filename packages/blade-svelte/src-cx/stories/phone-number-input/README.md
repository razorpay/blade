# Phone number input

A composition, not a new field: a `TextInput` (`type="tel"`) for the national
number, a country button in that input's `leading` slot, and a picker — a
Modal holding a `VirtualOptionList`. The picker follows the app's Modal
defaults: set `{ Modal: { variant: 'sheet' } }` on BladeProvider for a
bottom sheet. The picker
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
| `leading` | After the country button and before the dial code: an icon (`IconSource`), drawn as a glyph, or a snippet |
| `trailing` | After the number and the clear button, last: an icon, drawn as a glyph, or a snippet (a Link or a button) |
| `size` | `medium` (default) or `large`: Blade DSL's Phone Number Input (Figma) has no small |
| `testID` | The number control; `-country`, `-picker`, `-search`, `-countries` suffix the parts |

## Why `leading` and `trailing` are props

Blade DSL's Phone Number Input (Figma) lays the field out as TextInput's
(see the text-input README), with the country selector first:

| Part | medium | large |
| --- | --- | --- |
| Country selector, from the edge | 4px (on the field's padding) | 6px |
| Selector | 28px pill, 6.5px in, 20×15 flag, 12px chevron 4px on | 36px, 9px in, 24×18 flag |
| Selector → glyph or dial code | 4px | 4px |
| Dial code → number | 8px | 8px |
| Number → trailing parts | 8px | 8px |

The selector draws its own pill, so it sits on the field's padding; the
glyphs and the trailing link need the field's insets. Each is one prop
with two shapes, and the field places each: an icon draws as a glyph, a
snippet goes in the slot. A string `trailing` is gone: Figma's trailing
slot is a glyph or a link.

Typing keeps digits only. Pasting a number that starts with `+` switches the
country to match it. `country.pattern` validates the national number and
`country.maxLength` caps it. Anything richer (i18nify's `isValidPhoneNumber`)
stays with the app: lazy-load it and drive `validationState` and the texts.

`bind:this` exposes `focus()` (TextInput has it too). Needs a mounted `ModalStack` and `LayerHost` for the picker; without the
stack a tap reports to the `captureError` adapter instead of opening.

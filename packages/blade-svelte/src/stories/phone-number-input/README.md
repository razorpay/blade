# Phone number input

A composition, not a new field: a `TextInput` (`type="tel"`) for the national
number, a country button in that input's `leading` slot, and a dropdown of
countries under the field, as Blade's CountrySelector (React's `Dropdown`
with its `DropdownOverlay` hanging from the field). The dropdown is as wide
as the field's frame, 8px below it, scrolling past 320px; its list is in
ActionList's look, its rows `ActionListItem`s (the flag leading, the dial
code trailing). Escape or a press outside closes it and focus returns to
the country button. The list (`PhoneCountryList`, exported) is its own chunk,
loaded on the first tap: a phone field costs no list until then. It is
virtualized (ActionList's `isVirtualized`): only the rows in view mount,
so its container must bound its height. All the
field behaviour (form registration, hint line, validation state, InputGroup
membership) is TextInput's.

**An app may show the list its own way.** The field asks
`adapters.presentDropdown('dial-code', request)` (BladeProvider's
`adapters`) first, with an `ActionListRequest`: ActionList's props as data
(the selectable countries as `items`, the picked one as `value`,
`itemKey`, `itemText`, `label`) and `cancelled`, a promise resolved when the
field goes or opens another; no element, so the request can cross a bridge
to a native host (`request.cancelled.then(() => bridge.send('dropdown.dismiss'))`). A
presenter that returns a promise takes the list over — a sheet on phones,
a modal on desktop, `PhoneCountryList` under a search of its own, say —
and resolves it with the pick. One that
returns `undefined`, or none at all, leaves Blade's dropdown. React has no
search in its country list, so neither does Blade. The list's rows keep the
overlay's gutter, `--overlay-gutter` (20px on a modal or a drawer, 16px on
a sheet or a popover, none under the field): a presenter that puts a search
above the list pads it the same, `px-[var(--overlay-gutter,0px)]`.

Without `countries` the field offers `defaultPhoneCountries()`: every
country i18nify (a peer dependency) knows, its dial codes and flags, the
platform's English region names, sorted by name, as Blade React's. They
carry no `pattern` or `maxLength`. An app that wants its own order, names,
subset or validation passes `countries` (`PhoneCountry[]`: `code`, `name`,
`dialCode`, optional `flag`, `pattern`, `maxLength`) in display order —
`defaultPhoneCountries()` with patterns added, say.

| Prop                                                                                                                                                       | Notes                                                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `countries`                                                                                                                                                | Optional; i18nify's countries by default. Order is the picker's order                                                              |
| `allowedCountries`                                                                                                                                         | ISO codes narrowing `countries`. With one left there is no picker                                                                  |
| `value` (bindable)                                                                                                                                         | The whole number, `+919876543210` — also what a Form submits under `name`. A value without a plus is read as national to `country` |
| `country` (bindable)                                                                                                                                       | ISO code. A `value` with a plus names its own country and wins; shared dial codes (+1) resolve to `country`                        |
| `onChange`                                                                                                                                                 | `{ value, country, dialCode, nationalNumber }` on every edit and country pick                                                      |
| `onCountryChange`                                                                                                                                          | `{ country }`, on a pick. The pick rewrites `value` as a user edit, so the app's form hears it                                     |
| `isCountryFixed`                                                                                                                                           | Dial code as text: no button, no picker                                                                                            |
| `showCountrySelector`                                                                                                                                      | Default on; off hides the country button, and the dial code still shows                                                            |
| `showDialCode`                                                                                                                                             | Default on; off hides the code beside the flag (the country's name still carries it)                                               |
| `countryLabel`                                                                                                                                             | Required, localized: names the button (`Country: India +91`) and the list                                                          |
| `closeLabel`                                                                                                                                               | Localized; handed to an app's presenter for its close button                                                                       |
| `placeholder`                                                                                                                                              | Default: Blade's example number for the country (`1234 567890` for India)                                                          |
| `label`, `helpText`, `errorText`, `successText`, `validationState`, `isRequired`, `isDisabled`, `autoFocus`, `span`, `name`, `accessibilityLabel`, `class` | As on TextInput                                                                                                                    |
| `leading`                                                                                                                                                  | After the country button and before the dial code: an icon (`IconSource`), drawn as a glyph, or a snippet                          |
| `trailing`                                                                                                                                                 | After the number and the clear button, last: an icon, drawn as a glyph, or a snippet (a Link or a button)                          |
| `size`                                                                                                                                                     | `medium` (default) or `large`: Blade DSL's Phone Number Input (Figma) has no small                                                 |
| `testID`                                                                                                                                                   | The number control; `-country`, `-picker` (the dropdown), `-countries` (the list) suffix the parts                                 |

## Why `leading` and `trailing` are props

Blade DSL's Phone Number Input (Figma) lays the field out as TextInput's
(see the text-input README), with the country selector first:

| Part                            | medium                                               | large                    |
| ------------------------------- | ---------------------------------------------------- | ------------------------ |
| Country selector, from the edge | 4px (on the field's padding)                         | 6px                      |
| Selector                        | 28px pill, 6.5px in, 20×15 flag, 12px chevron 4px on | 36px, 9px in, 24×18 flag |
| Selector → glyph or dial code   | 4px                                                  | 4px                      |
| Dial code → number              | 8px                                                  | 8px                      |
| Number → trailing parts         | 8px                                                  | 8px                      |

The selector draws its own pill, so it sits on the field's padding; the
glyphs and the trailing link need the field's insets. Each is one prop
with two shapes, and the field places each: an icon draws as a glyph, a
snippet goes in the slot. A string `trailing` is gone: Figma's trailing
slot is a glyph or a link.

Typing keeps digits only. Pasting a number that starts with `+` switches the
country to match it. A country's `pattern`, when the app gives one, validates the national
number and its `maxLength` caps it. Anything richer (i18nify's `isValidPhoneNumber`)
stays with the app: lazy-load it and drive `validationState` and the texts.

`bind:this` exposes `focus()` (TextInput has it too).

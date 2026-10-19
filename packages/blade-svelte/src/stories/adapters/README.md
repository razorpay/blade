# Adapters

`src/adapters.ts` declares `BladeAdapters`. Styling is
not here: the classes are each component's own (`components/<name>/styles.ts`)
and runtime theming is CSS variables only.

| Adapter                    | Called by                                                                                                                                                     |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `track(event, payload)`    | Fields on first touch: `field_change` with `{ name }` only, never the value                                                                                   |
| `vibrate(kind)`            | `press` from Button and IconButton (`warning` when a form refused the press), `toggle` from Checkbox and Switch, `select` from Radio and Chip                 |
| `announce(message)`        | Button and IconButton when busy starts and stops; default: one polite live region per overlay host                                                            |
| `locale`                   | Amount's formatting; i18nify's global state without one                                                                                                       |
| `form` (`FormAdapter`)     | Fields register (a `FieldRecord` with `element()` and `reveal()`), report edits and blurs and show `errorOf(name)`; a submit Button calls `submit`, a `validateForm` one `validate`, and `invalid` on a failure |
| `reportError(error)`      | Anything the models reject with                                                                                                                               |
| `navigate(href, event)`    | Every `href` (Link, Button, Card, CardGroupItem, TabItem, BreadcrumbItem, Avatar) on a plain click on an internal href; return true once handled              |
| `toasts`                   | The toast queue: Blade's (`createToasts()`), which BladeProvider renders, or the app's own `{ showToast }`; read at mount                                     |
| `presentDropdown(kind, request)` | PhoneNumberInput's country list, shown the app's way                                                                                                          |
| `readOTP({ length, cancelled })` | OTPInput, once mounted and enabled: a code from a native host's SMS retriever or WebOTP fills the cells as a paste; `cancelled` resolves on unmount, disable or the user's first edit |

Pass them as `adapters` to a `BladeProvider` above the components; a nested
provider merges its own over the enclosing ones, and `null` unsets one for
its subtree (`BladeAdaptersOverride`). They are live: an adapter the app
swaps reaches the components already mounted. There is no global
registration.

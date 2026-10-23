# BladeProvider

Defaults for component axes — not theme tokens (theming is CSS variables).

- `size`: the size every sized control takes (Button, IconButton, Link, the
  inputs, Checkbox, RadioGroup, ChipGroup, Switch, SegmentedControl, Tabs),
  snapped to the nearest size each has. Display components (Badge, Counter,
  Icon, Text…) and the overlays (whose `size` is a width) keep their own.
- `defaults`: per component, any style props:
  `{ Button: { color: 'neutral' }, ToastContainer: { placement: 'top' } }`.
  None differs per breakpoint: desktop differences are the components' own
  `d:` classes.
- `adapters`: app services and overrides, merged over the enclosing
  provider's (`BladeAdapters`, all optional) and live: an adapter the app
  swaps reaches the components already mounted. `null` unsets the
  enclosing one for this subtree (`BladeAdaptersOverride`).

| Adapter                    | What it does                                                                                                                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `track`, `reportError`    | Analytics, error reporting                                                                                                                                                                                                |
| `vibrate(kind)`            | What a press or a pick meant (`press`, `select`, `toggle`, `warning`); the app decides whether the device vibrates                                                                                                        |
| `announce(message)`        | Says a message to a screen reader (a button that starts or stops loading). Default: the polite live region in the overlay host                                                                                            |
| `locale`                   | The BCP 47 locale Amount formats with; i18nify's own locale without one                                                                                                                                                   |
| `navigate(href, event)`    | An app router's hook into every `href` (Link, Button, CardGroupItem…): return `true` once the navigation is handled                                                                                                       |
| `form`                     | The app's form around the fields (`FormAdapter`): they register with it and show its errors, and submit Buttons submit it. An app's Form passes it on a BladeProvider around its fields                                   |
| `presentDropdown(kind, request)` | Takes a library dropdown over: `'dial-code'` is PhoneNumberInput's country list, as an `ActionListRequest` (ActionList's `items`, `value`, `itemKey`, `itemText`, `label` as data, plus a `cancelled` promise; no element, so the request can cross a bridge to a native host). Return a promise of the pick to show it your way (with `PhoneCountryList`), `undefined` for Blade's dropdown |

**BladeProvider hosts the overlays.** After its content it renders the
overlay host (not exported): the one scrim under every open modal and the
box modal surfaces mount in, covering the nearest positioned ancestor — so
make the provider's parent the app's shell (positioned, at most the screen,
`overflow-hidden` so toasts and popovers stay inside it)
and the app's scrolling element its direct child: overlays then cover the
shell, a modal opens in view however far the content has scrolled, and
nothing behind an open overlay scrolls. The outermost provider
hosts every overlay on the page. Toasts are the app's to render: a
ToastContainer inside the provider moves its toasts into the host, over open
modals; without one, no toast code ships. The app's back handler asks the open overlays first: `back()` returns
whether one handled it, from a component or a `.ts` flow:

```svelte
<script>
  import { BladeProvider, ToastContainer, back, showToast } from '@razorpay/blade-svelte/components';
  import { Opened } from './lib'; // the app's own overlays opened from code

  const adapters = { navigate, track };
  // await showToast('Saved'); if (!back()) router.back();
</script>

<div class="relative flex h-full max-h-[100dvh] flex-col overflow-hidden"> <!-- the app's shell -->
  <BladeProvider {adapters}>
    <main class="min-h-0 flex-1 overflow-auto"><App /></main> <!-- scrolls -->
    <Opened /> <!-- the app's: what it opened from code -->
    <ToastContainer placement="top" />
  </BladeProvider>
</div>
```

The form is the app's: its Form passes `adapters.form` on a BladeProvider
around its fields, which register with it. Each registers a `FieldRecord`
with `element()` (its element once mounted; sort by
`compareDocumentPosition` for document order) and `reveal()` (focus, then
scroll it to the centre, smoothly unless motion is reduced).

A component's prop wins; then, nearest provider first, its entry for the
component, then its overall `size`; then Blade's default.

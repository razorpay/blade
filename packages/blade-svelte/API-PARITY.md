# API parity: Blade React ↔ blade-svelte

Where blade-svelte differs from Blade React (`packages/blade/src/components`), one
component at a time. For each common component, blade-svelte matches React's look and
its API (props, variants), except where one of the rules below applies.

**Exports:** `@razorpay/blade-svelte/components` (`components-entry.ts`) is
the cx set (`index.ts`), the overlays included (Modal, BottomSheet, Drawer,
Popover, Menu). Nothing from `src/` is exported, and there is no `/utils`
subpath. Collapsible is built and documented below but not exported yet. The
package has no root entry.

**UI parts only.** Blade ships what React's Blade ships: UI parts. The
headless hosts and flows around them, and the extras built on the parts, are
the app's, and moved out of the library; an app builds them on Blade's
public entries (`/components`, and `/runes`, the few runes an app
composes on):

| The app's                                                                                                      | What the library keeps for it                                                                                                                                                  |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A form (`createForm`)                                                                                          | `adapters.form` (`FormAdapter`): fields register (a `FieldRecord`: `element()`, `reveal()`), report edits and show `errorOf`; submit buttons submit. Validation, when an error shows, document order and which field to reveal are the form's |
| An opener (overlays opened from code)                                                                          | The overlay host BladeProvider renders; back (`back()`); the dropdown           presenter's contract (`adapters.presentDropdown`, `PresentDropdownAdapter`)                 |
| Its own composed components (an overlay that switches by screen, a searchable list, navigation, async content) | The parts they compose. `ComponentStyleProps` is an interface, so they take provider defaults too                                                                              |

**Web only.** The `.native.svelte` twins moved out too: a consumer with a
native renderer implements its own, over the same classes.

An app composes them from the public components, and from what else is
public: `/components` exports `useComponentDefaults` and `getAdapters`
(adapters are passed through BladeProvider); `/runes` is not the runes
layer but the small set an app composes its own hosts and flows on:
`createLayerStack` (`Layer`), `defineContext`, `longestTransition` and
`phaseTransition`, `isPromise`, `phoneDigits`, `isGlyph` (`Glyph`,
`IconSource`), and the types `BackAnswer` and `FieldConstraints`. Across
the boundary go plain functions, promises and data, not
handles or registries: a field record's `element()` and `reveal()`,
`showToast`'s promise, `back()`, `presentDropdown`'s promise, and the
overlay gutter as a CSS variable (`--overlay-gutter`). A withdrawal is a
`cancelled: Promise<void>` that resolves once and never rejects, not an
`AbortSignal`: older engines have none, and a signal can't cross a bridge
to a native host (`request.cancelled.then(() => bridge.send('…dismiss'))`
can). `createCancel()` makes one; a request Blade hands over is never
already cancelled. The components'
own runes stay internal. There is no
overlay base component: an app's overlay composes Modal, BottomSheet,
Drawer, Popover or Menu.

## Rules

1. **Layout and positioning go through `class`**, never props. `Box` is replaced by
   Uno (Tailwind) classes. Margin/padding styled-props, `maxWidth`, `minWidth`,
   `width` and the like are not ported.
2. **Render props and intermediate components become snippets** (`ModalHeader`,
   `AccordionItemHeader`, …). Inside a snippet the caller renders `Text`, `Icon`,
   etc. directly. Their props go too, when a snippet covers them (a header's
   `subtitle`, `leading`, `trailing`, back button). Only what behaviour or
   accessibility needs stays a prop, such as a `title` that names a dialog.
   **Exception:** Card, Modal, BottomSheet and Drawer compose React's parts
   (`CardHeader`, `CardBody`, `CardFooter`, `ModalHeader`, `ModalBody`,
   `ModalFooter`, `BottomSheet*`, `Drawer*`), each its own component over
   its own exported classes; the overlays' headers build on CardHeader.
   Popover and Menu keep the snippets (drawn by an internal
   OverlaySections, which Modal, BottomSheet and Drawer never load).
3. **`defaultValue`, `defaultChecked`, `defaultCountry`, `defaultExpandedIndex`, …
   are folded into the bindable prop** (`bind:value`, …). There is no separate
   default prop.
4. **Collections compose, as in React**: item components (`CardGroupItem`,
   `MenuItem`, …) register with their parent and are read in
   document order, so anything else may sit between them (a heading, a
   divider). A collection is data plus an item snippet only where it must
   know every item up front: `Carousel`, and a long CardGroup or ActionList
   (`items` or `sections` with a `row` snippet, for `isVirtualized`). The
   headless core is `runes/base/choice-list.svelte.ts` (CardGroup, Tabs,
   RadioGroup, ChipGroup) over `runes/base/ordered-entries.svelte.ts` (also
   InputGroup, OTPInput, Breadcrumb, AvatarGroup).
5. **The look follows React.** Checkout-specific looks are dropped and noted per
   component.
6. **cx-only features** (props React lacks) are listed per component with a
   recommendation. Each one is **pending** until decided.
7. **Labels sit on top.** `labelPosition` (a label to the left of the field) is
   not ported, on any component: every field label is above its field.
   Decided after ChipGroup; it was removed from ChipGroup and OTPInput, the
   two components that had it.
8. **`*-blade-N` means Blade spacing token N, 0 to 11, and nothing else** —
   `p-blade-5` and `w-blade-5` are both 16px. Any other length is written as
   the value: `w-[176px]`, `max-w-[30rem]`, `h-[var(--toast-height)]` (`_`
   is a space). The numeric scale stays (`w-9` is 36px). `w-blade-N` used to
   read Blade's `size` tokens (`w-blade-400` was 400px); every such use was
   rewritten to the bracket form with the same length.
9. **A field's `label` is a plain string**: it names the control. React's
   `labelSuffix` and `labelTrailing` are not ported; nothing sits beside
   the label. Hint lines (`helpText`, `errorText`, `successText`) take
   `string | Snippet` on the inputs, a superset of React's strings, for a
   line with a Link in it.
10. **Keyboard and autofill props follow the web**, not React Native's
    names: `type` is the HTML input type (`tel`, not Blade's `telephone`),
    and `inputMode`, `enterKeyHint`, `autoComplete` and `autoCapitalize`
    are the HTML attributes. Each `type` brings Blade's defaults for them
    (`getKeyboardAndAutocompleteProps`), and a given attribute wins: `tel`
    → done key, `autocomplete="tel"`; `email` → done key,
    `autocomplete="email"`, no autocapitalize; `url` → go key, no
    autocapitalize; `number` → decimal keypad, done key. As Blade, `number`
    renders as `type="text"` (a number input spins, steps on scroll, ignores
    `maxlength` and gets the wrong iOS keyboard). `text` adds nothing.
    Search and password fields are their own components, as Blade
    (SearchInput, PasswordInput), over TextInput. OTPInput adds
    `inputMode="numeric"` and `autoComplete="one-time-code"`, and
    PhoneNumberInput `autoComplete="tel"`. Blade's `keyboardType`,
    `keyboardReturnKeyType` and `autoCompleteSuggestionType` are not
    ported; `inputMode` is independent of `type`, which Blade can't express.
11. **BladeProvider sets component defaults, not a theme.** Theming stays CSS
    variables. The provider takes an overall `size`, which every sized
    control (Button, IconButton, Link, the inputs, Checkbox, RadioGroup,
    ChipGroup, Switch, SegmentedControl, Tabs) snaps to its nearest size;
    per-component `defaults` for any style prop; `adapters` (app services,
    plus `toasts`, the app's queue, and `presentDropdown`, the app's
    presenter for library dropdowns; see rule 15). No value differs per breakpoint and
    nothing in the library reads the viewport in JS: an app's own components
    that switch by screen read it themselves (`matchMedia` on the query `d:`
    uses). Components are mobile first, and their desktop
    differences are `d:` classes (one breakpoint, 62.5rem — checkout's). A prop wins;
    then, nearest provider first, its entry for the component, then its
    overall `size`; then Blade's default. React's `themeTokens` and
    `colorScheme` are not ported. BottomSheet's `adaptive` is not ported: an overlay that switches by screen is the app's own (see Overlays).
12. **Change callbacks take Blade's payload object**: a field reports
    `onChange({ name, value })` (`FieldChange`, `components/shared/change.ts`),
    Checkbox and Switch `onChange({ isChecked, value })`, ChipGroup,
    CardGroup and ActionList `onChange({ name, value })` with `value`
    shaped as `bind:value` (an array with `multiple`; React's groups send
    `values`, a list even for one pick), their items' `onClick({ name, value, event })`
    (`name` the item's value, `value` whether it was selected),
    Collapsible (not exported yet) `onExpandChange({ isExpanded })`, every
    overlay and Tooltip `onOpenChange({ isOpen })`, PhoneNumberInput
    `onCountryChange({ country })`, OTPInput `onOTPFilled({ name, value, method })`
    (`method` is cx's addition, as on its `onChange`).
    PhoneNumberInput's `onChange` is the exception: `{ country, dialCode, nationalNumber, value }`, with no `name`.
    Blade's `event` is not passed, except to an item's `onClick`. Where
    Blade passes a bare value, so does cx: Tabs and Carousel
    `onChange(value)`. Every overlay binds `isOpen` and reports dismissals
    through `onDismiss`.
    `onFocus`/`onBlur` pass the DOM event (OTPInput's also the cell's index).
13. **`children` is the trigger, `content` what it reveals**, as in React
    (Tooltip; Collapsible, not exported yet). `children` is a snippet
    that reads the state: `{ isOpen }`,
    Collapsible's `{ isExpanded }`; the wrapper around it listens, so the
    trigger wires nothing. `content` is Tooltip's text (`string | Snippet`)
    and Collapsible's body (React's CollapsibleBody), as it is Popover's
    and Menu's raw content (in place of `body` and `footer`) and a
    CardGroupItem's disclosed part. There is no `trigger` prop. Modal,
    BottomSheet and Drawer have no trigger at all (they open from code),
    so their `children` is the content (see Overlays).
14. **A slot named by position takes `IconSource | Snippet`** (`leading`,
    `trailing`, `titleLeading`): an icon is drawn as the component's glyph,
    a snippet in the asset box. `icon` exists only where there is one glyph
    and no slot: Button, Link, IconButton, Badge, Alert, Avatar,
    BreadcrumbItem, AnnouncementBanner, and EmptyState's title glyph. One
    slot takes an icon or a snippet, not both.
15. **The app's services are adapters** (BladeProvider's `adapters`,
    `BladeAdapters`). They are live: components read them through getters,
    so an adapter the app swaps reaches what is mounted (`toasts` is read
    when the provider mounts). An adapter left out is the
    enclosing provider's; `null` unsets it for the subtree
    (`BladeAdaptersOverride`). Beside `toasts`, `form` and
    `presentDropdown`:
    - `track(event, payload)`: `field_change` sends `{ name }` only.
    - `navigate(href, event)`: every `href` renderer (Link, a link Button,
      Card, Avatar, BreadcrumbItem, a link row, a link tab) shares
      `createLink` (`runes/link/link.ts`): a plain click on an internal href
      goes to the router, and `target="_blank"` adds `noopener noreferrer`
      to the caller's `rel`. React has no router hook.
    - `announce(message)`: one polite live region per overlay host (the
      default). Button and IconButton say `loadingAnnouncement` and
      `loadedAnnouncement` ("Started loading", "Stopped loading"), where
      React's LiveAnnouncer says fixed English.
    - `locale`: Amount's locale, reactive; i18nify's global state is the
      fallback. cx-only.
    - `vibrate(kind)`: `press` (a button), `select` (Radio, Chip), `toggle`
      (Checkbox, Switch), `warning` (a press a form refused). Blade only
      reports. cx-only.
    - `readOTP({ length, cancelled })`: OTPInput asks it once mounted and
      enabled, for a native host's SMS retriever or the WebOTP API. A
      resolved code fills the cells as a paste does (`otp_fill` with
      `method: 'adapter'`, never the code); `undefined` and a result after
      the cancel (a rejection too) are ignored; otherwise a rejection goes
      to `reportError`. `cancelled` resolves on unmount, on `isDisabled`,
      and on the user's first edit. The owner resetting `value` to `''` (a
      resend) asks again once the field is enabled and editable; a request
      still pending then is kept, not doubled. A user clearing the cells by
      hand does not ask again.
      React only sets `autoComplete="one-time-code"`. cx-only.
    - `data-analytics-*` props land where React's do, on every component
      (a toast takes them in `showToast`'s options).

## Inventory

Status: `common` means present on both sides, `react-only` means blade-svelte lacks it,
`cx-only` means React lacks it, and `n/a` means internal, a motion preset, or
replaced by a rule.

| React                                                     | blade-svelte                                                   | Status                                                                                                                                                                                                  |
| --------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accordion                                                 | —                                                              | react-only: cx's Accordion (formerly named CardGroup) is removed; disclosure is a CardGroupItem's `content`                                                                                                |
| ActionList                                                | `action-list` (ActionList, ActionListItem, ActionListSection)  | common, **done**: a look over CardGroup (Menu's rows), `actionListClasses()` exported; `isVirtualized` over data rows; no search (see ActionList)                                                       |
| Alert                                                     | `alert`                                                        | common, **done**                                                                                                                                                                                        |
| Amount                                                    | `amount`                                                       | common, **done**                                                                                                                                                                                        |
| AnimateInteractions                                       | —                                                              | n/a (motion)                                                                                                                                                                                            |
| AnnouncementBanner                                        | `announcement-banner`                                          | common, **done**: Blade DSL's Announcement Banner (Figma) (see AnnouncementBanner)                                                                                                                      |
| AppBar                                                    | —                                                              | react-only                                                                                                                                                                                              |
| AutoComplete                                              | —                                                              | react-only                                                                                                                                                                                              |
| Avatar, AvatarGroup                                       | `avatar`                                                       | common, **done**: Blade DSL's Avatar and Avatar Group (Figma) (see Avatar)                                                                                                                              |
| Badge                                                     | `badge`                                                        | common, **done**                                                                                                                                                                                        |
| BaseAnimatedValue, BaseHeaderFooter, BaseMenu, BaseMotion | —                                                              | n/a (internal)                                                                                                                                                                                          |
| BladeProvider                                             | `blade-provider`                                               | **different**: component defaults, not theme tokens (rule 11)                                                                                                                                           |
| BottomBar                                                 | `bottom-bar`                                                   | common, **done**: Blade DSL's Bottom Bar (Figma), a container; positioning is the consumer's (see BottomBar)                                                                                            |
| BottomDock                                                | —                                                              | react-only                                                                                                                                                                                              |
| BottomNav                                                 | —                                                              | react-only                                                                                                                                                                                              |
| BottomSheet                                               | `bottom-sheet`                                                 | common, **done**: always a sheet; no `adaptive`                                                                                                                                                         |
| Box                                                       | —                                                              | n/a (rule 1)                                                                                                                                                                                            |
| Breadcrumb                                                | `breadcrumb`                                                   | common, **done**: Blade DSL's Breadcrumb (Figma), subtle and intense (see Breadcrumb)                                                                                                                   |
| Button / IconButton                                       | `button` / `icon-button`                                       | common, **done**                                                                                                                                                                                        |
| ButtonGroup                                               | `button-group`                                                 | common, **done** (new)                                                                                                                                                                                  |
| Card                                                      | `card`, `card-children` (CardHeader, CardBody, CardFooter)     | common, **done**: composed as React's; each part's classes exported apart; Card does not bundle its parts                                                                                               |
| Carousel                                                  | `carousel`                                                     | common                                                                                                                                                                                                  |
| Charts                                                    | —                                                              | react-only                                                                                                                                                                                              |
| ChatInput, ChatMessage                                    | —                                                              | react-only                                                                                                                                                                                              |
| Checkbox                                                  | `checkbox`                                                     | common, **done**                                                                                                                                                                                        |
| Chip, ChipGroup                                           | `chip`                                                         | common, **done** (new)                                                                                                                                                                                  |
| Collapsible                                               | `collapsible`                                                  | common, **done** (new); **not exported**                                                                                                                                                                |
| Confirmation                                              | —                                                              | react-only                                                                                                                                                                                              |
| Counter                                                   | `counter`                                                      | common, **done** (new)                                                                                                                                                                                  |
| CounterInput                                              | `counter-input`                                                | common, **done** (new)                                                                                                                                                                                  |
| CreationView                                              | —                                                              | react-only                                                                                                                                                                                              |
| DatePicker                                                | —                                                              | react-only                                                                                                                                                                                              |
| DetailedView                                              | —                                                              | react-only                                                                                                                                                                                              |
| Divider                                                   | `divider`                                                      | common, **done**                                                                                                                                                                                        |
| DotLoader                                                 | `dot-loader`                                                   | common, **done** (new); cx Button draws it                                                                                                                                                              |
| Drawer                                                    | `drawer`                                                       | common, **done**; `side: right \| left` (cx-only `left`); `DrawerHeader` (`color`, `showDivider`: default `false`, Figma draws none), `DrawerBody` (`padding`, cx-only), `DrawerFooter` (`showDivider`) |
| Dropdown                                                  | —                                                              | **not ported** by decision: a select dropdown is not mobile friendly. A pick list is ActionList on the page or in a BottomSheet; an action list is a Menu (see Overlays)                                |
| Elevate, Fade, Morph, Move, Scale, Slide, Stagger         | —                                                              | n/a (motion)                                                                                                                                                                                            |
| EmptyState                                                | `empty-state`                                                  | common, **done**                                                                                                                                                                                        |
| FileUpload                                                | —                                                              | react-only                                                                                                                                                                                              |
| FilterChip                                                | —                                                              | react-only                                                                                                                                                                                              |
| FloatingActionButton                                      | —                                                              | react-only                                                                                                                                                                                              |
| Form (FormLabel, FormHint, CharacterCounter)              | `shared/FieldLabel`, `shared/FieldHint`, `shared/FieldCounter` | common, **done**; fields register with the app's form through `adapters.form` (cx-only)                                                                                                                 |
| FormGroup                                                 | —                                                              | react-only                                                                                                                                                                                              |
| GenUI                                                     | —                                                              | react-only                                                                                                                                                                                              |
| Icons                                                     | `icon`, `@razorpay/blade-svelte/icons`, `/vite`, `/webpack`    | common, **done**: Blade's icons by name, as SVG imports; a font plugin makes them glyphs (see Icons)                                                                                                    |
| Indicator                                                 | —                                                              | react-only                                                                                                                                                                                              |
| InfoGroup                                                 | —                                                              | react-only                                                                                                                                                                                              |
| Input / TextInput                                         | `text-input`                                                   | common, **done**                                                                                                                                                                                        |
| Input / TextArea                                          | `text-area`                                                    | common, **done**                                                                                                                                                                                        |
| Input / OTPInput                                          | `otp-input`                                                    | common, **done**                                                                                                                                                                                        |
| Input / PhoneNumberInput                                  | `phone-number-input`                                           | common, **done**                                                                                                                                                                                        |
| Input / PasswordInput                                     | `password-input`                                               | common (new): over TextInput                                                                                                                                                                            |
| Input / SearchInput                                       | `search-input`                                                 | common (new): over TextInput; `isLoading` and a trailing Dropdown are gaps                                                                                                                              |
| Input / PaymentInput, ColorInput, SliderInput             | —                                                              | react-only                                                                                                                                                                                              |
| SelectInput, AutoComplete                                 | —                                                              | **not ported** by decision: a select dropdown is not mobile friendly (see Overlays)                                                                                                                     |
| InputGroup                                                | `input-group`                                                  | common, **done**                                                                                                                                                                                        |
| LightBox                                                  | —                                                              | react-only                                                                                                                                                                                              |
| Link                                                      | `link`                                                         | common, **done**                                                                                                                                                                                        |
| List                                                      | —                                                              | react-only                                                                                                                                                                                              |
| ListView                                                  | —                                                              | react-only                                                                                                                                                                                              |
| LiveAnnouncer                                             | —                                                              | n/a                                                                                                                                                                                                     |
| Menu                                                      | `menu` (Menu) + any content                                    | common, **changed**: Menu's look on a `dialog` panel by its trigger (`children`); an ActionList inside is an ordinary choice list whose `onPick` closes it (see Overlays)                                          |
| Modal                                                     | `modal`                                                        | common, **done**: the centred dialog only (no `variant`); opening from code is the app's, on these overlays                                                                                             |
| OverlayContextReset                                       | —                                                              | n/a                                                                                                                                                                                                     |
| Pagination                                                | —                                                              | react-only                                                                                                                                                                                              |
| Popover                                                   | `popover` (Popover)                                            | common, **done**: a non-modal panel by its trigger (`children`, as React's) (see Overlays)                                                                                                                                     |
| PopupArrow                                                | —                                                              | n/a (internal)                                                                                                                                                                                          |
| Preview                                                   | —                                                              | react-only                                                                                                                                                                                              |
| ProgressBar                                               | `progress-bar`                                                 | common, **done** (new); replaces cx's `progress` loader, which is removed                                                                                                                               |
| QuickFilters                                              | —                                                              | react-only                                                                                                                                                                                              |
| Radio                                                     | `radio`                                                        | common, **done**                                                                                                                                                                                        |
| RollingText                                               | —                                                              | react-only                                                                                                                                                                                              |
| SegmentedControl                                          | `segmented-control`                                            | common, **done**                                                                                                                                                                                        |
| SelectableCard                                            | —                                                              | react-only                                                                                                                                                                                              |
| Settings                                                  | —                                                              | react-only                                                                                                                                                                                              |
| SideNav                                                   | —                                                              | react-only                                                                                                                                                                                              |
| Skeleton                                                  | `skeleton`                                                     | common, **done**                                                                                                                                                                                        |
| SkipNav                                                   | —                                                              | react-only                                                                                                                                                                                              |
| Spark                                                     | —                                                              | react-only                                                                                                                                                                                              |
| Spinner                                                   | —                                                              | react-only                                                                                                                                                                                              |
| SpotlightPopoverTour                                      | —                                                              | react-only                                                                                                                                                                                              |
| StepGroup                                                 | —                                                              | react-only                                                                                                                                                                                              |
| Switch                                                    | `switch`                                                       | common, **done**                                                                                                                                                                                        |
| Table                                                     | —                                                              | react-only                                                                                                                                                                                              |
| Tabs                                                      | `tabs`                                                         | common, **done**                                                                                                                                                                                        |
| Tag                                                       | —                                                              | react-only                                                                                                                                                                                              |
| TimePicker                                                | —                                                              | react-only                                                                                                                                                                                              |
| Toast                                                     | `toast`                                                        | common, **done**                                                                                                                                                                                        |
| Tooltip                                                   | `tooltip`                                                      | common, **done**                                                                                                                                                                                        |
| TopNav                                                    | —                                                              | react-only                                                                                                                                                                                              |
| TreeView                                                  | —                                                              | react-only                                                                                                                                                                                              |
| TrustBadge                                                | `trust-badge`                                                  | common                                                                                                                                                                                                  |
| Typography (Text, Heading)                                | `text`, `heading`                                              | common; **known gap:** no letter-spacing (see Chip)                                                                                                                                                     |
| Typography (Display, Code)                                | `display`, `code`                                              | common, **done**: Figma's Display and Code styles (see Typography)                                                                                                                                      |
| VisuallyHidden                                            | —                                                              | n/a (`sr-only` class)                                                                                                                                                                                   |
| —                                                         | `layer` (Surface), `blade-provider/OverlayHost`                | cx-only (overlay infrastructure): BladeProvider renders the overlay host and the toasts (not exported); `adapters.toasts` drives the toasts, `back()` asks the overlays                              |
| —                                                         | `card-group` (CardGroup, CardGroupItem, CardGroupSection)      | cx-only in React's terms: Blade DSL's Card Group, the always-visible choice list (formerly OptionList) with link and disclosure rows (see CardGroup)                                 |
| —                                                         | —                                                              | n/a: Countdown and Image are app compositions, libui's (`@razorpay/libui`), not Blade DSL parts                                                                                                         |
| —                                                         | `shared`                                                       | n/a (internal)                                                                                                                                                                                          |

---

## CardGroup

React has no CardGroup. The reference is `src/`'s CardGroup (Blade DSL's ❖
Card Group): `CardGroup`, `CardGroupItem`, `CardGroupCollapsibleItem` and
`CardGroupCollapsibleItemBody`. cx: `CardGroup` and `CardGroupItem`
(`components/card-group/`) over `runes/card-group`, plus `CardGroupSection`. src's collapsible pair is a `body` snippet on
`CardGroupItem` (below). CardGroup and ActionList are two looks over one
internal `BaseCardGroup`, which neither exports.

**Two changes from before this port:**

- **OptionList is CardGroup now.** The rename covers OptionList, OptionItem,
  OptionListSection, VirtualOptionList, `OptionListClasses` and the rest.
  CardGroup inherits OptionList's engine: the value, `selectionType`, the
  form field, the keyboard, sections and virtualisation. The search
  (`query`/`match`/`empty`) is gone, and so is `classes`: the look is
  CardGroup's own, and ActionList's is its own component.
- **cx's former CardGroup is removed.** It was React's Accordion, renamed.
  React's `Accordion` has no cx counterpart now. Disclosure is a
  CardGroupItem's `content`.

### Props

`CardGroup` (src → cx):

| src                            | cx                                                                                     | Action                                                                       |
| ------------------------------ | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `children`                     | same                                                                                   | same                                                                         |
| `accessibilityLabel`           | same, or `label`                                                                       | same; a visible `label` names it too                                         |
| — (selection is the caller's)  | `bind:value`, `selectionType` (`single`, `multiple`), `compare`, `isDeselectable`      | **added**: the group holds the pick, so rows are native radios or checkboxes |
| —                              | `onChange({ name, value })`, an array with `multiple`                                  | **added**: one key, shaped as `bind:value` (React's CheckboxGroup sends `values`)                    |
| —                              | `name`, `isRequired`, `validationState`, `helpText`, `errorText`, `isDisabled`         | **added**: a form field                                                      |
| —                              | `onPick`                                                                               | **added**: every user pick, changed or not (pick = submit)                   |
| —                              | `items` or `sections`, `row`, `itemKey`, `isVirtualized`, `itemText`, `isItemDisabled` | **added**: the options as data, rendered by `row`; virtualised on demand     |
| `testID`, analytics attributes | same                                                                                   | same; each choice's control gets `${testID}-${index}` and its own analytics  |
| styled props                   | `class`                                                                                | rule 1                                                                       |

`CardGroupItem`:

| src                                      | cx                                                                                                | Action                                                                                                                       |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `children` (the free slot)               | `title`, `description`, `leading`, `trailing`, or `children(state)`                               | **changed**: the usual layout from props; `children` replaces it                                                             |
| `leading`, `trailing`                    | same (`string \| Snippet`)                                                                        | same                                                                                                                         |
| `href`, `target`, `rel`                  | same                                                                                              | same: a link with a chevron pointing right                                                                                   |
| `onClick` + `isSelected` (caller-driven) | `value`, picked through the group's `bind:value`; `onClick({ name, value, event })` after a press | **changed**: a choice is a native radio or checkbox row. The ring is the same. `onClick` gets React's ActionListItem payload |
| `isDisabled`                             | same                                                                                              | same; a disabled link loses its `href` and leaves the tab order                                                              |
| `accessibilityLabel`                     | same                                                                                              | same, for rows with no value                                                                                                 |
| —                                        | `text`                                                                                            | **added**: what typeahead matches                                                                                            |
| `testID`, analytics attributes           | same                                                                                              | same                                                                                                                         |

`CardGroupCollapsibleItem` and `CardGroupCollapsibleItemBody` → a `body`
snippet on `CardGroupItem`:

- **No `value`:** the row is the disclosure. src's `isExpanded`,
  `defaultIsExpanded` and `onExpandChange` become a bindable `isExpanded`
  (rule 3) and `onExpandChange({ isExpanded })` on the item.
- **With a `value`:** the body follows the pick, which covers src's
  "Selection With Nested Input". Passing `isExpanded` overrides this.
- A row inside a body is just a row, as in `src/`.
- The types refuse a `body` on a link and an `onExpandChange` on a choice.

**No `selectionType="none"`.** There are no rows that act and hold nothing,
in CardGroup or ActionList. A list where a pick
submits uses **`onPick`**, which fires on every user pick (pointer, Enter or
Space) with the row's value, whether the value changed or not, so the same
row picked again still reports. A row's `onClick` fires for keyboard picks
too: before this change, Enter and Space went past it.

**Keys:** a single choice is a radio group, so the arrows pick as they
move (`selectsOnMove`); ActionList's arrows only move, as a listbox's.

**CardGroup has no search**, as React: it takes no `query`, `match` or
`empty`. An app filters its data and renders `CardGroupItem`s (or passes
the filtered `items`). **Rows as data:** with `items` (or titled
`sections`) and a `row` snippet the list lays its rows out itself, keyed by
`itemKey`; `isVirtualized` then mounts only the rows in view, as React's
ActionList `isVirtualized` (give the list a bounded height in `class`).
Rows from data with none to show (a search emptied them) render no rows
box; the label and the hint stay.
The type checks are in `test/fixtures/CardGroupTypes.svelte`.

### Look

As `src/`'s `cardGroup.module.css`:

- **Surface:** Card's `primary` raised surface with 12px corners. The rim and
  lip are redrawn above the rows (`after:shadow-card-group-rim`).
- **Rows:** 16px padding, 8px gaps, body medium in medium weight, with
  `surface.border.gray.subtle` hairlines between them and the group's corners
  on the end rows.
- **Hover:** `surface.background.gray.moderate`.
- **Picked:** a 1.5px `surface.border.primary.normal` inset ring with no fill.
- **Focus:** a 4px `interactive.border.primary.faded` inset ring, drawn on the
  row's `::before` so it composes with the picked ring. The roving row's ring
  shows when the keyboard moves; links and triggers use `:focus-visible`.
- **Disabled:** 50% on `interactive.background.gray.disabled`.
- **Sections** (cx-only): each `CardGroupSection` is a raised card of its
  own under its heading (body medium, `surface.text.gray.subtle`), 12px
  above it, with sections 24px apart, as checkout's net-banking list. The
  look reads the list's `{ hasSections }`.
- **Chevrons:** `surface.icon.gray.subtle`; a trigger's flips over
  `moderate`.
- **Body:** a hairline above, 16px by 12px padding, on
  `surface.background.gray.subtle`.

**Not copied from `src/`:**

- **Native rows:** a choice is a native radio or checkbox. `src/` uses a
  `<button aria-current>`.
- **Body motion:** the body opens with the Collapsible motion (280ms) and
  unmounts when closed.

### Status

`svelte-check` gives 0 errors and `test` passes. It hasn't been measured
against `src/`'s Storybook yet.

---

## Alert

React: `Alert`. cx: `Alert` (`components/alert/`).

### Props

| React                                 | cx                               | Action                                                                                                                                    |
| ------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `description` (required, text or JSX) | `description: string \| Snippet` | same as React; checkout's cx called it `children`                                                                                         |
| `title`                               | `title: string \| Snippet`       | superset                                                                                                                                  |
| `color` (+ `primary`)                 | `color`                          | **added** `primary`                                                                                                                       |
| `emphasis: 'subtle' \| 'intense'`     | `emphasis`                       | **added**                                                                                                                                 |
| `icon` (defaults per colour)          | `icon`                           | **added** the defaults: info, check-circle, alert-triangle, alert-octagon (the last two drawn from Blade's icons into `components/icons`) |
| `isDismissible` (default true)        | `isDismissible`                  | **added**; was "dismissible when `closeLabel` is set"                                                                                     |
| `onDismiss`                           | `onDismiss`                      | same; the alert now closes itself after it, as in React                                                                                   |
| `isFullWidth`                         | —                                | **removed** by decision: full width is the only layout (spans the container, centred on desktop (`d`, 62.5rem))                           |
| `maxWidth` (default 584px)            | —                                | **removed** by decision: no width of its own; a cap is a `class` (rule 1)                                                                 |
| `actions: { primary, secondary }`     | —                                | **removed** by decision (was an `actions` snippet); no checkout call site used it                                                         |
| `testID`                              | `testID`                         | same                                                                                                                                      |
| styled props, `data-analytics-*`      | `class`; same                    | rule 1; analytics same                                                                                                                    |

### Look

Measured against React Storybook for neutral, positive and notice subtle, and
negative intense. These match exactly:

- the box: 12px padding, 12px radius, no border, the fill;
- full width centring on desktop (`d`, 62.5rem) (the 584px cap and non-full-width layout were measured, then dropped by decision);
- icon, title, description and close positions and sizes;
- title and description type and colours, subtle and intense;
- the close glyph's colours;
- `role`, `aria-live`, and the "Dismiss alert" label.

- **Dropped checkout look:** the 8px radius and transparent 1px border, and the
  16px (`leading-50`) description line height, now Blade's 17px.

### cx-only features — decision pending

| Feature             | What it does                                          | Recommendation                                             |
| ------------------- | ----------------------------------------------------- | ---------------------------------------------------------- |
| `isOpen` (bindable) | shows the alert again after a dismiss; slides it shut | keep: React's alert, once dismissed, is gone until remount |
| `closeLabel`        | the dismiss button's accessible name                  | keep: React hardcodes English "Dismiss alert"              |

### Checkout call sites

All four already use React's shape (`description`, `isDismissible`, `icon`):
Netbanking, FlowSelector, TabbyCheckoutSheet, BankList. Three pass
`isFullWidth`, which is gone: drop it (full width is the only layout).
They pass React icon components to `icon`; cx takes the same-named icon from `@razorpay/blade-svelte/icons` (`import { BankIcon } from '@razorpay/blade-svelte/icons'`).

### Status

Audited, fixed, and verified: `svelte-check` gives 0 errors; `test`
passes; the DOM measurements match React Storybook.

### Figma alignment (Blade DSL)

- Text → dismiss is 12px, per Blade DSL's full-width Alert (Figma). Figma centres the dismiss button vertically in full width; cx keeps it top-aligned by request.
- Why `icon` is a prop: see the alert README (the icon carries its own 8px to the text).

---

## Amount

React: `Amount`. cx: `Amount` (`components/amount/`) over `runes/amount`.

**Decision:** by default Amount decides only the formatting (i18nify and
Intl): `size`, `weight` and `color` default to `inherit`, so it takes the
surrounding text's. `type` with `size` draws it as one of Blade DSL's Amount
variants (Figma), every one of them ported.

### Props

| React                                                 | cx                                                    | Action                                                                                                                                                                                                                                                                   |
| ----------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `value`                                               | `value`                                               | same                                                                                                                                                                                                                                                                     |
| `currency` (default `INR`)                            | `currency`                                            | **default added** (was required)                                                                                                                                                                                                                                         |
| `type`, `size`, `weight`, `color`                     | same, `size`/`weight`/`color` defaulting to `inherit` | **added**, Figma's variants: body xsmall–large, heading small–2xlarge, display small–xlarge; weights regular/medium/semibold (heading: no medium); `color` takes Text's colours. Sizes and weights are typed per `type`. React defaults to body medium; cx inherits      |
| `suffix: decimals \| none \| humanize`                | `suffix`                                              | **added**                                                                                                                                                                                                                                                                |
| `fractionDigits: number \| 'auto'` (default 2)        | `fractionDigits`                                      | same as React (checkout's cx used to default to the currency's own digits)                                                                                                                                                                                               |
| `isAffixSubtle` (default true)                        | `isAffixSubtle`                                       | same as React: one step smaller at 64% opacity, the decimals in the number's face (checkout's cx called it `affix: subtle \| normal`). With a set size the affix takes the style one step down (see the amount README); while the size inherits it is 0.75em of the text |
| `currencyIndicator: currency-symbol \| currency-code` | `currencyIndicator`                                   | same as React (checkout's cx called it `currencyDisplay: symbol \| code`)                                                                                                                                                                                                |
| `isStrikethrough`                                     | `isStrikethrough`                                     | same: one line across the whole amount, currency included, 1px (body) or 2px (heading, display); kept a `<del>` for readers                                                                                                                                              |
| `testID`                                              | `testID`                                              | same                                                                                                                                                                                                                                                                     |
| styled props, `data-analytics-*`                      | `class`; `data-analytics-*`                           | rule 1; analytics same (on the root)                                                                                                                                                                                                                                     |

### Formatting

Now i18nify's `formatNumberByParts`, as React (decision), replacing the
platform `Intl`. That brings:

- i18nify's symbols (SGD `S$` in en-SG);
- React's 2-decimal default;
- `none` flooring;
- `humanize` with a zero fraction stripped (Blade's polyfill).

A currency i18nify can't format falls back to the code and the plain number.

### Look

Only the layout is Amount's own, and it matches React:

- parts on one baseline;
- 4px either side of the minus sign;
- 2px between currency and number, on the locale's side;
- subtle affixes one step smaller at React's 64% opacity (`opacity-blade-800`); the decimals in the number's face, the currency in the body face;
- the strikethrough, React's line across the whole amount (1px body, 2px heading and display).

Everything else follows the text around it.

The type/size table follows Figma: the value in the type's style (heading
and display in the heading face), the subtle affix a step down, the currency
symbol always in the body face.

- **Side fix (Typography):** `font-heading` now carries Blade's `opsz` 60, for
  every heading. Before it was missing everywhere, and headings set a little wide.

### Accessibility

cx does more than React here, and keeps it: the whole amount as one hidden
string, with the styled parts `aria-hidden`. React reads the spans in order.

### cx-only features — decision pending

| Feature                | What it does                                                                                               | Recommendation                                   |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `unit: major \| minor` | takes paise or cents and scales by the currency's exponent                                                 | keep: checkout amounts are in minor units        |
| `locale`               | pins grouping and currency side; app-wide through `adapters.locale` (rule 15), over i18nify's global state | keep: React has only i18nify's global locale     |
| `symbol`               | replaces the currency symbol with the app's own                                                            | keep or drop: checkout's own symbol table (`RM`) |

### Checkout call sites

Two, in international checkout (Desktop, Mobile). Both pass `size` and
`weight`, and Desktop passes `type` and a token-path `color`: `type`, `size`
and `weight` now carry over; the token-path `color` becomes one of Text's
colours. `fractionDigits` still works; without it the default is now 2.

### Status

Audited, fixed, and verified: `svelte-check` gives 0 errors; `test`
passes; inheritance and the strikethrough are checked in the browser.

### Figma alignment (Blade DSL)

- All of Figma's type × size × weight variants are ported, with `size`, `weight` and `color` defaulting to `inherit`. Figma also puts 2px between the integer and the decimals; cx keeps them together, as React does.

---

## Badge

React: `Badge`. cx: `Badge` (`components/badge/`).

### Props

| React                                                       | cx                               | Action                                                                             |
| ----------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------- |
| `children` (string, required)                               | `children` snippet               | the label as content; React's dev check for empty text is not ported               |
| `color` (5 intents + `primary`, default neutral)            | `color`                          | same                                                                               |
| `emphasis: subtle \| intense` (default subtle)              | `emphasis`                       | same                                                                               |
| `size: xsmall \| small \| medium \| large` (default medium) | `size: small \| medium \| large` | **removed** `xsmall`: Blade DSL's Badge (Figma) draws small, medium and large only |
| `icon`                                                      | `icon`                           | **added** (a glyph token, see Icons)                                               |
| `testID`                                                    | `testID`                         | same                                                                               |
| styled props, `data-analytics-*`                            | `class`; same                    | rule 1; analytics same                                                             |

### Look

Measured against React Storybook for 4 colour, emphasis and size combinations.
These match exactly:

- the box: width, height (14/16/20/24px), pill radius, no border;
- the label: position, size, line height, weight, letter spacing, colour.

- **Sizes:** Blade's badgeTokens, which match Blade DSL's Badge (Figma).
  Side padding is the box's (4px, 8px for large) plus the label's own
  spacing (2px at small, 4px above), which is also the icon-to-label gap:
  text-only badges are 6/8/12px in on both sides, and a leading icon sits
  one gap closer to the edge (4/4/8px). That spacing is why `icon` is a prop.
  Icons are 8px at small, 12px above.
- **Weight:** medium on subtle, regular on intense, as in Blade.
- **Label:** one line (`clamp-1`). A cut-off label gets its full text as a
  `title`, which is Blade's `useTruncationTitle`
  (`runes/dom/truncation.ts`, new).
- **Dropped checkout look:** the transparent 1px border, the flex gap, and the
  16px line height.
- **Theme note:** cx's colours are Blade's _neutral_ theme (`uno.config.ts`),
  and React Storybook defaults to `bladeTheme`. They differ for primary subtle:
  opaque azure 100 against azure at 9%. Every other Badge colour is the same
  in both. This is a theme choice, not a Badge difference.

### Checkout call sites

None.

### Status

Audited, fixed, and verified: `svelte-check` gives 0 errors; `test`
passes; the DOM measurements match React Storybook.

---

## BottomSheet

React: `BottomSheet`, `BottomSheetHeader`, `BottomSheetBody`, `BottomSheetFooter`.
cx: `BottomSheet` (`components/bottom-sheet/`), over the overlay runes
(`createOverlay`) as a surface on the bottom edge, through the internal
`OverlaySurface` Modal and Drawer share. The header changes below are shared, so Modal has
them too.

**Decisions:** the sheet keeps its content height, with no snap points. On
desktop it keeps cx's capped, rounded panel. React's web sheet is full width
at every size. A sheet on phones and a modal on desktop is an app's own
overlay that switches by screen.

### Props

| React                                                     | cx                                      | Action                                                                                                                                   |
| --------------------------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `isOpen` (controlled)                                     | `bind:isOpen`                           | same                                                                                                                                     |
| —                                                         | `onOpenChange({ isOpen })`              | **added**, as Popover's: the opens and closes the sheet makes, not the owner's `isOpen`                                                   |
| `onDismiss()`                                             | `onDismiss({ source, close })`          | **changed**: fires on every dismissal, dismissible or not; a dismissible sheet then closes, otherwise `close` ends it. Replaces `onBack` |
| `isDismissible` (default true)                            | `isDismissible`                         | same: whether a dismissal closes it by itself; hides the close button, as in React                                                       |
| `snapPoints` (default [0.35, 0.5, 0.85])                  | —                                       | **not ported** by decision: content height, drag only dismisses                                                                          |
| —                                                         | `isDraggable` (default true)            | cx-only: off hides the handle and stops the drag; settable through BladeProvider                                                         |
| `initialFocusRef`                                         | same                                    | same: an element inside, bound with `bind:this`; else the panel takes focus, or content with `autofocus`                                 |
| `zIndex`                                                  | —                                       | n/a: the overlay host stacks sheets                                                                                                      |
| `BottomSheetHeader` `title`, `subtitle`                   | same, on `BottomSheetHeader`            | same: the title names the sheet, the subtitle describes it                                                                               |
| `BottomSheetHeader` `leading`, `titleSuffix`, `trailing`  | same                                    | same names (rule 14 for `leading`)                                                                                                       |
| `BottomSheetHeader` `showBackButton`, `onBackButtonClick` | same, plus `backLabel` (default `Back`) | same; a step back, not a dismissal                                                                                                       |
| `BottomSheetHeader` `children`                            | `children`                              | same: under the header's row                                                                                                             |
| `BottomSheetBody` (`padding` spacing.5 \| spacing.0)      | `BottomSheetBody` (`padding`)           | same; `overflow` is `class`. Classes: `resolveBottomSheetBody({ padding })`                                                              |
| `BottomSheetFooter`                                       | `BottomSheetFooter`                     | same. Classes: `resolveBottomSheetFooter()`                                                                                              |
| close button labelled "Close"                             | `closeLabel` (default `Close`)          | **changed**: shows while dismissible, not only when labelled                                                                             |
| `data-analytics-*`                                        | same                                    | same                                                                                                                                     |

### Look (at phone width)

Measured against React Storybook at 390px. These match:

- the panel: 16px top radius, fill, and the upward shadow;
- title: position, type (16/24 semibold −3.3%) and colour;
- close button: 20×20 at 16px in, centred on the title's first line;
- body and footer padding (16px).

- **Header:** Blade's BaseHeader box. 16px padding (20px on desktop (`d`, 62.5rem)), a
  hairline under it, and the title's type. The close button is centred on the
  title's first line. With no title, subtitle or header, an 8px strip holds the close
  button, floating in a 28px circle. The back button (`showBackButton`) is
  BaseHeader's: a 20px chevron first in the row, 16px before what follows.
- **Grab handle:** 56 × 4px, 12px from the top.
- **Footer:** 16px (20px on desktop (`d`, 62.5rem)) on the sheet's surface, under a hairline.
- **Dropped checkout look:** 8px radius, the 40px handle, the heading-face
  title, and the 20px padding with a 40px close button.
- **Side fix (CardGroup, then Accordion):** Blade's letter spacing on its title and subtitle,
  and the subtitle's 17px line height.
- **Typography gap noted:** cx `Text` misses Blade's letter spacing, and its
  xsmall and small line heights are wrong (Typography pass).

### Behaviour kept beyond React

cx does more than React's web sheet here, and keeps it:

- Escape closes (React's docs specify it; the web code doesn't).
- The focus trap.
- `aria-labelledby` pointing at the title.
- Back, as a dismissal (`source: 'back'`): the app's back handler calls
  `back()` first; `true` means an overlay handled it.

### cx-only features — decision pending

| Feature                       | What it does                                                                                                                   | Recommendation                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| `onClosed`                    | the exit finished                                                                                                              | keep                                     |
| `role: dialog \| alertdialog` | the dialog's role                                                                                                              | keep                                     |
| `accessibilityLabel`          | names an untitled sheet                                                                                                        | keep                                     |
| `chrome` snippet              | content hung off the panel's top edge (above it or over it), beside the close button and handle; receives `close`. Modal's too | keep                                     |
| `pace`                        | v2's quicker drawer easing                                                                                                     | decide                                   |
| `adaptive`                    | an app's own responsive overlay (not in the library)                                                                           | **moved**: BottomSheet is always a sheet |

### Checkout call sites

8 files. They pass `padding` (5), `title` and `snapPoints` (1), which is
React's API. These sites need porting: `padding` becomes `body` (padded) or
`children` (raw), and `snapPoints` is dropped.

### Status

Audited, fixed, and verified: `svelte-check` gives 0 errors; `test`
passes; the DOM measurements at phone width match React Storybook.

### Figma alignment (Blade DSL)

- `size` **removed**: Blade DSL's Bottom Sheet (Figma) has no sizes; the sheet is the 400px column on desktop (`d`).
- **Added** `leading` (`IconSource | Snippet`, rule 14), `titleSuffix`, `trailing` in the header, per Figma; the header sits 12px under the handle strip.
- **Missing**: Figma's back button, input field and contentType variants.

---

## AnnouncementBanner

React: `AnnouncementBanner`. cx: `AnnouncementBanner` (`components/announcement-banner/`), from Blade DSL's Announcement Banner (Figma).

| React                                         | cx                     | Action                            |
| --------------------------------------------- | ---------------------- | --------------------------------- |
| `children` (ReactNode)                        | `children` snippet     | rule 2                            |
| `alignment` (`center`, `left`)                | same                   | same                              |
| `icon`                                        | `icon` (an IconSource) | Icons rule                        |
| `accessibilityLabel` (default "Announcement") | same                   | same                              |
| `testID`                                      | same                   | same                              |
| dark treatment under `colorScheme="dark"`     | —                      | **missing**: cx has no dark theme |

### Figma alignment (Blade DSL)

- `surface.background.gray.subtle`, 8px above and below, 16px at the sides; the 16px icon 4px before the message.
- The message is Body/SmallMedium, 12/18 with no letter-spacing (React uses Text small, 12/17 at −1.3%), in `surface.text.gray.subtle`, on one line with an ellipsis.

---

## Avatar

React: `Avatar`, `AvatarGroup`. cx: the same (`components/avatar/`), from Blade DSL's Avatar and Avatar Group (Figma).

| React                                                           | cx                                 | Action                                                                                             |
| --------------------------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------- |
| `name`, `src`, `alt`, `srcSet`, `crossOrigin`, `referrerPolicy` | same                               | same; a broken image falls back to the initials or the glyph (**added**)                           |
| `icon` (default `UserIcon`)                                     | `icon` (an IconSource)             | Icons rule                                                                                         |
| `size`, `variant`, `color`, `isSelected`                        | same                               | same values and defaults                                                                           |
| `onClick`, `href`, `target`, `rel`                              | same                               | a button or a link                                                                                 |
| `topAddon` (Indicator only), `bottomAddon` (IconComponent)      | `topAddon`, `bottomAddon` snippets | rule 2: each in a box sized and placed per size; a trusted badge is an image, not a tintable glyph |
| `AvatarGroup` `size`, `density`, `maxCount`                     | same                               | same; avatars register with the group, so `maxCount` needs no child counting                       |
| —                                                               | `AvatarGroup` `accessibilityLabel` | **added**: names the `role="group"`                                                                |
| `BladeCommonEvents`, styled props, `data-analytics-*`           | `class`, `testID`, same            | rule 1 / same                                                                                      |

### Figma alignment (Blade DSL)

- **Rim:** a 1px `surface.border.gray.subtle` rim on every avatar (React draws none); selected, 2px `surface.border.primary.normal`.
- **Tint:** `interactive.background.{color}.faded` over a white underlay, `…fadedHighlighted` on hover; initials and glyph in `interactive.text.{color}.normal`.
- **Initials:** Body Semibold 10/13 (xsmall, small), 12/17 (medium), 14/20 (large); Heading 20/26 at xlarge, where React uses 18/24.
- **Addons:** the indicator 6/6/8/8/10px at Figma's top-right offsets; the trusted badge 8/8/12/16/20px at the bottom right.
- **"+N":** `surface.background.gray.subtle` with `interactive.text.neutral.muted`.

---

## Breadcrumb

React: `Breadcrumb`, `BreadcrumbItem`. cx: the same (`components/breadcrumb/`), from Blade DSL's Breadcrumb (Figma).

| React                                                                                         | cx                               | Action                                                                     |
| --------------------------------------------------------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------- |
| `size`, `color` (default `primary`), `showLastSeparator`, `accessibilityLabel`                | same                             | same                                                                       |
| —                                                                                             | `emphasis` (`subtle`, `intense`) | **added** from Figma: intense is the stepper-like pill trail with chevrons |
| `BreadcrumbItem` `href`, `onClick`, `isCurrentPage`, `children`, `icon`, `accessibilityLabel` | same (`children` a snippet)      | same / rule 2                                                              |
| styled props, `data-analytics-*`                                                              | `class`, `testID`, same          | rule 1 / same                                                              |

### Figma alignment (Blade DSL)

- **Subtle:** cx's Link per item (Body Medium, 12/16/16px glyph), 4px apart with a muted slash; neutral and white links at 0.56 opacity, primary full; the current page plain Body Medium, `aria-current="page"` on its `<li>`. Items register with the trail, so the separator needs no child counting.
- **Intense:** 28px pills (12px in, 16px radius, Body Small 12/18), 24px apart with a 16px chevron, gray wash on hover, the current page Semibold on `interactive.background.primary.faded` (white: `interactive.background.staticBlack.faded`). Figma draws it at small only, so `size` doesn't apply.

---

## BottomBar

React: `BottomBar` (renders fixed to the bottom). cx: `BottomBar` (`components/bottom-bar/`), from Blade DSL's Bottom Bar (Figma).

**Decision:** cx's BottomBar is only the surface; it does not position
itself. The consumer fixes it through `class` (`fixed inset-x-0 bottom-0`,
`sticky`, or in the flow), where React fixes it to the viewport.

| React                        | cx                 | Action                                          |
| ---------------------------- | ------------------ | ----------------------------------------------- |
| `children`                   | `children` snippet | rule 2                                          |
| fixed positioning            | —                  | **changed** by decision: the consumer's `class` |
| `accessibilityLabel`         | same               | same: names the `role="group"`, as React's      |
| `testID`, `data-analytics-*` | same               | same                                            |

### Figma alignment (Blade DSL)

- Surface `surface.background.gray.intense`, a 1px `surface.border.gray.muted` top border, and the Bottom Nav shadow (`0 -8px 24px`, the muted border colour) as `shadow-bottomBar`.
- 4px padding above and at the sides; Figma's 64px slot is the content's own height.
- Figma ends the bar in an iPhone home-indicator strip (an 8px gap and 15px); cx pads the bottom with the device's safe area (`env(safe-area-inset-bottom)`), at least 4px. It is non-zero only under `viewport-fit=cover`.

---

## Button and IconButton

React: `Button`, `IconButton`. cx: `Button` (`components/button/`) and
`IconButton` (`components/icon-button/`) over `runes/button/press.svelte.ts`.

### Button props

| React                                                                | cx                                                          | Action                                                                                                                                                                                                                                                  |
| -------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant: primary \| secondary \| tertiary`                          | `variant`                                                   | **removed** `tertiary` (deprecated in Blade DSL's Button, Figma; it drew as `secondary`); **removed** `link` by decision (an action that reads as a link waits for Link's button form, in the Link pass)                                                |
| `color: primary \| white \| positive \| negative` (default primary)  | `color` + `neutral`                                         | **added** `white`; `neutral` kept (Blade supports it with its own tokens); **default now `primary`** (blue), was neutral (black)                                                                                                                        |
| `size` (default medium)                                              | `size`                                                      | same values; now Blade's heights, padding and type                                                                                                                                                                                                      |
| `icon`, `iconPosition`                                               | `icon` (leading), `trailingIcon`                            | **changed**: Blade DSL's Button (Figma) has a leading and a trailing icon that may both show; `icon` alone is the icon-only square (28/32/36/48px, 16px glyph). Props, not children: the label's 4px each side is the gap, the icons sit on the padding |
| `children` (string)                                                  | `children` snippet                                          | the label and any icons                                                                                                                                                                                                                                 |
| `type` (default `button`)                                            | `type`                                                      | **default changed** from `submit` to `button`                                                                                                                                                                                                           |
| `href`, `target`, `rel`                                              | same                                                        | **added**: an anchor; `isDisabled` ignored there, as in React                                                                                                                                                                                           |
| `isFullWidth`                                                        | `class="w-full"`                                            | rule 1                                                                                                                                                                                                                                                  |
| `isLoading`, `isDisabled`, `accessibilityLabel`, `onClick`, `testID` | same                                                        | same                                                                                                                                                                                                                                                    |
| `onBlur`, `onFocus`, pointer and touch events, `tabIndex`            | —                                                           | **missing**; add on demand                                                                                                                                                                                                                              |
| `data-analytics-*`                                                   | same                                                        | same                                                                                                                                                                                                                                                    |
| —                                                                    | `validateForm`, `loadingAnnouncement`, `loadedAnnouncement` | cx-only, pending (below)                                                                                                                                                                                                                                |

### IconButton props

| React                                                                      | cx                                                                               | Action                                                                                                         |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `emphasis: intense \| subtle \| moderate` (default intense)                | `emphasis: intense \| subtle`                                                    | **added**, replacing `variant: plain \| boxed`; **removed** `moderate` (not in Blade DSL's Icon Button, Figma) |
| `isHighlighted`                                                            | `isHighlighted`                                                                  | **added**                                                                                                      |
| `size: small \| medium \| large`                                           | `size`                                                                           | same; glyph 12/16/20px; a 24/32px box (8px radius) only when highlighted or moderate, never at large           |
| `icon`, `accessibilityLabel` (required), `isDisabled`, `onClick`, `testID` | same                                                                             | same                                                                                                           |
| —                                                                          | `isLoading`, `type`, `validateForm`, `loadingAnnouncement`, `loadedAnnouncement` | cx-only, pending (below)                                                                                       |

### Look

Measured against React Storybook for six variant × colour × size combinations.
These match exactly:

- height, radius and fill;
- the inset-shadow frame for outlined, white and feedback colours;
- side padding;
- the label's position, type (Inter medium) and colour.

- **Sizes:** min height 28/32/36/48px; padding 8/8/12/16px plus the label's
  4px (content `px-1 gap-1`); type 12/12/14/16px; radius 8px, and 12px at large.
- **States:** hover, press and focus take the highlighted fill and frame, and
  focus draws Blade's 4px ring. Press scales the content to 95%.
- **Loading:** Blade's DotLoader over the hidden label (it stays laid out, so
  the width holds): 4px dots 2px apart (6 and 3 at large), rising in turn over
  1.2s, the middle one held under reduced motion. The button wears the
  disabled look.
- **IconButton loading:** a 2px spinner in place of the glyph, at the glyph's
  size (12/16/20px), not the DotLoader.
- **Theme note:** cx's Uno colours come from Blade's neutral theme, which
  pairs a blue primary fill with black primary borders and icons. The primary
  button's frame now takes the standard theme's blue rim and edge
  (`standardColor` in `uno.config.ts`), as React draws it. The primary loader
  dots are still the neutral theme's black.
- **Dropped checkout look:** the heading face, semibold, fixed heights
  (32/36/44/48) with all-round padding, bouncing dots, and IconButton's
  `boxed` MiniButton.
- **Uno change:** `disabled:` now also matches `[aria-disabled=true]` (and
  `enabled:` excludes it), so a busy control looks disabled yet keeps focus.

### cx-only features — decision pending

| Feature                                        | What it does                                                                                  | Recommendation                              |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Busy keeps focus                               | `aria-disabled` + `aria-busy` rather than `disabled`                                          | keep: React's disabled drops keyboard focus |
| `validateForm`                                 | a `button` that validates the app's form without submitting                                   | keep: checkout forms                        |
| `loadingAnnouncement`, `loadedAnnouncement`    | what `adapters.announce` says on turning busy and idle ("Started loading", "Stopped loading") | keep: React announces fixed English         |
| IconButton `isLoading`, `type`, `validateForm` | IconButton shares Button's press                                                              | keep                                        |

### Checkout call sites

136 files use Button.

- Unspecified colours turn blue: pass `color="neutral"` where checkout's black
  button is wanted.
- Submit buttons need `type="submit"`: 8 sites have it already.
- `variant="link"` moves to Link once Link has its button form.

### Status

Audited, fixed, and verified: `svelte-check` gives 0 errors; `test`
passes; the DOM measurements match React Storybook, except the theme note.

### Figma alignment (Blade DSL)

- **Button label:** semibold, letter-spaced −1.3% (−3.3% at large), per Figma; React sets medium weight.
- **IconButton:** highlighted box 24px (8px radius) at small, 32px (12px radius) at medium, none at large.
- `tertiary` **removed**: Figma marks it deprecated (❌). Callers use `secondary`, which Blade drew the same (Toast's action included). Figma's `showAvatar` (an avatar group after the label, large only) has no cx counterpart.

---

## ButtonGroup

React: `ButtonGroup`. cx: `ButtonGroup` (`components/button-group/`, new),
with its context in `runes/button/group.ts`.

### Props

| React                                                          | cx                 | Action                                                               |
| -------------------------------------------------------------- | ------------------ | -------------------------------------------------------------------- |
| `variant`, `size`, `color` (defaults primary, medium, primary) | same               | **added**; they override each Button's own, as in React              |
| `isDisabled`                                                   | `isDisabled`       | **added**; joins each Button's own, as in React (either disables it) |
| `isFullWidth`                                                  | —                  | **removed** by decision: `class="w-full [&>*]:flex-1"` (rule 1)      |
| `children` (Button, Dropdown, Tooltip, Popover)                | `children` snippet | same; React's dev check on child types is not ported                 |
| `testID`                                                       | `testID`           | same                                                                 |
| styled props, `data-analytics-*`                               | `class`; same      | rule 1; analytics same                                               |

### Look

Measured against React Storybook for primary and secondary. These match:

- the group: 38px at medium (36px buttons plus a 1px transparent border),
  8px radius (12px at large), clipped;
- filled seams: 1px wide, in `surface.border.gray.subtle`, as Figma draws
  them on the blue and the white fills alike (a translucent white was tried
  and reverted: Figma's seam is the grey);
- outlined: buttons overlap by 1px, so the rims read as one line.

- **Separator:** React inserts a separator element between filled buttons.
  cx draws it as a 1px gap over the following button (new Uno class
  `bg-divider-gray-subtle`), since `children` is one snippet.
- **Corners:** inner corners square off; the end buttons keep their outer
  radius, as in React.
- **Sheen:** the resting sheen stays on the first filled button only
  (`before:[&>*+*]:hidden`), as in Figma and React.

### Behaviour

- `role="group"`. It is not a toolbar: each button is its own Tab stop.
- `resetButtonGroup()` (`runes/button/group.ts`) is React's
  OverlayContextReset: Buttons inside an overlay's content aren't styled by an
  enclosing group. Popover and Menu call it (their `FloatingPanel`).

### Status

New, verified: `svelte-check` gives 0 errors; `test` passes; the
measurements match React Storybook.

### Figma alignment (Blade DSL)

- Filled buttons are split by a zero-width 1px subtle divider with no group border, so the group is exactly its buttons (Figma). React added a 1px transparent border and a 1px gap.

---

## Card

React: `Card`, `CardHeader*`, `CardBody`, `CardFooter*` (+ `TicketCard`,
`InfoCard`). cx: `Card` (`components/card/`) composing `CardHeader`,
`CardBody` and `CardFooter` (`components/card-children/`), each over its own
classes (`resolveCardHeader`, `resolveCardBody`, `resolveCardFooter`),
exported apart. Card renders its parts as children: an app that imports
only Card does not bundle them (`yarn check:tree-shaking` checks it).
CardHeader is also the base of ModalHeader, BottomSheetHeader and
DrawerHeader, which pass their own classes, a back button (`start`), the ids
that name their dialog and the drag zone (`attach`).

### Props

| React                                                                                                                            | cx                                                                                                   | Action                                                                                                                                                                                         |
| -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CardHeaderLeading` (`title`, `subtitle`, `prefix`, `suffix`)                                                                    | `CardHeader` `title`, `subtitle` (`string \| Snippet`), `prefix` (`IconSource \| Snippet`), `suffix` | **flattened** onto CardHeader (rule 14 for `prefix`). Its title names the card, or its overlay, without `accessibilityLabel`; `suffix` shows without a title too                               |
| `CardHeader` (`showDivider`), `CardHeaderTrailing` (`visual`), leaf parts (Icon, Counter, Badge, Amount, Text, Link, IconButton) | `CardHeader` `showDivider`, `trailing` snippet                                                       | same; the leaves are the caller's components in `prefix`, `suffix`, `trailing`. cx-only: `classes`, `start`, `content`, `children`, `titleId`, `subtitleId`, `attach`, for headers built on it |
| `CardBody`                                                                                                                       | `CardBody`                                                                                           | same                                                                                                                                                                                           |
| `CardFooter` (`showDivider`), `CardFooterLeading` (`title`, `subtitle`), `CardFooterTrailing` (`actions`)                        | `CardFooter` `title`, `subtitle`, `actions` (`primary`, `secondary`), `showDivider`; or `children`   | **flattened** onto CardFooter; `children` in place of the leading text and actions                                                                                                             |
| `size: large \| medium`                                                                                                          | —                                                                                                    | not ported: it only sized the header's title; cx draws React's default, `large`                                                                                                                |
| `variant: primary \| secondary`                                                                                                  | `variant`                                                                                            | same                                                                                                                                                                                           |
| `padding` (`spacing.0` \| `.3` \| `.4` \| `.5` \| `.7`, default `.7`)                                                            | `padding`                                                                                            | same                                                                                                                                                                                           |
| `onClick`                                                                                                                        | `onClick`                                                                                            | same as React; checkout's cx called it `onPress`; now React's overlay button, where the card was itself one `<button>`                                                                         |
| `href`, `target`, `rel`                                                                                                          | same                                                                                                 | **added**: a link overlay, routed as Link's (rule 15)                                                                                                                                          |
| `isSelected`                                                                                                                     | `isSelected`                                                                                         | **added**                                                                                                                                                                                      |
| `isDisabled`                                                                                                                     | `isDisabled`                                                                                         | same; now `aria-disabled` with no overlay                                                                                                                                                      |
| `as: 'label'`                                                                                                                    | `as`                                                                                                 | **added**                                                                                                                                                                                      |
| `accessibilityLabel`, `testID`                                                                                                   | same                                                                                                 | same                                                                                                                                                                                           |
| `onHover`                                                                                                                        | —                                                                                                    | **missing**; add on demand                                                                                                                                                                     |
| `elevation`, `backgroundColor`, `borderRadius`, `shouldScaleOnHover`                                                             | —                                                                                                    | deprecated in React (no-ops); not ported                                                                                                                                                       |
| `width`, `height`, min and max sizes, styled props                                                                               | `class`                                                                                              | rule 1                                                                                                                                                                                         |
| `data-analytics-*`                                                                                                               | same                                                                                                 | same                                                                                                                                                                                           |
| `TicketCard`, `InfoCard`                                                                                                         | —                                                                                                    | react-only                                                                                                                                                                                     |

### Look

Measured against React Storybook's CardExample. The surface matches exactly:
24px padding, 12px radius, fill, the three-part shadow (1px rim, drop shadow,
top shade), and the two 16px gradients' position and size.

- **Header and footer:** hairlines in `surface.border.gray.muted`, 12px either
  side, as CardHeader and CardFooter draw them.
- **Selected:** the 2px `surface.border.primary.normal` ring; the surface
  drops its rim (new Uno class `surface-raised-borderless`). React's example
  story does not wire `isSelected`, so the ring was checked against the spec.
- **Focus:** Blade's 4px ring, drawn on the overlay's covering `::before`.
- **Dropped checkout look:** per-section padding, the 1px border plus
  `shadow-card` surface, and the whole-card button with its press nudge.

### cx-only features

**Removed (decided):** `color`, a tinted card (v2's MagicCard tones): React
has no tints.

### Checkout call sites

6 files. They pass `padding` (now supported), `variant`, `borderRadius`
(deprecated in React; drop it) and `onClick`.

### Status

Audited, fixed, and verified: `svelte-check` gives 0 errors; `test`
passes; the surface measurements match React Storybook.

### Figma alignment (Blade DSL)

- **Missing**: Figma's metric card (16px radius, metric header and body), themable card (`surface/background/primary/faint`), Compact variant and elevations.

---

## Checkbox

React: `Checkbox`, `CheckboxGroup`. cx: `Checkbox` (`components/checkbox/`).

### Props

| React                                        | cx                                                        | Action                                                                                                                                                       |
| -------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `isChecked`, `defaultChecked`                | `isChecked` (bindable)                                    | rule 3                                                                                                                                                       |
| `onChange({ isChecked, event, value })`      | `onChange({ isChecked, value })`                          | rule 12; no `event`                                                                                                                                          |
| `children`                                   | `children` snippet (receives `{ isChecked, isDisabled }`) | same (the title)                                                                                                                                             |
| `helpText`                                   | `helpText`                                                | **changed**: now under the title, indented to line up with it, and shown in every state, as React. It was one line under the control that the error replaced |
| `errorText`, `validationState`               | same                                                      | **changed**: the error line is a separate FormHint under the whole control, led by Blade's error icon (the new shared `FieldHint`)                           |
| `isIndeterminate`                            | `isIndeterminate`                                         | **added**: Blade's dash on a checked box; the input's `indeterminate` makes it read as mixed                                                                 |
| `size: small \| medium \| large`             | `size`                                                    | **added** (was medium only): box 12/16/20, border 1.5/1.5/2, mark 8/12/16, title 12/14/16, help 11/11/14, and the small box's 1px tick nudge                 |
| `name`, `isDisabled`, `isRequired`, `testID` | same                                                      | same                                                                                                                                                         |
| `value`                                      | `value`                                                   | **added**: the input's `value` attribute                                                                                                                     |
| `tabIndex`                                   | `tabIndex`                                                | **added**                                                                                                                                                    |
| `data-analytics-*`                           | same                                                      | same                                                                                                                                                         |
| styled props                                 | `class`                                                   | rule 1                                                                                                                                                       |
| `CheckboxGroup`                              | —                                                         | react-only; add on demand (checkout has no group)                                                                                                            |

### Look

Measured against React Storybook (Default, Checked, Small, Large, HelpText,
ErrorText, Indeterminate) with the same state on both sides:

- **Geometry matches exactly:** box sizes, 4px radius, the 2px margin round the
  box, the title 22/18/26px from the box (the box's margin plus 4px), title
  type (14/20, 12/17, 16/24, `surface.text.gray.subtle`), the help text
  indented to the title and 23/24px below the box top (11/16, 14/16 at large,
  `surface.text.gray.muted`), and the marks' size and place.
- **Marks:** now Blade's own CheckedIcon and IndeterminateIcon paths (filled,
  0.5 stroke); they stay mounted and fade and scale as Blade's Fade does.
- **Focus:** Blade's 4px `surface.border.primary.muted` outline, 1px off the
  box (new Uno class `outline-4`). It was a flush shadow.
- **Disabled:** Blade's `not-allowed` cursor over the field; the label takes
  no pointer. It was pointer-events off with the default cursor.
- **Error line:** Blade's FormHint — the info icon 2px down, 4px before the
  text, 4px under the label (8px at large).
- **Theme:** the checked border is `interactive.border.primary.default`, black
  in the neutral theme `uno.config.ts` uses, blue in React Storybook's default
  theme.

### cx-only features — decision pending

| Feature              | What it does                                          | Recommendation                                            |
| -------------------- | ----------------------------------------------------- | --------------------------------------------------------- |
| `accessibilityLabel` | names a checkbox with no `children`                   | keep: React needs a visually hidden child for this        |
| `parse`              | maps `isChecked` to the value the app's form collects | keep: checkout's form integration needs it (5 call sites) |

### Checkout call sites

18 files use v2's own Checkbox (none yet use this one). They pass `onChange`,
`value` (the checked state, here `isChecked`), `name`, `parse`, `class`,
`size` (2, now supported), `store` (2) and `type="radio"` (4; those are Radios).

### Status

Audited, fixed, and verified: `svelte-check` gives 0 errors; `test`
passes (new tests: indeterminate, size, help text layout, the error line's
icon); every measurement above matches React Storybook. The shared
`FieldHint` (`components/shared/FieldHint.svelte`) has since been adopted by
the fields and groups too (see Form).

### Figma alignment (Blade DSL)

- At small the box sits 3px from the top (2px otherwise), centring on the 17px title line as Figma's container does.

---

## Chip and ChipGroup

React: `Chip`, `ChipGroup`. cx: `Chip`, `ChipGroup` (`components/chip/`), **new**
— ported from React, as checkout had none.

A ChipGroup is Radio/Checkbox semantics drawn as chips: `single` is native
radios, `multiple` native checkboxes. It is built on the headless choice list
(`runes/base/choice-list.svelte.ts`) like CardGroup, but keeps the platform's
keys, as React does: a radio group picks as the arrows move, and each checkbox
is a tab stop.

### ChipGroup props

| React                                               | cx                                                        | Action                                                                                                                                        |
| --------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `children` (Chips)                                  | `children`                                                | rule 4: Chips register; anything may sit between them                                                                                         |
| `selectionType: single \| multiple`                 | same                                                      | same (default `single`)                                                                                                                       |
| `value`, `defaultValue` (`string \| string[]`)      | `value` (bindable; a string, or an array with `multiple`) | rule 3                                                                                                                                        |
| `onChange({ name, values })`                        | `onChange({ name, value })`                               | **changed** (rule 12): one key, `value` shaped as `bind:value` (an array with `multiple`)                                                                                          |
| `label`, `accessibilityLabel`                       | same                                                      | same                                                                                                                                          |
| `labelPosition`                                     | —                                                         | not ported (rule 7): the label is always on top                                                                                               |
| `labelSuffix`, `labelTrailing`                      | —                                                         | not ported (rule 9)                                                                                                                           |
| `necessityIndicator`                                | same                                                      | **added** (first in cx): `*` or `(optional)` after the label; `required` also requires                                                        |
| `helpText`, `errorText`, `validationState`          | same                                                      | the error replaces the help text in one FormHint line, as React                                                                               |
| `isDisabled`, `isRequired`, `name`, `testID`        | same                                                      | same; a single-choice group is a `radiogroup` carrying `aria-required` and `aria-invalid`, not each chip; each Chip gets `${testID}-${index}` |
| `size: xsmall \| small \| medium \| large`, `color` | same                                                      | same (defaults `small`, `primary`)                                                                                                            |
| `data-analytics-*`                                  | same                                                      | same                                                                                                                                          |
| styled props                                        | `class`                                                   | rule 1                                                                                                                                        |

### Chip props

| React                                | cx                                                                                          | Action                                                                                                                                                                                                                                                                        |
| ------------------------------------ | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`, `children` (string)         | `value`, `children` snippet (receives `{ isChecked, isDisabled }`; optional with `leading`) | rule 2                                                                                                                                                                                                                                                                        |
| `icon`, `leading` (one or the other) | `leading?: IconSource \| Snippet<[ControlState]>`                                           | **merged** (rule 14): an icon, or a snippet (an Avatar, a flag) that receives `{ isChecked, isDisabled }`. Props, not children: Figma spaces the leading item differently from the label (the label's 4px each side is the gap and the text inset; the leading item has none) |
| `color`, `isDisabled`                | same                                                                                        | same; both fall back to the group's                                                                                                                                                                                                                                           |
| `width`, `minWidth`, `maxWidth`      | `class`                                                                                     | rule 1                                                                                                                                                                                                                                                                        |
| `testID`                             | same                                                                                        | same                                                                                                                                                                                                                                                                          |

### Look

Measured against React Storybook (Single Selection, Multi Selection) at the
same state:

- **Chip:** 30px tall (28px inner plus the 1px frame), 8px sides, 8px frame
  radius and 7px inner, the text box 4px each side, 14/20 text — widths match
  to the tenth of a pixel. The large label is Heading/MediumRegular (the
  heading face, 20/26) per Blade DSL's \_Chip (Figma); React sets it in body
  16/24. Picked: the inner border and the faded fill; hover a
  step up; disabled per React. Pressed scales to 0.92. Focus: React's 2px
  `interactive.border.primary.default` outline, 2px off.
- **Group:** the label 12/17 medium `surface.text.gray.subtle` (FormLabel's
  tokens per size), 6px above the chips; chips wrap 8px apart with a 42px row
  pitch; max width 280px on phones, 420px above, truncating.
- **SelectorLabel's 2px margin** above and below each chip is React's (blade-core's
  chip CSS omits it).
- **Letter-spacing:** Blade's Text sets `tracking-50` on body and caption text
  (`tracking-25` on large body). The chip text, the group label, Checkbox's title
  and help text, and `FieldHint` now carry it. cx's Text and Heading do not yet:
  that is Typography's to fix.
- **Theme:** picked `primary` is black here (neutral theme), blue in React
  Storybook.

### Checkout call sites

None: checkout has no chips.

### Status

New, verified: `svelte-check` gives 0 errors; `test` passes (8 new
tests: radios and checkboxes, pick and bind, per-chip colour, disabled,
press, necessity and help text, Form required); the measurements above match
React Storybook.

---

## Collapsible

> **Not exported:** the code is in `src/components/` and documented here, but `@razorpay/blade-svelte` does not export it yet.

React: `Collapsible`, `CollapsibleButton`, `CollapsibleLink`, `CollapsibleBody`
(`CollapsibleText` is internal to other components). cx: `Collapsible` and
`CollapsibleChevron` (`components/collapsible/`), **new** — ported from React,
as checkout had none. Not a wrapper over `<details>`: that cannot open above
its trigger, cannot use a Button or Link as its trigger, and cannot animate
closing — React is a button plus a region too.

### Props

| React                                                    | cx                                                                                       | Action                                                                                                                                                                                                                     |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isExpanded`, `defaultIsExpanded`                        | `isExpanded` (bindable)                                                                  | rule 3                                                                                                                                                                                                                     |
| `onExpandChange({ isExpanded })`                         | same                                                                                     | rule 12                                                                                                                                                                                                                    |
| `direction: bottom \| top`                               | same                                                                                     | same: `top` opens the body above the trigger                                                                                                                                                                               |
| `CollapsibleButton` (a Button)                           | the `children` trigger (receives `{ isExpanded }`): the caller's Button                  | rule 13: the wrapper toggles on a press that no handler prevented (`defaultPrevented`), the caller's Button wires nothing; its first focusable element gets `aria-expanded`, and `aria-controls` while the body is mounted |
| `CollapsibleLink` (a BaseLink `button` with the chevron) | the `children` trigger: the caller's `Link variant="button"` with a `CollapsibleChevron` | rule 13; `CollapsibleChevron` is React's CollapsibleChevronIcon                                                                                                                                                            |
| `CollapsibleBody` (+ `width`)                            | `content` snippet                                                                        | rule 13; width through `class` (rule 1)                                                                                                                                                                                    |
| `testID`                                                 | same                                                                                     | same                                                                                                                                                                                                                       |
| `data-analytics-*`                                       | same                                                                                     | same                                                                                                                                                                                                                       |
| styled props                                             | `class`                                                                                  | rule 1                                                                                                                                                                                                                     |

**Side addition (Link):** `variant: 'anchor' | 'button'`, React's Link API —
`button` renders a `<button>` that acts and reads as a link (no `href`).

### Look

Measured against React Storybook (WithCollapsibleLink, WithCollapsibleButton,
WithDirection):

- **Triggers** are the caller's Link or Button, and match React to the tenth of
  a pixel (169.2×20 and 181.2×36 for the story's label); the chevron is 16px,
  4px after the label, and flips (-180°) over 280ms on the standard easing.
- **Body:** 12px from the trigger (below, or above with `top`); it slides its
  height open and closed over 280ms on the standard easing, fading from 0.8 —
  the same panel as CardGroup's (now `components/shared/CollapsePanel.svelte`).
  Unlike React, a collapsed body is unmounted, as CardGroup's is.
- **Width:** at least 200px; at most the viewport less 40px, 640px on
  desktop (`d`). React's 1136px step needs a second breakpoint; cx has one.
- **Theme:** the link trigger is black here (neutral theme), blue in React.

### Status

New, verified: `svelte-check` gives 0 errors; `test` passes (toggle,
bind and report, aria state, the chevron, host-driven state, direction, and
Link's `button` variant); the measurements above match React Storybook.

### Figma alignment (Blade DSL)

- The body sits directly under the trigger (Figma); React put 12px between them.

---

## Counter

React: `Counter`. cx: `Counter` (`components/counter/`), **new** — ported from
React, as checkout had none.

### Props

| React                                                                           | cx      | Action                                                                                               |
| ------------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| `value`, `max`                                                                  | same    | same: past `max` it reads `max+`. **Different:** `max={0}` counts (`0+`); React treats 0 as no `max` |
| `color` (`neutral`, `positive`, `negative`, `notice`, `information`, `primary`) | same    | same (default `neutral`)                                                                             |
| `emphasis: subtle \| intense`, `size: small \| medium \| large`                 | same    | same                                                                                                 |
| `testID`                                                                        | same    | same                                                                                                 |
| `data-analytics-*`                                                              | same    | same                                                                                                 |
| styled props                                                                    | `class` | rule 1                                                                                               |

### Look

Measured against React Storybook (Default, Max, the three size stories, and
`positive`): the pill's size to the tenth of a pixel (16/20/24px tall, as wide
at one digit), the side padding from two digits (4/8/8px), the medium text
(10/12/14px) with Blade's letter-spacing, and both colour pairs match. Width
caps at 100px on phones and 120px above, as React's platform tokens.

### Status

New, verified: `test` passes (count, `max+`, padding, colour); the
measurements above match React Storybook.

### Figma alignment (Blade DSL)

- Matches Figma (16/20/24px pills, 4/8/8px padding, 10/13, 12/17 and 14/20 medium, −1.3%); no change.

---

## CounterInput

React: `CounterInput`. cx: `CounterInput` (`components/counter-input/`),
**new** — ported from React, as checkout had none.

### Props

| React                                                                     | cx                          | Action                                                                                    |
| ------------------------------------------------------------------------- | --------------------------- | ----------------------------------------------------------------------------------------- |
| `value`, `defaultValue`                                                   | `value` (bindable)          | rule 3                                                                                    |
| `onChange({ value })`                                                     | `onChange({ name, value })` | rule 12                                                                                   |
| `min` (default 0), `max`                                                  | same                        | same: steps and typed values clamp to the range; each button disables at its end          |
| `label`, `accessibilityLabel`, `name`                                     | same                        | same; `name` registers the count with the app's form                                      |
| `labelPosition`                                                           | —                           | not ported (rule 7)                                                                       |
| `labelSuffix`, `labelTrailing`                                            | —                           | not ported (rule 9)                                                                       |
| `size: xsmall \| small \| medium \| large`, `emphasis: subtle \| intense` | same                        | same (defaults `medium`, `subtle`)                                                        |
| `isLoading`, `isDisabled`                                                 | same                        | same: both stop the buttons, disable the field and grey the number; loading draws the bar |
| `onFocus`, `onBlur`, `testID`                                             | same                        | same                                                                                      |
| `data-analytics-*`                                                        | same                        | same                                                                                      |
| styled props                                                              | `class`                     | rule 1                                                                                    |

### Look

Measured against React Storybook (Basic Usage, with emphasis, disabled and
loading set through args):

- **Box:** 94×38 at medium (78/86/94/122 × 30/34/38/50 by size), 8px radius
  (12px at large), the gray border; disabled and loading on the subtle fill.
- **Buttons:** 28px square at medium, 4px in from the box's edge and each
  other's side, 4px padding and radius, the 20px icon; hover fills
  `interactive.background.gray.faded-highlighted` and darkens the icon.
- **Number:** as wide as its digits (`ch`, at least 2) plus 4px each side,
  36px tall, semibold with Blade's letter-spacing; greyed while disabled or
  loading.
- **Label:** FormLabel's tokens per size, 4px above the box (8px at large).
- **Motion:** the new number slides in from below on a step up, from above on
  a step down (200ms). Loading swings a 2px bar along the bottom edge over
  960ms, in React's colours; React's indeterminate bar also changes width as
  it goes, ours keeps 40% (blade-core's port).
- **Focus:** Blade's inset 4px ring on a button's keyboard focus, and on the
  number field after Tab only (React's rule: `:focus-visible` would ring a
  click too).
- **Theme:** `intense` is black here (neutral theme), blue in React
  Storybook.

### Status

New, verified: `svelte-check` gives 0 errors; `test` passes (range,
steps and binding, clamping typed input, disabled and loading, Form
submission, the slide); the measurements above match React Storybook.

### Figma alignment (Blade DSL)

- **Box:** 92×36 at medium (76/84/92/120 × 28/32/36/48 by size), border included, as Figma; React draws the border outside, 2px larger. Buttons 20/24/28/40px square, 4px from the edge; icons 12/16/16/20px.
- **Missing**: Figma's `labelPosition: left` (8px gap).

---

## Divider

React: `Divider`. cx: `Divider` (`components/divider/`).

### Props

| React                                            | cx             | Action                                                      |
| ------------------------------------------------ | -------------- | ----------------------------------------------------------- |
| `orientation: horizontal \| vertical`            | same           | same                                                        |
| `dividerStyle: solid \| dashed`                  | `dividerStyle` | same as React; checkout's cx called it `line`               |
| `variant: normal \| subtle \| muted`             | `variant`      | **added** (was muted only): `surface.border.gray.{variant}` |
| `thickness: thinner \| thin \| thick \| thicker` | `thickness`    | **added** (was thin only): Blade's border widths            |
| `width`, `height`                                | `class`        | rule 1                                                      |
| `testID`                                         | same           | same                                                        |
| styled props                                     | `class`        | rule 1                                                      |

### Look

Measured against React Storybook (Divider, Horizontal, Vertical):

- **Horizontal:** a 1px bottom border (was the top one), growing along a flex
  row rather than taking `w-full`, no margin.
- **Vertical:** a 1px left border, stretched to the row's height.
- **Element:** an `<hr>` (a native separator, with `aria-orientation` when
  vertical) where React renders a `div role="separator"`: the same semantics.

### Checkout call sites

None pass `line`; the one harness that did now passes `dividerStyle`.

### Status

Audited, fixed, and verified: `svelte-check` gives 0 errors; `test`
passes; the measurements above match React Storybook.

### Figma alignment (Blade DSL)

- Matches Figma; no change.

---

## Dropdown and Menu

> **Superseded (decided):** the Dropdown and Menu components below were
> removed. Menu is its own overlay (`components/menu/`) with an ActionList
> inside; a select dropdown is not ported, as it is not mobile friendly.
> See Overlays at the end. The comparison stays as the record of what the
> rows and the keyboard do.

React: `Dropdown` with a trigger (`DropdownButton`, `DropdownLink`,
`DropdownIconButton`, or an input trigger: `SelectInput`, `AutoComplete`,
`FilterChipSelectInput`), a `DropdownOverlay` (+ `DropdownHeader`,
`DropdownFooter`) and an `ActionList`. One component does both jobs; the
trigger and `selectionType` decide whether it's an action menu or a picker.

cx: two components on one core.

- **`Menu` + `MenuItem`** (`components/menu/`): do something; items act like buttons and every pick closes it.
- **`Dropdown` + `ActionList` (`ActionListItem`, `ActionListSection`), `DropdownHeader`, `DropdownFooter`** (`components/dropdown/`, `components/action-list/`): pick a value; the row stays selected.

**Decision:** split, as the Blade designers do ("if the click saves a
choice, use Dropdown; if it triggers an action, use Menu"). Neither extends
the other: both are thin layers over `createPopupList`
(`runes/popup-list/`): ordered rows, the keyboard, the disclosure and the
trigger. Menu adds a momentary pick (act and close). Dropdown adds a held
pick in a form field (`heldSelection` from `base/choice-list`,
`createFieldShell`), closing on a single pick only, as React.

**Focus model:** both keep focus on one element (the list, or a search
field) and name the active row with `aria-activedescendant`. Menu used to
move focus onto each item; the visible behaviour is unchanged.

### Props

| React                                                                                                           | cx                                                                                                                                                       | Action                                                                                               |
| --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `DropdownButton` / `DropdownLink` / `DropdownIconButton`                                                        | the `children` trigger, the caller's Button or Link (Menu: receives `{ isOpen }`; Dropdown: `{ isOpen, selected }`, the picked rows' titles)             | rule 13; the wrapper stamps `aria-haspopup` / `aria-expanded`                                        |
| `DropdownOverlay` (Menu: `MenuOverlay`)                                                                         | `content` snippet: the ActionList (Menu: the MenuItems)                                                                                                  | rule 13                                                                                              |
| `SelectInput`                                                                                                   | Dropdown without `children`: `label`, `placeholder`, `helpText`/`errorText`/`successText`, `validationState`, `size`, `name`, `isRequired`, `isDisabled` | **changed**: the select field is what the Dropdown draws without a trigger, not a separate component |
| `selectionType: single \| multiple`                                                                             | Dropdown `selectionType`                                                                                                                                 | same; Menu has no selection                                                                          |
| `ActionList` `onChange` (via SelectInput)                                                                       | Dropdown `bind:value`, `onChange({ name, value })`                                                                                                       | rule 3                                                                                               |
| `isOpen`, `onOpenChange(isOpen)`                                                                                | `bind:isOpen`, `onOpenChange({ isOpen })`                                                                                                                | **changed**: the object form, as the other overlays                                                  |
| `DropdownOverlay` `defaultPlacement` (`bottom-start`)                                                           | `placement`                                                                                                                                              | same default                                                                                         |
| `DropdownOverlay` `width` / `minWidth` / `maxWidth` / `zIndex` / `referenceRef`                                 | —                                                                                                                                                        | **missing** (240–400px)                                                                              |
| `DropdownHeader` (`title`, `subtitle`, `leading`, `trailing`, `titleSuffix`, search via AutoComplete)           | —                                                                                                                                                        | not ported (no Dropdown); a search is an app's own searchable list                                   |
| `DropdownFooter`                                                                                                | `DropdownFooter`, in the `footer({ close })` snippet                                                                                                     | rule 2                                                                                               |
| `ActionListItem` `title`, `value`, `description`, `leading`, `trailing`, `titleSuffix`, `isDisabled`, `onClick` | `ActionListItem` (Menu: `MenuItem`) same; `leading` is an icon or a snippet                                                                              | same (rule 14)                                                                                       |
| `ActionListItem` `intent: 'negative'`                                                                           | `ActionListItem` / `MenuItem` `intent`                                                                                                                   | same; refused with the select field, as React (draws neutral)                                        |
| `ActionListItem` `isSelected`                                                                                   | —                                                                                                                                                        | derived from Dropdown's `value`                                                                      |
| `ActionListItem` `href`/`target`                                                                                | `ActionListItem` `href`, `target`, `rel`                                                                                                                 | same: a link row follows its link, closes the list and holds no value                                |
| `ActionListSection`                                                                                             | `ActionListSection` (Menu: anything between items)                                                                                                       | same                                                                                                 |
| `MenuDivider`                                                                                                   | `MenuDivider`                                                                                                                                            | same: Figma's separator row; the keys pass over it                                                   |
| —                                                                                                               | Menu `onSelect(value)`                                                                                                                                   | cx-only: an item's `value` is reported                                                               |
| No results / loading                                                                                            | Dropdown `emptyText` (search), `isLoading`                                                                                                               | same                                                                                                 |
| Nested dropdowns (submenus)                                                                                     | —                                                                                                                                                        | **missing**                                                                                          |
| `AutoComplete`, `FilterChipSelectInput`, tree view, country selector, virtualised list                          | —                                                                                                                                                        | **missing**                                                                                          |
| Below `m`: the overlay as a BottomSheet                                                                         | —                                                                                                                                                        | **missing**                                                                                          |
| `data-analytics-*`                                                                                              | Menu: on the panel                                                                                                                                       | same                                                                                                 |

### Look (Blade DSL, Figma)

One row, two panels (`components/shared/popup-list.ts`): Menu follows Figma's
Menu and \_Menu Item; Dropdown and a standalone ActionList follow Figma's
Dropdown, \_Action List and \_Action List Item.

- **Surface (both):** 240–400px wide, `popup.background.gray.moderate`, Figma's \_components/Popup (the 1px rim over the raised shadow, the medium blur), 8px from the trigger. It opens sliding 8px down as it fades in, over `quick`. **Menu** is 12px round; **Dropdown** 16px.
- **Rows' box:** 8px round the rows in both; **Menu**'s rows 2px apart, **Dropdown**'s and ActionList's touching (Figma's Body and \_Action List insets, no gap).
- **Row (both):** 36px, 8px padding, 8px radius, its parts 8px apart. Title Body/Medium in `interactive.text.gray.normal`; description Body/Small in `interactive.text.gray.muted`; glyph `interactive.icon.gray.normal` (negative: `feedback.icon.negative.intense`). Disabled: all three `…disabled`, and a multiple row's checkbox in Checkbox's disabled look. Active (pointer or keys): `interactive.background.gray.default`; the keys add Figma's 4px `interactive.border.primary.faded` ring.
- **Dropdown adds:** the held single pick in `interactive.background.gray.fadedHighlighted`, kept under the pointer and the keys; multiple rows lead with Checkbox's box; sections: Figma's separator row (a hairline 8px in, 4px tall) before every section but the first, then the heading (Semibold 12/17, `interactive.text.gray.muted`, 8px in, 2px under); a header (16px in all round, 16px to the search, Figma's divider under it); a footer (Figma's divider over it, then 16px in, 16px between actions).
- **Menu adds:** `intent="negative"` rows in `interactive.text.negative.normal` with the `interactive.background.negative.faded` wash; `MenuDivider`, Figma's separator row (a hairline 1px in from the panel's edges, 4px tall).

### Status

Menu ported to the core with its look unchanged; Dropdown added. `test` passes (`test/dropdown.test.ts`, the Menu cases in `test/popover.test.ts`, `runes/menu/menu.test.ts`).

### Figma alignment (Blade DSL)

- The two panels split, per Figma (were both Menu's): Dropdown and ActionList 16px round (Dropdown) with rows touching (was 2px apart); Menu unchanged.
- Figma's tokens throughout: descriptions `interactive.text.gray.muted` (was `surface.text.gray.muted`), glyphs `interactive.icon.*`, a disabled row's description, glyph and checkbox `…disabled` (were left enabled; ActionList dimmed the row with opacity), the keys' ring `interactive.border.primary.faded` (was `surface.border.primary.muted`, cx's other rings).
- A picked row keeps its wash under the pointer (was the hover fill).
- Dropdown's header and footer take Figma's dividers; the header is 16px in all round with 16px to the search (was 12px under, 12px to it); the footer 16px in all round (was 8px over it).
- Sections take Figma's separator row, a hairline 8px in (was flush with the rows' box).
- **Added** `MenuDivider` (React's), Figma's \_Menu Item separator.
- Not ported: Figma's \_Menu Header / \_Menu Footer (cx's Menu has neither); Figma's footer buttons sharing its width (the footer's content is the caller's).

---

## DotLoader

React: `DotLoader` (internal to Blade React: not exported from its components
index). cx: `DotLoader` (`components/dot-loader/`), exported. Button draws it
over its label while loading.

### Props

| React                                                       | cx      | Action                                                                                                                             |
| ----------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `size: small \| medium \| large` (default medium)           | same    | same                                                                                                                               |
| `color: IconColors` (default `interactive.icon.gray.muted`) | `color` | **changed**: Icon's colour axis (`muted` default, …, `inherit`), as everywhere in cx; `muted` is the same value as React's default |
| `accessibilityLabel`                                        | same    | same: `role="status"` when set, else `aria-hidden`                                                                                 |
| `testID`                                                    | same    | same                                                                                                                               |
| —                                                           | `class` | rule 1                                                                                                                             |

### Look

Geometry and motion from React's `dotLoaderTokens`: 18/24/36px squares,
3/4/6px dots, 1.5/2/3px apart, rising 3.75/5/7.5px. The loop is 1.2s and the
dots are staggered by 150ms. They rest at 42% opacity and peak at 100%. Under
reduced motion the middle dot is held at its peak.

### Status

New; `svelte-check` gives 0 errors; `test` passes.

## EmptyState

React: `EmptyState`. cx: `EmptyState` (`components/empty-state/`).

### Props

| React                                      | cx                                | Action                                                                                               |
| ------------------------------------------ | --------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `asset`                                    | `asset` snippet                   | same as React; checkout's cx called it `media` (rule 2)                                              |
| `title?`                                   | `title?: string \| Snippet`       | now optional, as in React; a snippet is a superset                                                   |
| `description?`                             | `description?: string \| Snippet` | same as React; checkout's cx called it `message`; a snippet (a Link in it) is a superset, as Alert's |
| `children`                                 | `children` snippet                | now a direct child of the stack, as in React (no wrapper)                                            |
| `size: small \| medium \| large \| xlarge` | `size` (default `medium`)         | **added**                                                                                            |
| `testID`                                   | same                              | same                                                                                                 |
| styled props                               | `class`                           | rule 1                                                                                               |
| analytics                                  | same                              | same                                                                                                 |
| —                                          | ~~`color`~~                       | cx-only, **removed** (below)                                                                         |

### Look

Measured against React Storybook (With Title And Description, per size, at
desktop width — cx's type scale is Blade's desktop one):

- **Stack:** a centred flex column, gap 16/20/24/32px by size; no padding
  (was `px-4 py-8`) and no `text-center` on the root.
- **Asset:** a bare box capped at 60/90/120/160px (was an 80px tinted disc),
  no longer `aria-hidden`: an illustration is the caller's `<img alt>`.
- **Title and description:** one inner column, 2px apart. The title is a
  semibold Heading, `surface.text.gray.subtle`, 18/18/20/32px, no
  letter-spacing; its tag follows Blade's Heading (`h6`, `h6`, `h5`, `h3`;
  was `h2`). The description is body Text, `surface.text.gray.muted`,
  10/12/14/16px with Blade's letter-spacing (-1.3%, -3.3% for xlarge).

### cx-only features

**Removed (decided):** `color`, which drew a round disc tinted by an intent
behind the asset (checkout's old look). A caller who wants the disc draws it
inside `asset`.

### Checkout call sites

None in the apps; the story and the test harness were updated.

### Status

Audited, fixed, and verified: `svelte-check` gives 0 errors; `test`
passes; the measurements above match React Storybook.

### Figma alignment (Blade DSL)

- Title → description is 4px (Figma).
- **Added** `icon` (`IconSource`) before the title, or before the description when there is no title: Figma's leading icon, 12/16/20/32px with a 4/8/12/12px gap. Why it is a prop: see the empty-state README.
- **Missing**: Figma's help text with an icon, and the inline link.

---

## Form (FormLabel, FormHint, CharacterCounter)

React's `Form` is field chrome, not a form: `FormLabel`, `FormHint` and
`CharacterCounter`, which every field draws. cx has them as shared atoms in
`components/shared/`, with their classes in `shared/field.ts`. They are
internal on both sides: fields take `label`, `necessityIndicator`,
`helpText`, … and draw these.

| React                                      | cx                                           | Notes                                 |
| ------------------------------------------ | -------------------------------------------- | ------------------------------------- |
| `FormLabel`                                | `FieldLabel.svelte`, `resolveFieldLabel`     | **new**                               |
| `FormHint`                                 | `FieldHint.svelte`, `resolveFieldHint`       | gained `xsmall`                       |
| `CharacterCounter`                         | `FieldCounter.svelte`, `resolveFieldCounter` | **new**                               |
| `AnimatedFormHint` (`showHelpTextOnFocus`) | —                                            | not ported; would come with TextInput |
| `FormLabel.position="left"`                | —                                            | rule 7                                |

### FieldLabel

Props: `text`, `as: 'label' | 'span'` with `for` and `id`, `size`
(`xsmall`…`large`), `necessityIndicator`, `accessibilityText`. The label element holds the text and its necessity
only; the row around it holds the gap to the field.

Measured against React Storybook (ChipGroup, required at small and optional
at medium, desktop width): the same box, type, colours, gaps and offsets.

- Body text, medium weight, clamped to two lines: small (12/17) up to
  medium, medium (14/20) at large; `surface.text.gray.muted` at xsmall and
  small, `subtle` above. 4px above the field, 8px at large.
- Required: a regular body-small `*` in `feedback.text.negative.intense`,
  pinned to the first line. Optional: a regular caption `(optional)`,
  4px after the text, in `surface.text.gray.muted`.
- The necessity is read once: React reads a hidden "required" and the
  visible `*` too (its own TODO); cx hides the mark from screen readers.
- Row content sits 4px apart; `ms-auto` sends an item to the row's end —
  measured against React's "with label suffix & trailing" TextInput story
  (the Label row story).

### FieldCounter

`current/max`, a regular caption in `surface.text.gray.muted` at the hint's
size. TextInput and TextArea show it at the end of the hint row, 2px from
the edge, while `maxCharacters` is set (TextInput: unless `format` or
`transform` is).

### Fields on the shared chrome

Every field draws FieldLabel and FieldHint: ChipGroup, CounterInput,
TextInput, TextArea, OTPInput, PhoneNumberInput (through TextInput),
InputGroup, RadioGroup, SegmentedControl (through RadioGroup) and CardGroup;
Checkbox's title
is its label, and it draws FieldHint. Every field registers through one
field shell (`createFieldShell`, `runes/form/field.svelte.ts`). An
autofocused field's first blur counts as a visit, as in React (cx used to
skip it). The per-field label and hint strings
(`FIELD_LABEL`, `FIELD_HINT`, `FIELD_HINT_TONE`, `INPUT_LABEL`) are gone,
and so are the roots' `gap`s: the label and the hint carry their own.

### cx-only: `Form` (the app's)

**Moved** out of the library: the library keeps the seam its fields and
buttons use, `adapters.form` (`FormAdapter`); an app's Form passes one on a
BladeProvider around its fields. The form owns validation, when an error
shows (`errorOf`), submission and revealing the first invalid field; Blade
only displays and asks. A field's record carries `element()` (its element
once mounted; a form wanting document order sorts by
`compareDocumentPosition`) and `reveal()` (focus without scrolling, then
`scrollIntoView({ block: 'center' })`, smooth unless the user prefers
reduced motion; an OTP focuses its first empty cell, a CardGroup the
control in its row, a PhoneNumberInput its number). There is no
`FormAdapter.reorder` and no element handle type.

**Changed** from React, which has no form registration (fields take a
native `name`; `type="submit"` submits natively). Inside an app's form:

- fields register with it and show its error for them in place of
  `errorText` while it shows (an explicit `validationState` wins);
- a `type="submit"` Button cancels the native submit and calls
  `form.submit()`, showing busy while it runs, and shakes on a failure;
- a `validateForm` Button validates the form before its `onClick`;
- fields report their first touch through `adapters.track`
  (`field_change`, with `{ name }` only).

There is no `Form` component: the app's (checkout's) form implements
`FormAdapter`. Recommendation: **keep** the seam. It is not pending on
anything React has.

### Status

Audited, built and verified: `svelte-check` gives 0 errors; `test`
passes (`test/field.test.ts` is new); ChipGroup's and TextInput's labels
measure the same as React's.

Found on the way: the token contract's import stripper deleted every
`export const … ;` up to its first `;`, so exported style maps went
unchecked. Fixed; it caught Menu's `pe-2` (not a class here; now `pr-2`).

### Figma alignment (Blade DSL)

- The required `*` is semibold and 2px after the label (Figma's \_FormGroup-Header); the character count is 11/16 at every size, including large.
- Figma's label → field gap is 3px at small (cx 4px), and its large help text is 14/16. Not changed yet.

---

## Icons

React's icons are components (`<ArrowRightIcon color size />`) that resolve a
colour token in JS and write it onto each path. cx's are **SVG imports** of
the same names, from `@razorpay/blade-svelte/icons`. Without a font plugin, each
is its SVG's URL, drawn as a mask over the text colour. With `bladePlugin`
(Vite or webpack) each is a glyph (`{ name: 'arrow-right', code: '\uE01A' }`) of
the app's `blade-icons` font. Either way the colour is the text colour and the
size is the box, so a theme switch costs no JS.

| React                                             | cx                                                                                             | Action                                                                    |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| ~452 `*Icon` components                           | 450 SVG exports in `@razorpay/blade-svelte/icons`, same names                                  | **changed** from components to data; `Icon source={…}` draws one          |
| `color` (`surface.icon.gray.normal`…) on the icon | `color` axis on `Icon` (`default`, `subtle`, `muted`, `primary`, …), or the host's text colour | **changed**: a host tints it, as everywhere in cx                         |
| `size` `xsmall`…`2xlarge`                         | `size` `2xsmall`…`xlarge` (6–24px)                                                             | same scale, less 32px                                                     |
| `BluetoothIcon`, `ScissorsIcon`                   | —                                                                                              | **missing**: stroke-drawn, a font only fills; outline them in Blade first |
| multicolour marks (`RazorpayTrustIcon`…)          | an image (`<img>`)                                                                             | **moved**: icons are single-colour                                        |

### The font

The package ships no font:

- each glyph as a `currentColor` SVG;
- a codepoint lockfile (`src/icons/codepoints.json`, U+E000–U+EFFF);
- a barrel re-exporting the files.

`bladePlugin` (`@razorpay/blade-svelte/configs/vite` or `/configs/webpack`) works like this:

- **Imports:** named imports of the barrel are rewritten to the icons' own files, so one icon loads one module. A namespace or dynamic import takes the whole set.
- **Glyph modules:** it answers SVG requests from Blade's set and from the app's `extra` folders with a glyph module. App icons get codes from U+F000 up, by sorted file name.
- **The font:** it builds one font of the glyph modules the build loaded, deterministically, cached by its inputs.
- **Registration:** each glyph module imports a face module that registers the font with `new FontFace`, so there's no `@font-face` CSS.

How each bundler produces it:

- **Vite build:** the font is emitted empty and filled at `buildEnd`, so its hashed name is part of the JS hash.
- **Webpack:** at `finishModules`, it builds the font, rebuilds the face module to point at the emitted file, and emits it.
- **Dev:** the font is rebuilt as new icons load, and swapped in by HMR.

The rewrite runs on compiled JS, matching import statements by pattern:

- a string literal that contains a barrel import would be rewritten too, which is very unlikely in app code;
- an app whose loaders turn imports into CommonJS `require` gets no rewrite, so the barrel brings the whole set.

The predefined set is regenerated from Blade React by `node scripts/icon-svgs/extract-blade.mjs`. Codepoints never move: new glyphs append, and removed glyphs retire their code.

### cx names that changed

The old hand-drawn set mapped onto Blade's:

| Old        | Blade                |
| ---------- | -------------------- |
| `warning`  | `AlertTriangleIcon`  |
| `card`     | `CreditCardIcon`     |
| `more`     | `MoreHorizontalIcon` |
| `external` | `ExternalLinkIcon`   |

The rest map directly, e.g. `chevronDown` → `ChevronDownIcon`. Switch's thumb check is not a glyph: it's drawn inline, so the Switch needs nothing enabled.

### Risks

- **A consumer's native renderer** (Blade is web only): it needs to load the font (`formats: ['ttf']`) and honour `font-family`. Not verified; the image-based native Icon is gone.
- **Loading:** glyphs are blank until the font loads (`font-display: block`). The box is sized, so nothing shifts; preload the woff2 on critical screens.
- **User font overrides** (Firefox's "allow pages to choose their own fonts" off, dyslexia extensions) show boxes. A known icon-font limitation; accepted.
- **CSP:** with the plugin, `font-src` must allow the asset's origin, and no inline styles are needed. Without it, each icon's mask URL is an inline `style`.
- **Loading order:** the face is registered when the token module runs, not from CSS, so the woff2 starts loading with the JS. Preload it on critical screens if the blank moment shows.
- **Text content:** a glyph is a private-use character, so it's in `textContent`. It's `aria-hidden` and `select-none`, so assistive tech and copying skip it.

## Input / TextInput

React: `TextInput` (over `BaseInput`). cx: `TextInput` (`components/text-input/`).

### Props

| React                                                                         | cx                                                                                                                                                  | Action                                                                                                                                                                                                                                                                           |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `size: xsmall \| small \| medium \| large`                                    | `size`                                                                                                                                              | **added**                                                                                                                                                                                                                                                                        |
| `textAlign`                                                                   | `textAlign`                                                                                                                                         | **added**                                                                                                                                                                                                                                                                        |
| `labelSuffix`, `labelTrailing`                                                | —                                                                                                                                                   | not ported (rule 9)                                                                                                                                                                                                                                                              |
| `necessityIndicator`                                                          | same                                                                                                                                                | **added**; `required` also makes the control required, as in React                                                                                                                                                                                                               |
| `showClearButton`, `onClearButtonClick`                                       | same                                                                                                                                                | **added**: IconButton's medium look, while there is text; clears (`onChange` fires) and refocuses                                                                                                                                                                                |
| `maxCharacters`                                                               | same                                                                                                                                                | now also shows FieldCounter                                                                                                                                                                                                                                                      |
| `type: text \| telephone \| email \| url \| number \| search`                 | `type: text \| tel \| email \| url \| number`                                                                                                       | rule 10: the HTML types, with Blade's per-type defaults; `number` renders as `text`. `search` is SearchInput's (below)                                                                                                                                                           |
| `onChange({ name, value })`                                                   | same, plus `rawValue` with `format`                                                                                                                 | rule 12; with `format`, `value` is the formatted text and `rawValue` the typed characters, as React                                                                                                                                                                              |
| `keyboardReturnKeyType`, `autoCapitalize`, `autoCompleteSuggestionType`       | `enterKeyHint`, `autoCapitalize`, `autoComplete`                                                                                                    | rule 10; **added**                                                                                                                                                                                                                                                               |
| —                                                                             | `inputMode`                                                                                                                                         | rule 10; **added**: e.g. `numeric` digits in a `text` card-number field                                                                                                                                                                                                          |
| `onClick`, `onKeyDown`                                                        | same                                                                                                                                                | **added**                                                                                                                                                                                                                                                                        |
| `prefix`, `suffix`, `leading`, `trailing` (an icon or an element)             | same: `leading` (an icon, drawn before `prefix`, or a selector snippet after it), `prefix`, `suffix`, `trailing` (an icon, or a link snippet, last) | same names (rule 14); one side takes an icon or a snippet, not both. Blade DSL's TextInput (Figma) has distinct slots, each with its own inset (text, glyphs and words 8/12px from the edge, a selector 4px) and gap; see the text-input README. Strings go to `prefix`/`suffix` |
| `leadingIcon`, `icon` (deprecated), `trailingIcon`, `trailingButton` (a Link) | `leading`, `trailing`                                                                                                                               | folded in (rule 14): an icon or a snippet per side                                                                                                                                                                                                                               |
| `format` (a `#` mask)                                                         | same                                                                                                                                                | same: `#` takes one typed character, anything else is a delimiter the field places, React's caret rules included; it caps the length and hides the counter. The rule-list form is removed                                                                                        |
| —                                                                             | `transform` (`{ parse, format }`)                                                                                                                   | cx-only: a stored value that differs from the text shown (PhoneNumberInput's `+919876543210`), which a mask cannot say; ignored with `format`                                                                                                                                    |
| `isLoading`                                                                   | —                                                                                                                                                   | **gap**: no spinner in cx yet                                                                                                                                                                                                                                                    |
| `validationTextPlacement`, `showHelpTextOnFocus`                              | —                                                                                                                                                   | **gap**                                                                                                                                                                                                                                                                          |
| tags (`isTaggedInput`, `tags`, …), dropdown slots                             | —                                                                                                                                                   | **gap**                                                                                                                                                                                                                                                                          |
| `onSubmit`                                                                    | —                                                                                                                                                   | not ported: Enter submits the enclosing `<form>`, natively                                                                                                                                                                                                                       |
| `labelPosition`                                                               | —                                                                                                                                                   | rule 7                                                                                                                                                                                                                                                                           |
| `defaultValue`                                                                | `bind:value`                                                                                                                                        | rule 3                                                                                                                                                                                                                                                                           |

### Look

Measured against React Storybook (Text Input, per size, and its focus,
hover, error and disabled states, desktop width):

- **Sizes:** 28/32/36/48px tall, 8/8/12/12px side padding, body text
  10/12/14/16px (letter-spacing -1.3%, -3.3% at large), radius 8px (12px
  at large). The label and hint take the field's size.
- **Text:** now flush with the padding (the browser's 2px input padding is
  gone) and letter-spaced; the input does not inherit letter-spacing, so
  the control carries the type itself.
- **Focus:** Blade's 4px `surface.border.primary.muted` outline, 1px off
  the box (was a 4px box-shadow flush with it), over the 1.5px primary
  border.
- **Affixes:** the side padding in (8px up to small, 12px above), 8px to the
  text — as React's leading icon.
- **Border:** a 1px border inside the box where React draws a 1px ring
  outside it: the same line, 1px further in.

### cx-only features — decision pending

| Feature                       | What it does                                                     | Recommendation                           |
| ----------------------------- | ---------------------------------------------------------------- | ---------------------------------------- |
| `type="password"`             | the bare masked control PasswordInput builds on                  | keep (infrastructure); use PasswordInput |
| `role`                        | `searchbox` on the control                                       | keep (SearchInput's)                     |
| `isReadOnly`                  | read-only control                                                | keep                                     |
| `span`, `attach`              | InputGroup cell; PhoneNumberInput's handle                       | keep (infrastructure)                    |
| `pattern`                     | the control's validity pattern (PhoneNumberInput's, per country) | keep (infrastructure)                    |
| 16px text below `m` at medium | stops iOS zooming into the field                                 | keep                                     |

### Figma alignment (Blade DSL)

- `size`: small, medium, large: **removed** `xsmall` (not in Blade DSL's TextInput, Figma).
- Medium keeps 16px text on phones (iOS zoom) where Figma draws 14px. A selector passed in `trailing` sits 8px further in than Figma's trailing selector, since that slot takes the link inset.

---

## Input / TextArea

React: `TextArea`. cx: `TextArea` (`components/text-area/`).

| React                                   | cx     | Action                                                                  |
| --------------------------------------- | ------ | ----------------------------------------------------------------------- |
| `size`                                  | `size` | **added** (TextInput's sizes)                                           |
| `labelSuffix`, `labelTrailing`          | —      | not ported (rule 9)                                                     |
| `necessityIndicator`                    | same   | **added**                                                               |
| `showClearButton`, `onClearButtonClick` | same   | **added**: pinned 8px down and 12px in, the text keeps 36px clear of it |
| `maxCharacters`                         | same   | now also shows FieldCounter                                             |
| `onKeyDown`                             | same   | **added**                                                               |
| `numberOfLines` (default 2)             | same   | same                                                                    |
| —                                       | `span` | cx-only: a member of an InputGroup, as TextInput                        |
| tags, `showHelpTextOnFocus`             | —      | **gap**                                                                 |

Measured against React (Text Area): 2 lines are 56px of content plus the
border, 8/12px padding, the counter 2px from the end. cx-only: `isReadOnly`
(keep).

### Figma alignment (Blade DSL)

- `size`: medium, large (Figma). Large padding is 8px above and below and 12px at the sides (was 12px all round).

---

## Input / OTPInput

React: `OTPInput`. cx: `OTPInput` (`components/otp-input/`).

| React                                                       | cx                                       | Action                                  |
| ----------------------------------------------------------- | ---------------------------------------- | --------------------------------------- |
| `otpLength: 4 \| 6 \| 8`                                    | `otpLength: number`                      | superset                                |
| `onOTPFilled({ name, value })`, `onChange({ name, value })` | `({ name, value, method })`              | rule 12; **added** `method`             |
| `autoCompleteSuggestionType: none \| oneTimeCode`           | `autoComplete` (default `one-time-code`) | rule 10                                 |
| `keyboardType` (default `decimal`)                          | `inputMode` (default `numeric`)          | rule 10                                 |
| `keyboardReturnKeyType`                                     | `enterKeyHint`                           | rule 10; **added**                      |
| `placeholder` (one character per cell)                      | same                                     | **added**                               |
| `onFocus`, `onBlur` (with the cell's index)                 | `(event, index)`                         | **added**                               |
| `labelSuffix`, `labelTrailing`                              | —                                        | not ported (rule 9)                     |
| `size`                                                      | same                                     | same; the label and hint take it        |

**Look:** each cell takes Blade's natural input width, 88px, and shrinks in
a narrower box; the row is as wide as its cells (was: cells shared the full
width). Cell type 20/26 (24/32 at large), 36/48px tall, 8px apart.

**cx addition, `method`:** `onChange` and `onOTPFilled` add `method` to
React's `{ name, value }` (`OTPInputChange`): `typed` (a keystroke or
delete in a cell), `paste`, `autofill` (the platform's multi-character
commit), `adapter` (`adapters.readOTP`), and on `onOTPFilled` only `value`
(the owner's write completed the code). React's payload says nothing of
how the code arrived; checkout auto-submits an auto-read code and reports
the fill method.

**cx-only, pending:** `onClick`, `accept` (per-character filter),
`isRequired`, `isReadOnly`, `cellAccessibilityLabel` — keep all: checkout's
auto-read and i18n use them.

### Figma alignment (Blade DSL)

- Matches Figma (36/48px cells, 20/26 and 24/32 type, 8px gap); no change.

---

## Input / PhoneNumberInput

React: `PhoneNumberInput` (a Dropdown country selector). cx:
`PhoneNumberInput` (a TextInput, and a country dropdown under the field, or
the app's presenter's, `adapters.presentDropdown`).

| React                                                              | cx                                                                  | Action                                                                                            |
| ------------------------------------------------------------------ | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `size`                                                             | same                                                                | **added**                                                                                         |
| `showCountrySelector`                                              | same                                                                | **added**                                                                                         |
| `onFocus`, `onBlur`, `onClick`                                     | same                                                                | **added** (through TextInput)                                                                     |
| `keyboardReturnKeyType`, `autoCompleteSuggestionType`              | `enterKeyHint`, `autoComplete` (default `tel`)                      | rule 10; **added**                                                                                |
| clear button, `onClearButtonClick`                                 | same                                                                | **added**: always on while there is a number, as React                                            |
| `labelSuffix`, `labelTrailing`                                     | —                                                                   | not ported (rule 9)                                                                               |
| `leadingIcon`, `trailingIcon`                                      | `leading`, `trailing` (each an icon or a snippet)                   | rule 14: `leading` after the country button, before the dial code; `trailing` last                |
| `defaultCountry`, `defaultValue`                                   | `bind:country`, `bind:value`                                        | rule 3                                                                                            |
| `showDialCode`                                                     | same                                                                | same                                                                                              |
| `onChange` payload `{phoneNumber, dialCode, country, value, name}` | `PhoneNumberChange`: `{ country, dialCode, nationalNumber, value }` | **different**: no `name` (rule 12 not met) and no formatted `phoneNumber`; `nationalNumber` added |
| `onCountryChange({ country })`                                     | same                                                                | rule 12; the pick also reaches the app's form                                                     |
| `placeholder`                                                      | same                                                                | same: unset, an example number for the country, as React                                          |

**Look:** the country button is React's: 56×28, 4px in, 6px round, a 20px
flag and a 16px chevron 4px apart, the gray faded fill on hover, the focus
outline flush; the dial code 12px on. It used to show the browser's grey
button background.

**The picker is React's Dropdown:** a panel under the field, hanging from
its frame (React's `DropdownOverlay referenceRef={inputWrapperRef}`), as
wide as it, with a list in ActionList's look (`actionListClasses()`) over
the countries, `ActionListItem` rows (the flag leading, the dial code
trailing) and `onPick` closing it (the country already picked too). No
search, as React. The list is virtualized (`isVirtualized` over the
countries as `items`), so it mounts only the rows in view. React
switches to a BottomSheet on mobile; cx leaves that to the app:
`adapters.presentDropdown('dial-code', request)` gets an
`ActionListRequest` (ActionList's `items`, `value`, `itemKey`, `itemText`
and `label`, as data) and a `cancelled` promise, with no element, so it can
cross a bridge to a native host; a presenter that returns a promise of the pick shows the list its own way (a
sheet, a modal, the exported `PhoneCountryList` under its own search). `countries` (optional: i18nify's by
default), `isCountryFixed`, `countryLabel`, `closeLabel` (for a presenter's
close button) — keep. The list's gutter is the overlay's: every overlay's
panel sets `--overlay-gutter` (20px on a modal or a drawer, 16px on a
sheet, a popover or a menu; unset outside an overlay, 0px in the field's
own dropdown), and the rows pad by it (ActionList `inset="overlay"`), so
it follows a layout switch. A presenter's own search beside the list
takes `px-[var(--overlay-gutter,0px)]`. (`resolvePhoneCountryInset` is
removed.) `searchLabel` and `emptyText` are removed. The
countries carry no national-number patterns: `defaultPhoneCountries()`
(exported) is the default list, for an app that adds its own.

### Figma alignment (Blade DSL)

- `size`: medium, large (Figma). The selector follows Figma's \_Input / Selector (28/36px tall, 6.5/9px in, a 20×15 or 24×18 flag, 12px chevron) on the field's padding; the dial code is 4px after it.
- `leading` and `trailing` each take an icon or a snippet (rule 14; were `leadingIcon`, and `trailingIcon` beside a snippet-only `trailing`).

---

## Input / PasswordInput

React: `PasswordInput` (over `BaseInput`). cx: `PasswordInput`
(`components/password-input/`), a TextInput with its reveal state in
`runes/text-input/reveal.svelte.ts`.

| React                                                                                                                                                                                                                      | cx                                                      | Action                                                                                                                                        |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `showRevealButton` (default true)                                                                                                                                                                                          | same                                                    | **new**: Blade's medium IconButton (eye / eye-off), "Show password" / "Hide password"; none while disabled, and a disabled field stays masked |
| `necessityIndicator: required \| none`                                                                                                                                                                                     | same                                                    | same (never `optional`)                                                                                                                       |
| `autoCompleteSuggestionType: none \| password \| newPassword`                                                                                                                                                              | `autoComplete: off \| current-password \| new-password` | rule 10                                                                                                                                       |
| `keyboardReturnKeyType`                                                                                                                                                                                                    | `enterKeyHint`                                          | rule 10                                                                                                                                       |
| autocapitalize off                                                                                                                                                                                                         | `autoCapitalize="none"`                                 | same                                                                                                                                          |
| `label`, `accessibilityLabel`, `labelSuffix`/`labelTrailing`, `helpText`, `errorText`, `successText`, `validationState`, `maxCharacters`, `isDisabled`, `isRequired`, `placeholder`, `name`, `autoFocus`, `size`, `testID` | same, except `labelSuffix`/`labelTrailing`              | rule 9: those two are not ported                                                                                                              |
| `value`, `defaultValue`, `onChange({ name, value })`                                                                                                                                                                       | `bind:value`, same                                      | rules 3 and 12                                                                                                                                |
| `showHelpTextOnFocus`, `labelPosition`                                                                                                                                                                                     | —                                                       | gap; rule 7                                                                                                                                   |
| —                                                                                                                                                                                                                          | `span`, `attach`                                        | cx-only: an InputGroup cell (a CVV), a composition's handle                                                                                   |

The look is TextInput's, and the button is the clear button's. Replaces
TextInput `type="password"` at call sites (the InputGroup stories' CVV).

### Figma alignment (Blade DSL)

- `size`: medium, large (Figma). **Added** `leading` (TextInput's: an icon or a selector snippet; was `leadingIcon`), `prefix`, `suffix` and `trailing` (a snippet, the link, 8px before the reveal button); the reveal glyph is 16/20px.

---

## Input / SearchInput

React: `SearchInput` (over `BaseInput`). cx: `SearchInput`
(`components/search-input/`), a TextInput.

| React                                                                                                                                                                                          | cx                                          | Action                                                                                                                               |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| searchbox, search key                                                                                                                                                                          | same                                        | a `type="text"` control with `role="searchbox"` and `enterkeyhint="search"`, as Blade (a `search` input draws a second clear button) |
| `showSearchIcon` (default true)                                                                                                                                                                | same                                        | **new**: the search glyph leads                                                                                                      |
| clear button while it holds text, `onClearButtonClick`                                                                                                                                         | same                                        | always on, as Blade: clears (`onChange` fires) and refocuses                                                                         |
| `trailing`                                                                                                                                                                                     | same (`IconSource \| Snippet`, TextInput's) | after the clear button; Blade's trailing Dropdown is a **gap**                                                                       |
| `isLoading`                                                                                                                                                                                    | —                                           | **gap**: no Spinner in cx yet                                                                                                        |
| `label`, `accessibilityLabel`, `labelSuffix`/`labelTrailing`, `helpText`, `placeholder`, `name`, `isDisabled`, `autoFocus`, `autoCapitalize`, `onClick`, `onFocus`, `onBlur`, `size`, `testID` | same, except `labelSuffix`/`labelTrailing`  | rule 9: those two are not ported                                                                                                     |
| `value`, `defaultValue`, `onChange({ name, value })`                                                                                                                                           | `bind:value`, same                          | rules 3 and 12                                                                                                                       |
| Dropdown trigger (SearchInput inside a Dropdown)                                                                                                                                               | —                                           | not ported (no Dropdown)                                                                                                             |
| `onSubmit`                                                                                                                                                                                     | —                                           | not ported: Enter submits the enclosing `<form>`, natively                                                                           |
| —                                                                                                                                                                                              | `onKeyDown`                                 | cx-only, pending: keep                                                                                                               |
| `showHelpTextOnFocus`, `labelPosition`                                                                                                                                                         | —                                           | gap; rule 7                                                                                                                          |

Was TextInput `type="search"`, which is gone: the glyph, role and key moved
here.

### Figma alignment (Blade DSL)

- `size`: medium, large (Figma). The glyph is passed as TextInput's `leading` (an icon), so it is sized per field, 12px in and 8px from the text.

---

## InputGroup

React: `InputGroup` with `InputRow`s (`gridTemplateColumns`). cx:
`InputGroup`, whose members take a `span` (`full`, `1/2`, `1/3`, …) on a
12-column grid.

| React                                                                            | cx            | Action                                                                            |
| -------------------------------------------------------------------------------- | ------------- | --------------------------------------------------------------------------------- |
| `size`                                                                           | same          | **added**: members take it, as in React, and the corners round at 12px when large |
| `InputRow`                                                                       | member `span` | different composition; keep (spans cover every React layout seen)                 |
| `label`, `helpText`, `errorText`, `successText`, `validationState`, `isDisabled` | same          | same                                                                              |

**Look:** stacked rows share 1px seams, the group's corners are rounded, the
hint sits 4px under — as React's Default story.

### Figma alignment (Blade DSL)

- `size`: medium, large (Figma).

## **Error, as React:** the group's error doesn't turn the members' frames red. React's InputGroup uses `validationState` only for its hint line; cx's hint line turns negative and carries it, and the members stay `aria-invalid`. (cx used to draw the thick negative border on every member.)

## ProgressBar

React: `ProgressBar`. cx: `ProgressBar` (`components/progress-bar/`). It
replaces cx's `Progress` (dots, bar, ring), which is removed: its dots are
DotLoader now, and its bar and ring are this component.

### Props

| React                                                       | cx                      | Action                                                                         |
| ----------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------ |
| `variant: linear \| circular`                               | same (default `linear`) | same                                                                           |
| `variant: progress \| meter` (the older spelling of `type`) | `type`                  | **removed**: pass `type` with `variant="linear"`                               |
| `type: progress \| meter` (default progress)                | same                    | same: `role="progressbar"` or `role="meter"`, React's `aria-value*`            |
| `size: small \| medium \| large` (default small)            | same                    | same; `large` is typed out for linear, where React throws in dev               |
| `color: FeedbackColors`                                     | same                    | same; unset, the primary surface's intense fill                                |
| `value`, `min`, `max`, `label`, `accessibilityLabel`        | same                    | same                                                                           |
| `isIndeterminate`                                           | same                    | same; typed out for a meter, and a ring ignores it (React throws in dev)       |
| `showPercentage` (default true)                             | same                    | same. A circular meter hides it, as the prop's doc says; React's ring shows it |
| `_oscillation` (private)                                    | —                       | not ported                                                                     |
| `testID`, analytics attributes                              | same                    | same                                                                           |
| styled props                                                | `class`                 | rule 1                                                                         |

### Look

- **Linear:** a 2/4px track in feedback neutral-subtle with 2px corners. The
  label and the percentage sit above it, in body small subtle, with the
  percentage 4px above the track. The fill eases its width over 2xgentle
  (emphasized). On a `progress` bar a white sheen pulses over the fill (to
  25% and back, from a 2s delay). When indeterminate, a 5% fill slides
  across, stretching mid-way.
- **Circular:** 24/48/72px with a 3/5/7px stroke, starting at 12 o'clock.
  The percentage is semibold, inside the ring above small and below a small
  ring. The label sits 8px under. The arc dims to 65% and back until it is
  full.
- Under reduced motion the fill jumps to its value and nothing pulses or
  slides.

### Status

New; `svelte-check` gives 0 errors; `test` passes.

## Radio, RadioGroup

React: `RadioGroup`, `Radio`. cx: same (`components/radio/`).

| React                                  | cx   | Action                                                                       |
| -------------------------------------- | ---- | ---------------------------------------------------------------------------- |
| `RadioGroup.onChange({ name, value })` | same | rule 12                                                                      |
| `RadioGroup.size`                      | same | **added**: circles 12/16/20px, dots 4/6/8px, title 12/14/16px, gaps 4/8/12px |
| `RadioGroup.orientation`               | same | same; horizontal rows wrap (React: `flexWrap`, default `nowrap`)             |
| `Radio.helpText`                       | same | **added**: indented under the title, describes the radio                     |
| `Radio.trailing`                       | —    | **removed**: cx-only, and Blade DSL's Radio (Figma) has no trailing slot     |
| `Radio.size`                           | —    | the group's size wins in React; not ported                                   |
| `labelPosition`                        | —    | rule 7                                                                       |

**Look:** measured against React's RadioGroup (Help Text, all sizes): 2px
above and below each radio, the circle 2px in, the title 4px past it and
letter-spaced; focus is Blade's 4px outline (was a box-shadow).

**Accessibility:** a Radio or Checkbox with `helpText` is named by its
title alone and described by the help text. Both sit in one `<label>`, so
without this the help text joined the name, as it does in React.

### Figma alignment (Blade DSL)

- At small the circle sits 3px from the top (2px otherwise), as Figma's container.
- `Radio.trailing` **removed**: it was cx-only, and Figma's Radio has no trailing slot.

---

## Link

React: `Link` (over `BaseLink`). cx: `Link` (`components/link/`). Its
anchor behaviour is `createLink` (`runes/link/link.ts`), which every `href`
renderer shares: a link Button, Card, Avatar, BreadcrumbItem, a CardGroup or
ActionList link row and a link tab route plain internal clicks through
`adapters.navigate` and take the same `rel` as Link.

### Props

| React                                                                                 | cx                               | Action                                                                                  |
| ------------------------------------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------- |
| `variant: anchor \| button`                                                           | same                             | same                                                                                    |
| `color: primary \| white \| positive \| negative \| notice \| information \| neutral` | same                             | `white`, `notice`, `information` **added**                                              |
| `size: xsmall \| small \| medium \| large`                                            | same                             | same                                                                                    |
| `icon`, `iconPosition: left \| right`                                                 | `icon` (leading), `trailingIcon` | **changed**: Blade DSL's Link (Figma) has leading and trailing icons that may both show |
| `children` (optional with an icon)                                                    | same                             | now optional: an icon-only link, named by `accessibilityLabel`                          |
| `htmlTitle`                                                                           | same                             | **added** (`title`)                                                                     |
| `href`, `target`, `rel`                                                               | same                             | same; `_blank` adds `noopener noreferrer`                                               |
| `isDisabled` (button only)                                                            | on both                          | cx-only on the anchor, pending (below)                                                  |
| `onClick`                                                                             | same                             | same; then `adapters.navigate` may take a plain internal click (rule 15)                |
| `testID`, `data-analytics-*`                                                          | same                             | same                                                                                    |
| `accessibilityProps`, `hitSlop`, `opacity`, pointer events                            | —                                | not ported (`accessibilityLabel` covers naming)                                         |

### Look

Measured against React Storybook (Default, Link Button, Icon Right Link
Button, Disabled Link Button, Link Sizes; hover and keyboard focus):

- **Underline:** off at rest (the browser's `<a>` underline was never
  reset), on hover and focus, at the browser's offset (was 2px); the
  button form never underlines (it did on hover).
- **Type:** medium weight, 10/13, 12/17, 14/20, 16/24 by size (xsmall and
  small had a 16px line).
- **Focus ring:** 4px `interactive.border.primary.faded`, 1px out, round at
  4px (was 2px).
- **Icon:** 12px up to small, 16px above, 4px from the text.
- **Colour** moves at 2xquick/standard.
- **Display:** the anchor stays `inline`, so a long link wraps with its
  sentence; React's is `inline-block` and cannot. One line reads the same.

### cx-only features — decision pending

| Feature                   | What it does                               | Recommendation |
| ------------------------- | ------------------------------------------ | -------------- |
| `isDisabled` on an anchor | drops the `href`, marks it `aria-disabled` | keep           |
| `download`                | saves instead of navigating                | keep           |

### Figma alignment (Blade DSL)

- `color`: primary, white, neutral, positive, negative: **removed** `notice`, `information` (not in Figma).
- Letter-spaced −1.3% (−3.3% at large), per Figma.

---

## Modal

React: `Modal`, `ModalHeader`, `ModalBody`, `ModalFooter`. cx: `Modal`
(`components/modal/`), the centred dialog, over the internal
`OverlaySurface` it shares with BottomSheet and Drawer. It has **no `variant`**: a sheet,
a drawer, a popover and a menu are their own components (BottomSheet,
Drawer, Popover, Menu) over the same runes (`createOverlay`); an overlay
that picks one per screen is the app's own (see Overlays). The header, body and
footer are shared with BottomSheet; see its section for the header decisions
(rule 2).

### Props

| React                                                                     | cx                                                                                                                   | Action                                                                                                                                                       |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `isOpen`, `onDismiss()`                                                   | `bind:isOpen`, `onDismiss({ source, close })`                                                                        | **changed**, as BottomSheet: fires on every dismissal, dismissible or not; a dismissible modal then closes, otherwise `close` ends it                        |
| —                                                                         | `onOpenChange({ isOpen })`                                                                                           | **added** on Modal and Drawer, as Popover's: the opens and closes it makes, not the owner's `isOpen`                                                         |
| `isDismissible`                                                           | same                                                                                                                 | same                                                                                                                                                         |
| `size: small \| medium \| large \| full` (default `small`)                | same                                                                                                                 | **changed** from `default \| full`: Blade's 400, 760 and 1024px columns                                                                                      |
| `accessibilityLabel`                                                      | same                                                                                                                 | same                                                                                                                                                         |
| `initialFocusRef`                                                         | same                                                                                                                 | same, as BottomSheet                                                                                                                                         |
| `zIndex`                                                                  | —                                                                                                                    | n/a: the overlay host stacks modals                                                                                                                          |
| `ModalHeader` (`title`, `subtitle`, `leading`, `trailing`, `titleSuffix`) | `ModalHeader` (`title: string \| Snippet`, `subtitle`, `leading?: IconSource \| Snippet`, `titleSuffix`, `trailing`) | same component (`components/modal-children/`); `leading` per rule 14; no back button, as React. Its classes are `resolveModalHeader()`                       |
| —                                                                         | `chrome` snippet                                                                                                     | cx-only: a zero-height box on the panel's top edge, unclipped, holding the close button and a sheet's handle; the caller adds things that hang off the panel |
| `ModalBody` (`padding` spacing.6 \| spacing.0)                            | `ModalBody` (`padding`)                                                                                              | same; `height` is `class` (rule 1). Classes: `resolveModalBody({ padding })`                                                                                 |
| `ModalFooter`                                                             | `ModalFooter`                                                                                                        | same; a padded box, the caller lays out the actions. Classes: `resolveModalFooter()`                                                                         |
| `data-analytics-*`                                                        | same                                                                                                                 | same                                                                                                                                                         |

### Look

Measured against React Storybook (Simple Modal, every size, 1200×800):

- **Panel:** 16px radius (was 8px), `popup` fill, Blade's shadow; 400,
  760 or 1024px wide on desktop (`d`), and at most 80% of the host's height when
  centred. `full` fills the host 8px in, at full height.
- **Header:** 20px in (16px below `m`), the title 16/24 semibold −3.3%,
  the close button 20px, centred on the title's first line, a hairline
  under it — unchanged, already React's.
- **Body:** 20px all round.
- **Footer:** 16px, 20px on desktop (`d`), under a hairline — a plain box, as
  Blade's BaseFooter: the caller lays out its buttons (the story right-aligns
  them 12px apart). It was a `flex gap-4` row with 16px above; BottomSheet's
  footer changed with it.
- **Scrim:** `overlay.background.subtle`, the overlay host's.
- Not ported: React's 320px minimum width (a checkout frame can be narrower).

### cx-only features — decision pending

| Feature                          | What it does                                | Recommendation          |
| -------------------------------- | ------------------------------------------- | ----------------------- |
| `pace`                           | v2's quicker easing                         | decide (as BottomSheet) |
| `onClosed`, `role`, `closeLabel` | as BottomSheet                              | keep                    |

### Status

Audited, fixed, and verified: `svelte-check` gives 0 errors; `test`
passes; the measurements match React Storybook at every size.

### Figma alignment (Blade DSL)

- **Title:** Heading/SmallSemibold 18/24 (Figma); React uses body 16/24.
- **Added** `leading` (`IconSource | Snippet`, rule 14), `titleSuffix` and `trailing({ close })` in the header, per Figma's \_Modal Header: the leading item 8px from the title, the trailing item 16px from the title and from the close button. Why they are props: see the modal README.
- **Sections:** header 20px above and beside, 16px below, at every width (Figma's \_Modal Header; was 16px below `m`); the close a 20px glyph in Figma's 28px box, 24px from the top and the end, the title row leaving 44px for it; a `leading` snippet in Figma's 32px slot, centred on the title block (an icon `leading` stays on the title line, a 20px glyph). Footer 16px above the actions (20px beside and below on desktop (`d`)).
- **Drawer:** 380px on desktop (`d`) and 100% − 24px on phones (Figma; React 375/420px); header 20px in with no divider; **added** `titleSuffix`, `trailing`; Figma's detail block under the title is **missing**.
- **Missing**: Figma's full-width square modal on phones, the `padding` variant (20/16/0), and the full-page modal.

---

## Popover

React: `Popover` (with `PopoverInteractiveWrapper` for a non-button trigger).
cx: `Popover` (`components/popover/`) over the overlay runes, whose
floating panel (`FloatingPanel`) Menu shares. Its content is
`OverlaySections`: the header, body and footer as props and snippets, as
Menu's. `children` is the trigger, as React's; `content` is raw content in
place of the sections; React's `content` is `body`, `titleLeading` is
`leading`.

### Props

| React                                | cx                                                                       | Action                                                                                                                                |
| ------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `children` (the trigger)             | `children` (receives `{ isOpen }`), in a wrapper that opens it on a click | same; the trigger wires nothing |
| `content`                            | `body: Snippet<[{ close }]>`, or raw `content`                           | **renamed**: the padded body, or content that owns its box; `padding: default \| none`                                                |
| `title`                              | `title: string \| Snippet`, `subtitle`                                   | **added**: the heading, and it names the dialog                                                                                       |
| `titleLeading`                       | `leading?: IconSource \| Snippet`, `titleSuffix`, `trailing`             | **renamed** (rule 14): an icon is a 20px glyph, a snippet an asset                                                                    |
| `footer`                             | snippet (receives `close`)                                               | **added**                                                                                                                             |
| `placement` (default `top`)          | same                                                                     | default **changed** from `bottom-start`                                                                                               |
| `openInteraction: click \| hover`    | —                                                                        | **not ported** by decision: click only. Hover has no touch counterpart and checkout is mobile first; Tooltip is the one hover overlay |
| close button (with `click`)          | same, `closeLabel` (default `Close`)                                     | **added**: beside the title, or floating in the corner without one                                                                    |
| `isOpen`, `onOpenChange({ isOpen })` | `bind:isOpen`, same                                                      | rule 12: fires on every open and close, whoever asked; dismissals also report `onDismiss`                                             |
| `defaultIsOpen`                      | `bind:isOpen`                                                            | rule 3                                                                                                                                |
| `maxWidth`                           | —                                                                        | rule 1 would put it on `class`, which lands on the trigger; not ported                                                                |
| `initialFocusRef`                    | same                                                                     | same; without it focus goes to the first control (the close button), as React                                                         |
| `zIndex`                             | —                                                                        | n/a: the overlay host stacks panels                                                                                                   |
| `data-analytics-*`                   | same                                                                     | same                                                                                                                                  |

### Look

Measured against React Storybook (Default, 1200×800):

- **Panel:** 16px round (was 8px), `popup.background.gray.moderate`, the
  popup shadow (a 1px rim drawn inside, was a border), the high blur; 328px
  at most (288px below `m`, was 320px everywhere).
- **Arrow:** **added**, 22×12 toward the trigger, clamped along the edge;
  the panel sits 16px off the trigger, the arrow's tip 4px. It has no rim
  (React's does): the rim would need a literal colour or a drop-shadow
  filter.
- **Content:** 16px in; the footer 16px under; the header 4px over the
  content — leading, title and close 8px apart; the title body large
  semibold (16/24 −3.3%) with 12px after it; the close button a 16px muted
  glyph (a medium IconButton).

### cx-only features — decision pending

| Feature                                            | What it does                 | Recommendation |
| -------------------------------------------------- | ---------------------------- | -------------- |
| `isDisabled`                                       | the trigger does not open it | keep           |
| `accessibilityLabel`                               | names an untitled panel      | keep           |
| `onDismiss`, `onClosed`, `isDismissible`, `chrome` | as Modal's                   | keep           |

`pace` is removed.

### Status

Audited, fixed, and verified: `svelte-check` gives 0 errors; `test`
passes; the panel, header, gap and arrow measure as React's.

### Figma alignment (Blade DSL)

- `titleLeading` takes an icon (`IconSource`, 20px) or a snippet (an asset), per Figma's \_Popover Title, whose leading item is an icon or an asset (was `titleIcon` beside a snippet-only `titleLeading`).
- Leading → title is 8px; title → close is 24px (the title's 12px plus the row's 12px), per Figma.

---

## SegmentedControl

React: `SegmentedControl`, `SegmentedControlItem`. cx: the same
(`components/segmented-control/`), the internal `BaseRadioGroup` in its
own look (RadioGroup's `look` prop is removed).

### Props

| React                                                                                                         | cx                                                                                                                                                                                                                              | Action                                                                      |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `size: small \| medium \| large`                                                                              | same                                                                                                                                                                                                                            | same                                                                        |
| `label`, `accessibilityLabel`, `helpText`, `errorText`, `validationState`, `isDisabled`, `isRequired`, `name` | same                                                                                                                                                                                                                            | same                                                                        |
| `necessityIndicator`                                                                                          | same                                                                                                                                                                                                                            | **added** (through RadioGroup)                                              |
| `value`, `defaultValue`, `onChange({ name, value })`                                                          | `bind:value`, same                                                                                                                                                                                                              | rule 3; rule 12                                                             |
| `labelPosition`                                                                                               | —                                                                                                                                                                                                                               | rule 7                                                                      |
| `SegmentedControlItem` `value`, `leading`, `isDisabled`, `accessibilityLabel`, `children`                     | same; `leading?: IconSource \| Snippet<[ControlState]>`: React's icon, or a snippet with an asset in the icon's box (rule 14); **added** `trailing` (a Counter or Badge), as Blade DSL's \_Segmented Control / Item (Figma) has | same; **added** the snippet form and `trailing`                             |
| —                                                                                                             | hints `string \| Snippet`; item snippets receive `{ isChecked, isDisabled }`                                                                                                                                                    | cx-only, across Chip, Radio, Checkbox, Switch and SegmentedControl (rule 9) |

### Look

Measured against React Storybook (Default, every size):

- **Track:** 28/36/48px tall, 2px in at small and 4px otherwise, 2px
  between segments, round at 8px (12px at large),
  `interactive.background.gray.faded`. Blade DSL (Figma) draws small 28px
  with 2px in; React's tokens give 32px with 4px, so cx follows Figma.
- **Segments:** 24/28/40px, round at 4px (8px at large); the label Body
  Medium at small and medium (14/20) and Body Large at large (16/24), per
  Figma (React sets small in 12/17), medium weight, letter-spaced.
- **Row:** the leading item, the label and the trailing item, 8px apart and
  centred. That one gap, owned by the segment, is why `leading` and
  `trailing` are props rather than children.
- **Icon:** 16px, 20px at large (was 16px everywhere), 8px from the label.
- **Thumb:** `surface.background.gray.intense`, round as the segment,
  sliding at moderate/standard (was quick); hover fills an unpicked segment
  with `interactive.background.gray.default` at gentle; focus is the inset
  4px `surface.border.primary.muted` ring.

### cx-only features — decision pending

| Feature                   | What it does                      | Recommendation |
| ------------------------- | --------------------------------- | -------------- |
| `color: neutral \| white` | the pill over a brand-colour pane | keep           |

### Status

Audited, fixed, and verified: `svelte-check` gives 0 errors; `test`
passes; every size measures as React's.

---

## Skeleton

React: `Skeleton`. cx: `Skeleton` (`components/skeleton/`).

| React                                                                      | cx      | Action |
| -------------------------------------------------------------------------- | ------- | ------ |
| `width`, `height`, min/max sizes, `borderRadius`, flex props, styled props | `class` | rule 1 |
| `testID`                                                                   | same    | same   |

**Look** (computed styles against React's Default story): the
`interactive.background.gray.default` fill, hidden from assistive tech.

- **Fade-in added:** the bone fades in over `2xgentle` (0.96s), then pulses
  to `gray.highlighted` and back (1.32s, alternating) from 0.96s on, both on
  the standard curve. cx only pulsed. The fade uses `both` fill, so with
  reduced motion (no animation) the bone still shows.
- **No default radius**, as React: it was 4px. The shape is the caller's
  `class`; the stories now pass `rounded-xsmall`.

No cx-only features. **Status:** done; `svelte-check` gives 0 errors and
`test` passes.

### Figma alignment (Blade DSL)

- Figma's Skeleton Loader has a 16px radius; cx leaves the radius to the caller's class.

---

## Switch

React: `Switch`. cx: `Switch` (`components/switch/`). Its colours, motion
and thumb check were ported from React earlier. The check is
`surface.icon.primary.normal`, where React's is `interactive.icon.primary.subtle`:
the same blue in the standard theme, but the latter is black in the neutral
theme cx's classes fall back to, so the check would not match the track.

| React                                                                    | cx                                                 | Action                                                      |
| ------------------------------------------------------------------------ | -------------------------------------------------- | ----------------------------------------------------------- |
| `isChecked`, `defaultChecked`, `onChange({ isChecked, value, event })`   | `bind:isChecked`, `onChange({ isChecked, value })` | rule 3; rule 12                                             |
| `size: small \| medium`                                                  | same                                               | same                                                        |
| `isDisabled`, `name`, `accessibilityLabel`, `testID`, `data-analytics-*` | same                                               | same                                                        |
| `value` (the submitted string)                                           | same                                               | same: what a native form submits while it is on             |
| —                                                                        | `parse`                                            | cx-only: `parse(isChecked)` is what the app's form collects |
| `id`                                                                     | —                                                  | not ported (the control's id is internal)                   |

**Look** — measured against React Storybook at 1200 and 390px, on and off:

- **Phone sizes added:** Blade's switch is bigger below `m` — track 36×20
  (small) and 44×24 (medium), thumb 16 and 20px, check 8 and 10px — and
  takes the desktop size (28×16 / 36×20, thumb 12 / 16px, check 6 / 8px)
  on desktop (`d`). cx had the desktop size everywhere. The press stretch follows
  the thumb (125%, growing from its centre).
- Track and thumb colours, the thumb's position when on, and the check's
  fade already matched.

**cx-only, pending:** `children` (a label beside the switch; Blade's Switch
takes only `accessibilityLabel`) — keep; `isLoading` (the thumb spins while
a change is in flight) — keep; `parse` — keep (form model).

**Status:** done; `svelte-check` gives 0 errors and `test` passes.

### Figma alignment (Blade DSL)

- Size: small 28×16 and medium 36×20 at every width, in a 2px margin, as Blade DSL's Switch (Figma). React's phone sizes (36×20 / 44×24) are not ported.

---

## Tabs

React: `Tabs`, `TabList`, `TabItem`, `TabPanel`. cx: `Tabs`, `TabItem`,
`TabPanel` (`components/tabs/`), on the choice list (`runes/tabs/`).

### Composition (decided)

cx's Tabs were data-driven (`items`, `itemKey`, `itemLabel` and a panel
snippet per item). Rule 4 makes them compose: TabItems register with Tabs
and are read in document order, and each TabPanel names its tab by `value`.
Blade's `TabList` is an intermediate container, so it becomes the `tabList`
snippet (rule 2); the panels are `children`.

```svelte
<Tabs bind:value>
  {#snippet tabList()}
    <TabItem value="upi">UPI</TabItem>
    <TabItem value="card" leading={CreditCardIcon}>Card</TabItem>
  {/snippet}
  <TabPanel value="upi">…</TabPanel>
  <TabPanel value="card">…</TabPanel>
</Tabs>
```

### Props

| React                                                                                 | cx                                                                                                                                                                                                                                                                                    | Action                                                                                  |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `variant: bordered \| borderless \| filled` (default `bordered`)                      | same                                                                                                                                                                                                                                                                                  | **added** (was `layout: auto \| fill`)                                                  |
| `size: small \| medium \| large`                                                      | same                                                                                                                                                                                                                                                                                  | `small` **added**                                                                       |
| `orientation: horizontal \| vertical`                                                 | same                                                                                                                                                                                                                                                                                  | **added**                                                                               |
| `isFullWidthTabItem`                                                                  | same                                                                                                                                                                                                                                                                                  | **added** (replaces `layout="fill"`)                                                    |
| `isLazy`                                                                              | same                                                                                                                                                                                                                                                                                  | **added**: panels mount only while picked; otherwise all stay mounted, hidden, as Blade |
| `value`, `defaultValue`, `onChange`                                                   | `bind:value`, `onChange`                                                                                                                                                                                                                                                              | rule 3; the first enabled tab is picked when unset, as Blade                            |
| `TabList`                                                                             | `tabList` snippet                                                                                                                                                                                                                                                                     | rule 2; same name                                                                       |
| `TabItem` `value`, `leading`, `trailing`, `isDisabled`, `href`, `onClick`, `children` | same; `leading?: IconSource \| Snippet<[TabItemState]>`: React's icon, or a snippet with an asset in the icon's box, as Blade DSL's \_Tabs Leading Item (Figma) is an icon or an asset (rule 14); `children`, a `leading` snippet and `trailing` receive `{ isSelected, isDisabled }` | **added**: all but `value` and the label (was data-driven)                              |
| `TabPanel` `value`, `children`                                                        | same                                                                                                                                                                                                                                                                                  | composed (was the per-item snippet)                                                     |
| `items`, `itemKey`, `itemLabel`, `isItemDisabled`, `tab`                              | —                                                                                                                                                                                                                                                                                     | **removed**: rule 4                                                                     |

### Look

Measured against React Storybook (Default, every variant × size, and both
orientations):

- **Bordered / borderless, horizontal:** tabs 30/38/50px tall with no side
  padding, 24px apart at small and 32px at medium and large (per size, as
  Blade DSL's Tabs in Figma; React spaces them by breakpoint), the label
  14/20 (16/24 at large). In each tab the leading item, the label and the
  trailing item sit 8px apart: the tab owns that gap, which is why they are
  props;
  a 2px `interactive.border.neutral.highlighted` indicator slides under the
  pick at moderate/standard; an unpicked tab's 2px edge turns
  `interactive.border.gray.highlighted` on hover. Bordered adds the 1px
  `surface.border.gray.muted` track under the row.
- **Vertical:** the tabs stack at full width, 12px in, the indicator 1.5px
  on the left, the track beside the column.
- **Filled:** the row on `interactive.background.gray.faded`, 4px in (2px
  at small), 8/12px round; the tabs share it; a `surface.background.gray. intense` pill slides to the pick, round as the tab (6px at small).
  Vertical: the picked tab fills itself, 12px in.
- **Icons** 16px (20px at large), 8px from the label; **focus** is the inset
  4px ring; everything else moves at gentle/standard.
- **Panels** have no padding of their own (was 16px above).

### Behaviour

One tab stop; arrows on either axis, Home and End move between enabled
tabs, wrapping. `activation` defaults to `manual`, as Blade: a press, Enter
or Space picks. cx keeps `automatic` (moving focus picks, the APG
default).

### cx-only features — decision pending

| Feature                           | What it does               | Recommendation                    |
| --------------------------------- | -------------------------- | --------------------------------- |
| `activation: automatic \| manual` | whether focus moving picks | keep (default `manual`, as Blade) |
| `accessibilityLabel`              | names the tablist          | keep                              |

### Status

Audited, rebuilt, and verified: `svelte-check` gives 0 errors; `test`
passes; every variant, size and orientation measures as React's.

---

## Toast

React: `useToast().show(…)` with a `ToastContainer`. cx:
`showToast(toast, { cancelled }?)` (from anywhere, on the page's queue),
which returns a `Promise<ToastDismissReason>`; `cancelled` resolving
dismisses the toast (one resolved already goes on the next microtask,
before it paints). BladeProvider
renders the stack (not exported). A queue made before any stack mounts
keeps its toasts, timers held, and shows them once one mounts. The public
`Toasts` type is just `{ showToast }`: an app's own queue is
`createToasts()`, passed as `adapters.toasts`, or an object of its own
with a `showToast`, which BladeProvider does not render. A nested provider
with a Blade queue of its own renders its stack in the enclosing overlay
host. Internally (`runes/toast/`, not exported) the model is
`createToastsModel` and the queue `createToastQueue`.

### Options

| React                                                   | cx                                                         | Action                                                                                                                                                                                        |
| ------------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content`                                               | same                                                       | same as React; checkout's cx called it `message` (a string)                                                                                                                                   |
| `leading`                                               | `leading?: IconSource \| { image, alt? }`                  | same name; data only (an exception to rule 14: a toast is shown from a `.ts` call): an icon replaces the colour's default glyph (Blade's info, check-circle, alert-triangle, alert-octagon); an image (an asset, 20px) takes its place too |
| `color`                                                 | same                                                       | same                                                                                                                                                                                          |
| `action: { text, onClick, isLoading }`                  | `{ text, onClick(): void \| Promise<unknown> }`             | **changed**: a returned promise shows the action busy (disabled, `aria-busy`) until it settles, a rejection going to `adapters.reportError`, in place of a static `isLoading`. Pressing it doesn't dismiss the toast, as Blade: resolve `cancelled` |
| dismiss button                                          | always shown, `closeLabel` (default `Dismiss toast`)       | **changed**: it showed only when `closeLabel` was passed                                                                                                                                      |
| `onDismissButtonClick`                                  | `onDismissButtonClick()` (no arguments)                    | **added**                                                                                                                                                                                     |
| `autoDismiss` (default true), `duration` (default 4000) | same                                                       | **added** `autoDismiss`; `duration` now defaults to 4000 here                                                                                                                                 |
| `id`, `toast.dismiss(id)`                               | `showToast`'s `cancelled`, and the promise it returns      | **changed**: no handle; resolve `cancelled` to dismiss, await the promise for why it left                                                                                                      |
| `type: promotional`                                     | —                                                          | **gap**: arbitrary content, gray, the action under it                                                                                                                                         |

### Look

Measured against React Storybook (Basic, neutral):

- 12px round (was 8px), 12px in and 8px above and below (was 12px all
  round), the parts 8px apart; the colour's popup fill with its 1px rim
  drawn inside (was a border) over the white bevel (`shadow-toast-*`), and
  the medium backdrop blur (was none).
- Content: body small (12/17, letter-spaced) in static white, 4px above and
  below (was 10px).
- Action: an xsmall secondary white Button (Blade's tertiary drew the same); dismiss: the subtle medium
  IconButton, 12px after it (the hairline between them is gone).

### Kept beyond React

- A `negative` toast is an `alert` (Blade announces all politely).
- The stack: capacity, stacking and hover-to-hold (ported earlier).

### cx-only features — decision pending

| Feature                          | What it does                                                                       | Recommendation |
| -------------------------------- | ---------------------------------------------------------------------------------- | -------------- |
| `onDismiss(reason)`, the promise | how it went: `timeout`, `dismiss` (the button or `cancelled`), `evicted`, `cleared` | keep           |
| `closeLabel`                     | i18n for the dismiss button                                                        | keep           |

**Status:** done; `svelte-check` gives 0 errors and `test` passes;
the toast measures as React's.

### Figma alignment (Blade DSL)

- `showToast({ leading })` takes an icon or an image (`{ image, alt }`, an asset), in place of the glyph: Figma's leading item is an icon or an asset.
- Content → action or cross is 12px (Figma). Figma's desktop action is a Link; cx keeps an xsmall secondary white Button.

---

## Tooltip

React: `Tooltip` (with `TooltipInteractiveWrapper` for a non-focusable
trigger). cx: `Tooltip` (`components/tooltip/`).

| React                                                  | cx                                                                                      | Action                                                                                          |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `content` (string)                                     | `content: string \| Snippet`                                                            | same name (rule 13), superset: a snippet for rich content                                       |
| `title`                                                | `title: string \| Snippet`                                                              | **added**                                                                                       |
| `placement` (default `top`; no `left/right-start/end`) | same (all twelve)                                                                       | superset                                                                                        |
| `onOpenChange({ isOpen })`                             | same                                                                                    | rule 12                                                                                         |
| `children` (the trigger)                               | `children` (receives `{ isOpen }`), in a wrapper that listens for hover, focus and taps | same name (rule 13); the trigger wires nothing                                                  |
| `maxWidth`                                             | —                                                                                       | rule 1 would put it on `class`, which lands on the trigger; not ported                          |
| `zIndex`                                               | —                                                                                       | n/a: the overlay host stacks it                                                                 |
| BladeProvider's `FloatingDelayGroup` (300/300 ms)      | the tooltips under one layer stack share a delay group                                  | same: 300 ms to open and to close; once one is open the next opens at once and the first closes |
| `data-analytics-*`                                     | same, on the bubble                                                                     | same                                                                                            |

**Look** — measured against React Storybook (Default, With Title):

- The bubble: `popup.background.gray.intense`, 12px round and in (was 8px
  round, 8×4px in), 200px at most (was 240px), the low raised shadow and
  the high blur; the title semibold body medium (14/20) in static white
  over the content, body small (12/17, was 10px) in its subtle step, 4px
  apart.
- The arrow: a 14×7 triangle (was a rotated 8px square); the bubble 12px
  off the trigger (was 8px), the arrow's tip 4px.

**cx-only, pending:** `isDisabled` (no tooltip) — keep.

**Status:** done; `svelte-check` gives 0 errors and `test` passes;
the bubble measures as React's.

### Figma alignment (Blade DSL)

- Figma's arrow is 14×8 and overlaps the bubble by 2px; cx draws 14×7.

---

## Text and Heading (Typography)

Blade DSL's Typography page (Figma) defines the scale:

- **Text** sizes are Figma's Body styles: xsmall 10/13, small 12/17, medium 14/20 (−1.3%), large 16/24 (−3.3%). Before, xsmall and small sat on a 16px line with no letter-spacing.
- **Heading** sizes are Figma's Heading styles: small 18/24, medium 20/26, large 24/32, xlarge 32/38, and **added** 2xlarge 40/46 (each was one step smaller).
- Heading `weight: medium` **removed**: Figma has regular and semibold only.
- **Display** (added) is Figma's Display styles: small 48/56, medium 56/64, large 64/70, xlarge 72/78, in the heading face; regular and medium at −1.3%, semibold at 0%. Same as React: `size` (default small), `weight` (default semibold), `color`, `textAlign`, `as` (`span`, `h1`–`h6`; cx defaults to `h1`, React to a plain text element).
- **Code** (added) is Figma's Code styles: small 10/14, medium 12/18, Menlo, regular or bold. Same as React: `size` (default small), `weight`, `isHighlighted` (default true, a neutral chip in the subtle text colour), and `color` only when not highlighted, enforced by the type. **Different:** the line heights follow Figma; React uses 13 and 17. React's `textTransform` is left to `class`.
- **Colours:** Text's `negative` and `positive`, as React (`danger` and `success` are removed).
- **Truncation:** Text's `truncateAfterLines`, as React (was `truncate`). **Different:** capped at 6 lines (the generated clamps).
- Text, Heading, Display and Code pass `data-analytics-*`.
- Caption styles have no component yet.

---

## Carousel

React: `Carousel`. cx: `Carousel` (`components/carousel/`), data plus a
slide snippet (rule 4: `items`, `itemKey`, `children(item, index)`).

| React                                         | cx                                                             | Action                                                                                |
| --------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `activeSlide`, `defaultActiveSlide`           | `bind:activeSlide`                                             | rule 3                                                                                |
| `onChange(slideIndex)`                        | same                                                           | same                                                                                  |
| `autoPlay`                                    | same                                                           | same: every 6s, paused while the pointer or focus is inside, off under reduced motion |
| `showIndicators`                              | same                                                           | same                                                                                  |
| `accessibilityLabel`                          | same                                                           | same                                                                                  |
| —                                             | `slideLabel`, `indicatorLabel`, `indicatorsAccessibilityLabel` | cx-only: localized names for the slides, the dots and their row                       |
| `visibleItems`, `navigationButtonPosition`, … | —                                                              | **missing** (below)                                                                   |

**Semantics:** the dots are a `tablist` of `tab`s and each slide a
`tabpanel` (`aria-roledescription="slide"`).

- Indicators: 6px dots 4px apart; the current one an 18px pill, with its width animating (Figma \_Carousel Indicators). Before: 8px dots 6px apart.
- **Missing**: Figma's navigation buttons, `visibleItems` and `navPosition`, white and blue indicators, and the 10px root gap (cx 8px).

---

## ActionList

React: `ActionList`, `ActionListItem`, `ActionListSection` — the rows of every Dropdown, of BottomSheet bodies and of the country selector. cx: the same names (`components/action-list/`). **ActionList is a look:**

- **ActionList** is CardGroup's internal `BaseCardGroup` with `actionListClasses(variant, inset)`, plus `variant` and `inset`. Everything else is CardGroup's: native radios or checkboxes, `bind:value`, `onChange`, `onPick`, the form field, sections (`ActionListSection` renders a `CardGroupSection`), rows as data and `isVirtualized`. Its keys are a listbox's, as React's: the arrows move and pick nothing, Enter and Space pick. React has no standalone ActionList: it reads `selectionType` and the selection from the Dropdown context (`useDropdown`) and renders only inside a Dropdown or a BottomSheet. cx's list holds its own value, as CardGroup.
- **`actionListClasses()` is exported**, for an app's own list in ActionList's look. The look has no search parts.
- **Removed from ActionList** (not in React's ActionList; an app's own list brings them): `isSearchable`, `searchPlaceholder`, `query`, `match`, `empty`, `virtualizedItems`, `virtualizedSections`. **Removed everywhere:** `selectionType="none"`. A list where a pick submits uses `onPick`.
- **Not coupled to Menu.** Inside a Menu, ActionList is an ordinary choice list. Its rows are radios, not `menuitem`s, and nothing closes the menu for it: its `onPick` calls the body's `close`.
- **Link rows:** an `ActionListItem` with `href` is CardGroupItem's link row in ActionList's look (`chevron: 'hidden'`), routed as Link's (rule 15). When disabled it drops its `href` and leaves the tab order. A link closes a menu from its own `onClick`.
- **One row:** rows draw `shared/ActionListRow.svelte` with the `shared/popup-list` classes (36px, touching, 8px radius, the selected wash, a drawn checkbox for multiple), Menu's row in Figma's \_Action List.

**Migration:**

| Was                                                          | Is                                                                                                  |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `<ActionList isSearchable …>` (or `query`, `match`, `empty`) | an app's own searchable list (not in the library) that filters `items`, or `actionListClasses()`    |
| `<ActionList virtualizedItems … itemKey … children={row}>`   | `<ActionList items={…} itemKey={…} row={…} isVirtualized>` (or `sections`)                          |
| `selectionType="none"` with `onChange`                       | `onPick` (every pick, the same row again too); the rows are radios                                  |
| an ActionList in a menu closing it by itself                 | `onPick` calls the body's `close`; a link row's `onClick` too                                       |
| `onChange(value)`, an item's `onClick(event)`                | `onChange({ name, value })` (an array with `multiple`), `onClick({ name, value, event })` |

| React                                                                                                | cx                                                                     | Action                                                                                                                                                      |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ActionList` `children`                                                                              | `children`                                                             | rule 2                                                                                                                                                      |
| Dropdown's `selectionType`; the selection from the Dropdown context (no standalone ActionList)       | `selectionType`, `bind:value`, `onChange`, `onPick` (standalone)       | `selectionType` same (`single`, `multiple`); **added**: standalone, the list holds the value (`bind:value`), as CardGroup; `onPick` for a pick that submits |
| —                                                                                                    | `variant: plain \| card`, `inset`                                      | cx-only: `card` draws rows divided in a bordered box, each section its own box under its heading (checkout's bank list; to be checked against Figma)        |
| `ActionList` `isVirtualized`                                                                         | `isVirtualized`, with `items` or `sections`, `row` and `itemKey`       | **changed**: React walks `children` as element data; a Svelte snippet is opaque, so a virtual list takes its options as data and renders each with `row`    |
| `ActionListItem` `title`, `value`, `description`, `leading`, `trailing`, `titleSuffix`, `isDisabled` | same; `leading` is an icon or a snippet                                | same (rule 14)                                                                                                                                              |
| `ActionListItem` `onClick({ name, value, event })`                                                   | same                                                                   | same: `name` is the row's value, `value` whether it was selected when pressed                                                                               |
| `ActionListItem` `href`, `target`                                                                    | `href`, `target`, `rel`                                                | same: a link row, never a value                                                                                                                             |
| `ActionListItem` `intent: 'negative'`                                                                | `intent`                                                               | same                                                                                                                                                        |
| `ActionListItem` `isSelected`                                                                        | —                                                                      | derived from the value                                                                                                                                      |
| `ActionListSection` (`title`, a divider after)                                                       | `ActionListSection`                                                    | same (the hairline is drawn above every section but the first)                                                                                              |
| `ActionListItemIcon`, `…Asset`, `…Avatar`, `…Badge`, `…BadgeGroup`, `…Text`                          | an icon `leading`, and `leading` / `titleSuffix` / `trailing` snippets | rules 2 and 14                                                                                                                                              |
| `testID`, `data-analytics-*`                                                                         | same                                                                   | same; each row's control gets `${testID}-${index}` and its own analytics                                                                                    |

### Virtualization

- **Over data, not children.** React's `isVirtualized` walks `children` as element data; a Svelte snippet is opaque, and a composed list learns of an item only when it mounts and registers (`registerEntry` in `runes/card-group/item.svelte.ts`), which a virtual list exists to avoid. So CardGroup and ActionList take the options as data (`items`, or titled `sections`) with a `row` snippet that renders one, keyed by `itemKey`. With `isVirtualized` only the rows in view mount (`components/virtual-window/`), heights measured and remembered by key; give the list a bounded height in `class`. The keyboard, typeahead and the value cover every option, mounted or not.

---

## Overlays

### What there is

- **Five components, no base.** Each overlay is its own component, with
  its own props, styles (`resolveModal`, `resolveBottomSheet`,
  `resolveDrawer`, `resolvePopover`, `resolveMenu`) and provider defaults:
  `Modal` (centred), `BottomSheet`, `Drawer` (`side`), `Popover` and `Menu`
  (floating by their trigger), as in React. What they share is runes:
  `createOverlay` (the dialog model, the header registry, the trigger's
  wiring, the overlay context) over `createDialog`. Modal, BottomSheet and
  Drawer render the internal `OverlaySurface` (the overlay and the
  `Surface` with its close button); Popover and Menu `FloatingPanel`.
  The first three are surfaces on the layer stack (the scrim, the inert
  page, the focus trap, back); Popover and Menu are floating panels. One
  disclosure model (`createDialog`) holds the layer for both kinds, so
  `onDismiss` reports the same `{ source, close }` (`cross`, `blur`,
  `escape`, `back`, `drag`) and Escape reaches only the topmost overlay.
  Modal has no `variant`.
- **The overlay host:** BladeProvider renders it after its content (the
  one scrim, the box surfaces mount in, the toasts and a polite live
  region for `adapters.announce`). The outermost provider hosts every
  overlay on the page (the layers coordinator is internal); a nested one
  with a toast queue of its own renders its stack in that host. Nothing
  renders twice. (It was `OverlayStack`, a component to mount.) The layers
  keep stacking, Escape and back, which the app's back handler asks first
  (`back()`); the layer
  stack's navigation (`popAfter`, `popTill`, `resolve`, a stack `back`) is
  the app's own.
- **The trigger**: Popover's and Menu's `children` (rule 13), a snippet
  with the control that opens the panel, in a wrapper that stamps
  `aria-haspopup` (`dialog`), `aria-expanded` and `aria-controls`, with
  `isDisabled`. Click only (and the arrows for a menu): nothing opens on
  hover, which has no touch counterpart, so React Popover's
  `openInteraction="hover"` is not ported. Tooltip stays the one hover
  overlay. Modal, BottomSheet and Drawer have none, as React's: they open
  from code (`isOpen`), and closing returns focus to what had it when they
  opened.
- **`onOpenChange({ isOpen })`** on every overlay (React's Popover and
  Menu have it; cx adds it to Modal, BottomSheet and Drawer): every open
  and close the overlay makes, whoever asked — Popover's and Menu's
  trigger, a dismissal or `close` — never a change the owner makes to
  `isOpen`.
- **`initialFocusRef`** on Modal, BottomSheet, Drawer and Popover, as
  React's: the element that takes focus on open.
- **ButtonGroup reset:** Popover and Menu content is not styled by an
  enclosing ButtonGroup (React's OverlayContextReset, `resetButtonGroup()`).
- **Tooltip delay group:** the tooltips under one layer stack share a group
  with React's 300/300 ms delays (see Tooltip).
- **Switching by screen is the app's.** No library overlay changes layout
  by screen: an app's own overlay that switches by screen composes these,
  on the query `d:` uses (`(min-width: 62.5rem)` by default). Modal's `presentation` and
  BottomSheet's `adaptive` are not ported. React does this per breakpoint
  inside DropdownOverlay and BottomSheet.
- **Opening from code is the app's**: a stack of opened components it
  renders on these overlays. No library component opens one.
- **`presentDropdown(kind, request)`** lets an app show a library dropdown
  (`'dial-code'`: PhoneNumberInput's country list) its own way, resolving
  a promise with the pick;
  without it, or when it
  returns `undefined`, the dropdown hangs under its field.
- **A menu holds whatever the app puts in it.** Menu and ActionList are
  not coupled: Menu is Blade's Menu look (no close button, `bottom-start`, the
  arrows open it from its trigger) on a `dialog` panel, with no
  `closeLabel`, `role` or `pace`. An ActionList inside is an ordinary
  choice list whose `onPick` calls the body's `close`; a link row closes it
  from its `onClick`. **Changed** from React, whose Menu is a `role="menu"`
  of `menuitem`s.
- **No Dropdown:** a select dropdown (React's SelectInput, Dropdown,
  AutoComplete, FilterChipSelectInput) is not ported by decision — a field
  opening a floating list of options is not mobile friendly. A pick is an
  ActionList on the page, in a BottomSheet or in a Menu.

### Roles

| Overlay                    | Panel                                           | Trigger `aria-haspopup` | ActionList inside                                       |
| -------------------------- | ----------------------------------------------- | ----------------------- | ------------------------------------------------------- |
| Modal, BottomSheet, Drawer | `role="dialog"` (or `alertdialog`), modal layer | `dialog`                | `group` / `radiogroup` of native controls, as on a page |
| Popover, Menu              | `role="dialog"`, floating layer, no scrim       | `dialog`                | as above; a Menu has no close button                    |

### What moved where

| Was                                                                            | Is                                                                                                                       |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `<Modal variant="sheet">`, `<BottomSheet variant="modal">`                     | `<BottomSheet>`, `<Modal>`                                                                                               |
| `<Modal variant="drawer">` / `"left-drawer"`, `<Drawer variant="left-drawer">` | `<Drawer>` / `<Drawer side="left">`                                                                                      |
| `<Modal variant="popover">`, `<Modal variant="menu">`                          | `<Popover>`, `<Menu>`                                                                                                    |
| `presentation` / `{ Modal: { presentation: 'sheet' } }`                        | an app's own responsive overlay (not in the library)                                                                     |
| `{ Modal: { variant: 'sheet' } }` for the app                                  | an app's own responsive overlay where the screen decides; `BottomSheet` where it is always a sheet                       |
| `<Modal title=… body={…} footer={…}>` (and BottomSheet, Drawer)                | `<Modal><ModalHeader title=… /><ModalBody>…</ModalBody><ModalFooter>…</ModalFooter></Modal>` (`BottomSheet*`, `Drawer*`) |
| `padding` on Modal, BottomSheet, Drawer                                        | the body part's `padding` (`spacing.0`); DrawerBody's is cx-only (React's DrawerBody has none), as ModalBody's           |
| `showBackButton` on Modal or Drawer                                            | BottomSheetHeader only, as React                                                                                         |
| `openModal(c, { variant: 'sheet' })` / `{ as: 'sheet' }`                       | the app's own opener (not in the library)                                                                                |
| `OverlayStack`, `ToastStack` mounted by the app                                | the overlay host BladeProvider renders                                                                                   |
| `provideLayers()`, `provideToasts()`                                           | `adapters.toasts` on a BladeProvider; `back()`                                                                         |
| `adapters.layers`, `createLayers()`, `globalLayers`, `getLayers()`, `Layers`   | internal: the outermost provider hosts; `back()` for back                                                                 |
| `showToast()`'s `{ dismiss, dismissed }`, `ToastHandle`, `action.isLoading`    | `showToast(toast, { cancelled })`'s promise; an `onClick` returning a promise                                            |
| `resolvePhoneCountryInset(getOverlay()?.layout)`                               | `--overlay-gutter` (ActionList `inset="overlay"`, `px-[var(--overlay-gutter,0px)]`)                                      |

| Was                                                                 | Is                                                                                   |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `Popover` `children`, `content`, `titleLeading`                     | Popover `children` (the trigger), `body`, `leading`                                  |
| `Popover` `content: string`                                         | a `Text size="small"` in `body`                                                      |
| `pace` on Popover or Menu; Menu's `closeLabel`, `role`              | removed (`pace` stays on Modal, BottomSheet and Drawer)                              |
| `Menu` `content` of `MenuItem`s, `onSelect`                         | Menu with an ActionList of `ActionListItem`s in `body`, its `onPick` calling `close` |
| `MenuDivider`                                                       | `Divider`                                                                            |
| `Dropdown` select field, `DropdownHeader hasSearch`                 | not ported; an app's own searchable list in a sheet                                  |
| `DropdownFooter`                                                    | the overlay's `footer`                                                               |
| `runes/popup-list`, `runes/menu`, `runes/dropdown`, `runes/popover` | `runes/layer/overlay` (the context), CardGroup's own keyboard                        |
| `PopoverPanel`                                                      | `components/layer/FloatingPanel` (web only)                                          |

### Status

Done and verified: `svelte-check` gives 0 errors; `test` passes
(`test/modal-anchored.test.ts` covers the trigger, Popover and Menu and
the layer order; `test/overlay-host.test.ts` the host and nested
providers). The overlays are exported from `/components`; `Dropdown` is
gone from `src`.

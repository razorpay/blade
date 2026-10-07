# API parity: Blade React ↔ src-cx

Where src-cx differs from Blade React (`packages/blade/src/components`), one
component at a time. For each common component, src-cx matches React's look and
its API (props, variants), except where one of the rules below applies.

## Rules

1. **Layout and positioning go through `class`**, never props. `Box` is replaced by
   Uno (Tailwind) classes. Margin/padding styled-props, `maxWidth`, `minWidth`,
   `width` and the like are not ported.
2. **Render props and intermediate components become snippets** (`ModalHeader`,
   `AccordionItemHeader`, …). Inside a snippet the caller renders `Text`, `Icon`,
   etc. directly. Their props go too, when a snippet covers them (a header's
   `subtitle`, `leading`, `trailing`, back button). Only what behaviour or
   accessibility needs stays a prop, such as a `title` that names a dialog.
3. **`defaultValue`, `defaultChecked`, `defaultCountry`, `defaultExpandedIndex`, …
   are folded into the bindable prop** (`bind:value`, …). There is no separate
   default prop.
4. **Collections compose, as in React**: item components (`CardGroupItem`,
   `OptionItem`, `MenuItem`, …) register with their parent and are read in
   document order, so anything else may sit between them (a heading, a
   divider). A collection is data plus an item snippet only where it must
   know every item up front: a virtual list (`VirtualOptionList`) and
   `Carousel`. The headless core is `runes/base/choice-list.svelte.ts`
   (OptionList, CardGroup, Tabs, RadioGroup, ChipGroup) over
   `runes/base/ordered-entries.svelte.ts` (also Menu, InputGroup, Form).
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
9. **A field's label area is one `labelArea` snippet**, in place of React's
   `labelSuffix` and `labelTrailing`. `label` stays a string: it names the
   control. The snippet receives `{ label }`, the drawn label (text and
   necessity) as a snippet, renders it, and puts anything beside it; today
   the area is a row, items 4px apart, `ms-auto` pushing one to the end. It
   is an area, not a row, so a future `labelPosition="left"` keeps the same
   snippet. Every field with a label has it, CounterInput and InputGroup
   included; OptionList and VirtualOptionList not yet (a `label` string,
   string hints). Hint lines (`helpText`, `errorText`, `successText`) take
   `string | Snippet` on the inputs, a superset of React's strings, for a
   line with a Link in it. Only the label element names the
   control — React puts both slots inside its `<label>`, so a "Learn more"
   link becomes part of the input's name. Decided after the Form audit.
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
    per-component `defaults` for any style prop; and `adapters`. No value
    differs per breakpoint and nothing reads the viewport in JS: components
    are mobile first, and their desktop differences are `d:` classes (one
    breakpoint, 62.5rem — checkout's). A prop wins;
    then, nearest provider first, its entry for the component, then its
    overall `size`; then Blade's default. React's `themeTokens` and
    `colorScheme` are not ported. Modal's `variant` (`modal | sheet | drawer |
    left-drawer`) replaces BottomSheet's `adaptive`.
12. **Change callbacks take Blade's payload object**: a field reports
    `onChange({ name, value })` (`FieldChange`, `components/shared/change.ts`),
    Checkbox `onChange({ isChecked, value })`, Switch
    `onChange({ isChecked })`, ChipGroup `onChange({ name, values })` (a
    list either way), Collapsible `onExpandChange({ isExpanded })`, Popover,
    Tooltip and Menu `onOpenChange({ isOpen })`, PhoneNumberInput
    `onCountryChange({ country })`, OTPInput `onOTPFilled({ name, value })`.
    PhoneNumberInput's `onChange` is the exception: `{ country, dialCode,
    nationalNumber, value }`, with no `name`.
    Blade's `event` is not passed. Where Blade passes a bare value, so does
    cx: Tabs and Carousel `onChange(value)` — except Menu's (Dropdown's)
    `onOpenChange`, which takes `{ isOpen }` like every other overlay's.
    `onFocus`/`onBlur` pass the DOM event (OTPInput's also the cell's index).

## Inventory

Status: `common` means present on both sides, `react-only` means src-cx lacks it,
`cx-only` means React lacks it, and `n/a` means internal, a motion preset, or
replaced by a rule.

| React | src-cx | Status |
| --- | --- | --- |
| Accordion | `card-group` (renamed `CardGroup`) | common, **done**; cx names it CardGroup (see below) |
| ActionList | `action-list` (ActionList, ActionListItem, ActionListSection) | common, **done**: Dropdown's rows, and a standalone pick list over OptionList (see ActionList) |
| Alert | `alert` | common, **done** |
| Amount | `amount` | common, **done** |
| AnimateInteractions | — | n/a (motion) |
| AnnouncementBanner | `announcement-banner` | common, **done**: Blade DSL's Announcement Banner (Figma) (see AnnouncementBanner) |
| AppBar | — | react-only |
| AutoComplete | — | react-only |
| Avatar, AvatarGroup | `avatar` | common, **done**: Blade DSL's Avatar and Avatar Group (Figma) (see Avatar) |
| Badge | `badge` | common, **done** |
| BaseAnimatedValue, BaseHeaderFooter, BaseMenu, BaseMotion | — | n/a (internal) |
| BladeProvider | `blade-provider` | **different**: component defaults, not theme tokens (rule 11) |
| BottomBar | `bottom-bar` | common, **done**: Blade DSL's Bottom Bar (Figma), a container; positioning is the consumer's (see BottomBar) |
| BottomDock | — | react-only |
| BottomNav | — | react-only |
| BottomSheet | `bottom-sheet` | common, **done** |
| Box | — | n/a (rule 1) |
| Breadcrumb | `breadcrumb` | common, **done**: Blade DSL's Breadcrumb (Figma), subtle and intense (see Breadcrumb) |
| Button / IconButton | `button` / `icon-button` | common, **done** |
| ButtonGroup | `button-group` | common, **done** (new) |
| Card | `card` | common, **done** |
| Carousel | `carousel` | common |
| Charts | — | react-only |
| ChatInput, ChatMessage | — | react-only |
| Checkbox | `checkbox` | common, **done** |
| Chip, ChipGroup | `chip` | common, **done** (new) |
| Collapsible | `collapsible` | common, **done** (new) |
| Confirmation | — | react-only |
| Counter | `counter` | common, **done** (new) |
| CounterInput | `counter-input` | common, **done** (new) |
| CreationView | — | react-only |
| DatePicker | — | react-only |
| DetailedView | — | react-only |
| Divider | `divider` | common, **done** |
| DotLoader | — | react-only (cx Button draws its own loader) |
| Drawer | `drawer` | common, **done** (Modal's `drawer` variant; `left-drawer` docks it left) |
| Dropdown | `dropdown` | common, **done** (partial): select field or any trigger, single/multiple, header/search/footer, states (see Dropdown and Menu) |
| Elevate, Fade, Morph, Move, Scale, Slide, Stagger | — | n/a (motion) |
| EmptyState | `empty-state` | common, **done** |
| FileUpload | — | react-only |
| FilterChip | — | react-only |
| FloatingActionButton | — | react-only |
| Form (FormLabel, FormHint, CharacterCounter) | `shared/FieldLabel`, `shared/FieldHint`, `shared/FieldCounter` | common, **done** (cx's `form`, a `<form>` with field registration, is cx-only) |
| FormGroup | — | react-only |
| GenUI | — | react-only |
| Icons | `icon`, `@razorpay/blade-svelte/icons`, `/vite`, `/webpack` | common, **done**: Blade's icons by name, as SVG imports; a font plugin makes them glyphs (see Icons) |
| Indicator | — | react-only |
| InfoGroup | — | react-only |
| Input / TextInput | `text-input` | common, **done** |
| Input / TextArea | `text-area` | common, **done** |
| Input / OTPInput | `otp-input` | common, **done** |
| Input / PhoneNumberInput | `phone-number-input` | common, **done** |
| Input / PasswordInput | `password-input` | common (new): over TextInput |
| Input / SearchInput | `search-input` | common (new): over TextInput; `isLoading` and a trailing Dropdown are gaps |
| Input / PaymentInput, ColorInput, SliderInput | — | react-only |
| InputGroup | `input-group` | common, **done** |
| LightBox | — | react-only |
| Link | `link` | common, **done** |
| List | — | react-only |
| ListView | — | react-only |
| LiveAnnouncer | — | n/a |
| Menu | `menu` | common: Dropdown's action form, on the same core (see Dropdown and Menu) |
| Modal | `modal` | common, **done** |
| OverlayContextReset | — | n/a |
| Pagination | — | react-only |
| Popover | `popover` | common, **done** |
| PopupArrow | — | n/a (internal) |
| Preview | — | react-only |
| ProgressBar | — (`progress` is a different thing) | react-only; cx's `progress` is a loader (dots, bar, ring) with no value, label or colour, so it counts as cx-only (Storybook: Extra Components) |
| QuickFilters | — | react-only |
| Radio | `radio` | common, **done** |
| RollingText | — | react-only |
| SegmentedControl | `segmented-control` | common, **done** |
| SelectableCard | — | react-only |
| Settings | — | react-only |
| SideNav | — | react-only |
| Skeleton | `skeleton` | common, **done** |
| SkipNav | — | react-only |
| Spark | — | react-only |
| Spinner | — | react-only |
| SpotlightPopoverTour | — | react-only |
| StepGroup | — | react-only |
| Switch | `switch` | common, **done** |
| Table | — | react-only |
| Tabs | `tabs` | common, **done** |
| Tag | — | react-only |
| TimePicker | — | react-only |
| Toast | `toast` | common, **done** |
| Tooltip | `tooltip` | common, **done** |
| TopNav | — | react-only |
| TreeView | — | react-only |
| TrustBadge | `trust-badge` | common |
| Typography (Text, Heading) | `text`, `heading` | common; **known gap:** no letter-spacing (see Chip) |
| Typography (Display, Code) | `display`, `code` | common, **done**: Figma's Display and Code styles (see Typography) |
| VisuallyHidden | — | n/a (`sr-only` class) |
| — | `async` | cx-only |
| — | `countdown` | cx-only |
| — | `image` | cx-only |
| — | `layer` (LayerHost, Surface) | cx-only (overlay infrastructure) |
| — | `nav-stack` | cx-only |
| — | `option-list` (OptionList, OptionItem, VirtualOptionList) | cx-only: an always-visible choice list, not a popup |
| — | `screen` | cx-only |
| — | `virtual` | cx-only |
| — | `shared` | n/a (internal) |

---

## CardGroup (React's Accordion)

React: `Accordion`, `AccordionItem`, `AccordionItemHeader`, `AccordionItemBody`.
cx: `CardGroup` and `CardGroupItem` (`components/card-group/`) over
`runes/card-group`. It was cx's `Accordion`, renamed (a rename only): what
it is in checkout — cards to pick one of, the picked one expanding — is the
CardGroup/CardGroupItem pair of Blade's interactive-cards decision. Its look
and behaviour are React's Accordion, compared below; the tables name React's
components on the left and cx's on the right.
Compositional like React (rule 4): items are `CardGroupItem` children, and a
data list is an `{#each}`.

### Props

`Accordion` → `CardGroup`:

| React | cx | Action |
| --- | --- | --- |
| `variant: 'filled' \| 'transparent'` (default transparent) | `variant` | **renamed** from `boxed`/`plain`; default now `transparent` |
| `size: 'large' \| 'medium'` (default large) | `size` | **added** |
| `showNumberPrefix` | `showNumberPrefix` | **added** (`1.`, `2.`, …); wins over `leading`, as in React |
| `expandedIndex`, `defaultExpandedIndex` | `bind:value` | rule 3. The value is the item's `value`, its index by default, so an index works as in React |
| `onExpandChange({ expandedIndex })` (-1 = none) | `onChange({ name, value })` (`value` or `null`) | rule 12; `null` for none. Same behaviour: one open at a time, a second press closes it |
| `children: AccordionItem[]` | `children` | same |
| `maxWidth`, `minWidth`, styled props | `class` | exempt (rule 1). React's MAX/MIN_WIDTH defaults (200–360 min, 640/800 max) are not baked in |
| `testID` | `testID` (each header gets `${testID}-${index}`) | same |
| `data-analytics-*` | — | **missing**, to add with the analytics pass across components |

`AccordionItem` → `CardGroupItem` (React's `AccordionItemHeader` props flattened onto it):

| React | cx | Action |
| --- | --- | --- |
| *(index)* | `value` (default: index) | **added**: a stable identity for `bind:value` |
| `AccordionItemHeader.title` | `title: string \| Snippet` | same; a snippet sizes its own text |
| `AccordionItemHeader.subtitle` | `subtitle: string \| Snippet` | same |
| `AccordionItemHeader.leading` | `leading` snippet | same (rule 2) |
| `AccordionItemHeader.trailing` | `trailing` snippet | **changed**: replaces the chevron. React's `trailing` sits before the chevron |
| `AccordionItemHeader.titleSuffix` | — | **dropped** by decision; use a `title` snippet |
| `AccordionItemHeader.children` | — | **dropped**; use `header` |
| — | `header` snippet | cx-only: lays out the header's content, receiving the drawn `title` and `subtitle` as snippets — one meaning of `header` across Modal, Card and CardGroupItem: the header box's content, placing any `title`/`subtitle` itself (Card has none) |
| `AccordionItemBody` | `body` snippet, inside Blade's body box | rule 2; named and resolved as Modal's `body` |
| — | `children` snippet | cx-only: a full-width custom body without the body box; wins over `body`, as in Modal |
| — | `collapse()` in the snippet state | cx-only: the body closes its own item |
| — | CardGroup `labelArea`, `string \| Snippet` hints | as the inputs (rule 9) |
| `isDisabled` | `isDisabled` | same |
| `testID` | `testID` | same; overrides the CardGroup's `${testID}-${index}` |
| `title` / `description` / `icon` on AccordionItem (deprecated) | — | not ported (deprecated in React) |

### Look

Matched against React Storybook (`WithShowNumberPrefix`, filled/transparent ×
large/medium) by measuring the DOM. These now match:
- header height;
- prefix, title and chevron positions and fonts;
- body offsets (12px above, 16px sides and bottom);
- the filled surface (radius, three-part shadow, background);
- the focus ring (4px `surface.border.primary.muted`, offset 1, radius small);
- the chevron colours (muted, subtle when hovered, focused or expanded, disabled).

- **transparent:** no surface; a 1px `surface.border.gray.muted` divider after every item.
- **filled:** new Uno class `surface-raised` (Blade's `getSurfaceStyles`, light mode) plus
  `rounded-medium bg-surface-gray-intense`; dividers between items only. The hover fill
  follows the box corners.
- **Header:** 16px padding; hover/focus fill `interactive.background.gray.faded` in
  2xquick; a 0.5px hairline under an expanded header, hidden on hover/focus. The
  number prefix sits in a 28px/20px line box.
- **Collapse:** 280ms (`moderate`), standard easing, opacity 0.8 → 1
  (`cubicBezier`/`easeStandard` added to `runes/dom/motion.ts`).
- **Dropped checkout look:** the `boxed` card (`shadow-card`, `border-interactive-gray-disabled`),
  gray `bg-surface-gray-subtle` panels, `px-4` headers with 11px corner radii,
  and the `opacity-blade-600` disabled root.
- **Not copied from React:**
  - React still shows the hover fill on a disabled header.
  - React doesn't grey the number prefix when disabled.
- **Side fix (Typography):** Text and Heading now reset `margin` to 0, like Blade's
  BaseText. Before, a `<p>` kept the browser's 1em margins. A caller's `m*-` classes still win.

### Accessibility

cx does more than React here, and keeps it:
- header `id` plus the region's `aria-labelledby`;
- Up/Down/Home/End moving between headers.

Added from React: the `role="heading" aria-level="3"` wrapper around each button.

### cx-only features

**Removed (decided):**
- `isMultiple`: React allows one open item.
- `isCollapsible`: React always closes the open item on a second press.
  - Checkout's home method list used `isCollapsible={false}`; it now collapses like React.
- `items`, `itemKey`, `compare`, `isItemDisabled`: the CardGroup is compositional
  now, so these become per-item props or an `{#each}`.
- `indicator` and `isActionable`: replaced by `trailing`, and by an item having
  no body. An item without `body` or `children` acts instead of expanding
  and draws a chevron pointing right.

**Decision pending:**

| Feature | What it does | Recommendation |
| --- | --- | --- |
| `CardGroupItem.onClick(event) → false` | vetoes an expand (downtime sheet, address gate); the only action of a body-less item | **keep**: needed by checkout; not expressible otherwise |
| `scrollOnExpand` (default true) | scrolls the opened panel into view | keep |
| `name`, `isRequired`, `validationState`, `helpText`, `errorText`, `label`, `accessibilityLabel` | the open item as a form field | **decide**: no React equivalent; checkout home uses it as a required choice |

### Checkout call sites affected

These use the old `items` + snippets API and need a port to
`<CardGroupItem>` children. Use `variant="filled"` if the old card look is wanted:
- `app/v2/sidecart/sidecart-iframe/components/widgets/free-gifts/FreeGiftMultiRuleSheet.svelte`
- `app/v2/sidecart/sidecart-iframe/components/widgets/coupons/unlock-milestone/components/eligible-products/EligibleProductsScreen.svelte`
- `app/v3/surfaces/international-checkout/components/MobileCheckout.svelte`
- `app/v3/surfaces/international-checkout/components/DesktopCheckout.svelte`
- `app/v3/components/payment/RetryScreen.svelte`

### Status

Audited, fixed, and verified after the compositional rewrite: `svelte-check`
gives 0 errors; `test` passes; the DOM measurements match React
Storybook, unchanged from before the rewrite.



### Figma alignment (Blade DSL)

- cx CardGroup follows Blade DSL's ❖ Accordion (Figma), not its ❖ Card Group (48px navigation rows; cx's `go` items approximate it).
- Header line box 24px at large and 20px at medium; 8px leading → title; 12px title → trailing or chevron; title and subtitle 2px apart in medium weight (React: semibold); chevron 20/16px. Body 16px above and inside, 16px below and between parts (12px at medium); React's body is 12px above.
- Why `leading` and `trailing` are props: see the card-group README.

---

## Alert

React: `Alert`. cx: `Alert` (`components/alert/`).

### Props

| React | cx | Action |
| --- | --- | --- |
| `description` (required, text or JSX) | `description: string \| Snippet` | **renamed** from `children` |
| `title` | `title: string \| Snippet` | superset |
| `color` (+ `primary`) | `color` | **added** `primary` |
| `emphasis: 'subtle' \| 'intense'` | `emphasis` | **added** |
| `icon` (defaults per colour) | `icon` | **added** the defaults: info, check-circle, alert-triangle, alert-octagon (the last two drawn from Blade's icons into `components/icons`) |
| `isDismissible` (default true) | `isDismissible` | **added**; was "dismissible when `closeLabel` is set" |
| `onDismiss` | `onDismiss` | same; the alert now closes itself after it, as in React |
| `isFullWidth` | — | **removed** by decision: full width is the only layout (spans the container, centred on desktop (`d`, 62.5rem)) |
| `maxWidth` (default 584px) | — | **removed** by decision: no width of its own; a cap is a `class` (rule 1) |
| `actions: { primary, secondary }` | — | **removed** by decision (was an `actions` snippet); no checkout call site used it |
| `testID` | `testID` | same |
| styled props, `data-analytics-*` | `class`; — | rule 1; analytics **missing** (analytics pass) |

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

| Feature | What it does | Recommendation |
| --- | --- | --- |
| `isOpen` (bindable) | shows the alert again after a dismiss; slides it shut | keep: React's alert, once dismissed, is gone until remount |
| `closeLabel` | the dismiss button's accessible name | keep: React hardcodes English "Dismiss alert" |

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

| React | cx | Action |
| --- | --- | --- |
| `value` | `value` | same |
| `currency` (default `INR`) | `currency` | **default added** (was required) |
| `type`, `size`, `weight`, `color` | same, `size`/`weight`/`color` defaulting to `inherit` | **added**, Figma's variants: body xsmall–large, heading small–2xlarge, display small–xlarge; weights regular/medium/semibold (heading: no medium); `color` takes Text's colours. Sizes and weights are typed per `type`. React defaults to body medium; cx inherits |
| `suffix: decimals \| none \| humanize` | `suffix` | **added** |
| `fractionDigits: number \| 'auto'` (default 2) | `fractionDigits` | **changed** default from the currency's own to 2; `auto` added |
| `isAffixSubtle` (default true) | `isAffixSubtle` | **renamed** from `affix: subtle \| normal`. With a set size the affix takes Figma's style one step down (see the amount README); while the size inherits it is 0.75em of the text |
| `currencyIndicator: currency-symbol \| currency-code` | `currencyIndicator` | **renamed** from `currencyDisplay: symbol \| code` |
| `isStrikethrough` | `isStrikethrough` | same; a `<del>` whose own line follows the text, where React draws a 1px/2px line |
| `testID` | `testID` | same |
| styled props, `data-analytics-*` | `class`; — | rule 1; analytics **missing** (analytics pass) |

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
- subtle affixes smaller only: Figma's subtle affix is never faded (React and cx used to set 64% opacity).

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

| Feature | What it does | Recommendation |
| --- | --- | --- |
| `unit: major \| minor` | takes paise or cents and scales by the currency's exponent | keep: checkout amounts are in minor units |
| `locale` | pins grouping and currency side | keep: React has only i18nify's global locale |
| `symbol` | replaces the currency symbol with the app's own | keep or drop: checkout's own symbol table (`RM`) |

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

| React | cx | Action |
| --- | --- | --- |
| `children` (string, required) | `children` snippet | the label as content; React's dev check for empty text is not ported |
| `color` (5 intents + `primary`, default neutral) | `color` | same |
| `emphasis: subtle \| intense` (default subtle) | `emphasis` | same |
| `size: xsmall \| small \| medium \| large` (default medium) | `size: small \| medium \| large` | **removed** `xsmall`: Blade DSL's Badge (Figma) draws small, medium and large only |
| `icon` | `icon` | **added** (a glyph token, see Icons) |
| `testID` | `testID` | same |
| styled props, `data-analytics-*` | `class`; — | rule 1; analytics **missing** (analytics pass) |

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
- **Theme note:** cx's colours are Blade's *neutral* theme (`uno.config.ts`),
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
cx: `BottomSheet` (`components/bottom-sheet/`), which is Modal in its
`sheet` variant. The header changes below are Modal's, so Modal has them
too.

**Decisions:** the sheet keeps its content height, with no snap points. On
desktop it keeps cx's capped, rounded panel, with `size` and `variant`. React's web sheet is full width at every size.

### Props

| React | cx | Action |
| --- | --- | --- |
| `isOpen` (controlled) | `bind:isOpen` | same |
| `onDismiss()` | `onDismiss({ source, close })` | **changed**: fires on every dismissal, dismissible or not; a dismissible sheet then closes, otherwise `close` ends it. Replaces `onBack` |
| `isDismissible` (default true) | `isDismissible` | same: whether a dismissal closes it by itself; hides the close button, as in React |
| `snapPoints` (default [0.35, 0.5, 0.85]) | — | **not ported** by decision: content height, drag only dismisses |
| — | `isDraggable` (default true) | cx-only: off hides the handle and stops the drag; settable through BladeProvider |
| `initialFocusRef` | — | **missing**: the panel takes focus, or content with `autofocus` |
| `zIndex` | — | n/a: the LayerHost stacks sheets |
| `BottomSheetHeader.title` | `title: string \| Snippet` | same; it names the dialog |
| `BottomSheetHeader.subtitle` | `subtitle: string` | same: one muted line under the title; it describes the dialog |
| `BottomSheetHeader` `leading`, `trailing`, `titleSuffix`, `showBackButton`, `onBackButtonClick`, `children` | `header` snippet | **removed** by decision (rule 2): the caller renders them in `header`, which receives the drawn title and subtitle to place among them |
| `BottomSheetBody` (`padding` spacing.5 \| spacing.0) | `body` snippet (16px) / `children` (raw) | rule 2 |
| `BottomSheetFooter` | `footer` snippet | rule 2; a padded box, the caller lays out its content (was `flex gap-4`, changed with Modal) |
| close button labelled "Close" | `closeLabel` (default `Close`) | **changed**: shows while dismissible, not only when labelled |
| `data-analytics-*` | — | **missing** (analytics pass) |

### Look (at phone width)

Measured against React Storybook at 390px. These match:
- the panel: 16px top radius, fill, and the upward shadow;
- title: position, type (16/24 semibold −3.3%) and colour;
- close button: 20×20 at 16px in, centred on the title's first line;
- body and footer padding (16px).

- **Header:** Blade's BaseHeader box. 16px padding (20px on desktop (`d`, 62.5rem)), a
  hairline under it, and the title's type. The close button is centred on the
  title's first line. With no title, subtitle or header, an 8px strip holds the close
  button, floating in a 28px circle. (Subtitle, back button and leading were
  measured to match React, then removed by decision.)
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
- The Android back button, as a dismissal (`source: 'back'`).

### cx-only features — decision pending

| Feature | What it does | Recommendation |
| --- | --- | --- |
| `onClosed` | the exit finished | keep |
| `role: dialog \| alertdialog` | the dialog's role | keep |
| `accessibilityLabel` | names an untitled sheet | keep |
| `chrome` snippet | content hung off the panel's top edge (above it or over it), beside the close button and handle; receives `close`. Modal's too | keep |
| `pace` | v2's quicker drawer easing | decide |
| `size`, `variant` | desktop panel width; `variant` picks `sheet` or `modal`; the app decides which (was `adaptive`, rule 11; no breakpoint switches it) | kept by the desktop decision |

### Checkout call sites

8 files. They pass `padding` (5), `title` and `snapPoints` (1), which is
React's API. These sites need porting: `padding` becomes `body` (padded) or
`children` (raw), and `snapPoints` is dropped.

### Status

Audited, fixed, and verified: `svelte-check` gives 0 errors; `test`
passes; the DOM measurements at phone width match React Storybook.



### Figma alignment (Blade DSL)

- `size` **removed**: Blade DSL's Bottom Sheet (Figma) has no sizes; the sheet is the 400px column on desktop (`d`).
- **Added** `leading`, `titleSuffix`, `trailing` in the header, per Figma; the header sits 12px under the handle strip.
- **Missing**: Figma's back button, input field and contentType variants.

---

## AnnouncementBanner

React: `AnnouncementBanner`. cx: `AnnouncementBanner` (`components/announcement-banner/`), from Blade DSL's Announcement Banner (Figma).

| React | cx | Action |
| --- | --- | --- |
| `children` (ReactNode) | `children` snippet | rule 2 |
| `alignment` (`center`, `left`) | same | same |
| `icon` | `icon` (an IconSource) | Icons rule |
| `accessibilityLabel` (default "Announcement") | same | same |
| `testID` | same | same |
| dark treatment under `colorScheme="dark"` | — | **missing**: cx has no dark theme |

### Figma alignment (Blade DSL)

- `surface.background.gray.subtle`, 8px above and below, 16px at the sides; the 16px icon 4px before the message.
- The message is Body/SmallMedium, 12/18 with no letter-spacing (React uses Text small, 12/17 at −1.3%), in `surface.text.gray.subtle`, on one line with an ellipsis.

---

## Avatar

React: `Avatar`, `AvatarGroup`. cx: the same (`components/avatar/`), from Blade DSL's Avatar and Avatar Group (Figma).

| React | cx | Action |
| --- | --- | --- |
| `name`, `src`, `alt`, `srcSet`, `crossOrigin`, `referrerPolicy` | same | same; a broken image falls back to the initials or the glyph (**added**) |
| `icon` (default `UserIcon`) | `icon` (an IconSource) | Icons rule |
| `size`, `variant`, `color`, `isSelected` | same | same values and defaults |
| `onClick`, `href`, `target`, `rel` | same | a button or a link |
| `topAddon` (Indicator only), `bottomAddon` (IconComponent) | `topAddon`, `bottomAddon` snippets | rule 2: each in a box sized and placed per size; a trusted badge is an image, not a tintable glyph |
| `AvatarGroup` `size`, `density`, `maxCount` | same | same; avatars register with the group, so `maxCount` needs no child counting |
| — | `AvatarGroup` `accessibilityLabel` | **added**: names the `role="group"` |
| `BladeCommonEvents`, styled props, `data-analytics-*` | `class`, `testID` | rule 1 / **missing** (analytics pass) |

### Figma alignment (Blade DSL)

- **Rim:** a 1px `surface.border.gray.subtle` rim on every avatar (React draws none); selected, 2px `surface.border.primary.normal`.
- **Tint:** `interactive.background.{color}.faded` over a white underlay, `…fadedHighlighted` on hover; initials and glyph in `interactive.text.{color}.normal`.
- **Initials:** Body Semibold 10/13 (xsmall, small), 12/17 (medium), 14/20 (large); Heading 20/26 at xlarge, where React uses 18/24.
- **Addons:** the indicator 6/6/8/8/10px at Figma's top-right offsets; the trusted badge 8/8/12/16/20px at the bottom right.
- **"+N":** `surface.background.gray.subtle` with `interactive.text.neutral.muted`.

---

## Breadcrumb

React: `Breadcrumb`, `BreadcrumbItem`. cx: the same (`components/breadcrumb/`), from Blade DSL's Breadcrumb (Figma).

| React | cx | Action |
| --- | --- | --- |
| `size`, `color` (default `primary`), `showLastSeparator`, `accessibilityLabel` | same | same |
| — | `emphasis` (`subtle`, `intense`) | **added** from Figma: intense is the stepper-like pill trail with chevrons |
| `BreadcrumbItem` `href`, `onClick`, `isCurrentPage`, `children`, `icon`, `accessibilityLabel` | same (`children` a snippet) | same / rule 2 |
| styled props, `data-analytics-*` | `class`, `testID` | rule 1 / **missing** (analytics pass) |

### Figma alignment (Blade DSL)

- **Subtle:** cx's Link per item (Body Medium, 12/16/16px glyph), 4px apart with a muted slash; neutral and white links at 0.56 opacity, primary full; the current page plain Body Medium, `aria-current="page"` on its `<li>`. Items register with the trail, so the separator needs no child counting.
- **Intense:** 28px pills (12px in, 16px radius, Body Small 12/18), 24px apart with a 16px chevron, gray wash on hover, the current page Semibold on `interactive.background.primary.faded` (white: `interactive.background.staticBlack.faded`). Figma draws it at small only, so `size` doesn't apply.

---

## BottomBar

React: `BottomBar` (renders fixed to the bottom). cx: `BottomBar` (`components/bottom-bar/`), from Blade DSL's Bottom Bar (Figma).

**Decision:** cx's BottomBar is only the surface; it does not position
itself. The consumer fixes it through `class` (`fixed inset-x-0 bottom-0`,
`sticky`, or in the flow), where React fixes it to the viewport.

| React | cx | Action |
| --- | --- | --- |
| `children` | `children` snippet | rule 2 |
| fixed positioning | — | **changed** by decision: the consumer's `class` |
| `testID` | `testID` | same |

### Figma alignment (Blade DSL)

- Surface `surface.background.gray.intense`, a 1px `surface.border.gray.muted` top border, and the Bottom Nav shadow (`0 -8px 24px`, the muted border colour) as `shadow-bottomBar`.
- 4px padding above and at the sides; Figma's 64px slot is the content's own height.
- Figma ends the bar in an iPhone home-indicator strip (an 8px gap and 15px); cx pads the bottom with the device's safe area (`env(safe-area-inset-bottom)`), at least 4px. It is non-zero only under `viewport-fit=cover`.

---

## Button and IconButton

React: `Button`, `IconButton`. cx: `Button` (`components/button/`) and
`IconButton` (`components/icon-button/`) over `runes/button/press.svelte.ts`.

### Button props

| React | cx | Action |
| --- | --- | --- |
| `variant: primary \| secondary \| tertiary` | `variant` | **removed** `tertiary` (deprecated in Blade DSL's Button, Figma; it drew as `secondary`); **removed** `link` by decision (an action that reads as a link waits for Link's button form, in the Link pass) |
| `color: primary \| white \| positive \| negative` (default primary) | `color` + `neutral` | **added** `white`; `neutral` kept (Blade supports it with its own tokens); **default now `primary`** (blue), was neutral (black) |
| `size` (default medium) | `size` | same values; now Blade's heights, padding and type |
| `icon`, `iconPosition` | `icon` (leading), `trailingIcon` | **changed**: Blade DSL's Button (Figma) has a leading and a trailing icon that may both show; `icon` alone is the icon-only square (28/32/36/48px, 16px glyph). Props, not children: the label's 4px each side is the gap, the icons sit on the padding |
| `children` (string) | `children` snippet | the label and any icons |
| `type` (default `button`) | `type` | **default changed** from `submit` to `button` |
| `href`, `target`, `rel` | same | **added**: an anchor; `isDisabled` ignored there, as in React |
| `isFullWidth` | `class="w-full"` | rule 1 |
| `isLoading`, `isDisabled`, `accessibilityLabel`, `onClick`, `testID` | same | same |
| `onBlur`, `onFocus`, pointer and touch events, `tabIndex` | — | **missing**; add on demand |
| `data-analytics-*` | — | **missing** (analytics pass) |
| — | `validateForm`, `autoPressAfter`, `loadingAnnouncement` | cx-only, pending (below) |

### IconButton props

| React | cx | Action |
| --- | --- | --- |
| `emphasis: intense \| subtle \| moderate` (default intense) | `emphasis: intense \| subtle` | **added**, replacing `variant: plain \| boxed`; **removed** `moderate` (not in Blade DSL's Icon Button, Figma) |
| `isHighlighted` | `isHighlighted` | **added** |
| `size: small \| medium \| large` | `size` | same; glyph 12/16/20px; a 24/32px box (8px radius) only when highlighted or moderate, never at large |
| `icon`, `accessibilityLabel` (required), `isDisabled`, `onClick`, `testID` | same | same |
| — | `isLoading`, `type`, `validateForm`, `loadingAnnouncement` | cx-only, pending (below) |

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

| Feature | What it does | Recommendation |
| --- | --- | --- |
| Busy keeps focus | `aria-disabled` + `aria-busy` rather than `disabled` | keep: React's disabled drops keyboard focus |
| `validateForm` | a `button` that validates the Form without submitting | keep: checkout forms |
| `autoPressAfter` | self-presses after N seconds, with a fill | keep: checkout redirects |
| `loadingAnnouncement` | live-region copy while busy | keep: React announces fixed English |
| IconButton `isLoading`, `type`, `validateForm` | IconButton shares Button's press | keep |

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

| React | cx | Action |
| --- | --- | --- |
| `variant`, `size`, `color` (defaults primary, medium, primary) | same | **added**; they override each Button's own, as in React |
| `isDisabled` | `isDisabled` | **added**; joins each Button's own, as in React (either disables it) |
| `isFullWidth` | — | **removed** by decision: `class="w-full [&>*]:flex-1"` (rule 1) |
| `children` (Button, Dropdown, Tooltip, Popover) | `children` snippet | same; React's dev check on child types is not ported |
| `testID` | `testID` | same |
| styled props, `data-analytics-*` | `class`; — | rule 1; analytics **missing** (analytics pass) |

### Look

Measured against React Storybook for primary and secondary. These match:
- the group: 38px at medium (36px buttons plus a 1px transparent border),
  8px radius (12px at large), clipped;
- filled seams: 1px wide, in `surface.border.gray.subtle`;
- outlined: buttons overlap by 1px, so the rims read as one line.

- **Separator:** React inserts a separator element between filled buttons.
  cx draws it as a 1px gap over the group's fill (new Uno class
  `bg-divider-gray-subtle`), since `children` is one snippet.
- **Corners:** inner corners square off; the end buttons keep their outer
  radius, as in React.
- **Not ported:** React removes the resting sheen from all but the first
  filled button.

### Behaviour

- `role="group"`. It is not a toolbar: each button is its own Tab stop.
- `resetButtonGroup()` (`runes/button/group.ts`) is React's
  OverlayContextReset: Buttons inside an overlay's content aren't styled by an
  enclosing group. Popover and Menu content should call it in their passes.

### Status

New, verified: `svelte-check` gives 0 errors; `test` passes; the
measurements match React Storybook.


### Figma alignment (Blade DSL)

- Filled buttons are split by a zero-width 1px subtle divider with no group border, so the group is exactly its buttons (Figma). React added a 1px transparent border and a 1px gap.

---

## Card

React: `Card`, `CardHeader*`, `CardBody`, `CardFooter*` (+ `TicketCard`,
`InfoCard`). cx: `Card` (`components/card/`).

### Props

| React | cx | Action |
| --- | --- | --- |
| `CardHeader` (+ Leading, Trailing, Icon, Counter, Badge, Amount, Text, Link, IconButton) | `header` snippet | rule 2: title, subtitle, prefix, suffix and trailing are the caller's |
| `CardBody` | `children` | rule 2; the `body` snippet is **removed** (same as `children` now) |
| `CardFooter` (+ Leading, Trailing, `actions`) | `footer` snippet | rule 2: the actions are the caller's Buttons |
| `size: large \| medium` | — | not ported: it only sized the header's title, which is the caller's now |
| `variant: primary \| secondary` | `variant` | same |
| `padding` (`spacing.0` \| `.3` \| `.4` \| `.5` \| `.7`, default `.7`) | `padding: spacing.5 \| spacing.7` | **added**; **removed** spacing.0/.3/.4: Blade DSL's Card (Figma) is 24px in, 16px its metric card's |
| `onClick` | `onClick` | **renamed** from `onPress`; now React's overlay button, where the card was itself one `<button>` |
| `href`, `target`, `rel` | same | **added**: a link overlay |
| `isSelected` | `isSelected` | **added** |
| `isDisabled` | `isDisabled` | same; now `aria-disabled` with no overlay |
| `as: 'label'` | `as` | **added** |
| `accessibilityLabel`, `testID` | same | same |
| `onHover` | — | **missing**; add on demand |
| `elevation`, `backgroundColor`, `borderRadius`, `shouldScaleOnHover` | — | deprecated in React (no-ops); not ported |
| `width`, `height`, min and max sizes, styled props | `class` | rule 1 |
| `data-analytics-*` | — | **missing** (analytics pass) |
| `TicketCard`, `InfoCard` | — | react-only |

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

### cx-only features — decision pending

| Feature | What it does | Recommendation |
| --- | --- | --- |
| `color` | a tinted card (v2's MagicCard tones) | decide: React has no tints |

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

| React | cx | Action |
| --- | --- | --- |
| `isChecked`, `defaultChecked` | `isChecked` (bindable) | rule 3 |
| `onChange({ isChecked, event, value })` | `onChange({ isChecked, value })` | rule 12; no `event` |
| `children` | `children` snippet (receives `{ isChecked, isDisabled }`) | same (the title) |
| `helpText` | `helpText` | **changed**: now under the title, indented to line up with it, and shown in every state, as React. It was one line under the control that the error replaced |
| `errorText`, `validationState` | same | **changed**: the error line is a separate FormHint under the whole control, led by Blade's error icon (the new shared `FieldHint`) |
| `isIndeterminate` | `isIndeterminate` | **added**: Blade's dash on a checked box; the input's `indeterminate` makes it read as mixed |
| `size: small \| medium \| large` | `size` | **added** (was medium only): box 12/16/20, border 1.5/1.5/2, mark 8/12/16, title 12/14/16, help 11/11/14, and the small box's 1px tick nudge |
| `name`, `isDisabled`, `isRequired`, `testID` | same | same |
| `value` | `value` | **added**: the input's `value` attribute |
| `tabIndex` | `tabIndex` | **added** |
| `data-analytics-*` | — | **missing** (analytics pass) |
| styled props | `class` | rule 1 |
| `CheckboxGroup` | — | react-only; add on demand (checkout has no group) |

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

| Feature | What it does | Recommendation |
| --- | --- | --- |
| `accessibilityLabel` | names a checkbox with no `children` | keep: React needs a visually hidden child for this |
| `parse` | maps `isChecked` to the value a Form collects | keep: checkout's Form integration needs it (5 call sites) |

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
(`runes/base/choice-list.svelte.ts`) like OptionList, but keeps the platform's
keys, as React does: a radio group picks as the arrows move, and each checkbox
is a tab stop.

### ChipGroup props

| React | cx | Action |
| --- | --- | --- |
| `children` (Chips) | `children` | rule 4: Chips register; anything may sit between them |
| `selectionType: single \| multiple` | same | same (default `single`) |
| `value`, `defaultValue` (`string \| string[]`) | `value` (bindable; a string, or an array with `multiple`) | rule 3 |
| `onChange({ name, values })` | same | rule 12: `values` is a list for single selection too |
| `label`, `accessibilityLabel` | same | same |
| `labelPosition` | — | not ported (rule 7): the label is always on top |
| `labelSuffix`, `labelTrailing` | `labelArea` | rule 9 |
| `necessityIndicator` | same | **added** (first in cx): `*` or `(optional)` after the label; `required` also requires |
| `helpText`, `errorText`, `validationState` | same | the error replaces the help text in one FormHint line, as React |
| `isDisabled`, `isRequired`, `name`, `testID` | same | same |
| `size: xsmall \| small \| medium \| large`, `color` | same | same (defaults `small`, `primary`) |
| `data-analytics-*` | — | **missing** (analytics pass) |
| styled props | `class` | rule 1 |

### Chip props

| React | cx | Action |
| --- | --- | --- |
| `value`, `children` (string) | `value`, `children` snippet (receives `{ isChecked, isDisabled }`; optional with `icon` or `leading`) | rule 2 |
| `icon`, `leading` | same | same (`icon` is an icon source; `leading` a snippet). Props, not children: Figma spaces the leading item differently from the label (the label's 4px each side is the gap and the text inset; the leading item has none) |
| `color`, `isDisabled` | same | same; both fall back to the group's |
| `width`, `minWidth`, `maxWidth` | `class` | rule 1 |
| `testID` | same | same |

### Look

Measured against React Storybook (Single Selection, Multi Selection) at the
same state:

- **Chip:** 30px tall (28px inner plus the 1px frame), 8px sides, 8px frame
  radius and 7px inner, the text box 4px each side, 14/20 text — widths match
  to the tenth of a pixel. The large label is Heading/MediumRegular (the
  heading face, 20/26) per Blade DSL's _Chip (Figma); React sets it in body
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

React: `Collapsible`, `CollapsibleButton`, `CollapsibleLink`, `CollapsibleBody`
(`CollapsibleText` is internal to other components). cx: `Collapsible` and
`CollapsibleChevron` (`components/collapsible/`), **new** — ported from React,
as checkout had none. Not a wrapper over `<details>`: that cannot open above
its trigger, cannot use a Button or Link as its trigger, and cannot animate
closing — React is a button plus a region too.

### Props

| React | cx | Action |
| --- | --- | --- |
| `isExpanded`, `defaultIsExpanded` | `isExpanded` (bindable) | rule 3 |
| `onExpandChange({ isExpanded })` | same | rule 12 |
| `direction: bottom \| top` | same | same: `top` opens the body above the trigger |
| `CollapsibleButton` (a Button) | `trigger` snippet with `{ isExpanded }` | rule 2: the wrapper toggles on a press, the caller's Button wires nothing; its first focusable element gets `aria-expanded`, and `aria-controls` while the body is mounted |
| `CollapsibleLink` (a BaseLink `button` with the chevron) | the caller's `Link variant="button"` with a `CollapsibleChevron` | rule 2; `CollapsibleChevron` is React's CollapsibleChevronIcon |
| `CollapsibleBody` (+ `width`) | `children` | rule 2; width through `class` (rule 1) |
| `testID` | same | same |
| `data-analytics-*` | — | **missing** (analytics pass) |
| styled props | `class` | rule 1 |

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

| React | cx | Action |
| --- | --- | --- |
| `value`, `max` | same | same: past `max` it reads `max+` |
| `color` (`neutral`, `positive`, `negative`, `notice`, `information`, `primary`) | same | same (default `neutral`) |
| `emphasis: subtle \| intense`, `size: small \| medium \| large` | same | same |
| `testID` | same | same |
| `data-analytics-*` | — | **missing** (analytics pass) |
| styled props | `class` | rule 1 |

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

| React | cx | Action |
| --- | --- | --- |
| `value`, `defaultValue` | `value` (bindable) | rule 3 |
| `onChange({ value })` | `onChange({ name, value })` | rule 12 |
| `min` (default 0), `max` | same | same: steps and typed values clamp to the range; each button disables at its end |
| `label`, `accessibilityLabel`, `name` | same | same; `name` registers the count with a Form |
| `labelPosition` | — | not ported (rule 7) |
| `labelSuffix`, `labelTrailing` | `labelArea` | rule 9 |
| `size: xsmall \| small \| medium \| large`, `emphasis: subtle \| intense` | same | same (defaults `medium`, `subtle`) |
| `isLoading`, `isDisabled` | same | same: both stop the buttons and grey the number; loading draws the bar |
| `onFocus`, `onBlur`, `testID` | same | same |
| `data-analytics-*` | — | **missing** (analytics pass) |
| styled props | `class` | rule 1 |

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

| React | cx | Action |
| --- | --- | --- |
| `orientation: horizontal \| vertical` | same | same |
| `dividerStyle: solid \| dashed` | `dividerStyle` | **renamed** from `line` |
| `variant: normal \| subtle \| muted` | `variant` | **added** (was muted only): `surface.border.gray.{variant}` |
| `thickness: thinner \| thin \| thick \| thicker` | `thickness` | **added** (was thin only): Blade's border widths |
| `width`, `height` | `class` | rule 1 |
| `testID` | same | same |
| styled props | `class` | rule 1 |

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

| React | cx | Action |
| --- | --- | --- |
| `DropdownButton` / `DropdownLink` / `DropdownIconButton` | `trigger` snippet (Menu, and Dropdown) | rule 2; the wrapper stamps `aria-haspopup` / `aria-expanded` |
| `SelectInput` | Dropdown without a `trigger`: `label`, `placeholder`, `helpText`/`errorText`/`successText`, `validationState`, `size`, `name`, `isRequired`, `isDisabled` | **changed**: the select field is the Dropdown's default trigger, not a separate component |
| `selectionType: single \| multiple` | Dropdown `isMultiple` | **changed** name; Menu has no selection |
| `ActionList` `onChange` (via SelectInput) | Dropdown `bind:value`, `onChange({ name, value })` | rule 3 |
| `isOpen`, `onOpenChange(isOpen)` | `bind:isOpen`, `onOpenChange({ isOpen })` | **changed**: the object form, as the other overlays |
| `DropdownOverlay` `defaultPlacement` (`bottom-start`) | `placement` | same default |
| `DropdownOverlay` `width` / `minWidth` / `maxWidth` / `zIndex` / `referenceRef` | — | **missing** (240–400px) |
| `DropdownHeader` (`title`, `subtitle`, `leading`, `trailing`, `titleSuffix`, search via AutoComplete) | `DropdownHeader` (`title`, `subtitle`, `trailing`, `hasSearch`) | same, minus `leading`/`titleSuffix`; search is built in |
| `DropdownFooter` | `DropdownFooter`, in the `footer({ close })` snippet | rule 2 |
| `ActionListItem` `title`, `value`, `description`, `leading`, `trailing`, `titleSuffix`, `isDisabled`, `onClick` | `ActionListItem` (Menu: `MenuItem`) same | same |
| `ActionListItem` `intent: 'negative'` | `ActionListItem` / `MenuItem` `intent` | same; refused with the select field, as React (draws neutral) |
| `ActionListItem` `isSelected` | — | derived from Dropdown's `value` |
| `ActionListItem` `href`/`target` | `ActionListItem` `href`, `target`, `rel` | same: a link row follows its link, closes the list and holds no value |
| `ActionListSection` | `ActionListSection` (Menu: anything between items) | same |
| — | Menu `onSelect(value)` | cx-only: an item's `value` is reported |
| No results / loading | Dropdown `emptyText` (search), `isLoading` | same |
| Nested dropdowns (submenus) | — | **missing** |
| `AutoComplete`, `FilterChipSelectInput`, tree view, country selector, virtualised list | — | **missing** |
| Below `m`: the overlay as a BottomSheet | — | **missing** |
| `data-analytics-*` | — | **missing** (analytics pass) |

### Look (one spec for both)

The designers agreed Menu and Dropdown should look the same; cx uses Menu's
spacing for both (`components/shared/popup-list.ts`):

- **Surface:** 240–400px wide, 12px radius, `popup.background.gray.moderate`, the 1px popup rim over the raised shadow (`shadow-dropdown`), the medium blur, 8px from the trigger. It opens sliding 8px down as it fades in, over `quick`.
- **Rows:** 8px round them, 2px between; each 36px, 8px padding, 8px radius. The active row (pointer or keys) is `interactive.background.gray.default`; the keys add Blade's 4px `surface.border.primary.muted` ring.
- **Dropdown adds:** the held single pick in Figma's darker wash (`interactive.background.gray.fadedHighlighted`); multiple rows lead with Checkbox's box; a header (16px in, 12px under); a footer (16px in); section headings (Semibold 12/17, muted).
- **Menu adds:** `intent="negative"` rows in `interactive.text.negative.normal` with the `interactive.background.negative.faded` wash.
- Figma's Dropdown is drawn with a 16px radius, no row gap and 4px list padding; per the designers, it follows Menu's here.

### Status

Menu ported to the core with its look unchanged; Dropdown added. `test` passes (`test/dropdown.test.ts`, the Menu cases in `test/popover.test.ts`, `runes/menu/menu.test.ts`).
---

## EmptyState

React: `EmptyState`. cx: `EmptyState` (`components/empty-state/`).

### Props

| React | cx | Action |
| --- | --- | --- |
| `asset` | `asset` snippet | **renamed** from `media` (rule 2) |
| `title?` | `title?: string \| Snippet` | now optional, as in React; a snippet is a superset |
| `description?` | `description?: string \| Snippet` | **renamed** from `message`; a snippet (a Link in it) is a superset, as Alert's |
| `children` | `children` snippet | now a direct child of the stack, as in React (no wrapper) |
| `size: small \| medium \| large \| xlarge` | `size` (default `medium`) | **added** |
| `testID` | same | same |
| styled props | `class` | rule 1 |
| analytics | — | not ported (none of cx has them yet) |
| — | ~~`color`~~ | cx-only, **removed** (below) |

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

| React | cx | Notes |
| --- | --- | --- |
| `FormLabel` | `FieldLabel.svelte`, `resolveFieldLabel` | **new** |
| `FormHint` | `FieldHint.svelte`, `resolveFieldHint` | gained `xsmall` |
| `CharacterCounter` | `FieldCounter.svelte`, `resolveFieldCounter` | **new** |
| `AnimatedFormHint` (`showHelpTextOnFocus`) | — | not ported; would come with TextInput |
| `FormLabel.position="left"` | — | rule 7 |

### FieldLabel

Props: `text`, `as: 'label' | 'span'` with `for` and `id`, `size`
(`xsmall`…`large`), `necessityIndicator`, `accessibilityText`, and `area`
(a field's `labelArea`, rule 9). The label element holds the text and its
necessity only; the row around it holds the gap to the field.

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
the edge, while `maxCharacters` is set (TextInput: unless `format` is).

### Fields on the shared chrome

Every field draws FieldLabel and FieldHint: ChipGroup, CounterInput,
TextInput, TextArea, OTPInput, PhoneNumberInput (through TextInput),
InputGroup, RadioGroup, SegmentedControl (through RadioGroup), OptionList,
VirtualOptionList and CardGroup (its cx-only field mode); Checkbox's title
is its label, and it draws FieldHint. The per-field label and hint strings
(`FIELD_LABEL`, `FIELD_HINT`, `FIELD_HINT_TONE`, `INPUT_LABEL`) are gone,
and so are the roots' `gap`s: the label and the hint carry their own.

### cx-only: `Form`

`components/form/Form.svelte` is a `<form>` whose fields register with it:
validation, submit, errors and revealing the first invalid field. React has no
equivalent; checkout depends on it. Recommendation: **keep**. It is not
pending on anything React has.

### Status

Audited, built and verified: `svelte-check` gives 0 errors; `test`
passes (`test/field.test.ts` is new); ChipGroup's and TextInput's labels
measure the same as React's.

Found on the way: the token contract's import stripper deleted every
`export const … ;` up to its first `;`, so exported style maps went
unchecked. Fixed; it caught Menu's `pe-2` (not a class here; now `pr-2`).


### Figma alignment (Blade DSL)

- The required `*` is semibold and 2px after the label (Figma's _FormGroup-Header); the character count is 11/16 at every size, including large.
- Figma's label → field gap is 3px at small (cx 4px), and its large help text is 14/16. Not changed yet.

---

## Icons

React's icons are components (`<ArrowRightIcon color size />`) that resolve a
colour token in JS and write it onto each path. cx's are **SVG imports** of
the same names, from `@razorpay/blade-svelte/icons`. Without a font plugin, each
is its SVG's URL, drawn as a mask over the text colour. With `bladeIconFontPlugin`
(Vite or webpack) each is a glyph (`{ name: 'arrow-right', code: '\uE01A' }`) of
the app's `blade-icons` font. Either way the colour is the text colour and the
size is the box, so a theme switch costs no JS.

| React | cx | Action |
| --- | --- | --- |
| ~452 `*Icon` components | 450 SVG exports in `@razorpay/blade-svelte/icons`, same names | **changed** from components to data; `Icon source={…}` draws one |
| `color` (`surface.icon.gray.normal`…) on the icon | `color` axis on `Icon` (`default`, `subtle`, `muted`, `primary`, …), or the host's text colour | **changed**: a host tints it, as everywhere in cx |
| `size` `xsmall`…`2xlarge` | `size` `2xsmall`…`xlarge` (6–24px) | same scale, less 32px |
| `BluetoothIcon`, `ScissorsIcon` | — | **missing**: stroke-drawn, a font only fills; outline them in Blade first |
| multicolour marks (`RazorpayTrustIcon`…) | `Image` | **moved**: icons are single-colour |

### The font

The package ships no font:
- each glyph as a `currentColor` SVG;
- a codepoint lockfile (`src-cx/icons/codepoints.json`, U+E000–U+EFFF);
- a barrel re-exporting the files.

`bladeIconFontPlugin` (`@razorpay/blade-svelte/vite` or `/webpack`) works like this:
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

The predefined set is regenerated from Blade React by `yarn generate-icons`. Codepoints never move: new glyphs append, and removed glyphs retire their code.

### cx names that changed

The old hand-drawn set mapped onto Blade's:

| Old | Blade |
| --- | --- |
| `warning` | `AlertTriangleIcon` |
| `card` | `CreditCardIcon` |
| `more` | `MoreHorizontalIcon` |
| `external` | `ExternalLinkIcon` |

The rest map directly, e.g. `chevronDown` → `ChevronDownIcon`. Switch's thumb check is not a glyph: it's drawn inline, so the Switch needs nothing enabled.

### Risks

- **Native renderer** (`packages/native`): needs to load the font (`formats: ['ttf']`) and honour `font-family`. Not yet verified; the image-based native Icon is gone.
- **Loading:** glyphs are blank until the font loads (`font-display: block`). The box is sized, so nothing shifts; preload the woff2 on critical screens.
- **User font overrides** (Firefox's "allow pages to choose their own fonts" off, dyslexia extensions) show boxes. A known icon-font limitation; accepted.
- **CSP:** with the plugin, `font-src` must allow the asset's origin, and no inline styles are needed. Without it, each icon's mask URL is an inline `style`.
- **Loading order:** the face is registered when the token module runs, not from CSS, so the woff2 starts loading with the JS. Preload it on critical screens if the blank moment shows.
- **Text content:** a glyph is a private-use character, so it's in `textContent`. It's `aria-hidden` and `select-none`, so assistive tech and copying skip it.

## Input / TextInput

React: `TextInput` (over `BaseInput`). cx: `TextInput` (`components/text-input/`).

### Props

| React | cx | Action |
| --- | --- | --- |
| `size: xsmall \| small \| medium \| large` | `size` | **added** |
| `textAlign` | `textAlign` | **added** |
| `labelSuffix`, `labelTrailing` | `labelArea` | rule 9 |
| `necessityIndicator` | same | **added**; `required` also makes the control required, as in React |
| `showClearButton`, `onClearButtonClick` | same | **added**: IconButton's medium look, while there is text; clears (`onChange` fires) and refocuses |
| `maxCharacters` | same | now also shows FieldCounter |
| `type: text \| telephone \| email \| url \| number \| search` | `type: text \| tel \| email \| url \| number` | rule 10: the HTML types, with Blade's per-type defaults; `number` renders as `text`. `search` is SearchInput's (below) |
| `onChange({ name, value })` | same | rule 12 |
| `keyboardReturnKeyType`, `autoCapitalize`, `autoCompleteSuggestionType` | `enterKeyHint`, `autoCapitalize`, `autoComplete` | rule 10; **added** |
| — | `inputMode` | rule 10; **added**: e.g. `numeric` digits in a `text` card-number field |
| `onClick`, `onKeyDown` | same | **added** |
| `prefix`, `suffix`, `leadingIcon`, `trailingIcon`, `leading`, `trailing`, `trailingButton` | `leadingIcon`, `prefix`, `leading` (selector snippet), `suffix`, `trailingIcon`, `trailing` (link snippet) | **changed**: Blade DSL's TextInput (Figma) has distinct slots, each with its own inset (text, glyphs and words 8/12px from the edge, a selector 4px) and gap; see the text-input README. `leading`/`trailing` are snippet-only (strings move to `prefix`/`suffix`) |
| `format` (a `#` mask) | `format` (parse/format functions or rule lists) | different: cx's is richer; a mask string is not accepted |
| `isLoading` | — | **gap**: no spinner in cx yet |
| `validationTextPlacement`, `showHelpTextOnFocus` | — | **gap** |
| tags (`isTaggedInput`, `tags`, …), dropdown slots | — | **gap** |
| `onSubmit` | — | covered by Form's Enter-to-submit |
| `labelPosition` | — | rule 7 |
| `defaultValue` | `bind:value` | rule 3 |

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

| Feature | What it does | Recommendation |
| --- | --- | --- |
| `type="password"` | the bare masked control PasswordInput builds on | keep (infrastructure); use PasswordInput |
| `role` | `searchbox` on the control | keep (SearchInput's) |
| `isReadOnly` | read-only control | keep |
| `span`, `attach` | InputGroup cell; PhoneNumberInput's handle | keep (infrastructure) |
| `pattern` | the control's validity pattern (PhoneNumberInput's, per country) | keep (infrastructure) |
| 16px text below `m` at medium | stops iOS zooming into the field | keep |


### Figma alignment (Blade DSL)

- `size`: small, medium, large: **removed** `xsmall` (not in Blade DSL's TextInput, Figma).
- Medium keeps 16px text on phones (iOS zoom) where Figma draws 14px. A selector passed in `trailing` sits 8px further in than Figma's trailing selector, since that slot takes the link inset.

---

## Input / TextArea

React: `TextArea`. cx: `TextArea` (`components/text-area/`).

| React | cx | Action |
| --- | --- | --- |
| `size` | `size` | **added** (TextInput's sizes) |
| `labelSuffix`, `labelTrailing` | `labelArea` | rule 9 |
| `necessityIndicator` | same | **added** |
| `showClearButton`, `onClearButtonClick` | same | **added**: pinned 8px down and 12px in, the text keeps 36px clear of it |
| `maxCharacters` | same | now also shows FieldCounter |
| `onKeyDown` | same | **added** |
| `numberOfLines` (default 2) | same | same |
| tags, `showHelpTextOnFocus` | — | **gap** |

Measured against React (Text Area): 2 lines are 56px of content plus the
border, 8/12px padding, the counter 2px from the end. cx-only: `isReadOnly`
(keep).


### Figma alignment (Blade DSL)

- `size`: medium, large (Figma). Large padding is 8px above and below and 12px at the sides (was 12px all round).

---

## Input / OTPInput

React: `OTPInput`. cx: `OTPInput` (`components/otp-input/`).

| React | cx | Action |
| --- | --- | --- |
| `otpLength: 4 \| 6 \| 8` | `otpLength: number` | superset |
| `onOTPFilled({ name, value })`, `onChange({ name, value })` | same | **renamed** from `onFilled`; rule 12 |
| `autoCompleteSuggestionType: none \| oneTimeCode` | `autoComplete` (default `one-time-code`) | rule 10 |
| `keyboardType` (default `decimal`) | `inputMode` (default `numeric`) | rule 10 |
| `keyboardReturnKeyType` | `enterKeyHint` | rule 10; **added** |
| `placeholder` (one character per cell) | same | **added** |
| `onFocus`, `onBlur` (with the cell's index) | `(event, index)` | **added** |
| `labelSuffix`, `labelTrailing` | `labelArea` | rule 9 |
| `size` | same | same; the label and hint take it |

**Look:** each cell takes Blade's natural input width, 88px, and shrinks in
a narrower box; the row is as wide as its cells (was: cells shared the full
width). Cell type 20/26 (24/32 at large), 36/48px tall, 8px apart.

**cx-only, pending:** `onClick`, `accept` (per-character filter),
`isRequired`, `isReadOnly`, `cellAccessibilityLabel` — keep all: checkout's
auto-read and i18n use them.


### Figma alignment (Blade DSL)

- Matches Figma (36/48px cells, 20/26 and 24/32 type, 8px gap); no change.

---

## Input / PhoneNumberInput

React: `PhoneNumberInput` (a Dropdown country selector). cx:
`PhoneNumberInput` (a TextInput, and a Modal picker from a ModalStack).

| React | cx | Action |
| --- | --- | --- |
| `size` | same | **added** |
| `showCountrySelector` | same | **added** |
| `onFocus`, `onBlur`, `onClick` | same | **added** (through TextInput) |
| `keyboardReturnKeyType`, `autoCompleteSuggestionType` | `enterKeyHint`, `autoComplete` (default `tel`) | rule 10; **added** |
| clear button, `onClearButtonClick` | same | **added**: always on while there is a number, as React |
| `labelSuffix`, `labelTrailing` | `labelArea` | rule 9 |
| `trailingIcon` | `trailing` | rule 2 |
| `defaultCountry`, `defaultValue` | `bind:country`, `bind:value` | rule 3 |
| `showDialCode` | same | same |
| `onChange` payload `{phoneNumber, dialCode, country, value, name}` | `PhoneNumberChange`: `{ country, dialCode, nationalNumber, value }` | **different**: no `name` (rule 12 not met) and no formatted `phoneNumber`; `nationalNumber` added |
| `onCountryChange({ country })` | same | rule 12 |

**Look:** the country button is React's: 56×28, 4px in, 6px round, a 20px
flag and a 16px chevron 4px apart, the gray faded fill on hover, the focus
outline flush; the dial code 12px on. It used to show the browser's grey
button background.

**cx-only, pending:** the picker is a Modal (a bottom sheet on phones) with
a search, not a Dropdown — keep: it is checkout's flow; `countries`
(required: the library ships no country data, the app supplies it); `isCountryFixed`,
`countryLabel`, `searchLabel`, `emptyText`, `closeLabel` — keep.


### Figma alignment (Blade DSL)

- `size`: medium, large (Figma). The selector follows Figma's _Input / Selector (28/36px tall, 6.5/9px in, a 20×15 or 24×18 flag, 12px chevron) on the field's padding; the dial code is 4px after it.
- **Added** `leadingIcon`, `trailingIcon`; `trailing` is snippet-only (string removed).

---

## Input / PasswordInput

React: `PasswordInput` (over `BaseInput`). cx: `PasswordInput`
(`components/password-input/`), a TextInput with its reveal state in
`runes/text-input/reveal.svelte.ts`.

| React | cx | Action |
| --- | --- | --- |
| `showRevealButton` (default true) | same | **new**: Blade's medium IconButton (eye / eye-off), "Show password" / "Hide password"; none while disabled, and a disabled field stays masked |
| `necessityIndicator: required \| none` | same | same (never `optional`) |
| `autoCompleteSuggestionType: none \| password \| newPassword` | `autoComplete: off \| current-password \| new-password` | rule 10 |
| `keyboardReturnKeyType` | `enterKeyHint` | rule 10 |
| autocapitalize off | `autoCapitalize="none"` | same |
| `label`, `accessibilityLabel`, `labelSuffix`/`labelTrailing`, `helpText`, `errorText`, `successText`, `validationState`, `maxCharacters`, `isDisabled`, `isRequired`, `placeholder`, `name`, `autoFocus`, `size`, `testID` | same; `labelArea` | rule 9 for the label area |
| `value`, `defaultValue`, `onChange({ name, value })` | `bind:value`, same | rules 3 and 12 |
| `showHelpTextOnFocus`, `labelPosition` | — | gap; rule 7 |
| — | `span`, `attach` | cx-only: an InputGroup cell (a CVV), a composition's handle |

The look is TextInput's, and the button is the clear button's. Replaces
TextInput `type="password"` at call sites (the InputGroup stories' CVV).


### Figma alignment (Blade DSL)

- `size`: medium, large (Figma). **Added** `leadingIcon`, `prefix`, `suffix` and `trailing` (the link, 8px before the reveal button); the reveal glyph is 16/20px.

---

## Input / SearchInput

React: `SearchInput` (over `BaseInput`). cx: `SearchInput`
(`components/search-input/`), a TextInput.

| React | cx | Action |
| --- | --- | --- |
| searchbox, search key | same | a `type="text"` control with `role="searchbox"` and `enterkeyhint="search"`, as Blade (a `search` input draws a second clear button) |
| `showSearchIcon` (default true) | same | **new**: the search glyph leads |
| clear button while it holds text, `onClearButtonClick` | same | always on, as Blade: clears (`onChange` fires) and refocuses |
| `trailing` | same (`string \| Snippet`) | after the clear button; Blade's trailing Dropdown is a **gap** |
| `isLoading` | — | **gap**: no Spinner in cx yet |
| `label`, `accessibilityLabel`, `labelSuffix`/`labelTrailing`, `helpText`, `placeholder`, `name`, `isDisabled`, `autoFocus`, `autoCapitalize`, `onClick`, `onFocus`, `onBlur`, `size`, `testID` | same; `labelArea` | rule 9 for the label area |
| `value`, `defaultValue`, `onChange({ name, value })` | `bind:value`, same | rules 3 and 12 |
| Dropdown trigger (SearchInput inside a Dropdown) | `DropdownHeader hasSearch` | the search lives in the Dropdown's header |
| `onSubmit` | — | covered by Form's Enter-to-submit |
| — | `onKeyDown` | cx-only, pending: keep |
| `showHelpTextOnFocus`, `labelPosition` | — | gap; rule 7 |

Was TextInput `type="search"`, which is gone: the glyph, role and key moved
here.


### Figma alignment (Blade DSL)

- `size`: medium, large (Figma). The glyph is TextInput's `leadingIcon`, so it is sized per field, 12px in and 8px from the text.

---

## InputGroup

React: `InputGroup` with `InputRow`s (`gridTemplateColumns`). cx:
`InputGroup`, whose members take a `span` (`full`, `1/2`, `1/3`, …) on a
12-column grid.

| React | cx | Action |
| --- | --- | --- |
| `size` | same | **added**: members take it, as in React, and the corners round at 12px when large |
| `InputRow` | member `span` | different composition; keep (spans cover every React layout seen) |
| `label`, `helpText`, `errorText`, `successText`, `validationState`, `isDisabled` | same | same |

**Look:** stacked rows share 1px seams, the group's corners are rounded, the
hint sits 4px under — as React's Default story.


### Figma alignment (Blade DSL)

- `size`: medium, large (Figma).


**Error, as React:** the group's error doesn't turn the members' frames red. React's InputGroup uses `validationState` only for its hint line; cx's hint line turns negative and carries it, and the members stay `aria-invalid`. (cx used to draw the thick negative border on every member.)
---

## Radio, RadioGroup

React: `RadioGroup`, `Radio`. cx: same (`components/radio/`).

| React | cx | Action |
| --- | --- | --- |
| `RadioGroup.onChange({ name, value })` | same | rule 12 |
| `RadioGroup.size` | same | **added**: circles 12/16/20px, dots 4/6/8px, title 12/14/16px, gaps 4/8/12px |
| `RadioGroup.orientation` | same | same; horizontal rows wrap (React: `flexWrap`, default `nowrap`) |
| `Radio.helpText` | same | **added**: indented under the title, describes the radio |
| `Radio.trailing` | — | **removed**: cx-only, and Blade DSL's Radio (Figma) has no trailing slot |
| `Radio.size` | — | the group's size wins in React; not ported |
| `labelPosition` | — | rule 7 |

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

React: `Link` (over `BaseLink`). cx: `Link` (`components/link/`).

### Props

| React | cx | Action |
| --- | --- | --- |
| `variant: anchor \| button` | same | same |
| `color: primary \| white \| positive \| negative \| notice \| information \| neutral` | same | `white`, `notice`, `information` **added** |
| `size: xsmall \| small \| medium \| large` | same | same |
| `icon`, `iconPosition: left \| right` | `icon` (leading), `trailingIcon` | **changed**: Blade DSL's Link (Figma) has leading and trailing icons that may both show |
| `children` (optional with an icon) | same | now optional: an icon-only link, named by `accessibilityLabel` |
| `htmlTitle` | same | **added** (`title`) |
| `href`, `target`, `rel` | same | same; `_blank` adds `noopener noreferrer` |
| `isDisabled` (button only) | on both | cx-only on the anchor, pending (below) |
| `onClick` | same | same; an app router takes plain internal clicks (adapter) |
| `accessibilityProps`, `hitSlop`, `opacity`, pointer events | — | not ported (`accessibilityLabel` covers naming) |

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

| Feature | What it does | Recommendation |
| --- | --- | --- |
| `isDisabled` on an anchor | drops the `href`, marks it `aria-disabled` | keep |
| `download` | saves instead of navigating | keep |


### Figma alignment (Blade DSL)

- `color`: primary, white, neutral, positive, negative: **removed** `notice`, `information` (not in Figma).
- Letter-spaced −1.3% (−3.3% at large), per Figma.

---

## Modal

React: `Modal`, `ModalHeader`, `ModalBody`, `ModalFooter`. cx: `Modal`
(`components/modal/`). The header, body and footer are shared with
BottomSheet; see its section for the header decisions (rule 2).

### Props

| React | cx | Action |
| --- | --- | --- |
| `isOpen`, `onDismiss()` | `bind:isOpen`, `onDismiss({ source, close })` | **changed**, as BottomSheet: fires on every dismissal, dismissible or not; a dismissible modal then closes, otherwise `close` ends it |
| `isDismissible` | same | same |
| `size: small \| medium \| large \| full` (default `small`) | same | **changed** from `default \| full`: Blade's 400, 760 and 1024px columns |
| `accessibilityLabel` | same | same |
| `initialFocusRef` | — | **missing**, as BottomSheet |
| `zIndex` | — | n/a: the LayerHost stacks modals |
| `ModalHeader` (`title`, `subtitle`, `leading`, `trailing`, `titleSuffix`, back button) | `title`, `subtitle` + `header` snippet | `subtitle` kept as a string; the rest rule 2 (see BottomSheet) |
| — | `chrome` snippet | cx-only: a zero-height box on the panel's top edge, unclipped, holding the close button and a sheet's handle; the caller adds things that hang off the panel |
| `ModalBody` (`padding` spacing.6 \| spacing.0) | `body` snippet (20px) / `children` (raw) | rule 2 |
| `ModalFooter` | `footer` snippet | rule 2 |
| `data-analytics-*` | — | **missing** (analytics pass) |

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
- **Scrim:** `overlay.background.subtle`, the LayerHost's.
- Not ported: React's 320px minimum width (a checkout frame can be narrower).

### cx-only features — decision pending

| Feature | What it does | Recommendation |
| --- | --- | --- |
| `variant: modal \| sheet \| drawer \| left-drawer` | centred, Blade's BottomSheet, Blade's Drawer, or the drawer on the left; the app picks | keep: BottomSheet and Drawer ride it (`placement` removed) |
| `pace` | v2's quicker easing | decide (as BottomSheet) |
| `onClosed`, `role`, `closeLabel` | as BottomSheet | keep |
| `ModalStack`, imperative `openModal` | a stack of modals opened from code, a lazy body with a pending state | keep |

### Status

Audited, fixed, and verified: `svelte-check` gives 0 errors; `test`
passes; the measurements match React Storybook at every size.


### Figma alignment (Blade DSL)

- **Title:** Heading/SmallSemibold 18/24 (Figma); React uses body 16/24.
- **Added** `icon`, `leading`, `titleSuffix` and `trailing({ close })` in the header, per Figma's _Modal Header: the leading item 8px from the title, the trailing item 16px from the title and from the close button. Why they are props: see the modal README.
- **Sections:** header 20px above and beside, 16px below, at every width (Figma's _Modal Header; was 16px below `m`); the close a 20px glyph in Figma's 28px box, 24px from the top and the end, the title row leaving 44px for it; a `leading` snippet in Figma's 32px slot, centred on the title block (`icon` stays on the title line). Footer 16px above the actions (20px beside and below on desktop (`d`)).
- **Drawer:** 380px on desktop (`d`) and 100% − 24px on phones (Figma; React 375/420px); header 20px in with no divider; **added** `titleSuffix`, `trailing`; Figma's detail block under the title is **missing**.
- **Missing**: Figma's full-width square modal on phones, the `padding` variant (20/16/0), and the full-page modal.

---

## Popover

React: `Popover` (with `PopoverInteractiveWrapper` for a non-button trigger).
cx: `Popover` (`components/popover/`), whose panel Menu shares.

### Props

| React | cx | Action |
| --- | --- | --- |
| `children` (the trigger) | `trigger` snippet (receives `isOpen`) | **changed**: one name for the trigger across Popover, Tooltip, Menu and Collapsible |
| `content` | `children` snippet (receives `close`) | **changed**: `children` is always the content |
| `title` | `title: string \| Snippet` | **added**: the heading, and it names the dialog |
| `titleLeading` | snippet (receives `close`) | **added** |
| `footer` | snippet (receives `close`) | **added** |
| `placement` (default `top`) | same | default **changed** from `bottom-start` |
| `openInteraction: click \| hover` | same | **added**: hover opens under the pointer, over the trigger or the panel (100ms to cross the gap), with no close button and no focus move |
| close button (with `click`) | same, `closeLabel` (default `Close`) | **added**: beside the title, or floating in the corner without one |
| `isOpen`, `onOpenChange({ isOpen })` | `bind:isOpen`, same | rule 12 |
| `defaultIsOpen` | `bind:isOpen` | rule 3 |
| `maxWidth` | — | rule 1 would put it on `class`, which lands on the trigger; not ported |
| `initialFocusRef` | — | **missing**: focus goes to the first control (as React without it) |
| `zIndex` | — | n/a: the LayerHost stacks panels |
| `data-analytics-*` | — | **missing** (analytics pass) |

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

| Feature | What it does | Recommendation |
| --- | --- | --- |
| `isDisabled` | the trigger does not open it | keep |
| `accessibilityLabel` | names an untitled panel | keep |

### Status

Audited, fixed, and verified: `svelte-check` gives 0 errors; `test`
passes; the panel, header, gap and arrow measure as React's.


### Figma alignment (Blade DSL)

- **Added** `titleIcon` (`IconSource`, 20px) beside `titleLeading` (snippet, for an asset), per Figma's _Popover Title, whose leading item is an icon or an asset.
- Leading → title is 8px; title → close is 24px (the title's 12px plus the row's 12px), per Figma.

---

## SegmentedControl

React: `SegmentedControl`, `SegmentedControlItem`. cx: the same
(`components/segmented-control/`), a RadioGroup drawn through its internal
`look`.

### Props

| React | cx | Action |
| --- | --- | --- |
| `size: small \| medium \| large` | same | same |
| `label`, `accessibilityLabel`, `helpText`, `errorText`, `validationState`, `isDisabled`, `isRequired`, `name` | same | same |
| `necessityIndicator` | same | **added** (through RadioGroup) |
| `value`, `defaultValue`, `onChange({ name, value })` | `bind:value`, same | rule 3; rule 12 |
| `labelPosition` | — | rule 7 |
| `SegmentedControlItem` `value`, `leading`, `isDisabled`, `accessibilityLabel`, `children` | same, but React's `leading` icon → `icon` (an `IconSource`, as Chip, MenuItem, TabItem); **added** `leading` (an asset snippet) and `trailing` (a Counter or Badge), as Blade DSL's _Segmented Control / Item (Figma) has | **renamed**, **added** |
| — | `labelArea`; hints `string \| Snippet`; item snippets receive `{ isChecked, isDisabled }` | cx-only, across Chip, Radio, Checkbox, Switch and SegmentedControl (rule 9) |

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
  centred. That one gap, owned by the segment, is why `icon`, `leading` and
  `trailing` are props rather than children.
- **Icon:** 16px, 20px at large (was 16px everywhere), 8px from the label.
- **Thumb:** `surface.background.gray.intense`, round as the segment,
  sliding at moderate/standard (was quick); hover fills an unpicked segment
  with `interactive.background.gray.default` at gentle; focus is the inset
  4px `surface.border.primary.muted` ring.

### cx-only features — decision pending

| Feature | What it does | Recommendation |
| --- | --- | --- |
| `color: neutral \| white` | the pill over a brand-colour pane | keep |

### Status

Audited, fixed, and verified: `svelte-check` gives 0 errors; `test`
passes; every size measures as React's.

---

## Skeleton

React: `Skeleton`. cx: `Skeleton` (`components/skeleton/`).

| React | cx | Action |
| --- | --- | --- |
| `width`, `height`, min/max sizes, `borderRadius`, flex props, styled props | `class` | rule 1 |
| `testID` | same | same |

**Look** (computed styles against React's Default story): the
`interactive.background.gray.default` fill, hidden from assistive tech.

- **Fade-in added:** the bone fades in over `2xgentle` (0.96s), then pulses
  to `gray.highlighted` and back (1.32s, alternating) from 0.96s on, both on
  the standard curve. cx only pulsed. The fade uses `both` fill, so with
  reduced motion (no animation) the bone still shows.
- **No default radius**, as React: it was 4px. The shape is the caller's
  `class`; ModalPending and the stories now pass `rounded-xsmall`; Async's
  bones pass none.

No cx-only features. **Status:** done; `svelte-check` gives 0 errors and
`test` passes.


### Figma alignment (Blade DSL)

- Figma's Skeleton Loader has a 16px radius; cx leaves the radius to the caller's class.

---

## Switch

React: `Switch`. cx: `Switch` (`components/switch/`). Its colours, motion
and thumb check were ported from React earlier.

| React | cx | Action |
| --- | --- | --- |
| `isChecked`, `defaultChecked`, `onChange({ isChecked, value, event })` | `bind:isChecked`, `onChange({ isChecked })` | rule 3; rule 12 (no `value`: cx's form value is `parse`) |
| `size: small \| medium` | same | same |
| `isDisabled`, `name`, `accessibilityLabel`, `testID` | same | same |
| `value` (the submitted string) | `parse` | cx's form model: `parse(isChecked)` is the submitted value |
| `id` | — | not ported (the control's id is internal) |

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
Blade's `TabList` is an intermediate container, so it becomes the `tabs`
snippet (rule 2); the panels are `children`.

```svelte
<Tabs bind:value>
  {#snippet tabs()}
    <TabItem value="upi">UPI</TabItem>
    <TabItem value="card" icon={card}>Card</TabItem>
  {/snippet}
  <TabPanel value="upi">…</TabPanel>
  <TabPanel value="card">…</TabPanel>
</Tabs>
```

### Props

| React | cx | Action |
| --- | --- | --- |
| `variant: bordered \| borderless \| filled` (default `bordered`) | same | **added** (was `layout: auto \| fill`) |
| `size: small \| medium \| large` | same | `small` **added** |
| `orientation: horizontal \| vertical` | same | **added** |
| `isFullWidthTabItem` | same | **added** (replaces `layout="fill"`) |
| `isLazy` | same | **added**: panels mount only while picked; otherwise all stay mounted, hidden, as Blade |
| `value`, `defaultValue`, `onChange` | `bind:value`, `onChange` | rule 3; the first enabled tab is picked when unset, as Blade |
| `TabList` | `tabs` snippet | rule 2 |
| `TabItem` `value`, `leading`, `trailing`, `isDisabled`, `href`, `onClick`, `children` | same, but React's `leading` icon → `icon` (an `IconSource`, as MenuItem, Chip, Link), plus `leading` for an asset in the icon's box, as Blade DSL's _Tabs Leading Item (Figma) is an icon or an asset; `children`, `leading` and `trailing` receive `{ isSelected, isDisabled }` | **added**: all but `value` and the label; **renamed** `leading` |
| `TabPanel` `value`, `children` | same | composed (was the per-item snippet) |
| `items`, `itemKey`, `itemLabel`, `isItemDisabled`, `tab` | — | **removed**: rule 4 |

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
  at small), 8/12px round; the tabs share it; a `surface.background.gray.
  intense` pill slides to the pick, round as the tab (6px at small).
  Vertical: the picked tab fills itself, 12px in.
- **Icons** 16px (20px at large), 8px from the label; **focus** is the inset
  4px ring; everything else moves at gentle/standard.
- **Panels** have no padding of their own (was 16px above).

### Behaviour

One tab stop; arrows on either axis, Home and End move between enabled
tabs, wrapping. cx keeps `activation` (default `automatic`: moving focus
picks, the APG default); `manual` picks on a press, Enter or Space, as
Blade does.

### cx-only features — decision pending

| Feature | What it does | Recommendation |
| --- | --- | --- |
| `activation: automatic \| manual` | whether focus moving picks | keep (Blade is `manual`) |
| `accessibilityLabel` | names the tablist | keep |

### Status

Audited, rebuilt, and verified: `svelte-check` gives 0 errors; `test`
passes; every variant, size and orientation measures as React's.

---

## Toast

React: `useToast().show(…)` with a `ToastContainer`. cx: `showToast(…)`
(from anywhere, over a queue) with a `ToastStack` (`components/toast/`).

### Options

| React | cx | Action |
| --- | --- | --- |
| `content` | same | **renamed** from `message` (a string) |
| `leading` | `icon` (`IconSource`) | **renamed** to `icon`, the library's name for a glyph (Alert, Chip, MenuItem, TabItem); each colour has Blade's default glyph (info, check-circle, alert-triangle, alert-octagon) |
| `color` | same | same |
| `action: { text, onClick, isLoading }` | same names; `onClick()` is required and takes no arguments | **renamed** from `{ label, onPress }`; `isLoading` added (disables it, `aria-busy`). Pressing it no longer dismisses the toast, as Blade: call the handle's `dismiss()` |
| dismiss button | always shown, `closeLabel` (default `Dismiss toast`) | **changed**: it showed only when `closeLabel` was passed |
| `onDismissButtonClick` | `onDismissButtonClick()` (no arguments) | **added** |
| `autoDismiss` (default true), `duration` (default 4000) | same | **added** `autoDismiss`; `duration` now defaults to 4000 here |
| `id`, `toast.dismiss(id)` | the returned handle's `dismiss()` and `dismissed` | cx's handle |
| `type: promotional` | — | **gap**: arbitrary content, gray, the action under it |

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

| Feature | What it does | Recommendation |
| --- | --- | --- |
| `onDismiss(reason)`, `dismissed` | how it went: `timeout`, `dismiss` (the button or the handle), `evicted`, `cleared` | keep |
| `closeLabel` | i18n for the dismiss button | keep |

**Status:** done; `svelte-check` gives 0 errors and `test` passes;
the toast measures as React's.


### Figma alignment (Blade DSL)

- **Added** `leading` (a snippet, in place of the glyph) to `showToast`: Figma's leading item is an icon or an asset.
- Content → action or cross is 12px (Figma). Figma's desktop action is a Link; cx keeps an xsmall secondary white Button.

---

## Tooltip

React: `Tooltip` (with `TooltipInteractiveWrapper` for a non-focusable
trigger). cx: `Tooltip` (`components/tooltip/`).

| React | cx | Action |
| --- | --- | --- |
| `content` (string) | `content: string`, or a `children` snippet for rich content | superset |
| `title` | `title: string \| Snippet` | **added** |
| `placement` (default `top`; no `left/right-start/end`) | same (all twelve) | superset |
| `onOpenChange({ isOpen })` | same | rule 12 |
| `children` (the trigger) | `trigger` snippet (receives `isOpen`) | **changed**: one name for the trigger across the overlays |
| `maxWidth` | — | rule 1 would put it on `class`, which lands on the trigger; not ported |
| `zIndex` | — | n/a: the LayerHost stacks it |

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
- Caption styles have no component yet.

---

## Carousel

- Indicators: 6px dots 4px apart; the current one an 18px pill, with its width animating (Figma _Carousel Indicators). Before: 8px dots 6px apart.
- **Missing**: Figma's navigation buttons, `visibleItems` and `navPosition`, white and blue indicators, and the 10px root gap (cx 8px).

---

## ActionList

React: `ActionList`, `ActionListItem`, `ActionListSection` — the rows of every Dropdown, of BottomSheet bodies and of the country selector. cx: the same names (`components/action-list/`), working in two contexts.

- **Inside a Dropdown:** the items are the Dropdown's options (`role="option"`, or a link). The Dropdown holds the value; `ActionList` is only their group.
- **Standalone:** a wrapper over `OptionList`, which takes ActionList's look as `classes` (`resolveActionList()`; native radios or checkboxes, `bind:value`, form field, keyboard, virtualisation). React's standalone ActionList takes a controlled `selectedValue`; cx binds the value, as OptionList.
- **One row:** both contexts draw `shared/ActionListRow.svelte` with the `shared/popup-list` classes, so standalone rows match Menu and Dropdown (36px, 2px apart, 8px radius, the selected wash, a drawn checkbox for multiple). PhoneNumberInput's country picker uses it too.

| React | cx | Action |
| --- | --- | --- |
| `ActionList` `children` | `children` | rule 2 |
| `ActionList` `selectionType`, `selectedValue` (standalone) | `isMultiple`, `bind:value`, `onChange` | **changed**: the list holds the value, as OptionList |
| `ActionList` `isVirtualized` | `VirtualOptionList` with `classes={resolveActionList()}` | **changed** |
| `ActionListItem` `title`, `value`, `description`, `leading`, `trailing`, `titleSuffix`, `isDisabled`, `onClick` | same (`icon` for a glyph leading) | same |
| `ActionListItem` `href`, `target` | `href`, `target`, `rel` | same: a link row, never a value |
| `ActionListItem` `intent: 'negative'` | `intent` | same; with the Dropdown select field it draws neutral (React throws) |
| `ActionListItem` `isSelected` | — | derived from the value |
| `ActionListSection` (`title`, a divider after) | `ActionListSection` | same (the hairline is drawn above every section but the first) |
| `ActionListItemIcon`, `…Asset`, `…Avatar`, `…Badge`, `…BadgeGroup`, `…Text` | `icon`, and `leading` / `titleSuffix` / `trailing` snippets | rule 2 |

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
4. **The shape is data-driven by default** (`items` plus a key and snippets),
   where React composes children. Names and props still follow React.
   Exception: Accordion went compositional (`AccordionItem`) by decision.
5. **The look follows React.** Checkout-specific looks are dropped and noted per
   component.
6. **cx-only features** (props React lacks) are listed per component with a
   recommendation. Each one is **pending** until decided.

## Inventory

Status: `common` means present on both sides, `react-only` means src-cx lacks it,
`cx-only` means React lacks it, and `n/a` means internal, a motion preset, or
replaced by a rule.

| React | src-cx | Status |
| --- | --- | --- |
| Accordion | `accordion` | common, **done** |
| ActionList | — (`option-list` is a different thing) | **deferred** to Dropdown/Menu; see below |
| Alert | `alert` | common, **done** |
| Amount | `amount` | common, **done** |
| AnimateInteractions | — | n/a (motion) |
| AnnouncementBanner | — | react-only |
| AppBar | — | react-only |
| AutoComplete | — | react-only |
| Avatar | — | react-only |
| Badge | `badge` | common, **done** |
| BaseAnimatedValue, BaseHeaderFooter, BaseMenu, BaseMotion | — | n/a (internal) |
| BladeProvider | — | n/a (theming is CSS variables and Uno classes) |
| BottomBar | — | react-only (compare with cx `footer-bar`) |
| BottomDock | — | react-only |
| BottomNav | — | react-only |
| BottomSheet | `bottom-sheet` | common, **done** |
| Box | — | n/a (rule 1) |
| Breadcrumb | — | react-only |
| Button / IconButton | `button` / `icon-button` | common, **done** |
| ButtonGroup | `button-group` | common, **done** (new) |
| Card | `card` | common, **done** |
| Carousel | `carousel` | common |
| Charts | — | react-only |
| ChatInput, ChatMessage | — | react-only |
| Checkbox | `checkbox` | common |
| Chip | — | react-only |
| Collapsible | — | react-only |
| Confirmation | — | react-only |
| Counter | — | react-only |
| CounterInput | — | react-only |
| CreationView | — | react-only |
| DatePicker | — | react-only |
| DetailedView | — | react-only |
| Divider | `divider` | common |
| DotLoader | — | react-only (cx Button draws its own loader) |
| Drawer | — | react-only |
| Dropdown | `menu` | common (partial) |
| Elevate, Fade, Morph, Move, Scale, Slide, Stagger | — | n/a (motion) |
| EmptyState | `empty-state` | common |
| FileUpload | — | react-only |
| FilterChip | — | react-only |
| FloatingActionButton | — | react-only |
| Form (FormLabel, FormHint, CharacterCounter) | `form`, `shared/field` | common (React: field chrome; cx: a `<form>` with field registration) |
| FormGroup | — | react-only |
| GenUI | — | react-only |
| Icons | `icon`, `icons` | common |
| Indicator | — | react-only |
| InfoGroup | — | react-only |
| Input / TextInput | `text-input` | common |
| Input / TextArea | `text-area-input` | common |
| Input / OTPInput | `otp-input` | common |
| Input / PhoneNumberInput | `phone-number-input` | common |
| Input / PasswordInput, SearchInput, PaymentInput, ColorInput, SliderInput | — | react-only |
| InputGroup | `input-group` | common |
| LightBox | — | react-only |
| Link | `link` | common |
| List | — | react-only |
| ListView | — | react-only |
| LiveAnnouncer | — | n/a |
| Menu | `menu` | common |
| Modal | `modal` | common |
| OverlayContextReset | — | n/a |
| Pagination | — | react-only |
| Popover | `popover` | common |
| PopupArrow | — | n/a (internal) |
| Preview | — | react-only |
| ProgressBar | `progress` | common |
| QuickFilters | — | react-only |
| Radio | `radio` | common |
| RollingText | — | react-only |
| SegmentedControl | `segmented-control` | common |
| SelectableCard | — | react-only |
| Settings | — | react-only |
| SideNav | — | react-only |
| Skeleton | `skeleton` | common |
| SkipNav | — | react-only |
| Spark | — | react-only |
| Spinner | — | react-only |
| SpotlightPopoverTour | — | react-only |
| StepGroup | — | react-only |
| Switch | `switch` | common |
| Table | — | react-only |
| Tabs | `tabs` | common |
| Tag | — | react-only |
| TimePicker | — | react-only |
| Toast | `toast` | common |
| Tooltip | `tooltip` | common |
| TopNav | — | react-only |
| TreeView | — | react-only |
| TrustBadge | `trust-badge` | common |
| Typography (Text, Heading) | `text`, `heading` | common |
| Typography (Display, Code) | — | react-only |
| VisuallyHidden | — | n/a (`sr-only` class) |
| — | `async` | cx-only |
| — | `countdown` | cx-only |
| — | `footer-bar` | cx-only |
| — | `image` | cx-only |
| — | `layer` (LayerHost, Surface) | cx-only (overlay infrastructure) |
| — | `nav-stack` | cx-only |
| — | `screen` | cx-only |
| — | `virtual` | cx-only |
| — | `shared` | n/a (internal) |

---

## Accordion

React: `Accordion`, `AccordionItem`, `AccordionItemHeader`, `AccordionItemBody`.
cx: `Accordion` and `AccordionItem` (`components/accordion/`) over `runes/accordion`.
Compositional like React (an exception to rule 4, by decision): items are
`AccordionItem` children, and a data list is an `{#each}`.

### Props

`Accordion`:

| React | cx | Action |
| --- | --- | --- |
| `variant: 'filled' \| 'transparent'` (default transparent) | `variant` | **renamed** from `boxed`/`plain`; default now `transparent` |
| `size: 'large' \| 'medium'` (default large) | `size` | **added** |
| `showNumberPrefix` | `showNumberPrefix` | **added** (`1.`, `2.`, …); wins over `leading`, as in React |
| `expandedIndex`, `defaultExpandedIndex` | `bind:value` | rule 3. The value is the item's `value`, its index by default, so an index works as in React |
| `onExpandChange({ expandedIndex })` (-1 = none) | `onChange(value \| null)` | `null` for none. Same behaviour: one open at a time, a second press closes it |
| `children: AccordionItem[]` | `children` | same |
| `maxWidth`, `minWidth`, styled props | `class` | exempt (rule 1). React's MAX/MIN_WIDTH defaults (200–360 min, 640/800 max) are not baked in |
| `testID` | `testID` (each header gets `${testID}-${index}`) | same |
| `data-analytics-*` | — | **missing**, to add with the analytics pass across components |

`AccordionItem` (React's `AccordionItemHeader` props flattened onto it):

| React | cx | Action |
| --- | --- | --- |
| *(index)* | `value` (default: index) | **added**: a stable identity for `bind:value` |
| `AccordionItemHeader.title` | `title: string \| Snippet` | same; a snippet sizes its own text |
| `AccordionItemHeader.subtitle` | `subtitle: string \| Snippet` | same |
| `AccordionItemHeader.leading` | `leading` snippet | same (rule 2) |
| `AccordionItemHeader.trailing` | `trailing` snippet | **changed**: replaces the chevron. React's `trailing` sits before the chevron |
| `AccordionItemHeader.titleSuffix` | — | **dropped** by decision; use a `title` snippet |
| `AccordionItemHeader.children` | — | **dropped**; use `header` |
| — | `header` snippet | cx-only: replaces leading, title and subtitle |
| `AccordionItemBody` | `content` snippet, inside Blade's body box | rule 2 |
| — | `children` snippet | cx-only: a full-width custom body without the body box; `content` wins over it |
| `isDisabled` | `isDisabled` | same |
| `testID` | `testID` | same; overrides the Accordion's `${testID}-${index}` |
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
  and the `opacity-600` disabled root.
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
- `items`, `itemKey`, `compare`, `isItemDisabled`: the Accordion is compositional
  now, so these become per-item props or an `{#each}`.
- `indicator` and `isActionable`: replaced by `trailing`, and by an item having
  no body. An item without `content` or `children` acts instead of expanding
  and draws a chevron pointing right.

**Decision pending:**

| Feature | What it does | Recommendation |
| --- | --- | --- |
| `AccordionItem.onClick(event) → false` | vetoes an expand (downtime sheet, address gate); the only action of a body-less item | **keep**: needed by checkout; not expressible otherwise |
| `scrollOnExpand` (default true) | scrolls the opened panel into view | keep |
| `name`, `isRequired`, `validationState`, `helpText`, `errorText`, `label`, `accessibilityLabel` | the open item as a form field | **decide**: no React equivalent; checkout home uses it as a required choice |

### Checkout call sites affected

These use the old `items` + snippets API and need a port to
`<AccordionItem>` children. Use `variant="filled"` if the old card look is wanted:
- `app/v2/sidecart/sidecart-iframe/components/widgets/free-gifts/FreeGiftMultiRuleSheet.svelte`
- `app/v2/sidecart/sidecart-iframe/components/widgets/coupons/unlock-milestone/components/eligible-products/EligibleProductsScreen.svelte`
- `app/v3/surfaces/international-checkout/components/MobileCheckout.svelte`
- `app/v3/surfaces/international-checkout/components/DesktopCheckout.svelte`
- `app/v3/components/payment/RetryScreen.svelte`

### Status

Audited, fixed, and verified after the compositional rewrite: `svelte-check:cx`
gives 0 errors; `test:cx` passes 584/584; the DOM measurements match React
Storybook, unchanged from before the rewrite.


---

## Alert

React: `Alert`. cx: `Alert` (`components/alert/`).

### Props

| React | cx | Action |
| --- | --- | --- |
| `description` (required, text or JSX) | `description: string \| Snippet` | **renamed** from `children` |
| `title` | `title` | same |
| `color` (+ `primary`) | `color` | **added** `primary` |
| `emphasis: 'subtle' \| 'intense'` | `emphasis` | **added** |
| `icon` (defaults per colour) | `icon` | **added** the defaults: info, check-circle, alert-triangle, alert-octagon (the last two drawn from Blade's icons into `components/icons`) |
| `isDismissible` (default true) | `isDismissible` | **added**; was "dismissible when `closeLabel` is set" |
| `onDismiss` | `onDismiss` | same; the alert now closes itself after it, as in React |
| `isFullWidth` | — | **removed** by decision: full width is the only layout (spans the container, centred from 768px) |
| `maxWidth` (default 584px) | — | **removed** by decision: no width of its own; a cap is a `class` (rule 1) |
| `actions: { primary, secondary }` | — | **removed** by decision (was an `actions` snippet); no checkout call site used it |
| `testID` | `testID` | same |
| styled props, `data-analytics-*` | `class`; — | rule 1; analytics **missing** (analytics pass) |

### Look

Measured against React Storybook for neutral, positive and notice subtle, and
negative intense. These match exactly:
- the box: 12px padding, 12px radius, no border, the fill;
- full width centring from 768px (the 584px cap and non-full-width layout were measured, then dropped by decision);
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
They pass React icon components to `icon`, where cx takes icon data (Icons pass).

### Status

Audited, fixed, and verified: `svelte-check:cx` gives 0 errors; `test:cx`
passes; the DOM measurements match React Storybook.


---

## Amount

React: `Amount`. cx: `Amount` (`components/amount/`) over `runes/amount`.

**Decision:** Amount decides only the formatting (i18nify and Intl). Its
size, weight, colour and face are inherited from the surrounding text, so
React's text-style props are not ported.

### Props

| React | cx | Action |
| --- | --- | --- |
| `value` | `value` | same |
| `currency` (default `INR`) | `currency` | **default added** (was required) |
| `type`, `size`, `weight`, `color` | — | **not ported** by decision: inherited from the surrounding `Text`/`Heading` |
| `suffix: decimals \| none \| humanize` | `suffix` | **added** |
| `fractionDigits: number \| 'auto'` (default 2) | `fractionDigits` | **changed** default from the currency's own to 2; `auto` added |
| `isAffixSubtle` (default true) | `isAffixSubtle` | **renamed** from `affix: subtle \| normal`. The affix is 0.75em, relative to the text, where React sizes it per type and size |
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
- subtle affixes at 64% opacity.

Everything else follows the text around it.

Before this decision, the full React type/size table was built and matched
exactly by measurement. It was then dropped: sizes come from the text now.

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
`weight`, and Desktop passes `type` and a token-path `color`. Move these onto
a wrapping `Heading`/`Text`. `fractionDigits` still works; without it the
default is now 2.

### Status

Audited, fixed, and verified: `svelte-check:cx` gives 0 errors; `test:cx`
passes; inheritance and the strikethrough are checked in the browser.


---

## Badge

React: `Badge`. cx: `Badge` (`components/badge/`).

### Props

| React | cx | Action |
| --- | --- | --- |
| `children` (string, required) | `children` snippet | the label as content; React's dev check for empty text is not ported |
| `color` (5 intents + `primary`, default neutral) | `color` | same |
| `emphasis: subtle \| intense` (default subtle) | `emphasis` | same |
| `size: xsmall \| small \| medium \| large` (default medium) | `size` | **added** `xsmall` and `large` |
| `icon` | `icon` | **added** (icon data, rule for Icons pass) |
| `testID` | `testID` | same |
| styled props, `data-analytics-*` | `class`; — | rule 1; analytics **missing** (analytics pass) |

### Look

Measured against React Storybook for 4 colour, emphasis and size combinations.
These match exactly:
- the box: width, height (14/16/20/24px), pill radius, no border;
- the label: position, size, line height, weight, letter spacing, colour.

- **Sizes:** Blade's badgeTokens. Side padding is the box's (4px, 8px for
  large) plus the label's own margin (2px up to small, 4px above), which is
  also the icon-to-label gap. Icons are 8px up to small, 12px above.
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

Audited, fixed, and verified: `svelte-check:cx` gives 0 errors; `test:cx`
passes; the DOM measurements match React Storybook.


---

## BottomSheet

React: `BottomSheet`, `BottomSheetHeader`, `BottomSheetBody`, `BottomSheetFooter`.
cx: `BottomSheet` (`components/bottom-sheet/`), which is Modal with
`bottomSheetLook`. The header changes below are Modal's, so Modal has them
too.

**Decisions:** the sheet keeps its content height, with no snap points. On
desktop it keeps cx's capped, rounded panel, with `size`, `adaptive` and
`placement`. React's web sheet is full width at every size.

### Props

| React | cx | Action |
| --- | --- | --- |
| `isOpen` (controlled) | `bind:isOpen` | same |
| `onDismiss()` | `onDismiss(source)` | same, plus what closed it |
| `isDismissible` (default true) | `isDismissible` | same; now also hides the close button, as in React |
| `snapPoints` (default [0.35, 0.5, 0.85]) | — | **not ported** by decision: content height, drag only dismisses |
| `initialFocusRef` | — | **missing**: the panel takes focus, or content with `autofocus` |
| `zIndex` | — | n/a: the LayerHost stacks sheets |
| `BottomSheetHeader.title` | `title: string \| Snippet` | same; it names the dialog |
| `BottomSheetHeader` `subtitle`, `leading`, `trailing`, `titleSuffix`, `showBackButton`, `onBackButtonClick`, `children` | `header` snippet | **removed** by decision (rule 2): the caller renders them under the title |
| `BottomSheetBody` (`padding` spacing.5 \| spacing.0) | `body` snippet (16px) / `children` (raw) | rule 2 |
| `BottomSheetFooter` | `footer` snippet | rule 2 |
| close button labelled "Close" | `closeLabel` (default `Close`) | **changed**: shows while dismissible, not only when labelled |
| `data-analytics-*` | — | **missing** (analytics pass) |

### Look (at phone width)

Measured against React Storybook at 390px. These match:
- the panel: 16px top radius, fill, and the upward shadow;
- title: position, type (16/24 semibold −3.3%) and colour;
- close button: 20×20 at 16px in, centred on the title's first line;
- body and footer padding (16px).

- **Header:** Blade's BaseHeader box. 16px padding (20px from 768px), a
  hairline under it, and the title's type. The close button is centred on the
  title's first line. With no title or header, an 8px strip holds the close
  button, floating in a 28px circle. (Subtitle, back button and leading were
  measured to match React, then removed by decision.)
- **Grab handle:** 56 × 4px, 12px from the top.
- **Footer:** 16px (20px from 768px) on the sheet's surface, under a hairline.
- **Dropped checkout look:** 8px radius, the 40px handle, the heading-face
  title, and the 20px padding with a 40px close button.
- **Side fix (Accordion):** Blade's letter spacing on its title and subtitle,
  and the subtitle's 17px line height.
- **Typography gap noted:** cx `Text` misses Blade's letter spacing, and its
  xsmall and small line heights are wrong (Typography pass).

### Behaviour kept beyond React

cx does more than React's web sheet here, and keeps it:
- Escape closes (React's docs specify it; the web code doesn't).
- The focus trap.
- `aria-labelledby` pointing at the title.
- The Android back button, through `onBack`.

### cx-only features — decision pending

| Feature | What it does | Recommendation |
| --- | --- | --- |
| `onClosed` | the exit finished | keep |
| `onBack` | content owns the back button | keep |
| `role: dialog \| alertdialog` | the dialog's role | keep |
| `accessibilityLabel` | names an untitled sheet | keep |
| `pace` | v2's quicker drawer easing | decide |
| `size`, `adaptive`, `placement` | desktop panel width, sheet on phones and modal on desktop | kept by the desktop decision |

### Checkout call sites

8 files. They pass `padding` (5), `title` and `snapPoints` (1), which is
React's API. These sites need porting: `padding` becomes `body` (padded) or
`children` (raw), and `snapPoints` is dropped.

### Status

Audited, fixed, and verified: `svelte-check:cx` gives 0 errors; `test:cx`
passes; the DOM measurements at phone width match React Storybook.


---

## Button and IconButton

React: `Button`, `IconButton`. cx: `Button` (`components/button/`) and
`IconButton` (`components/icon-button/`) over `runes/button/press.svelte.ts`.

### Button props

| React | cx | Action |
| --- | --- | --- |
| `variant: primary \| secondary \| tertiary` | `variant` | **added** `tertiary`; **removed** `link` by decision (an action that reads as a link waits for Link's button form, in the Link pass) |
| `color: primary \| white \| positive \| negative` (default primary) | `color` + `neutral` | **added** `white`; `neutral` kept (Blade supports it with its own tokens); **default now `primary`** (blue), was neutral (black) |
| `size` (default medium) | `size` | same values; now Blade's heights, padding and type |
| `icon`, `iconPosition` | — | **not ported** by decision: icons go in `children`, sized by the caller |
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
| `emphasis: intense \| subtle \| moderate` (default intense) | `emphasis` | **added**, replacing `variant: plain \| boxed` |
| `isHighlighted` | `isHighlighted` | **added** |
| `size: small \| medium \| large` | `size` | same; glyph 12/16/20px, box only when highlighted or moderate |
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
- **Loading:** Blade's DotLoader over the faded label: 4px dots 2px apart (6
  and 3 at large), rising in turn over 1.2s, the middle one held under reduced
  motion. The button wears the disabled look.
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

Audited, fixed, and verified: `svelte-check:cx` gives 0 errors; `test:cx`
passes; the DOM measurements match React Storybook, except the theme note.



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

New, verified: `svelte-check:cx` gives 0 errors; `test:cx` passes; the
measurements match React Storybook.

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
| `padding` (`spacing.0` \| `.3` \| `.4` \| `.5` \| `.7`, default `.7`) | `padding` | **added**; was fixed section padding |
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

Audited, fixed, and verified: `svelte-check:cx` gives 0 errors; `test:cx`
passes; the surface measurements match React Storybook.

---

## ActionList — deferred

**Decision:** build it with Dropdown and Menu. React's ActionList only exists
inside them: its role, selection and keyboard come from the Dropdown, and on
its own it has no keyboard support.

### React API, for when it is built

- **`ActionList`:** `children` (items and sections only), `isVirtualized`, `testID`.
  - With an AutoComplete trigger and no matches, it shows a "No Search Result Found" state.
- **`ActionListItem`:**
  - `title`* and `value`*;
  - `description`;
  - `leading` (Icon, Asset, Avatar, Text), `trailing` (Icon, Text), `titleSuffix` (Badge, BadgeGroup);
  - `intent: 'negative'`, `href`/`target` (renders an `<a>`), `isSelected`, `isDisabled`;
  - `onClick({ name, value, event })`, `testID`.
- **`ActionListSection`:** `title`*, `children`. A divider follows every section except the last.
- **Slot parts:**
  - `ActionListItemIcon` (16px; negative or disabled colours from the item);
  - `ActionListItemAsset` (16×12 img);
  - `ActionListItemAvatar` (xsmall);
  - `ActionListItemBadge` (medium, 8px left margin) and `ActionListItemBadgeGroup`;
  - `ActionListItemText` (14/20, `interactive.text.gray.muted`).
  - These become snippets under rule 2.
- **Roles:**
  - A menu trigger gives `role="menu"` and `menuitem` rows.
  - A select or autocomplete trigger gives `listbox` and `option`.
  - A row with `href` gets `link`.
  - Sections are `group` with `aria-label`.
- **Selection:**
  - Single selection is a background fill only, with no check mark.
  - Multiple selection (from Dropdown `selectionType`) replaces `leading` with a checkbox.
- **No `size` and no variants.**

### React look, for when it is built

- **List:** 8px padding, max-height 300px, scrolls. The popup surface belongs to DropdownOverlay:
  - `popup.background.gray.moderate` background, 12px radius, medium backdrop blur.
- **Row:**
  - 8px radius and 8px padding (4px under 768px), 2px margin above and below;
  - 36px tall on desktop with no description.
- **Row states:**
  - Hover: `interactive.background.gray.default`; negative: `interactive.background.negative.faded`.
  - Selected: `interactive.background.gray.fadedHighlighted`.
  - No pressed or disabled fill.
  - Focus: 4px `surface.border.primary.muted` ring, offset 1, keyboard only.
- **Text:**
  - Title: 14/20 regular, one line, truncated. Colour `interactive.text.gray.normal`; negative `feedback.text.negative.intense`; disabled `…gray.disabled`.
  - Description: 12/17 `interactive.text.gray.muted`.
- **Section title:** 12/17 semibold `surface.text.gray.muted`, 8px padding.
- **Divider:** 1px `surface.border.gray.muted`, 2px vertical and 8px horizontal margin.

### cx today

Nothing corresponds directly:
- `OptionList`/`OptionItem` (and `VirtualOptionList`) is a standalone form field of native radios and checkboxes, always visible, on the headless choice list it shares with Accordion. Its variants are `plain` (a bordered box of divided rows) and `card`.
- `Menu` draws its own `menuitem` rows.

When ActionList is built, those rows should be rebuilt on it. OptionList then gets its own cx-only section, or is re-audited against Radio/Checkbox groups.


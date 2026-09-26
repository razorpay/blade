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
   etc. directly.
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
| ActionList | `option-list` + `option-list-item` | common (partial: a selectable list, not a dropdown list) |
| Alert | `alert` | common |
| Amount | `amount` | common |
| AnimateInteractions | — | n/a (motion) |
| AnnouncementBanner | — | react-only |
| AppBar | — | react-only |
| AutoComplete | — | react-only |
| Avatar | — | react-only |
| Badge | `badge` | common |
| BaseAnimatedValue, BaseHeaderFooter, BaseMenu, BaseMotion | — | n/a (internal) |
| BladeProvider | — | n/a (theming is CSS variables and Uno classes) |
| BottomBar | — | react-only (compare with cx `footer-bar`) |
| BottomDock | — | react-only |
| BottomNav | — | react-only |
| BottomSheet | `bottom-sheet` | common |
| Box | — | n/a (rule 1) |
| Breadcrumb | — | react-only |
| Button / IconButton | `button` / `icon-button` | common |
| ButtonGroup | — | react-only |
| Card | `card` | common |
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

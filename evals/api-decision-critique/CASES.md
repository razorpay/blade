# API Decision Critique — Eval Cases

Each case is a real Blade PR. The eval checks whether the critique agent correctly identifies the API issues that were caught in the actual PR review.

Cases marked **clean** have no expected issues — they test that the agent does not produce false positives.

---

## All Cases

| # | File | Component | PR | Issues | Categories |
|---|------|-----------|----|--------|------------|
| 01 | `01_lightbox.json` | LightBox | [#3215](https://github.com/razorpay/blade/pull/3215) | `thumbnailSrc` → `thumbnail` (Src suffix not used in Blade); callback receives bare number instead of object `{ index }` | Naming suffix, Callback signature |
| 02 | `02_datepicker.json` | DatePicker | [#2927](https://github.com/razorpay/blade/pull/2927) | `footerSlot` → `footer` (Blade never uses the Slot suffix in public APIs) | Naming suffix |
| 03 | `03_counter_input.json` | CounterInput | [#2952](https://github.com/razorpay/blade/pull/2952) | `variant` → `emphasis` (variant is for structural differences; subtle/intense is visual emphasis) | Wrong prop name for semantics |
| 04 | `04_timepicker.json` | TimePicker | [#2934](https://github.com/razorpay/blade/pull/2934) | `onValueChange` → `onChange` (all change handlers in Blade are onChange) | Naming convention |
| 05 | `05_popover.json` | Popover | [#1584](https://github.com/razorpay/blade/pull/1584) | `headerTitle` → `title`, `headerLeading` → `titleLeading` (redundant header prefix on props) | Redundant prefix in prop name |
| 06 | `06_table.json` | Table | [#1730](https://github.com/razorpay/blade/pull/1730) | `cellDensity` → `rowDensity` (density is controlled at row level, not cell level) | Wrong level of abstraction |
| 07 | `07_tabs.json` | Tabs | [#1693](https://github.com/razorpay/blade/pull/1693) | `autoWidth` → `isFitted` (ambiguous name); `TabsItem` → `TabItem` (plural on sub-component) | Ambiguous naming, Plural sub-component name |
| 08 | `08_sankey_chart.json` | SankeyChart | [#3414](https://github.com/razorpay/blade/pull/3414) | Missing `ChartWrapper+Chart` composition pattern; wrong data shape; `from`/`to` → `source`/`target`; color props should use design token types; missing `colorTheme`; custom `height` instead of `BoxProps` | Composition pattern, Data shape, Field naming, Type system, Missing props |
| 09 | `09_chip.json` | Chip | [#1535](https://github.com/razorpay/blade/pull/1535) | `size` on `Chip` should be on `ChipGroup`; `onChange` returns `string \| string[]` instead of always `string[]` | Group vs item prop placement, Callback signature |
| 10 | `10_clean.json` | Table (clean) | [#3279](https://github.com/razorpay/blade/pull/3279) | _(none — internal styled-component fix, no public API changes)_ | _Clean / false-positive check_ |
| 11 | `11_fileupload.json` | FileUpload | [#2010](https://github.com/razorpay/blade/pull/2010) | `selectionType` → `uploadType` (wrong semantic domain); `onCancel` → `onDismiss` (fires on error state too, not just in-progress); `onDelete` → `onRemove`; `File`/`FileList` collide with browser globals | Semantic mismatch, Event naming, Browser global collision |
| 12 | `12_list.json` | List | [#952](https://github.com/razorpay/blade/pull/952) | `isOrderedFilled` boolean only valid with `variant='ordered'` → impossible state, should be `variant='ordered-filled'`; separate `UnorderedList`/`OrderedList` components hurt discoverability; dot notation breaks tree-shaking | Impossible state, Discoverability, Tree-shaking |
| 13 | `13_amount.json` | Amount | [#993](https://github.com/razorpay/blade/pull/993) | `children: string` → `value: number` (currency needs a typed number); `hasDecimals`+`hasTextPostfix` → `suffix` enum (mutually exclusive booleans); `fontWeight` redundant because size token encodes weight; stale template props copied from Badge (`contrast`, `screenSize`) | Wrong prop type, Mutually exclusive booleans, Redundant prop, Stale template content |
| 14 | `14_menu.json` | Menu | [#2212](https://github.com/razorpay/blade/pull/2212) | `onOpenChange: (isOpen: boolean)` → object param `({ isOpen })` for scalability; `Extract<FeedbackColors, 'negative'>` over-engineered, just use `'negative'`; `disabled` → `isDisabled` | Callback signature, Over-engineered type, Boolean naming |
| 15 | `15_infogroup.json` | InfoGroup | [#2725](https://github.com/razorpay/blade/pull/2725) | `orientation` → `itemOrientation` (counterintuitive: vertical on group means horizontal layout); `showDivider` boolean hides divider from JSX tree → use `<Divider />` as child; `leadingIcon`/`trailingIcon` too narrow → `leading`/`trailing` accepting `ReactElement` | Misleading scope, Hidden composition, Too-narrow prop type |
| 16 | `16_pagination.json` | Pagination | [#3005](https://github.com/razorpay/blade/pull/3005) | `currentPage` → `selectedPage` (wrong controlled-prop naming); missing uncontrolled `defaultSelectedPage`; `showPageNumberSelector` → `showPageNumbers` (verbose) | Controlled/uncontrolled naming, Missing uncontrolled pattern, Verbosity |
| 17 | `17_bottomsheet.json` | BottomSheet | [#1002](https://github.com/razorpay/blade/pull/1002) | `open` → `isOpen`; `onClose` → `onDismiss` (covers all dismiss triggers, not just button click); `hideDivider` negative boolean → `showDivider` positive; `actions: { primaryAction, secondaryAction }` → free `children` (restricts footer to fixed two-button layout) | Boolean prefix, Event naming, Negative boolean, Overly rigid slot |
| 18 | `18_spotlightpopovertour.json` | SpotlightPopoverTour | [#1793](https://github.com/razorpay/blade/pull/1793) | `visible` → `isOpen` (non-standard in Blade); `id` conflicts with HTML `id` attr → use `name`; `gotToNext` typo + `goToPrev` → `goToPrevious`; web tour via `getElementById` creates footguns — use `TourStep` on both platforms | Boolean naming, HTML attr conflict, Typo, Platform API inconsistency |

---

## Issue Categories

| Category | Description | Cases |
|----------|-------------|-------|
| **Boolean naming** | Boolean props must use auxiliary verb prefixes: `is`, `has`, `should`, `show`. No raw `open`, `visible`, `disabled`. | 14, 17, 18 |
| **Negative boolean** | Prefer positive booleans (`showDivider`) over negative ones (`hideDivider`). Negative booleans require mental inversion. | 17 |
| **Naming suffix/prefix** | Don't append `Slot`, `Src`, or repeat the parent area name (`header`) in child prop names. | 01, 02, 05 |
| **Callback signature** | Callbacks should receive an object `{ value }` not a bare primitive, so context can be added later without a breaking change. | 01, 09, 14 |
| **Controlled/uncontrolled naming** | Controlled: `value` + `onChange`. Uncontrolled initial: `default` + prop name. Never `current`, never `initial`. | 16 |
| **Impossible state** | When a boolean prop is only valid in combination with a specific value of another prop, encode it as a new enum value instead. | 12 |
| **Mutually exclusive booleans** | Two booleans where only one can be true at a time should be a single enum. | 13 |
| **Redundant prop** | Don't expose a prop that is already fully encoded by another prop (e.g. `fontWeight` when `size` tokens include weight). | 13 |
| **Semantic mismatch** | Use words that match the actual domain action. `selectionType` on FileUpload (nothing is being selected), `onCancel` on a dismiss that fires post-failure. | 03, 11 |
| **Wrong level of abstraction** | Prop names should reflect what is actually being controlled. `cellDensity` when density applies at row level. `orientation` when it controls per-item layout. | 06, 15 |
| **Stale template content** | Props copied from another component's template that don't apply here. Review against actual design specs before opening. | 13 |
| **Composition pattern** | Blade charts use `ChartWrapper + Chart` composition. Standalone single-component exports break the pattern. Dot notation (`List.Item`) breaks tree-shaking — use flat named exports. | 08, 12 |
| **Group vs item prop placement** | Props that apply uniformly across all children of a group (size, isDisabled) must live on the group component, not repeated on each child. | 09 |
| **Discoverability** | Splitting a component into `UnorderedList`/`OrderedList` means consumers can't find it by searching for `List`. Prefer a single component with a `variant` prop. | 12 |
| **Too-narrow prop type** | `leadingIcon: IconComponent` prevents passing `Avatar` or other valid React elements. Use `ReactElement \| IconComponent`. | 15 |
| **Over-engineered type** | `Extract<FeedbackColors, 'negative'>` always resolves to `'negative'` — just write the literal. | 14 |
| **Browser global collision** | Don't name types `File`, `FileList`, `Event` — they shadow browser globals. Prefix with component name. | 11 |
| **HTML attr conflict** | Avoid prop names that collide with standard HTML attributes forwarded to the DOM (`id`). | 18 |
| **Hidden composition** | A boolean prop like `showDivider` hides a structural element from the JSX tree. Prefer explicit composition (`<Divider />` as child) so the layout is visible at a glance. | 15 |
| **Missing uncontrolled pattern** | Every controllable component needs both controlled (`value` + `onChange`) and uncontrolled (`defaultValue`) variants. | 16 |
| **Platform API inconsistency** | An API that works only on one platform (e.g. `getElementById` on web) creates footguns. Prefer a unified approach (`TourStep`) on both. | 18 |

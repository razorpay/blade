# How cx's API differs from Blade React

Everything below comes from `API-PARITY.md`. Most differences follow a few
rules that apply to every component. The rest are listed per component.

## Rules that apply to every component

| React | cx |
| --- | --- |
| `Box`, styled props, `width`/`maxWidth`/`isFullWidth` | Layout goes through `class` (Uno classes) |
| Intermediate components and render props (`ModalHeader`, `TabList`, `CardHeader`, `DropdownButton`…) | Snippets (`header`, `body`, `footer`, `tabs`, `trigger`, `content`). Header extras such as subtitle, leading, trailing and the back button are drawn by the caller |
| `value` + `defaultValue`, `isOpen` + `defaultIsOpen`… | One bindable prop (`bind:value`, `bind:isOpen`) |
| `onChange({ name, value, event })` | `onChange({ name, value })`: Blade's payload object, without `event` (Checkbox `{ isChecked, value }`, ChipGroup `{ name, values }`, `onOpenChange({ isOpen })`…). Tabs and Carousel pass a bare value, as Blade |
| `labelPosition="left"` | Not ported: labels always sit on top |
| `labelSuffix` + `labelTrailing` | One `labelArea` snippet. Only the label text names the control |
| `keyboardType`, `keyboardReturnKeyType`, `autoCompleteSuggestionType`, `type="telephone"` | HTML attributes: `inputMode`, `enterKeyHint`, `autoComplete`, `type="tel"`. Each `type` brings Blade's defaults for them (a given attribute wins); `number` renders as `text`, as Blade. Password and search fields are PasswordInput and SearchInput |
| `BladeProvider` (theme tokens, `colorScheme`) | `BladeProvider` sets component defaults: an overall `size`, a style-prop entry per component, `breakpoints`, and values that can differ per breakpoint. Theming stays CSS variables |
| `data-analytics-*` | Missing everywhere (a later analytics pass) |
| Icon components | Icon data (`IconSource`) |

Collections compose the way React's do: `CardGroupItem`, `TabItem`,
`MenuItem` and `Chip` register with their parent. The exceptions are
`VirtualOptionList` and `Carousel`, which take data plus an item snippet.

## Renamed or reshaped

- **Accordion → `CardGroup` / `CardGroupItem`.**
  - The header's props sit directly on the item.
  - `onExpandChange({expandedIndex})` becomes `onChange({ name, value })`, with `value` `null` for none.
  - `trailing` replaces the chevron instead of sitting before it.
  - `titleSuffix` and the header's `children` are dropped; use a `title` snippet or `header`.
- **Modal and BottomSheet:**
  - `onDismiss(source)` also says what closed it.
  - The body is a `body` snippet (padded) or `children` (raw).
  - BottomSheet's `adaptive` is replaced by Modal's `variant: 'modal' | 'sheet'`, which can differ per breakpoint.
- **Tabs:** `TabList` becomes the `tabs` snippet. cx's old `items`, `itemKey` and `itemLabel` props are removed.
- **Toast:** `useToast().show()` becomes `showToast()`, which returns a handle with `dismiss()`. `toast.dismiss(id)` is gone.
- **TextInput:** `prefix`, `suffix`, the leading and trailing icons and `trailingButton` collapse into two slots, `leading` and `trailing`. `format` takes functions, not a `#` mask string.
- **Link:** `iconPosition` is `leading | trailing` instead of `left | right`.
- **Amount:** `type`, `size`, `weight` and `color` are not ported; it inherits them from the surrounding text.
- **Button:**
  - `icon` and `iconPosition` are not ported: icons go in `children`.
  - The default `type` is `button`.
  - `variant="link"` is removed.
- **InputGroup:** members take a `span` instead of sitting in `InputRow`s.
- **Switch:** `parse(isChecked)` replaces the `value` string.
- **Divider:** the old `line` prop is renamed `dividerStyle`, as in React.
- **Radio:** a radio's own `size` isn't ported; the group sets it.

## Dropped by decision

- BottomSheet `snapPoints`: sheets size to their content.
- Alert: `isFullWidth`, `maxWidth` and `actions`.
- Card: `size` and the deprecated props.
- Popover and Tooltip: `maxWidth`.
- Modal: the 320px minimum width.
- `zIndex` everywhere: the LayerHost stacks overlays.

## Still missing (open)

- **Menu (as Dropdown):** this is the largest gap.
  - No controlled `isOpen`, no `selectionType`, and no header or footer.
  - Items lack description, leading, trailing, `titleSuffix`, `intent`, `href` and `isSelected`.
  - No sections, submenus or input triggers (Select, AutoComplete).
  - No BottomSheet form on phones.
  - ActionList is deferred until then.
- **TextInput:** `isLoading`, `validationTextPlacement`, `showHelpTextOnFocus`, tags.
- **Overlays:** `initialFocusRef` on Modal, BottomSheet and Popover.
- **Button:** focus, blur and pointer events, and `tabIndex`.
- **Card:** `onHover`.
- **Toast:** `type: 'promotional'`.
- **Typography:** Text and Heading have no letter-spacing.
- **Not yet in cx:** about 50 React components, including Avatar, Table, DatePicker, Spinner, Tag, Drawer and CheckboxGroup.
- **SearchInput:** `isLoading`, a trailing Dropdown, and use as a Dropdown trigger.

## cx-only extras, each still awaiting a decision

- **`Form`**: a `<form>` that fields register with, for validation and submit.
- **Overlays:**
  - Modal: `variant` (`sheet`, `drawer`, `left-drawer`), `ModalStack`, `openModal`.
  - Modal and BottomSheet: `onClosed`, `onBack`, `role`, `pace` (still undecided, not "keep").
  - Popover and Tooltip: `isDisabled`.
- **Buttons:** `validateForm`, `autoPressAfter`, `loadingAnnouncement`; the busy state keeps focus.
- **CardGroup:** `onClick` returning `false` vetoes an expand; `scrollOnExpand`; the field mode (still undecided).
- **Amount:** `unit` (minor units), `locale`, `symbol`.
- **Fields:**
  - OTPInput: `accept`, `cellAccessibilityLabel`.
  - TextInput: `isReadOnly`.
  - PhoneNumberInput: its Modal picker with a search.
- **Others:**
  - Alert: `isOpen` and `closeLabel`.
  - Tabs: `activation`.
  - SegmentedControl: `color`.
  - Switch: `children` and `isLoading`.
  - Card: `color` (still undecided).
  - Toast: `onDismiss(reason)`.
  - Link: `download`, and `isDisabled` on an anchor.
- The recommendation for almost all of these is to keep them, because checkout uses them.

## Impact on checkout

- **Button (136 files):** buttons with no `color` turn blue, so pass `color="neutral"` where the black button is wanted. Submit buttons need `type="submit"`.
- **BottomSheet (8 files):** `padding` becomes `body` or `children`; drop `snapPoints`.
- **Accordion → CardGroup (5 files):** `items` becomes `<CardGroupItem>` children.
- **Amount (2 files):** move `size`, `weight` and `type` onto a wrapping `Text` or `Heading`.
- **Alert (3 files):** drop `isFullWidth`.

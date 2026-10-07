# How cx's API differs from Blade React

Everything below comes from `API-PARITY.md`. Most differences follow a few
rules that apply to every component. The rest are listed per component.

## Rules that apply to every component

| React | cx |
| --- | --- |
| `Box`, styled props, `width`/`maxWidth`/`isFullWidth` | Layout goes through `class` (Uno classes). `*-blade-N` is only Blade spacing token N (`p-blade-5` is 16px); any other length is written out (`w-[176px]`) |
| Intermediate components and render props (`ModalHeader`, `TabList`, `CardHeader`, `DropdownButton`…) | Snippets (`header`, `body`, `footer`, `tabs`, `trigger`). Header extras such as subtitle, leading, trailing and the back button are drawn by the caller |
| `value` + `defaultValue`, `isOpen` + `defaultIsOpen`… | One bindable prop (`bind:value`, `bind:isOpen`) |
| `onChange({ name, value, event })` | `onChange({ name, value })`: Blade's payload object, without `event` (Checkbox `{ isChecked, value }`, Switch `{ isChecked }`, ChipGroup `{ name, values }`, `onOpenChange({ isOpen })`…). Tabs and Carousel pass a bare value, as Blade. Menu's `onOpenChange` takes `{ isOpen }`, where Dropdown passes a bare value |
| `labelPosition="left"` | Not ported: labels always sit on top |
| `labelSuffix` + `labelTrailing` | One `labelArea` snippet. Only the label text names the control. Hints (`helpText`, `errorText`, `successText`) also take a snippet |
| `keyboardType`, `keyboardReturnKeyType`, `autoCompleteSuggestionType`, `type="telephone"` | HTML attributes: `inputMode`, `enterKeyHint`, `autoComplete`, `type="tel"`. Each `type` brings Blade's defaults for them (a given attribute wins); `number` renders as `text`, as Blade. Password and search fields are PasswordInput and SearchInput |
| `BladeProvider` (theme tokens, `colorScheme`) | `BladeProvider` sets component defaults: an overall `size` and a style-prop entry per component. No breakpoints in JS: desktop differences are the components' own `d:` classes (one breakpoint, 62.5rem). Theming stays CSS variables |
| `data-analytics-*` | Missing everywhere (a later analytics pass) |
| Icon components, and `leading` where it only takes an icon | The same-named icon from `@razorpay/blade-svelte/icons` (`IconSource`) in an `icon` prop; the app's `bladeIconFontPlugin` font picks it up from the import |

Collections compose the way React's do: `CardGroupItem`, `TabItem`,
`MenuItem`, `OptionItem` and `Chip` register with their parent. The
exceptions are `VirtualOptionList` and `Carousel`, which take data plus an
item snippet.

## Renamed or reshaped

- **Accordion → `CardGroup` / `CardGroupItem`.**
  - The header's props sit directly on the item.
  - `onExpandChange({expandedIndex})` becomes `onChange({ name, value })`, with `value` `null` for none.
  - `trailing` replaces the chevron instead of sitting before it.
  - `titleSuffix` and the header's `children` are dropped; use a `title` snippet or `header`.
- **Modal and BottomSheet:**
  - `onDismiss({ source, close })` fires on every dismissal and says what closed it. When the dialog isn't dismissible, it stays open until you call `close`.
  - The body is a `body` snippet (padded) or `children` (raw).
  - BottomSheet's `adaptive` is replaced by Modal's `variant: 'modal' | 'sheet'`, which the app picks.
- **Drawer:** not its own component; it is Modal's `variant="drawer"` (`left-drawer` docks it left).
- **Popover and Tooltip:** the trigger is a `trigger` snippet, not `children`. Popover's `content` becomes `children`; Tooltip keeps `content` as a string, and takes `children` for rich content. Popover's default `placement` is `top`.
- **Collapsible:** `CollapsibleButton` and `CollapsibleLink` become a `trigger` snippet (the caller's Button, or `Link variant="button"` with a `CollapsibleChevron`). `CollapsibleBody` becomes `children`.
- **Tabs:** `TabList` becomes the `tabs` snippet. `TabItem`'s `leading` icon becomes `icon`; `leading` is now a snippet for an asset (Figma's leading item is an icon or an asset).
- **SegmentedControlItem:** `leading` icon becomes `icon`; `leading` (asset) and `trailing` (Counter or Badge) are snippets, as in Figma.
- **Toast:** `useToast().show()` becomes `showToast()`, which returns a handle with `dismiss()`. `toast.dismiss(id)` is gone. A leading icon is `icon`; an asset is `leading` (snippet).
- **TextInput:** Figma's slots: `leadingIcon`, `prefix`, `leading` (a selector snippet), `suffix`, `trailingIcon`, `trailing` (a link snippet); `trailingButton` is `trailing`. `size` has no `xsmall`. `format` takes functions, not a `#` mask string.
- **Link:** `iconPosition` is replaced by `icon` (leading) and `trailingIcon`, which may both show. `notice` and `information` colours are gone.
- **Amount:** `type`, `size`, `weight` and `color` are Figma's variants, but `size`, `weight` and `color` default to `inherit` (the surrounding text), where React defaults to body medium. A token-path `color` becomes one of Text's colours.
- **Button:** `iconPosition` is replaced by `icon` (leading) and `trailingIcon`; `icon` alone makes the icon-only button.
- **Menu:** `MenuItem`'s `onClick` takes no arguments.
- **InputGroup:** members take a `span` instead of sitting in `InputRow`s.
- **Switch:** `parse(isChecked)` replaces the `value` string.
- **Radio:** a radio's own `size` isn't ported; the group sets it.
- **Sizes removed to match Blade DSL (Figma):** Badge `xsmall`; Switch phone sizes; TextInput `xsmall`; TextArea, PasswordInput, SearchInput, PhoneNumberInput and InputGroup `small`; BottomSheet `size`; IconButton `moderate`; Button and ButtonGroup `tertiary` (use `secondary`); Radio `trailing`; Heading `weight="medium"`; Card `padding` spacing.0/.3/.4.

## Dropped by decision

- BottomSheet `snapPoints`: sheets size to their content.
- Alert: `isFullWidth`, `maxWidth` and `actions`.
- ButtonGroup: `isFullWidth` (use `class="w-full [&>*]:flex-1"`).
- Card: `size` and the deprecated props.
- Popover and Tooltip: `maxWidth`.
- Modal: the 320px minimum width.
- `zIndex` everywhere: the LayerHost stacks overlays.

## Still missing (open)

- **Menu (as Dropdown):** this is the largest gap.
  - No `selectionType`, no header or footer, and no overlay `width`, `minWidth` or `maxWidth`.
  - Items lack description, leading, trailing, `titleSuffix`, `intent`, `href` and `isSelected`.
  - No sections, submenus or input triggers (Select, AutoComplete).
  - No BottomSheet form on phones.
  - ActionList is deferred until then.
- **TextInput:** `isLoading`, `validationTextPlacement`, tags.
- **SearchInput:** `isLoading`, a trailing Dropdown, and use as a Dropdown trigger.
- **Every input:** `showHelpTextOnFocus`.
- **PhoneNumberInput:** `onChange` reports `{ country, dialCode, nationalNumber, value }`: no `name` and no formatted `phoneNumber`, unlike React's.
- **Overlays:** `initialFocusRef` on Modal, BottomSheet and Popover.
- **Button:** focus, blur, pointer and touch events, and `tabIndex`.
- **Card:** `onHover`.
- **Toast:** `type: 'promotional'`.
- **Typography:** Text and Heading have no letter-spacing.
- **Not audited yet:** Carousel, ProgressBar (`progress`), TrustBadge, Icons.
- **Not yet in cx:** about 50 React components, including Avatar, Table, DatePicker, Spinner, Tag, Breadcrumb and CheckboxGroup.

## cx-only extras, each still awaiting a decision

- **`Form`**: a `<form>` that fields register with, for validation and submit.
- **Overlays:**
  - Modal: `variant` (`sheet`, `drawer`, `left-drawer`), `ModalStack`, `openModal`, the `chrome` snippet.
  - Modal and BottomSheet: `onClosed`, `role`, `closeLabel`, `pace` (still undecided, not "keep").
  - BottomSheet: `isDraggable`, `accessibilityLabel`, and Modal's `size` and `variant`.
  - Popover and Tooltip: `isDisabled`. Popover: `accessibilityLabel`.
- **Buttons:** `validateForm`, `autoPressAfter`, `loadingAnnouncement`; the busy state keeps focus. IconButton also takes `isLoading` and `type`.
- **CardGroup:** `onClick` returning `false` vetoes an expand; `scrollOnExpand`; the field mode (still undecided).
- **Amount:** `unit` (minor units), `locale`, `symbol` (keep or drop).
- **Fields:**
  - Checkbox: `accessibilityLabel`, `parse`.
  - OTPInput: `accept`, `cellAccessibilityLabel`, `onClick`, `isRequired`, `isReadOnly`.
  - TextInput and TextArea: `isReadOnly`.
  - PhoneNumberInput: its Modal picker with a search.
- **Others:**
  - Alert: `isOpen` and `closeLabel`.
  - Tabs: `activation`, `accessibilityLabel`.
  - SegmentedControl: `color`.
  - Switch: `children` and `isLoading`.
  - Card: `color` (still undecided).
  - Toast: `onDismiss(reason)`, `closeLabel`.
  - Link: `download`, and `isDisabled` on an anchor.
- The recommendation is to keep all of these, because checkout uses them, except the ones marked undecided.

## Impact on checkout

- **Button (136 files):** buttons with no `color` turn blue, so pass `color="neutral"` where the black button is wanted. The default `type` is now `button`, so submit buttons need `type="submit"`. `variant="link"` is gone: use `Link variant="button"`.
- **BottomSheet (8 files):** `padding` becomes `body` or `children`; drop `snapPoints`.
- **Checkbox (18 files, on v2's own Checkbox today):** `value` becomes `isChecked`; the 4 with `type="radio"` become Radios.
- **Card (6 files):** drop `borderRadius`.
- **Accordion → CardGroup (5 files):** `items` becomes `<CardGroupItem>` children. `isCollapsible={false}` is gone: the home method list now collapses on a second press.
- **Alert (3 of 4 files):** drop `isFullWidth`. `icon` takes the same-named icon from `@razorpay/blade-svelte/icons`, not a component.
- **Amount (2 files):** move `size`, `weight` and `type` onto a wrapping `Text` or `Heading`. Without `fractionDigits`, it shows 2 decimals.

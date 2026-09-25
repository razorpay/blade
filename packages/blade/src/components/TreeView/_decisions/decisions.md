# TreeView

TreeView renders a hierarchical list of expandable, selectable items. It works standalone on a page, or inside `Dropdown` (in place of `ActionList`) where selection is controlled through the trigger's `value` / `onChange` (SelectInput, FilterChipSelectInput).

TreeView is a **web-only** component; on React Native it throws a dev error.

## Design

- [Figma - TreeView](https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=125205-58766)

## Architecture

TreeView is a sibling of `ActionList` and `Menu` on the shared `BaseMenu` internals. ActionList stays flat forever; TreeView owns hierarchy. Changes to `Dropdown/*` are strictly additive and gated on the overlay content being a TreeView (published controller in Dropdown context), so ActionList / AutoComplete behaviour is byte-identical.

### The dual-mode rule (the key API decision)

**Inside a Dropdown, selection is owned by Dropdown state and the trigger's `value`/`defaultValue`/`onChange`, exactly as with ActionList.** TreeView's own selection props apply **only standalone**. Mode detection: `useDropdown().dropdownBaseId !== ''` (the noop context default makes this reliable). Passing TreeView-level selection props while inside a Dropdown logs a dev warning and they are ignored.

This means a consumer who swaps `ActionList` for `TreeView` inside an existing `Dropdown + SelectInput` keeps the exact same controlled API they already have. That is the point.

## API

```jsx
// standalone
<TreeView selectionType="multiple" onChange={({ values, selectedGroups }) => {}}>
  <TreeViewItem title="India" value="india">
    <TreeViewItem title="Karnataka" value="karnataka">
      <TreeViewItem title="Bengaluru" value="bengaluru" />
      <TreeViewItem title="Mysuru" value="mysuru" />
      <TreeViewLoadMore onClick={loadMoreCities} isLoading={isLoadingCities} />
    </TreeViewItem>
    <TreeViewItem title="Goa" value="goa" />
  </TreeViewItem>
</TreeView>

// inside Dropdown: selection API lives on the trigger, same as ActionList
<Dropdown selectionType="multiple">
  <FilterChipSelectInput label="Regions" value={values} onChange={({ values, selectedGroups }) => {}} />
  <DropdownOverlay>
    <TreeView>{/* TreeViewItem children */}</TreeView>
  </DropdownOverlay>
</Dropdown>
```

## Props

### TreeView

```ts
type TreeViewProps = {
  children: React.ReactNode; // TreeViewItem | TreeViewLoadMore, runtime-validated (B10)
  /**
   * Standalone only. Inside Dropdown, inherited from Dropdown's selectionType;
   * conflicting prop → dev warning, Dropdown wins.
   * @default 'single'
   */
  selectionType?: 'single' | 'multiple';
  /** Standalone only. Controlled selected LEAF values. */
  value?: string[];
  defaultValue?: string[];
  /** Standalone only. values: selected leaves. selectedGroups: topmost fully-selected branches (B3). */
  onChange?: (event: { name?: string; values: string[]; selectedGroups: string[] }) => void;
  name?: string;
  /** Visual density of every row. Tree-wide - individual rows cannot opt out. @default 'medium' */
  size?: 'small' | 'medium';
} & TestID &
  DataAnalyticsAttribute;
```

#### Sizing contract

`size` lives on `TreeView`, not on `TreeViewItem`: a tree with mixed row densities has no
valid design, and the indentation ladder has to be uniform for the rows to line up. It is
propagated through `TreeViewContext` and read by every subcomponent.

| Token                   | `small`     | `medium` (default) |
| ----------------------- | ----------- | ------------------ |
| Row height (first line) | 33px        | 36px               |
| Title typography        | Body Small  | Body Medium        |
| Chevron slot / icon     | 16px / 12px | 20px / 16px        |
| Checkbox                | `small`     | `medium`           |
| Indentation per level   | 20px        | 24px               |
| LoadMore label offset   | 20px        | 24px               |

Row height is derived from the title's line-height (17px / 20px) plus `BaseMenuItem`'s
vertical padding, rather than from a `size` token, so the rows land exactly on Figma's
33px / 36px.

Indentation is one chevron slot plus its 4px gap, which is what makes a child's title sit
directly under its parent's title at both sizes. It is applied as the row's own
`padding-left` (not as padding on the nested group) so hover / selected / focus
backgrounds stay full-bleed at any depth.

**`leading` and `trailing` are not resized.** They are arbitrary consumer `ReactNode`s, so
TreeView cannot (and should not) rewrite their props. Consumers size them, following two
different rules:

- **Icons track the tree's `size`** - both `leading` and a trailing icon, so
  `<FolderIcon size="small" />` / `<LockIcon size="small" />` in a `size="small"` tree.
- **Trailing Counter / Badge / Text are always `size="small"`**, at both tree sizes. They
  are secondary markers annotating the row; scaled up at `medium` they would out-weigh the
  title they belong to. This is a design rule, not a technical limit.

The design supports four trailing types (Figma: `_TreeViewItem-TrailingItem`). All of them
sit in a 20px-tall line box aligned to the row's first line:

| Trailing | Component                                               | `small` | `medium` |
| -------- | ------------------------------------------------------- | ------- | -------- |
| Counter  | `<Counter size="small" />`                              | 16×20   | 16×20    |
| Badge    | `<Badge size="small" />`                                | 38×20   | 38×20    |
| Icon     | any Blade icon, sized like `leading`                    | 12px    | 16px     |
| Text     | `<Text size="small" color="surface.text.gray.muted" />` | 24×20   | 24×20    |

Icon is the only trailing type that varies by tree size - it is a bare glyph with no
surface of its own, so it reads as part of the row's icon rhythm rather than as a chip.

`trailing` stays a plain `ReactNode` rather than a constrained union - these four are the
sanctioned treatments, not an enforced type.

### TreeViewItem

```ts
type TreeViewItemProps = {
  title: string;
  /** Required, unique across the tree (dev error otherwise, B10). */
  value: string;
  description?: string;
  /** icon | asset | avatar. In multiple, renders AFTER the checkbox (never replaced by it). */
  leading?: React.ReactNode;
  /** Counter, badge, or text - matches the Figma trailing slot. */
  trailing?: React.ReactNode;
  /** Cascades to the whole subtree; disabled subtrees are skipped by traversal (B4). */
  isDisabled?: boolean;
  /**
   * Branch-only opt-out of selection (default true). When false, row click / Enter / Space
   * toggle expansion instead; no checkbox or selected state is rendered. Leaves ignore it (dev warn).
   */
  isSelectable?: boolean;
  children?: React.ReactNode; // TreeViewItem | TreeViewLoadMore. Nesting IS depth (B8).
  defaultIsExpanded?: boolean;
  isExpanded?: boolean;
  onExpandChange?: (event: { isExpanded: boolean }) => void;
  /** Only for on-demand children: forces the branch affordance before children exist (B6). */
  hasChildren?: boolean;
  /** Children fetching: chevron renders Spinner (B6). */
  isLoading?: boolean;
  /** Per-item click, mirroring the ActionListItem precedent shape. */
  onClick?: (clickProps: {
    name: string;
    value: boolean;
    event?: React.MouseEvent<HTMLButtonElement>;
  }) => void;
} & TestID &
  DataAnalyticsAttribute;
```

No `titleSuffix`, `href`, `intent`, `isSelected`, or any level/depth prop. `href` is deliberately unsupported (a navigating node cannot own a selection subtree; `role="link"` cannot carry `aria-expanded`).

### TreeViewLoadMore

```ts
type TreeViewLoadMoreProps = {
  children?: string; // label, default "Show more"
  onClick: () => void;
  isLoading?: boolean;
} & TestID &
  DataAnalyticsAttribute;
```

## Behaviour contract (each item is a test)

**B1. Single-select.** No checkboxes. Any node with a `value` (branch or leaf) is selectable; selecting it makes it the single selection (radio semantics, including branch→descendant moves). Selected renders row emphasis + `aria-selected`. No cascade; indeterminate cannot occur. Inside Dropdown, selection closes the overlay via the existing `closeOnSelection` gate, unchanged. A branch can opt out with `isSelectable={false}` (leaf-only selection): its row click / Enter / Space toggle expansion instead, it carries no `aria-selected`/`aria-checked`, never enters `values`, and in Dropdown mode never enters `selectedIndices` (the overlay stays open).

**B2. Multi-select cascade.** Toggling a branch toggles all its **enabled, loaded** leaves. Branch checkbox state is **derived, never stored**: checked when all enabled loaded selectable descendants are selected, unchecked when none, indeterminate otherwise (render with `Checkbox isIndeterminate`, emitting `aria-checked="mixed"`). A branch whose only unselected descendants are disabled shows **checked**, not indeterminate. Collapsed branches keep rendering their own derived state.

**B3. Change payload.** `values` = selected **leaf** values only; a branch's own `value` never appears in `values`. `selectedGroups` = values of the **topmost** fully-selected branches only. Standalone, both arrive via `TreeView.onChange`. In Dropdown, `values` arrives through the trigger's standard `onChange({name, values})` (unchanged shape), and `selectedGroups` is added as an **additive optional field** on that payload when the overlay content is a TreeView. Canonical trace (tree: India > Karnataka > [Bengaluru, Mysuru], India > Goa):

| Action          | values                         | selectedGroups  |
| --------------- | ------------------------------ | --------------- |
| check Bengaluru | `['bengaluru']`                | `[]`            |
| check Mysuru    | `['bengaluru','mysuru']`       | `['karnataka']` |
| check Goa       | `['bengaluru','mysuru','goa']` | `['india']`     |
| uncheck India   | `[]`                           | `[]`            |

**B4. Disabled.** Disables the subtree: unselectable, not expandable by keyboard, skipped by traversal, unaffected by ancestor cascade. Mirrors ActionList's mechanism: **disabled rows are simply never registered**, which gives skip-behaviour for free in Dropdown mode.

**B5. Expansion.** `defaultIsExpanded` (default false) / `isExpanded` + `onExpandChange`, the `Collapsible` prop pattern. Chevron click toggles expansion, never selects; row click selects. Animation: `grid-template-rows: 0fr ⇄ 1fr` (200ms, standard easing token), chevron rotates 90°. **Never animate `height`.** The animating wrapper clips its content (`overflow: hidden`) only while collapsed or mid-transition — the clip is released on `transitionend` once the group has settled open and re-applied the moment it starts moving again, because a clipping ancestor also cuts off the focus ring of every row nested inside it (the ring is an `outline` painted outside the row's box).

**B6. Async children.** `hasChildren` with no rendered children → chevron renders; expand fires `onExpandChange`; while `isLoading` the chevron slot renders `Spinner` (16px), no layout shift. Newly loaded children **inherit the parent's selection** (selected iff parent was fully selected at arrival). In Dropdown mode this composes with the existing controlled re-sync: options re-register on children change and `useControlledDropdownInput` re-maps on `[props.value, options]`.

**B7. TreeViewLoadMore.** Non-selectable action row: no checkbox and no chevron of its own — the label is offset by one chevron slot (24px) from the row's indentation, so it aligns with the content of sibling rows. It is a plain `Text` (not the `Link` component) in `interactive.text.primary.normal` at medium weight, matching Figma. Reachable by Up/Down; Enter activates; Space is a no-op; never in `values`/`selectedGroups`/counts. `isLoading` = 16px `Spinner` (`neutral`, i.e. `interactive.icon.gray.muted`) + label switches to a muted "Loading..." + inert. Any depth including root. Dev-warn on >1 per branch or non-last position. Rows appended after the initial mount (into an existing group or at the root) animate their own mount with the same `grid-template-rows: 0fr → 1fr` transition as B5 — a "mount scope" (the tree root, or each children group) marks its first render, and a row mounting into an already-mounted scope knows it was appended later; rows mounting together with their scope render statically (the scope's own animation covers async groups, B6).

**B8. Depth.** Derived from nesting only; each row applies its own `padding-left = spacing.3 + 24px × (level − 1)` (Figma's `TreeView.Indentation.level-N`), so hover/selected backgrounds stay full-bleed across the tree width. Nested groups carry no padding. Dev-warn beyond 3 levels.

**B9. Chevron slot.** Every row reserves the 20px chevron slot, and it stays empty on leaves so leaves and branches of the same level align. With the 4px gap after it the slot spans exactly one 24px indentation step, which puts a child's content one step to the right of its parent's content.

**B10. Validation (dev).** Duplicate `value` → `throwBladeError`. Child validation to `TreeViewItem | TreeViewLoadMore` via componentId checks, implemented locally, not by touching ActionList's validator.

**B11. Selection storage.** Standalone: a `Set` of selected leaf values inside TreeView. Dropdown mode: **no TreeView-owned selection state at all**; Dropdown's `selectedIndices` is the store, and branch states/`selectedGroups`/counts are derived from it. One source of truth per mode, never both.

**B12. Empty branch.** `children` empty and no `hasChildren` → leaf (empty chevron slot, no expansion semantics).

**B13. Tooltip / Popover on items.** `TreeViewItem` takes `tooltip` and `popover` props, following the `SideNavLink` / `AppBar` precedent of overlays as props. Wrapping an item in `<Tooltip>` / `<Popover>` is not supported: TreeView only accepts `TreeViewItem` / `TreeViewLoadMore` children (B10), reads items' props to build the tree, and an item is not the row element either overlay needs as its trigger.

- `tooltip` wraps the treeitem row itself, so it opens on hover **and** keyboard focus, and its content reaches assistive tech through `aria-describedby`. Tooltip normally sets its content as the trigger's `aria-label` (meant for icon-only triggers); TreeView clears that so the row keeps its title as its name.
- `popover` opens on **mouse hover only**, for rich previews. The row cannot be Popover's trigger: Popover writes `aria-expanded` / `aria-haspopup` / `aria-controls` on its trigger, which would overwrite a branch's expansion state and make leaves announce as collapsed branches. A wrapper around the row is not an allowed child of `role="tree"` either (axe `aria-required-children`). So the Popover is controlled by the row's own `mouseenter` / `mouseleave` and anchored on an `aria-hidden`, `pointer-events: none` box laid over the row content. It opens for a **mouse** pointer only (`pointerType === 'mouse'` on `pointerenter`; pointer events rather than mouse events, because browsers fire emulated mouse events after a tap). On touch screens a tap would otherwise open the popover and select the row at once, the popover would flip below the row and cover the rows under it, and iOS Safari may swallow the first tap as a hover. Leaving the row closes it after `motion.delay.xquick` (160ms), so the pointer can cross the gap onto the popover: its content is portalled, but it is a React child of the row, so React keeps firing the row's `pointerenter` / `pointerleave` while the pointer is over it. For the same reason clicks, focus and mousedown inside the popover bubble into the row through the React tree; the row ignores any event whose DOM target is outside its own element. It does not open on focus either: an open Popover marks the rest of the page `aria-hidden`, which would hide the focused row itself. Because it is pointer-only, its content must never be the only place information lives.
- Both default to `placement="right"`: in a vertical tree, `top` / `bottom` would cover the rows the pointer moves to next.
- Only one of the two per item. If both are passed, `popover` wins and a dev warning is logged.

## Accessibility

**Standalone:** `role="tree"` (+ `aria-multiselectable` when multiple); rows `role="treeitem"` with `aria-expanded` (branches), `aria-level`, `aria-posinset`, `aria-setsize`, and `aria-selected` / `aria-checked` (`"mixed"` for indeterminate). Roving tabindex with real focus - one tab stop for the whole tree. The visual checkbox is `aria-hidden` (the treeitem role carries the state).

**In Dropdown:** mirrors ActionList's model, not the standalone one. Focus stays on the trigger; the active row is driven by `activeIndex` + `aria-activedescendant`, with row ids `${dropdownBaseId}-${index}`. This is the ARIA combobox pattern with a tree popup: popup `role="tree"`, rows `role="treeitem"`. TreeView never emits `menuitemcheckbox`.

**Keyboard map (both modes):** ArrowDown/ArrowUp move across visible rows; ArrowRight expands / moves into a branch; ArrowLeft collapses / moves to the parent; Home/End jump to first/last visible row; Enter/Space select (Space is a no-op on LoadMore).

## Dropdown display (D5)

The trigger shows the **smallest describing set**: topmost fully-selected branches count as 1 each, remaining selected leaves count individually. A single entry shows its title as the label ("Karnataka"); multiple entries show a count. Implemented as an additive `displayOverride` published by TreeView and consumed by `makeInputDisplayValue` and the FilterChip display path, falling back to existing behaviour when absent.

## Out of scope for v1

- React Native (native entry throws a dev error)
- BottomSheet (dev error when rendered inside one; needs the ActionList-style layout fork as a follow-up)
- Search/filter inside the tree, drag-and-drop, virtualization
- `href` on items
- AutoComplete / other triggers beyond SelectInput and FilterChipSelectInput (they must not crash, but are not part of acceptance)

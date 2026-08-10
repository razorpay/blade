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
} & TestID &
  DataAnalyticsAttribute;
```

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
  onClick?: (event: { name: string; value: string }) => void;
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

| Action          | values                            | selectedGroups  |
| --------------- | --------------------------------- | --------------- |
| check Bengaluru | `['bengaluru']`                   | `[]`            |
| check Mysuru    | `['bengaluru','mysuru']`          | `['karnataka']` |
| check Goa       | `['bengaluru','mysuru','goa']`    | `['india']`     |
| uncheck India   | `[]`                              | `[]`            |

**B4. Disabled.** Disables the subtree: unselectable, not expandable by keyboard, skipped by traversal, unaffected by ancestor cascade. Mirrors ActionList's mechanism: **disabled rows are simply never registered**, which gives skip-behaviour for free in Dropdown mode.

**B5. Expansion.** `defaultIsExpanded` (default false) / `isExpanded` + `onExpandChange`, the `Collapsible` prop pattern. Chevron click toggles expansion, never selects; row click selects. Animation: `grid-template-rows: 0fr ⇄ 1fr` (200ms, standard easing token), chevron rotates 90°. **Never animate `height`.**

**B6. Async children.** `hasChildren` with no rendered children → chevron renders; expand fires `onExpandChange`; while `isLoading` the chevron slot renders `Spinner` (16px), no layout shift. Newly loaded children **inherit the parent's selection** (selected iff parent was fully selected at arrival). In Dropdown mode this composes with the existing controlled re-sync: options re-register on children change and `useControlledDropdownInput` re-maps on `[props.value, options]`.

**B7. TreeViewLoadMore.** Non-selectable action row: no checkbox, no chevron slot — the label sits flush at the row's indentation, aligning with sibling leaf content. It is a plain `Text` (not the `Link` component) in `interactive.text.primary.normal` at medium weight, matching Figma. Reachable by Up/Down; Enter activates; Space is a no-op; never in `values`/`selectedGroups`/counts. `isLoading` = 16px `Spinner` (`neutral`, i.e. `interactive.icon.gray.muted`) + label switches to a muted "Loading..." + inert. Any depth including root. Dev-warn on >1 per branch or non-last position. Rows appended after the initial mount (into an existing group or at the root) animate their own mount with the same `grid-template-rows: 0fr → 1fr` transition as B5 — a "mount scope" (the tree root, or each children group) marks its first render, and a row mounting into an already-mounted scope knows it was appended later; rows mounting together with their scope render statically (the scope's own animation covers async groups, B6).

**B8. Depth.** Derived from nesting only; each row applies its own `padding-left = spacing.3 + 24px × (level − 1)` (Figma's `TreeView.Indentation.level-N`), so hover/selected backgrounds stay full-bleed across the tree width. Nested groups carry no padding. Dev-warn beyond 3 levels.

**B9. Chevron slot.** Only branch rows render the 20px chevron slot; with the 4px gap after it, the slot spans exactly one 24px indentation step, so a child's content starts at the same column as its parent's content. Leaf rows have no reserved gutter — their content sits flush at the row's indentation.

**B10. Validation (dev).** Duplicate `value` → `throwBladeError`. Child validation to `TreeViewItem | TreeViewLoadMore` via componentId checks, implemented locally, not by touching ActionList's validator.

**B11. Selection storage.** Standalone: a `Set` of selected leaf values inside TreeView. Dropdown mode: **no TreeView-owned selection state at all**; Dropdown's `selectedIndices` is the store, and branch states/`selectedGroups`/counts are derived from it. One source of truth per mode, never both.

**B12. Empty branch.** `children` empty and no `hasChildren` → leaf (no chevron slot, content flush at the row's indentation).

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

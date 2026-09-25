# TreeView

## Component Name

TreeView

## Description

TreeView renders a hierarchical list of expandable, selectable items. It works standalone on a page with its own selection state, or inside Dropdown (in place of ActionList) where selection is controlled through the trigger's `value` / `onChange` (SelectInput, FilterChipSelectInput). It supports single select (radio semantics), multiple select with branch cascade and indeterminate checkboxes, async children loading, and progressive loading with TreeViewLoadMore.

## Important Constraints

- `TreeView` is a **web-only** component. On React Native it throws an error.
- `TreeView` only supports `TreeViewItem` and `TreeViewLoadMore` as children (throws otherwise)
- `TreeViewItem` `value` must be unique across the whole tree (throws on duplicates)
- Inside Dropdown, `selectionType`, `value`, `defaultValue`, and `onChange` on TreeView are ignored (dev warning) — use them on the Dropdown trigger instead (SelectInput / FilterChipSelectInput)
- TreeView is not supported inside BottomSheet (dev error)
- Nesting beyond 3 levels logs a dev warning
- `TreeViewLoadMore` should be the last child of its branch, at most one per branch
- In `onChange`, `values` contains only selected **leaf** values; a branch's own value never appears in `values`. `selectedGroups` contains the topmost fully-selected branch values.
- `size` is set once on `TreeView` and applies to the whole tree — there is no per-item size. It scales the row height, title, chevron, checkbox and indentation, but **not** `leading` / `trailing`, which are your own nodes and must be sized by you:
  - **Icons follow the tree's `size`** — this applies to `leading` _and_ to a trailing icon. Use `size="small"` (12px) icons in a `size="small"` tree and `size="medium"` (16px) in a `medium` tree.
  - **Trailing Counter / Badge / Text are always `size="small"`, at both tree sizes.** Counter and Badge default to `medium`, so you must pass `size="small"` explicitly — they should never out-weigh the title they annotate.
- The four supported `trailing` treatments:
  - **Counter** — `<Counter value={12} size="small" />` (same at both tree sizes)
  - **Badge** — `<Badge size="small">Live</Badge>` (same at both tree sizes)
  - **Icon** — any Blade icon, sized like `leading`: `<LockIcon color="surface.icon.gray.muted" size="small" />` in a small tree, `size="medium"` in a medium tree. This is the only trailing type that varies by tree size.
  - **Text** — `<Text size="small" color="surface.text.gray.muted">Updated 2d ago</Text>`, also used for shortcut keys (same at both tree sizes)

## TypeScript Types

Below are the props that the TreeView component and its subcomponents accept.

```typescript
type TreeViewProps = {
  /**
   * Children of TreeView. Only `TreeViewItem` and `TreeViewLoadMore` are allowed
   */
  children: React.ReactNode;
  /**
   * Selection type of the tree.
   *
   * Standalone only. Inside Dropdown, it is inherited from Dropdown's `selectionType`.
   *
   * @default 'single'
   */
  selectionType?: 'single' | 'multiple';
  /**
   * Controlled selected leaf values.
   *
   * Standalone only. Inside Dropdown, use `value` on the trigger instead.
   */
  value?: string[];
  /**
   * Default selected leaf values (uncontrolled). Standalone only.
   */
  defaultValue?: string[];
  /**
   * Selection change handler. Standalone only. Inside Dropdown, use `onChange` on the trigger instead.
   *
   * - `values`: selected leaf values (a branch's own value never appears here in multiple selection)
   * - `selectedGroups`: values of the topmost fully-selected branches
   */
  onChange?: (event: { name?: string; values: string[]; selectedGroups: string[] }) => void;
  /**
   * Name of the tree, passed in the `onChange` payload
   */
  name?: string;
  /**
   * Visual density of every row in the tree. Applies tree-wide; individual rows cannot opt out.
   *
   * Note: `leading` and `trailing` are consumer-provided nodes, so their own `size`
   * must be set by you (use `size="small"` on icons/avatars in a `size="small"` tree).
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium';
} & TestID &
  DataAnalyticsAttribute;

type TreeViewItemProps = {
  /**
   * Title of the item
   */
  title: string;
  /**
   * Value of the item. Required and must be unique across the whole tree
   */
  value: string;
  /**
   * Description shown below the title
   */
  description?: string;
  /**
   * Leading element - icon, asset, or avatar.
   * In multiple selection, it renders AFTER the checkbox
   */
  leading?: React.ReactNode;
  /**
   * Trailing element - Counter, Badge, or Text
   */
  trailing?: React.ReactNode;
  /**
   * Disables the item and its whole subtree
   */
  isDisabled?: boolean;
  /**
   * When `false` on a branch item, the branch itself cannot be selected - clicking the row
   * (or pressing Enter/Space) toggles expansion instead, and no checkbox / selected state
   * is rendered for it. Use this when only leaf items should be selectable.
   * Only supported on branch items - leaf items are always selectable.
   *
   * @default true
   */
  isSelectable?: boolean;
  /**
   * Nested `TreeViewItem` / `TreeViewLoadMore` children. Nesting defines depth
   */
  children?: React.ReactNode;
  /**
   * Default expansion state (uncontrolled)
   * @default false
   */
  defaultIsExpanded?: boolean;
  /**
   * Controlled expansion state
   */
  isExpanded?: boolean;
  /**
   * Expansion change handler
   */
  onExpandChange?: (event: { isExpanded: boolean }) => void;
  /**
   * Forces the branch affordance (chevron) before children exist. Use for on-demand (async) children
   */
  hasChildren?: boolean;
  /**
   * Renders a Spinner in the chevron slot while children are being fetched
   */
  isLoading?: boolean;
  /**
   * Per-item click handler. Mirrors the ActionListItem precedent:
   * `name` is the item's value (id), `value` is the post-click selected state,
   * and `event` is the DOM event (present on click, absent on keyboard activation)
   */
  onClick?: (clickProps: {
    name: string;
    value: boolean;
    event?: React.MouseEvent<HTMLButtonElement>;
  }) => void;
  /**
   * Shows a Tooltip when the row is hovered or receives keyboard focus.
   * Use it for a short, plain-text hint about the item. Cannot be combined with `popover`.
   */
  tooltip?: {
    title?: string;
    content: string;
    /** @default 'right' */
    placement?: TooltipProps['placement'];
    onOpenChange?: ({ isOpen }: { isOpen: boolean }) => void;
  };
  /**
   * Shows a Popover when the row is hovered with a mouse - use it for rich previews.
   * Opens on mouse hover only (not on keyboard focus or touch), so never put information
   * in it that is not available elsewhere. Cannot be combined with `tooltip`.
   */
  popover?: {
    title?: string;
    titleLeading?: React.ReactNode;
    content: React.ReactElement;
    footer?: React.ReactNode;
    /** @default 'right' */
    placement?: PopoverProps['placement'];
    maxWidth?: SpacingValueType;
    onOpenChange?: ({ isOpen }: { isOpen: boolean }) => void;
  };
} & TestID &
  DataAnalyticsAttribute;

type TreeViewLoadMoreProps = {
  /**
   * Label of the load more row
   * @default 'Show more'
   */
  children?: string;
  /**
   * Click handler that loads more items
   */
  onClick: () => void;
  /**
   * Renders a Spinner, switches the label to "Loading..." and makes the row inert while more items are being fetched
   */
  isLoading?: boolean;
} & TestID &
  DataAnalyticsAttribute;
```

## Usage Guidelines

- Use TreeView when options have a natural hierarchy (regions > states > cities, org units, folder-like categories) and users select leaves, groups, or navigate the structure.
- Use `selectionType="multiple"` when users can select several leaves; toggling a branch selects/deselects all its enabled loaded leaves and partial selections render an indeterminate checkbox.
- Standalone TreeView owns its selection via `value`/`defaultValue`/`onChange`. Inside Dropdown, put those props on the trigger — a consumer swapping `ActionList` for `TreeView` inside an existing `Dropdown + SelectInput` keeps the exact same controlled API.
- For async/on-demand children, set `hasChildren` (renders the chevron before children exist) and `isLoading` while fetching; render the loaded children as nested `TreeViewItem`s. Newly loaded children of a fully-selected branch inherit the selection.
- Use `TreeViewLoadMore` as the last child of a branch (or the root) for progressive loading.
- Keyboard: ArrowUp/ArrowDown move across visible rows; ArrowRight expands / enters a branch; ArrowLeft collapses / moves to the parent; Home/End jump to the first/last visible row; Enter/Space select (Space is a no-op on TreeViewLoadMore).
- Branches are selectable by default (in single mode a branch is a valid selection; in multiple mode toggling it cascades). Set `isSelectable={false}` on a branch to make it a pure grouping row — clicking it (or Enter/Space) toggles expansion instead, and only leaf items can be selected.
- To show extra information on hover, use the `tooltip` prop on `TreeViewItem` for short text (it also opens on keyboard focus) or the `popover` prop for rich previews such as a screen thumbnail (mouse hover only; on touch screens a tap just selects the row, so show the preview elsewhere on mobile, e.g. when the row is selected). Do not wrap `TreeViewItem` in `<Tooltip>` / `<Popover>` — TreeView only accepts `TreeViewItem` / `TreeViewLoadMore` children.
- Use `size="small"` for dense surfaces such as sidebars, file trees, or long dropdown overlays where many rows must stay visible; keep the default `size="medium"` for primary in-page trees. Match all icons (leading and trailing) to the tree's size, and always pass `size="small"` to trailing Counters and Badges.

## Examples

### Dense tree with size="small", leading icons and trailing content

```tsx
import React from 'react';
import {
  TreeView,
  TreeViewItem,
  FolderIcon,
  FileTextIcon,
  LockIcon,
  Counter,
  Badge,
  Text,
} from '@razorpay/blade/components';

function SidebarTree() {
  return (
    // `size` is tree-wide. Icons follow it; trailing Counter / Badge / Text are always small
    <TreeView size="small" selectionType="multiple">
      <TreeViewItem
        title="Reports"
        value="reports"
        description="Generated every night"
        leading={<FolderIcon color="interactive.icon.gray.muted" size="small" />}
        // trailing: Counter
        trailing={<Counter value={12} color="information" size="small" />}
        defaultIsExpanded
      >
        <TreeViewItem
          title="Settlements"
          value="settlements"
          leading={<FileTextIcon color="interactive.icon.gray.muted" size="small" />}
          // trailing: Badge
          trailing={
            <Badge color="positive" size="small">
              Live
            </Badge>
          }
        />
        <TreeViewItem
          title="Payouts"
          value="payouts"
          leading={<FileTextIcon color="interactive.icon.gray.muted" size="small" />}
          // trailing: Text
          trailing={
            <Text size="small" color="surface.text.gray.muted">
              Updated 2d ago
            </Text>
          }
        />
        <TreeViewItem
          title="Vendor payments"
          value="vendor-payments"
          leading={<FileTextIcon color="interactive.icon.gray.muted" size="small" />}
          // trailing: Icon
          trailing={<LockIcon color="surface.icon.gray.muted" size="small" />}
        />
      </TreeViewItem>
    </TreeView>
  );
}

export default SidebarTree;
```

### Tooltip and hover preview on items

```tsx
import React from 'react';
import { TreeView, TreeViewItem } from '@razorpay/blade/components';
import { CheckCircleIcon, LoaderIcon, RefreshIcon } from '@razorpay/blade/components';

const CheckoutScreensTree = (): React.ReactElement => (
  <TreeView>
    <TreeViewItem
      title="Payment Processing"
      value="payment-processing"
      leading={<LoaderIcon />}
      tooltip={{ content: 'Shown while the bank confirms the payment' }}
    />
    <TreeViewItem
      title="Payment Success"
      value="payment-success"
      leading={<CheckCircleIcon />}
      popover={{
        title: 'Payment Success',
        content: <img src="/previews/payment-success.png" alt="" width="220" />,
      }}
    />
    <TreeViewItem title="Retry Payment" value="retry-payment" leading={<RefreshIcon />} />
  </TreeView>
);
```

### Standalone multiple selection with cascade

```tsx
import React from 'react';
import { TreeView, TreeViewItem } from '@razorpay/blade/components';

function RegionsTree() {
  return (
    <TreeView
      selectionType="multiple"
      name="regions"
      defaultValue={['bengaluru']}
      onChange={({ values, selectedGroups }) => {
        // values: selected leaf values only, e.g. ['bengaluru', 'mysuru']
        // selectedGroups: topmost fully-selected branches, e.g. ['karnataka']
        console.log(values, selectedGroups);
      }}
    >
      <TreeViewItem title="India" value="india" defaultIsExpanded>
        <TreeViewItem title="Karnataka" value="karnataka" defaultIsExpanded>
          <TreeViewItem title="Bengaluru" value="bengaluru" />
          <TreeViewItem title="Mysuru" value="mysuru" />
        </TreeViewItem>
        <TreeViewItem title="Goa" value="goa" />
      </TreeViewItem>
    </TreeView>
  );
}
```

### Inside Dropdown with FilterChipSelectInput (selection lives on the trigger)

```tsx
import React from 'react';
import {
  Dropdown,
  DropdownOverlay,
  DropdownFooter,
  FilterChipSelectInput,
  TreeView,
  TreeViewItem,
  Button,
  Box,
} from '@razorpay/blade/components';

function RegionsFilter() {
  const [values, setValues] = React.useState<string[]>([]);

  return (
    <Dropdown selectionType="multiple">
      <FilterChipSelectInput
        label="Regions"
        value={values}
        onChange={({ values: nextValues, selectedGroups }) => {
          // selectedGroups is an additive field present when the overlay content is a TreeView
          setValues(nextValues);
        }}
        onClearButtonClick={() => setValues([])}
      />
      <DropdownOverlay>
        {/* no selection props on TreeView here - the trigger owns selection */}
        <TreeView>
          <TreeViewItem title="India" value="india" defaultIsExpanded>
            <TreeViewItem title="Karnataka" value="karnataka">
              <TreeViewItem title="Bengaluru" value="bengaluru" />
              <TreeViewItem title="Mysuru" value="mysuru" />
            </TreeViewItem>
            <TreeViewItem title="Goa" value="goa" />
          </TreeViewItem>
        </TreeView>
        <DropdownFooter>
          <Box display="flex" gap="spacing.3" width="100%">
            <Button isFullWidth size="small" variant="tertiary" onClick={() => setValues([])}>
              Clear
            </Button>
            <Button isFullWidth size="small">
              Apply
            </Button>
          </Box>
        </DropdownFooter>
      </DropdownOverlay>
    </Dropdown>
  );
}
```

### Inside Dropdown with SelectInput, leaf-only selection

```tsx
import React from 'react';
import {
  Dropdown,
  DropdownOverlay,
  SelectInput,
  TreeView,
  TreeViewItem,
} from '@razorpay/blade/components';

// Branches opt out of selection with isSelectable={false}: clicking them (or Enter/Space)
// toggles expansion, so only leaf items (cities) can become the selected value
function CityPicker() {
  return (
    <Dropdown selectionType="single">
      <SelectInput label="City" placeholder="Select city" />
      <DropdownOverlay>
        <TreeView>
          <TreeViewItem title="India" value="india" isSelectable={false} defaultIsExpanded>
            <TreeViewItem title="Karnataka" value="karnataka" isSelectable={false}>
              <TreeViewItem title="Bengaluru" value="bengaluru" />
              <TreeViewItem title="Mysuru" value="mysuru" />
            </TreeViewItem>
            <TreeViewItem title="Goa" value="goa" isSelectable={false}>
              <TreeViewItem title="Panaji" value="panaji" />
              <TreeViewItem title="Margao" value="margao" />
            </TreeViewItem>
          </TreeViewItem>
        </TreeView>
      </DropdownOverlay>
    </Dropdown>
  );
}
```

### Async children and progressive loading

```tsx
import React from 'react';
import { TreeView, TreeViewItem, TreeViewLoadMore } from '@razorpay/blade/components';

// Mock API functions for demonstration
const fetchCities = (): Promise<string[]> => Promise.resolve(['Bengaluru', 'Mysuru', 'Mangaluru']);

const fetchMoreCities = (): Promise<string[]> => Promise.resolve(['Hubli', 'Belagavi', 'Gulbarga']);

function AsyncTree() {
  const [cities, setCities] = React.useState<string[]>([]);
  const [isLoadingChildren, setIsLoadingChildren] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  // Simulated API calls — replace with your real fetch logic
  const fetchCities = async (): Promise<string[]> => {
    return ['Bengaluru', 'Mysuru', 'Mangaluru'];
  };
  const fetchMoreCities = async (): Promise<string[]> => {
    return ['Hubli', 'Belagavi'];
  };

  return (
    <TreeView selectionType="multiple">
      <TreeViewItem
        title="Karnataka"
        value="karnataka"
        hasChildren
        isLoading={isLoadingChildren}
        onExpandChange={({ isExpanded }) => {
          if (isExpanded && cities.length === 0) {
            setIsLoadingChildren(true);
            fetchCities().then((loadedCities) => {
              setCities(loadedCities);
              setIsLoadingChildren(false);
            });
          }
        }}
      >
        {cities.map((city) => (
          <TreeViewItem key={city} title={city} value={city.toLowerCase()} />
        ))}
        <TreeViewLoadMore
          isLoading={isLoadingMore}
          onClick={() => {
            setIsLoadingMore(true);
            fetchMoreCities().then((moreCities) => {
              setCities((previous) => [...previous, ...moreCities]);
              setIsLoadingMore(false);
            });
          }}
        />
      </TreeViewItem>
      <TreeViewItem title="Goa" value="goa" />
    </TreeView>
  );
}
```

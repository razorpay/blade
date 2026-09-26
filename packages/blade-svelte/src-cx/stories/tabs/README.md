# Tabs

`packages/blade/components/tabs/Tabs.svelte` over `createTabs`
(`navigable-list` + single strict selection). Data-driven, like Accordion.

| Prop | Notes |
| --- | --- |
| `items`, `itemKey`, `itemLabel` | The key is also the value |
| `value` | Bindable; defaults to the first enabled tab — a tablist always has one picked |
| `onChange` | The new key |
| `isItemDisabled` | Skipped by the arrows, ignored by a click |
| `activation` | `automatic` (default): arrows pick as they move. `manual`: Enter or Space picks. Fixed at mount |
| `children(item)` | The picked tab's panel; only that one is mounted |
| `tab(item)` | Replaces a tab's label |
| `accessibilityLabel` | Names the tablist |
| `layout`, `size` | Style axes |

Blade's underline is the `tabsList` snippet, fed `{ index, count }`
like the segmented radio's thumb: with `layout="fill"` the tabs are equal, so
one underline slides by whole tabs; content-sized tabs underline themselves.
A segmented control is not tabs: that is `SegmentedControl`.

# @razorpay/blade-mcp

## 1.32.3

### Patch Changes

- e38ee57c2: feat(SankeyChart): group small nodes into an expandable "Other" node; Blade-owned layout on web

  - `groupNodesBelow` folds every node under the given share of the total into one "Other" node per column (never a root, never a node with `isGroupable: false`, never a group of one). Ribbons are re-pointed and summed (a merged ribbon does not fire `onLinkClick`, like the group node and `onNodeClick`; `onExpandChange` covers it), the group is drawn in neutral grey with a chevron, and its tooltip lists the members with their shares
  - Clicking a group, or pressing Enter/Space on its label, reveals the members in place at the same scale: every other bar and ribbon keeps its size, each revealed node gets room for its label, and the drawing grows below the container. Wrap the chart in a fixed-height `Box` with `overflowY="auto"` to scroll it. Clicking a revealed label folds the group again, and keyboard focus follows the toggle
  - Expanded state follows the Accordion API: `defaultExpandedGroupDepths`, `expandedGroupDepths`, `onExpandChange`, keyed by zero-based column depth like Accordion's numeric `expandedIndex`, so expanded state can be authored statically. `formatGroupLabel` names the group
  - The web chart now lays out through Blade's own engine, a port of the recharts Sankey algorithm pinned by a parity test, and renders its own tooltip. Existing charts keep their exact geometry, tooltip text and callbacks: `onLinkClick` still receives the consumer's own link object for a plain ribbon, a chart whose links are all missing or invalid still renders nothing, and `width` / `height` on `ChartSankey` are still accepted (deprecated and ignored: the chart sizes itself from the wrapper)

- 332e19fd1: fix(TreeView): drop the empty chevron space when no row can expand

  `TreeViewItem` rows reserve an empty chevron slot so leaves line up with branches. This is now decided once for the whole tree: the slot is kept on every row only when at least one row can expand (it has children or passes `hasChildren`). A fully flat tree drops the slot on every row, so it renders flush like `ActionList`, and `TreeViewLoadMore` drops its matching label offset too.

  The `blade-mcp` knowledgebase doc for TreeView is updated with the rule, and recommends `ActionList` for data that can never nest.

## 1.32.2

### Patch Changes

- 69fee199a: feat(FileUpload): add `size="small"`, allow `dropAreaText` on every size, and show an upload icon on the upload action

  - `size="small"`: a 32px tall drop area with smaller text and corner radius
  - `dropAreaText` now works with every size, not only `variable`. Pass `dropAreaText=""` to hide the "Drag files here or" text and show only the upload action. With `size="variable"`, `dropAreaText=""` now removes the empty text line instead of leaving a gap

  **Visual change for all existing usages:** the "Upload" action inside the drop area now always shows an upload icon and uses neutral colours (dark text and icon, medium weight, still underlined) instead of the blue link, matching the Figma design. No code changes are needed, but snapshot tests that include FileUpload will need updating.

  **Fix (web):** `errorText` now shows when `validationState="error"` even if `helpText` isn't set, and screen readers no longer hear "null" in place of the error.

- 5bad69b87: docs(blade-mcp): list StarFilledIcon and BookmarkFilledIcon in the available icons
- 4e0548cb8: feat(Popover): switch hover popovers and tooltips in place

  Popovers with `openInteraction="hover"` now join the same group as every `Tooltip` (the `FloatingDelayGroup` in `BladeProvider`). Moving the pointer from one hover overlay to the next switches them in place: opening one closes whichever is showing, the replaced one disappears without fading out, and the new one appears without fading in. Only the first overlay of a hover streak fades in, and only the last one fades out. This works for controlled hover popovers too: being replaced calls `onOpenChange({ isOpen: false })`.

  **Behaviour changes for hover popovers** (click popovers are unchanged). These fix behaviour that was not intended rather than change a designed API, so they ship as a minor release:

  - **Not modal (bug fix).** Hover popovers used to be modal by accident: the `modal` setting was hard-coded for every popover, so a hover popover marked the rest of the page `aria-hidden` while the pointer rested on its trigger, hiding the page from screen readers. A hover popover now neither traps focus nor hides the page. Opening one still never moves focus into it (it already opened with no initial focus); the difference is that if the user clicks into it and presses Tab, focus can now leave it instead of cycling inside it.
  - **Short close delay.** Leaving the trigger closes the popover after 80ms instead of immediately, which lets the next hover overlay replace it in place. Moving the pointer onto the popover cancels the close, so hover popovers are now easier to reach with the mouse.

  **Tooltip:** tooltips switch the same way, as floating-ui recommends: a tooltip replaced by the next one disappears at once instead of fading out under it.

  The `blade-mcp` Popover doc now describes hover popovers.

- dca708181: feat(TreeView): show a Popover preview when hovering a `TreeViewItem`

  `TreeViewItem` accepts a new `popover` prop (`{ title?, titleLeading?, content, footer?, placement?, maxWidth?, onOpenChange? }`) that shows a Popover when the row is hovered with a mouse, for rich previews such as an image of the screen an item represents. It opens to the right of the row by default. It does not open on keyboard focus or on touch screens, where a tap only selects the row, so its content should never be the only place information lives.

  Moving the pointer from row to row switches previews in place, using the hover-popover switching built into Popover (razorpay/blade#4044): the replaced preview disappears without fading out, and the new one appears without fading in.

  The `blade-mcp` knowledgebase doc for TreeView is updated with the prop and an example.

## 1.32.1

### Patch Changes

- 17337347f: feat(BarChart): compare bars against a min–max reference range

  `ChartBarWrapper` can now show a shaded min–max range behind its bars, in two shapes:

  1. **One range for the whole chart** — drop a `<ChartReferenceBand lowerDataKey upperDataKey>` into a `ChartBarWrapper`. Previously this rendered nothing, since only `ChartLineWrapper` had a band layer. The band is always visible and gets a legend swatch.

  2. **A range per bar** — `<ChartBar>` accepts `rangeLowerDataKey`, `rangeUpperDataKey`, `rangeName`, `rangeColor` and `showRangeLegend`. In a grouped chart each bar can carry its own range; bands are revealed **on hover, one at a time**, so several ranges don't overlap into an unreadable wash. The band is colour-matched to its bar and anchored to that series' own bar centres.

  While a band is declared, hovering a bar also fades the other series and shades the hovered category, so the revealed band reads against its own bar. **This is scoped to charts that declare a band** — a bar chart without one keeps exactly the category-wide hover highlight it has today.

  **Tooltip** — hovering a bar shows its value and, on a second row, the range's min–max at that same data point. A standalone `<ChartReferenceBand>` now contributes its bounds to that row; previously only a series' own `range*` props did, so a chart-level band drew the shaded area but showed no range row. A bar's own `range*` props still win.

  A band that declares no name is now labelled the same in the legend and in the tooltip. The two read the name by different routes, and the default was only applied on one of them — so a `<ChartBar>` with `range*` props but no `rangeName` got a legend swatch reading `Industry range` against a tooltip row reading `Industry`, both on screen at once when `showRangeLegend` was set.

  `ChartReferenceBand` keeps its existing export from the shared chart components barrel — no import changes needed.

  **Scope of the band** (each fails closed, rendering no band rather than one in the wrong place):

  - Horizontal layout only — not drawn under `layout="vertical"`, whose geometry is not yet supported.
  - Requires a string `dataKey` on the bar; recharts also allows a number or a function, which the band's DOM lookups can't name.
  - Web only — the `range*` props are accepted but inert on React Native, and marked `@platform web`.
  - Hover-revealed per-bar bands are a visual enhancement, not the carrier of the data: every value is also in the tooltip, which is reachable without a pointer.

  Also fixes the alignment of the tooltip's range row, which affects **every chart** that shows one, LineChart included. Its indent was a hardcoded `spacing.5` (16px) standing in for the colour swatch plus its gap (`spacing.4` + `spacing.3` = 20px), so the range label sat 4px to the left of the series name above it.

  The `blade-mcp` knowledgebase doc for BarChart is updated too, so AI agents know the band is available: its accepted-children constraint previously omitted `ChartReferenceBand` entirely.

## 1.32.0

### Minor Changes

- 54c4ca954: feat(knowledgebase): sync component docs with Blade component types

  - Add docs for `ColorInput`, `AppBar`, `BottomBar`, `SegmentedControl`, `TrustBadge` and `SankeyChart`
  - Add `TableEditableDropdownCell`, `FileUploadItem`, `CollapsibleText` and `ChartReferenceBand` to their parent docs
  - Remove props that do not exist in code (e.g. `DatePicker` `locale`, `AutoComplete` `filter`, `FileUpload` `successText`) and fix wrong values (e.g. `DatePicker` `picker`, `Carousel` `navigationButtonVariant`)
  - Add missing props and values (e.g. `xsmall` and `small` input sizes, `labelSuffix` and `labelTrailing`)
  - Replace undefined types in docs with concrete types and fix type blocks that did not parse

## 1.31.0

### Minor Changes

- 4dd93e1a4: feat(FloatingActionButton): rename the dark color from `black` to `neutral` and align it with the neutral button tokens

  `<FloatingActionButton color="black" />` becomes `<FloatingActionButton color="neutral" />`. The dark FAB is now the same treatment as a filled `neutral` button — it reads its surface from `interactive.background.neutral.*` and its label, icon and spinner from `interactive.*.onNeutral.*`, so it inverts with the theme instead of always being black on white. The hover surface is now slightly translucent and the disabled surface is lighter, matching the updated design.

  On focus, the filled `neutral` surface now draws its ring from `interactive.border.neutral.faded` instead of the faded primary blue used everywhere else, matching the design.

  `color="black"` was never exposed on `Button` and has no consumers, so it is removed rather than deprecated.

- 4dd93e1a4: feat(Spinner): add an `onNeutral` color for spinners on a filled neutral surface

  `<Spinner color="onNeutral" />` reads `interactive.icon.onNeutral.normal`, which inverts with the theme. Every other spinner color is either static (`white`) or tracks the page surface (`neutral`, the feedback colors), so none of them stayed visible on a filled `neutral` surface, which is black on light and white on dark.

  A loading `Button color="neutral" variant="primary"` and `FloatingActionButton color="neutral"` now use it. Both previously hardcoded a static white spinner, which disappeared against the white surface in dark mode. Fixes #3915 for the `neutral` surface.

## 1.30.0

### Minor Changes

- 3cd283e97: feat(FloatingActionButton): add FloatingActionButton component

  Adds `FloatingActionButton`, a persistent pill-shaped button anchored to the bottom of the viewport for the single most important action on a screen. It supports `primary`, `white` and `black` colors, anchors via `placement` (`bottom-end`, `bottom-start`, `bottom`) with a configurable `offset` and `zIndex`, and renders either an icon with a short label or an icon on its own, in which case `accessibilityLabel` is required. Positioning is `fixed` on web and `absolute` with safe-area insets on React Native.

## 1.29.0

### Minor Changes

- dd8501226: feat(blade): add TreeView component

  TreeView: hierarchical selectable list, standalone and inside Dropdown. First snowflake promotion (original Tree Hierarchy snowflake by Prarthana Gogoi).

  - `TreeView`, `TreeViewItem`, `TreeViewLoadMore` exports (web-only; native entry throws a dev error)
  - Standalone: single select (radio semantics) and multiple select with branch cascade, indeterminate checkboxes, roving tabindex keyboard map, `tree`/`treeitem` ARIA
  - Inside Dropdown: drop-in replacement for ActionList - selection controlled through the trigger's `value`/`onChange` (SelectInput, FilterChipSelectInput), with an additive optional `selectedGroups` field in the onChange payload and smallest-describing-set display on the trigger
  - Async children (`hasChildren` + `isLoading`) with selection inheritance, and `TreeViewLoadMore` for progressive loading at any depth

## 1.28.0

### Minor Changes

- adff0f113: feat(AnnouncementBanner): add AnnouncementBanner component to blade, blade-core, and blade-svelte

### Patch Changes

- a1d2688dd: docs: enrich MCP knowledgebase patterns with design context
- c4387a5fd: docs: add usage guidelines to MCP knowledgebase components

## 1.27.2

### Patch Changes

- 58ba1549d: feat(icons): add AgentStudioIcon and 6 filled icon variants

## 1.27.1

### Patch Changes

- 1aec424ef: docs(blade-mcp): update knowledgebase with icons and tokens

## 1.27.0

### Minor Changes

- 8f0547610: feat(blade-mcp): move from cursor to claude-code compatible guidelines

## 1.26.1

### Patch Changes

- f243e927e: feat(blade): add `variant` prop for primary and neutral backgrounds in TopNav

  Added a new `variant` prop to `TopNav` component with two options:

  - `variant="neutral"` (default) — existing dark/black background, fully backward-compatible
  - `variant="primary"` — uses brand primary color background (Razorpay blue)

  The explicit `backgroundColor` prop still takes precedence over `variant`, preserving the escape hatch for custom backgrounds.

  **Usage:**

  ```jsx
  // Default neutral variant (existing behavior)
  <TopNav>...</TopNav>

  // Primary brand color variant
  <TopNav variant="primary">...</TopNav>

  // Custom background still works
  <TopNav backgroundColor="surface.background.gray.intense">...</TopNav>
  ```

## 1.26.0

### Minor Changes

- a8823b007: feat(blade): update razorsense cdn path & added preloadRazorSenseAssets utility
  feat(blade-mcp): add knowledgebase for RazorSense and RazorSenseGradient

## 1.25.3

### Patch Changes

- 06e127d3f: feat(SideNav): MCP update, mobile sidenav bug fix, refactors

## 1.25.2

### Patch Changes

- 25932a3f4: feat(ChatInput): add onFocus and onBlur

## 1.25.1

### Patch Changes

- 8eaf6e5e5: feat(Menu): add offset prop to Menu knowledgebase

## 1.25.0

### Minor Changes

- 61297d8e0: feat(blade-mcp): update mcp docs

## 1.24.0

### Minor Changes

- 6d4888305: feat(LightBox): add lightbox component

## 1.23.6

### Patch Changes

- b6d980719: npm publish OIDC

## 1.23.5

### Patch Changes

- a6fd747df: feat(ChatInput): add onFileReupload to ChatInput knowledgebase of blade mcp

## 1.23.4

### Patch Changes

- efba04492: feat(ChatInput): add mcp knowledgebase

## 1.23.3

### Patch Changes

- 2eddc691a: chore: add changeset

## 1.23.2

### Patch Changes

- 72a1704ee: feat: update blade mcp docs

## 1.23.1

### Patch Changes

- 84180580d: fix(blade): chart UX improvements and recharts upgrade

  - Updated recharts from 3.1.2 to 3.7.0
  - BarChart: Fixed unwanted re-animation on tooltip hover
  - LineChart: Update auto color logic - single data indicator now defaults to gray.moderate
  - Updated chart documentation

## 1.23.0

### Minor Changes

- 7e66ed45e: feat(blade-mcp): update docs

## 1.22.1

### Patch Changes

- 10f6912a5: feat(blade): update docs
- 29bac6692: fix npm publish

## 1.22.0

### Minor Changes

- b6c2e2563: feat(blade): update charts docs

## 1.21.1

### Patch Changes

- 03e1de587: fix(mcp/README): mcp install link

## 1.21.0

### Minor Changes

- be2a6ff12: fix(blade): refactor blade mcp to use fs file change in stdio mode

## 1.20.1

### Patch Changes

- ff190d563: Updated tokens

## 1.20.0

### Minor Changes

- 0dbcbb6c2: feat(blade): added openInteraction prop for hover/click trigger on popover component

## 1.19.0

### Minor Changes

- 13ef641b8: feat(blade-mcp): refactor shouldCreateOrUpdateCursorRule logic

### Patch Changes

- 1a66a23ad: feat(blade-mcp): updated divider knowledgebase

## 1.18.0

### Minor Changes

- 571e8da27: feat(blade-mcp): add description to client name in get docs tool call & refactor logic for calling createCursorRule tools Call

## 1.17.0

### Minor Changes

- 17e980ebd: ## feat(blade): list view v2

  ### 🔧 Prop Updates

  - **Deprecated Props:**
    - List View Filters: searchValue, searchValuePlaceholder, searchName, onSearchChange, onSearchClear, searchTrailing, showFilters, onShowFiltersChange
    - Table Header: rowDensity
  - **Added:**
    - `actions` (replaces deprecated search-related props)
    - `FilterChipGroup.padding`
    - `TableToolbar.placement`

  ### 🎨 List View Visual & Structural Changes

  - **Table Cell:** Font (M→S, S→XS), color (Normal→Subtle), links (Primary→Neutral)
  - **Table Header:** Fixed height 36px, bg → `interactive.bg.gray.faded`, font (M→S, Normal→Subtle)
  - **Pagination:** Height 60→48px, removed horizontal padding, smaller/subtle text
  - **Quick Filter:** Always expanded, removed radio for single-select, unified badge color
  - **Filter Chip:** Border 0.5px normal, height 24px, refreshed Clear Filter button, removed bg/divider
  - **Filter Panel:** Removed old panel (Download/Copy), moved actions next to Quick Filters (Quick Filters left; Search + Actions right), added tooltips
  - **Bulk Action Toolbar:** Overlays Table Header on selection; hidden otherwise (same on mobile)
  - **Mobile:** Removed “Show Filter” button; bulk actions adapt; filters stay horizontally scrollable

## 1.16.0

### Minor Changes

- 49082f564: feat(blade): charts new ui & color token update

  ### Deprecation of `chart.background` prefix in color token

  The `chart.background` prefix in color token has been deprecated to improve clarity and provide a more descriptive API. The new prefix is `data.background`.

  **Impact**

  Implementation that explicitly sets `chart.background` prefix in color token will use `data.background` as prefix.

  **How to Upgrade**

  You need to update your code where `chart.background` prefix in color token. You can either remove the prefix entirely to use default color themes or change the value to `data.background`.

  ```diff
  - color="chart.background.categorical.blue.moderate"
  + color="data.background.categorical.blue.moderate"
  ```

  ### Updation of color mapping tokens for charts

  We have update color mapping of few token related to charts. you might need to update your snaps.

## 1.15.0

### Minor Changes

- e05eacbd0: feat(blade-mcp): add streamable transport support utilities
- e05eacbd0: feat(blade-mcp): refactor `createCursorRule` , `getBladeComponentDocs` , `getBladeGeneralDocs` , `getBladePatternDocs` tools to support MCP SSE

## 1.14.0

### Minor Changes

- c5e3a9237: feat(blade): introduced footer and enhance header background for DetailedView

  - **New Component**: Added `DrawerFooter` component with sticky positioning and optional divider in drawer
  - **Enhanced DrawerHeader**: Added `showDivider` prop to control header divider visibility and upgraded gradient pattern from linear to radial
  - **DetailedView Pattern Enhancement**:
    - Add an option to toggle the footer's visibility
    - Ensure the footer remains sticky at all times
    - Upgrade the gradient pattern in the header

## 1.13.0

### Minor Changes

- 9d7546305: feat(blade): added counter input component

## 1.12.2

### Patch Changes

- 4e11809db: chore(blade-mcp): Update Modal knowledgebase with important constraints

## 1.12.1

### Patch Changes

- b964fb7fb: fix(blade-mcp/Box): improve Box knowledgebase UI quality

## 1.12.0

### Minor Changes

- 6d508bbc8: feat(blade-mcp): add donut chart knowledge base

## 1.11.0

### Minor Changes

- 4f9b1ebd3: feat(blade-mcp): add figma to code image attachment in mcp tool call

### Patch Changes

- aae0f0d15: fix(blade-mcp): remove console logs

## 1.10.0

### Minor Changes

- 1b07633c3: feat(blade-mcp): update knowledgebase with BarChart

## 1.9.0

### Minor Changes

- ac1d4fb54: feat(blade): add support for non-dismissible modals & bottomsheet

  Introduces a new prop `isDismissible` in `Modal` and `BottomSheet` which can be used to prevent users from accidentally dismissing modals and bottomSheet by clicking outside or pressing the escape key. When `isDismissible={false}`, the close button is automatically hidden and the modal and bottomSheet can only be closed through explicit user actions.

  ```jsx
  <Modal isOpen={isOpen} isDismissible={false}>
    // .... modal content ....
  </Modal>
  ```

  ```jsx
  <BottomSheet isOpen={isOpen} isDismissible={false}>
    // .... bottomsheet component ....
  </BottomSheet>
  ```

## 1.8.0

### Minor Changes

- dd7e18b43: feat(server): add publishLinesOfCodeMetric tool integration

## 1.7.0

### Minor Changes

- c835336ad: feat(timepicker): added timepicker component

## 1.6.0

### Minor Changes

- ab1773547: feat(blade-mcp): update knowledgebase with AreaChart

## 1.5.0

### Minor Changes

- 2f0e492cd: feat(blade): update knowledge base to support line chart

## 1.4.5

### Patch Changes

- c1b2b96b7: chore(analytics): replace userId with OS-based userName

## 1.4.4

### Patch Changes

- 57d2d9ff2: feat(datepicker): exposing footer prop

## 1.4.3

### Patch Changes

- ea090ffc9: fix(blade-mcp): change index to get correct username in mcp

## 1.4.2

### Patch Changes

- 64b723a1b: feat(blade-mcp): add userName of user in mcp analytics

## 1.4.1

### Patch Changes

- 9cb50cab1: feat(blade-mcp): add constraints to component knowledgebase

## 1.4.0

### Minor Changes

- 5c6b0e949: feat(blade-mcp): add dashboard template pattern

## 1.3.1

### Patch Changes

- ea88e1487: '@razorpay/blade': feat: box now supports `feedback.background` tokens
  '@razorpay/blade-mcp': feat: add confirmation pattern documentation and examples

## 1.3.0

### Minor Changes

- b2467ea18: feat(table): added spanning & nesting
- d7f4084fa: feat(table): added support for grouping

## 1.2.2

### Patch Changes

- b42b8479e: Added correct function definition for the blade checkbox onchange function

## 1.2.1

### Patch Changes

- 2dfa5355b: chore(blade-mcp): changelog tool prompt

## 1.2.0

### Minor Changes

- 6b4729f41: feat(blade-mcp): add changelog tool

## 1.1.2

### Patch Changes

- f0bf2e774: feat: add settings pattern docs

## 1.1.1

### Patch Changes

- d8a9dd202: docs: add EmptyState in knowledgebase

## 1.1.0

### Minor Changes

- a78225edf: feat(blade-mcp): update blade mcp docs for metric and selectable card

## 1.0.1

### Patch Changes

- 50e2ce3cf: feat(mcp/README): update mcp readme with new tools and troubleshooting

## 1.0.0

### Major Changes

- e5bcc887d: feat(blade-mcp): add figma to code mcp tool

## 0.2.6

### Patch Changes

- 49b1b3cce: docs: trimmed knowledgebase for inputgroup and textinput

## 0.2.5

### Patch Changes

- 21b936ce5: docs: add Input Group, updated text input knowledgebase

## 0.2.4

### Patch Changes

- 8beb5e541: feat(blade-mcp): pass directory name to analytics

## 0.2.3

### Patch Changes

- 3d513728b: revert: "chore: update dependencies and improve CI workflow"

## 0.2.2

### Patch Changes

- 16a8f55c5: feat(InfoGroup): remove keyAlign prop
  feat(InfoGroup knowledgebase): update knowledgebase to add InfoGroup component

## 0.2.1

### Patch Changes

- 4fef0f921: feat(knowledgebase): update knowledgebase with constraints

## 0.2.0

### Minor Changes

- 07bf89369: feat(knowledgebase): support for patterns and different types of documentations

## 0.1.12

### Patch Changes

- e6b88620: feat(SideNav): add default position note in knowledgebase

## 0.1.11

### Patch Changes

- 735ec600: fix: update knowledgebase

## 0.1.10

### Patch Changes

- 94621723: Update release.yml

## 0.1.9

### Patch Changes

- b06afe7c: feat(blade-mcp): add runtime check fixes on cursor
- 4c5104ba: feat: add mcp error monitoring & instrumentation

## 0.1.8

### Patch Changes

- 90c22ea9: docs(blade-mcp): add Preview and Full Page Modal knowledgebase

## 0.1.7

### Patch Changes

- 546aceaa3: feat(Card): add maxWidth property to card

## 0.1.6

### Patch Changes

- 5d0264e5: feat(Card): improve card knowledgebase

## 0.1.5

### Patch Changes

- 6868bbd5: feat(blade-mcp): internal refactor of tools, improve prompts and descriptions and add version number to hi blade

## 0.1.4

### Patch Changes

- 8af9f264: feat(blade-mcp): tweaks for non-dev personas

## 0.1.3

### Patch Changes

- 6dd10f5c: fix(Inputs): knowledgebase imports

## 0.1.2

### Patch Changes

- 94f12cf2: feat(blade-mcp): update cursorrules to always be called

## 0.1.1

### Patch Changes

- f43a91bc: feat: add zod resolution

## 0.1.0

### Minor Changes

- 8a12b96a: feat(blade-mcp): add cursorrules, create project, and hi blade tools

## 0.0.5

### Patch Changes

- 5f8e157b: fix: mcp zod version compatibility

## 0.0.4

### Patch Changes

- 30dc7905: fix: publish mcp to npm

## 0.0.3

### Patch Changes

- b24dbe0a: fix: trying the mcp release

## 0.0.2

### Patch Changes

- f966dd83: feat: blade mcp server

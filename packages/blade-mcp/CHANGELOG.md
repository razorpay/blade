# @razorpay/blade-mcp

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

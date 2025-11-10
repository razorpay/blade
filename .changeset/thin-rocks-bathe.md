---
"@razorpay/blade": minor
"@razorpay/blade-mcp": minor
---

## feat(blade): list view v2

### 🔧 Prop Updates
- **Deprecated Props:** 
  - List View Filters: `searchValue`, `searchValuePlaceholder`, `searchName`, `onSearchChange`, `onSearchClear`, `searchTrailing`, `showFilters`, `onShowFiltersChange`
  - Table Header: `rowDensity`
- **Introduced Prop:** `actions` (replaces the above search-related props)
- **FilterChipGroup:** Added `padding` prop
- **Bulk Action Toolbar:** Added `overlay` prop

### 🎨 List View Changes
- **Table Cell**
  - Font size: Medium → Small; Small → XSmall
  - Font color: Normal → Subtle
  - Link color: Primary → Neutral
- **Table Header Cell**
  - Deprecated `rowDensity` prop (headers fixed to 36px height)
  - Background: `interactive.bg.gray.default` → `interactive.bg.gray.faded`
  - Font size: Medium → Small
  - Font color: Normal → Subtle
- **Pagination**
  - Height: 60px → 48px
  - Horizontal padding removed
  - Font size: Medium → Small
  - Font color: Normal → Subtle
- **Quick Filter**
  - Removed “Show More Filters” (filters always expanded)
  - Removed radio for single selection
  - Consistent badge/entity count color
- **Filter Chip**
  - Visual-only changes: border now normal (0.5px), height 24px
  - Updated Clear Filter button (color, size)
  - Background and divider removed
- **Filter Panel**
  - Removed old panel (Download, Copy, etc.)
  - Moved actions next to Quick Filters
  - New layout: Quick Filters on left; Search + Action Buttons (e.g., Download) on right
  - Added tooltips for action buttons
- **Bulk Action Toolbar**
  - When multiple items are selected, the table toolbar overlays (replaces) the table header. Hidden when no selection.  
  - Same behavior on mobile
- **Mobile**
  - Removed “Show Filter” button
  - Button group adapts for bulk actions
  - Filters remain horizontally scrollable

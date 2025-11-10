---
"@razorpay/blade": minor
"@razorpay/blade-mcp": minor
---

## feat(blade): list view v2


### 🔧 Prop Updates
- **Deprecated Props:** 
  - List View Filters: searchValue, searchValuePlaceholder, searchName, onSearchChange, onSearchClear, searchTrailing, showFilters, onShowFiltersChange
  - Table Header: rowDensity
- **Added:** 
  - `actions` (replaces deprecated search-related props)  
  - `FilterChipGroup.padding`  
  - `BulkActionToolbar.overlay`

### 🎨 List View Visual & Structural Changes
- **Table Cell:** Font (M→S, S→XS), color (Normal→Subtle), links (Primary→Neutral)
- **Table Header:** Fixed height 36px, bg → `interactive.bg.gray.faded`, font (M→S, Normal→Subtle)
- **Pagination:** Height 60→48px, removed horizontal padding, smaller/subtle text
- **Quick Filter:** Always expanded, removed radio for single-select, unified badge color
- **Filter Chip:** Border 0.5px normal, height 24px, refreshed Clear Filter button, removed bg/divider
- **Filter Panel:** Removed old panel (Download/Copy), moved actions next to Quick Filters (Quick Filters left; Search + Actions right), added tooltips
- **Bulk Action Toolbar:** Overlays Table Header on selection; hidden otherwise (same on mobile)
- **Mobile:** Removed “Show Filter” button; bulk actions adapt; filters stay horizontally scrollable

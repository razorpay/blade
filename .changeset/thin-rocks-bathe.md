---
"@razorpay/blade": minor
"@razorpay/blade-mcp": minor
---

## feat(blade): list view v2

### Prop Updates
**Deprecated Props:** `searchValue`, `searchValuePlaceholder`, `searchName`, `onSearchChange`, `onSearchClear`, `searchTrailing`, `showFilters`, `onShowFiltersChange`  
**Introduced Prop:** `actions` (replaces the above search-related props)  
**FilterChipGroup:** Added `padding` prop  

### List View Changes
- **Table Cell:** Font size Medium → Small; Small → XSmall, font color Normal → Subtle, link color Primary → Neutral  
- **Table Header Cell:** Removed `density` prop (headers fixed to 36px height), background `interactive.bg.gray.default` → `interactive.bg.gray.faded`, font size Medium → Small, font color Normal → Subtle  
- **Pagination:** Height 60px → 48px, horizontal padding removed, font size Medium → Small, font color Normal → Subtle  
- **Quick Filter:** Removed “Show More Filters” (always expanded), removed radio for single selection, consistent badge/entity count color  
- **Filter Chip:** Visual-only changes — border now normal (0.5px), height 24px, updated Clear Filter button, removed background & divider  
- **Filter Panel:** Removed old panel (Download, Copy, etc.), moved actions next to Quick Filters, new layout with Quick Filters on left and Search + Actions on right, added tooltips to action buttons  
- **Bulk Action Toolbar:** Shown above table header when multiple items selected; hidden otherwise (same on mobile)  
- **Mobile:** Search moves to top (already implemented), removed “Show Filter” button, button group adapts for bulk actions, filters remain horizontally scrollable  

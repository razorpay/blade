# Component Migration Priority Guide

This guide helps prioritize which components to migrate from React to Svelte based on dependencies, complexity, and usage patterns.

## Migration Status

**Total Components:** 77+ in React
**Migrated:** 6 (Button, Link, Spinner, Text, Heading, Code, Amount)
**Remaining:** 71+

## Priority Tiers

### Tier 1: Foundation Components (CRITICAL)

These are the building blocks that other components depend on. Migrate these first.

**Status:** ✅ 5/6 Complete

- [x] **Button** - Interactive foundation ✅
- [x] **Link** - Navigation foundation ✅
- [x] **Spinner** - Loading indicator ✅
- [x] **Typography (Text, Heading, Code)** - Text foundation ✅
- [ ] **Box** - Layout foundation (⚠️ NEEDED FOR MOST COMPONENTS)
- [x] **Amount** - Formatted currency ✅

**Next Action:** Migrate **Box** immediately - it's a dependency for many components.

### Tier 2: Core Input Components (HIGH PRIORITY)

Forms are essential for any application. High usage, moderate complexity.

- [ ] **TextInput** - Most common input type
- [ ] **Checkbox** - Common selection control
- [ ] **Radio** - Common selection control
- [ ] **Switch** - Toggle control
- [ ] **Select/Dropdown** - Selection from options

**Dependencies:**
- All depend on: Box (not migrated)
- Label component integration
- Form field wrapper patterns

**Recommended Order:**
1. Box (if not done)
2. TextInput (simplest, most used)
3. Checkbox (simple, common)
4. Radio (similar to Checkbox)
5. Switch (similar to Checkbox)
6. Dropdown (more complex)

### Tier 3: Core Display Components (HIGH PRIORITY)

Common UI elements for displaying information.

- [ ] **Card** - Container component (very common)
- [ ] **Badge** - Status/label indicator
- [ ] **Avatar** - User representation
- [ ] **Alert** - User feedback

**Dependencies:**
- Card: Box, possibly Text/Heading
- Badge: Text
- Avatar: Box, Text
- Alert: Box, Text, Icon

**Recommended Order:**
1. Badge (simple, no complex dependencies)
2. Avatar (simple)
3. Card (commonly used, depends on Box)
4. Alert (depends on Card patterns)

### Tier 4: Feedback Components (HIGH PRIORITY)

User feedback and interaction components.

- [ ] **Toast** - Notifications
- [ ] **Modal** - Dialog/popup
- [ ] **Tooltip** - Contextual help
- [ ] **Popover** - Contextual content
- [ ] **BottomSheet** - Mobile drawer

**Dependencies:**
- All need: Portal/overlay management
- Animation utilities
- Focus management
- Escape key handling

**Recommended Order:**
1. Tooltip (simpler, useful)
2. Popover (similar to Tooltip)
3. Modal (common, medium complexity)
4. Toast (needs positioning/stacking logic)
5. BottomSheet (mobile-specific)

### Tier 5: Navigation Components (MEDIUM PRIORITY)

Navigation and wayfinding components.

- [ ] **Breadcrumb** - Hierarchical navigation
- [ ] **Tabs** - Content organization
- [ ] **Pagination** - Data navigation
- [ ] **Menu** - Action lists
- [ ] **TopNav/SideNav/BottomNav** - App navigation

**Dependencies:**
- Breadcrumb: Link, Text
- Tabs: Button patterns, animation
- Pagination: Button
- Menu: Popover, List
- Nav: Box, Link, Icon

**Recommended Order:**
1. Breadcrumb (simple)
2. Pagination (simple, uses Button)
3. Tabs (medium complexity)
4. Menu (depends on Popover)
5. Nav components (complex, app-level)

### Tier 6: Data Display Components (MEDIUM PRIORITY)

Components for displaying structured data.

- [ ] **Table** - Tabular data
- [ ] **List/ActionList** - Item lists
- [ ] **Carousel** - Image/content slider
- [ ] **Charts (Donut, Bar, Line)** - Data visualization

**Dependencies:**
- Table: Complex scrolling, sorting, filtering
- List: Box, Text, Icon
- Carousel: Animation, touch gestures
- Charts: SVG rendering, data formatting

**Recommended Order:**
1. List (simpler, common)
2. ActionList (extends List)
3. Charts (standalone, useful)
4. Carousel (complex interactions)
5. Table (most complex)

### Tier 7: Advanced Input Components (MEDIUM PRIORITY)

Specialized form inputs.

- [ ] **OTPInput** - One-time password
- [ ] **TextArea** - Multi-line text
- [ ] **SearchInput** - Search functionality
- [ ] **PhoneNumberInput** - International phone
- [ ] **DatePicker** - Date selection
- [ ] **TimePicker** - Time selection
- [ ] **FileUpload** - File selection
- [ ] **Counter** - Numeric stepper
- [ ] **CheckboxGroup/RadioGroup** - Multiple selection

**Dependencies:**
- Most extend TextInput
- DatePicker: Calendar component, date utilities
- PhoneNumberInput: i18nify-js integration
- FileUpload: Drag & drop, file validation

**Recommended Order:**
1. TextArea (extends TextInput)
2. SearchInput (extends TextInput)
3. OTPInput (extends TextInput)
4. CheckboxGroup/RadioGroup (extends Checkbox/Radio)
5. Counter (extends Input)
6. PhoneNumberInput (complex i18n)
7. DatePicker (needs Calendar)
8. TimePicker (complex UI)
9. FileUpload (complex interactions)

### Tier 8: Interactive Components (LOW PRIORITY)

Less common but useful interactive elements.

- [ ] **Accordion** - Collapsible content
- [ ] **Collapsible** - Simple collapse
- [ ] **StepGroup** - Wizard/stepper
- [ ] **Tag/Chip/FilterChip** - Removable labels
- [ ] **ProgressBar** - Progress indication
- [ ] **Skeleton** - Loading placeholder

**Dependencies:**
- Accordion: Animation, state management
- StepGroup: Complex state machine
- Tag/Chip: Button patterns, close interaction
- ProgressBar: Animation
- Skeleton: Box, shimmer animation

**Recommended Order:**
1. Collapsible (simplest)
2. ProgressBar (simple animation)
3. Skeleton (useful for loading)
4. Tag/Chip (common in filters)
5. Accordion (medium complexity)
6. StepGroup (most complex)

### Tier 9: Specialized Components (LOWEST PRIORITY)

Rarely used or very specialized components.

- [ ] **Drawer** - Side panel
- [ ] **EmptyState** - No data state
- [ ] **VisuallyHidden** - A11y helper
- [ ] **LiveAnnouncer** - Screen reader announcements
- [ ] **SkipNav** - Skip to content link
- [ ] **Indicator** - Notification badge
- [ ] **AnimateInteractions** - Animation utilities
- [ ] **BaseMotion** - Animation primitives
- [ ] **SpotlightPopoverTour** - Product tour
- [ ] **GenUI** - AI components
- [ ] **QuickFilters** - Filter UI

**Dependencies:**
- Many are utilities or advanced features
- Some depend on animation framework
- GenUI is experimental

**Recommended Order:**
1. EmptyState (simple, useful)
2. Indicator (simple badge)
3. Drawer (similar to BottomSheet)
4. VisuallyHidden (a11y utility)
5. Others as needed

## Dependency Graph

```
Foundation Layer:
├── Box (CRITICAL - NOT MIGRATED YET!)
├── Button ✅
├── Link ✅
├── Typography (Text, Heading, Code) ✅
├── Spinner ✅
└── Amount ✅

Input Layer (depends on Box):
├── TextInput (base for other inputs)
├── Checkbox
├── Radio
├── Switch
└── Dropdown

Display Layer (depends on Box, Typography):
├── Card
├── Badge
├── Avatar
└── Alert

Feedback Layer (depends on Box, Button):
├── Tooltip
├── Popover
├── Modal
├── Toast
└── BottomSheet

Navigation Layer (depends on Link, Button):
├── Breadcrumb
├── Pagination
├── Tabs
├── Menu
└── Nav components

Data Layer (depends on Box, Typography):
├── List
├── Table
├── Charts
└── Carousel
```

## Suggested Migration Sequence

### Phase 1: Foundation (Week 1)
1. **Box** ⚠️ CRITICAL
2. Verify existing components work with Box

### Phase 2: Core Inputs (Week 2-3)
3. TextInput
4. Checkbox
5. Radio
6. Switch

### Phase 3: Core Display (Week 3-4)
7. Badge
8. Avatar
9. Card
10. Alert

### Phase 4: Basic Feedback (Week 5)
11. Tooltip
12. Popover

### Phase 5: Forms Extended (Week 6)
13. TextArea
14. SearchInput
15. Dropdown/Select

### Phase 6: Advanced Feedback (Week 7)
16. Modal
17. Toast

### Phase 7: Navigation (Week 8)
18. Breadcrumb
19. Pagination
20. Tabs

### Phase 8: Data Display (Week 9-10)
21. List
22. ActionList
23. Charts

### Phase 9: Advanced Inputs (Week 11-12)
24. OTPInput
25. CheckboxGroup/RadioGroup
26. DatePicker
27. PhoneNumberInput

### Phase 10: Remaining Components (Ongoing)
28. All other components as needed

## Complexity Ratings

### Simple (1-2 days)
- Badge
- Breadcrumb
- Avatar
- Spinner ✅
- Link ✅
- Amount ✅
- Collapsible
- ProgressBar
- Indicator
- EmptyState

### Medium (3-5 days)
- Button ✅
- TextInput
- Checkbox
- Radio
- Switch
- Card
- Alert
- Tooltip
- Popover
- Pagination
- Typography ✅
- List
- TextArea
- SearchInput
- Tag/Chip

### Complex (1-2 weeks)
- Dropdown/Select
- Modal
- Toast
- Tabs
- Menu
- Accordion
- OTPInput
- CheckboxGroup/RadioGroup
- DatePicker
- TimePicker
- BottomSheet
- Carousel
- Charts

### Very Complex (2-4 weeks)
- Table
- FileUpload
- PhoneNumberInput
- TopNav/SideNav/BottomNav
- StepGroup
- Drawer
- SpotlightPopoverTour
- GenUI components

## Decision Factors

When choosing what to migrate next, consider:

1. **Usage Frequency:** How often is this component used?
2. **Dependencies:** What does it depend on? What depends on it?
3. **Complexity:** How long will it take to migrate?
4. **User Impact:** Does this unblock user features?
5. **Learning Value:** Does it teach new patterns?

## Tips for Efficient Migration

1. **Batch Similar Components:** Migrate Checkbox, Radio, and Switch together
2. **Start Simple:** Build confidence with easy components first
3. **Reference Often:** Use migrated components as templates
4. **Test Thoroughly:** Each component should match React behavior
5. **Document Learnings:** Update guides with new patterns discovered

## Current Bottleneck

**⚠️ CRITICAL:** Box component is not yet migrated but is a dependency for most components. Prioritize Box migration before proceeding with many other components.

Without Box, the following are blocked or difficult:
- All form inputs
- Card
- Alert
- List
- Most layout-dependent components

## Next Recommended Migration

Based on current status:

**Immediate Next Steps:**
1. **Box** - Unblocks 30+ components
2. **TextInput** - Most common input, unblocks other inputs
3. **Card** - Very common display component
4. **Checkbox** - Common form control
5. **Badge** - Simple, useful, no complex dependencies

# Migrate Component to Svelte Skill

This skill automates the migration and creation of Svelte components in the blade-svelte package from the existing React components in the blade package.

## Context

Blade is migrating components from React (`packages/blade/`) to Svelte (`packages/blade-svelte/`). This skill helps:

1. **Migrate existing React components** to Svelte while maintaining API compatibility
2. **Create new Svelte components** following Blade's established patterns
3. **Ensure feature parity** between React and Svelte implementations

## Usage

### Migrate a React Component

```
/migrate-component-to-svelte Card
```

The skill will:
1. Locate the React Card component in `packages/blade/src/components/Card/`
2. Analyze its props, types, and behavior
3. Create Svelte equivalent with identical API
4. Ensure feature parity and visual consistency

### Create Component from Scratch

If the component doesn't exist in React, the skill will guide you through creating it from scratch with:
- Two-layer architecture (Base + Public wrapper)
- Proper type definitions
- Storybook stories
- Export configuration
- All necessary boilerplate

### What This Skill Does

1. **Asks Clarifying Questions**: Gathers requirements about the component (complexity, props, variants, etc.)
2. **Creates Directory Structure**: Sets up the two-layer folder structure
3. **Generates Type Definitions**: Creates TypeScript types for both Base and Public components
4. **Implements Base Component**: Builds the core implementation with:
   - Svelte 5 runes (`$state`, `$derived`, `$effect`)
   - Interaction state management
   - Accessibility attributes
   - Class-based styling from blade-core
   - Event handlers with disabled checks
5. **Creates Public Wrapper**: Builds thin wrapper component handling analytics
6. **Generates Storybook Stories**: Creates comprehensive stories showing all variants
7. **Updates Exports**: Adds component to main index file
8. **Validates**: Runs type checking and build verification

## Component Architecture

### Two-Layer Pattern

Every component has two layers:

```
ComponentName/
├── ComponentName.svelte              # Public API (Layer 2)
├── BaseComponentName/
│   └── BaseComponentName.svelte      # Implementation (Layer 1)
```

**Layer 1 (Base)**: Contains all logic, state management, interaction handling, accessibility
**Layer 2 (Public)**: Thin wrapper handling analytics and providing clean public API

### Why Two Layers?

- **Separation of Concerns**: Business logic separate from public API
- **Flexibility**: Internal components can be used directly when needed
- **Analytics**: Wrapper layer handles analytics without cluttering core logic
- **Testing**: Base components can be tested independently

## File Structure Created

```
ComponentName/
├── ComponentName.svelte              # Public wrapper
├── ComponentName.stories.svelte       # Storybook stories
├── BaseComponentName/                 # Base implementation
│   ├── BaseComponentName.svelte       # Core logic
│   ├── index.ts                       # Base exports
│   └── types.ts                       # Base types
├── index.ts                           # Public exports
└── types.ts                           # Public types
```

## Key Patterns

### Svelte 5 Runes
- `$state` - Reactive state
- `$derived` - Computed values
- `$effect` - Side effects
- `$props` - Component props

### Styling
- **Class-based only** (no inline styles)
- Classes from `@razorpay/blade-core/styles`
- Template classes called via functions to prevent tree-shaking

### Accessibility
- `makeAccessible()` for ARIA attributes
- `metaAttribute()` for test IDs
- `makeAnalyticsAttribute()` for analytics

### Interaction States
- Uses `useInteraction()` hook
- States: `default`, `hover`, `focus`, `disabled`
- Always check disabled state in handlers

## Examples

**Production Examples (✅ Actually Migrated):**
- [examples/Button-example.md](examples/Button-example.md) - **Primary reference** showing real, production code from the migrated Button component

**Hypothetical Examples (⚠️ Not Yet Migrated):**
- [examples/Card-example.md](examples/Card-example.md) - Hypothetical example showing how Card would be implemented

**Quick Reference:**
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Code patterns and snippets

## Validation Steps

After component creation, the skill runs:

1. `npm run svelte-check` - Type checking
2. `npm run build` - Build verification
3. `npm run storybook` - Visual verification

## Reference Components

Good reference components in the codebase:
- **Button**: Simple interactive component with states
- **Typography**: Complex component with multiple variants (Text, Heading, Code)
- **Amount**: Component with dependencies on other Base components
- **Link**: Component with conditional element rendering (a vs button)

## Customization

The skill asks questions before implementation to customize:
- Component complexity (simple vs complex)
- Required props
- Variants and styles
- Interactive states needed
- Dependencies on other components

## Tips

1. **Start Simple**: Begin with minimal props and add more as needed
2. **Follow Existing Patterns**: Check similar components for reference
3. **Type Everything**: All props should have TypeScript types and JSDoc comments
4. **Test in Storybook**: Always verify component renders correctly
5. **Check Accessibility**: Use Storybook's a11y panel to verify

## Troubleshooting

### Type Check Fails
- Ensure all props have proper types
- Check that Base component types extend `StyledPropsBlade`
- Verify event handler signatures match

### Build Fails
- Check that all imports are correct
- Ensure component is exported from index files
- Verify blade-core utilities are available

### Storybook Doesn't Show Component
- Check that story file follows naming pattern `*.stories.svelte`
- Verify `defineMeta` is called correctly
- Ensure component is imported properly

### Component Not in Autocomplete
- Component must be exported from `src/components/index.ts`
- Build must complete successfully
- Check package.json exports field

## Available React Components to Migrate

The React library has 77+ components available for migration. Key components include:

**Already Migrated to Svelte (6):**
- ✅ Button
- ✅ Link
- ✅ Spinner
- ✅ Typography (Text, Heading, Code)
- ✅ Amount

**High Priority (Forms & Inputs):**
- [ ] Input (TextInput, PasswordInput, OTPInput, TextArea, SearchInput, PhoneNumberInput)
- [ ] Checkbox, CheckboxGroup
- [ ] Radio, RadioGroup
- [ ] Switch
- [ ] Select / Dropdown
- [ ] DatePicker, TimePicker

**High Priority (Layout & Display):**
- [ ] Card (CardHeader, CardBody, CardFooter)
- [ ] Box
- [ ] Badge
- [ ] Avatar, AvatarGroup
- [ ] Alert

**High Priority (Navigation):**
- [ ] Breadcrumb
- [ ] Tabs
- [ ] Pagination
- [ ] Menu
- [ ] Dropdown

**High Priority (Feedback):**
- [ ] Modal
- [ ] Toast
- [ ] Tooltip
- [ ] Popover
- [ ] BottomSheet

**Medium Priority:**
- [ ] Table
- [ ] List, ActionList
- [ ] Accordion
- [ ] Carousel
- [ ] Charts (DonutChart, BarChart, LineChart)
- [ ] ProgressBar
- [ ] EmptyState
- [ ] Skeleton

**Lower Priority (Complex Components):**
- [ ] Drawer
- [ ] TopNav, SideNav, BottomNav
- [ ] StepGroup
- [ ] Counter, CounterInput
- [ ] FileUpload
- [ ] Tag, Chip, FilterChip

See [packages/blade/src/components/](../../../packages/blade/src/components/) for the complete list.

## Related Files

- [SKILL.md](SKILL.md) - Main skill instructions
- [TEMPLATE_GUIDE.md](TEMPLATE_GUIDE.md) - Which existing component to use as template
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - React to Svelte migration patterns
- [COMPONENT_PRIORITY.md](COMPONENT_PRIORITY.md) - Migration roadmap and priorities
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Code patterns and snippets
- [examples/Card-example.md](examples/Card-example.md) - Complete example implementation

## Contributing

To improve this skill:
1. Update [SKILL.md](SKILL.md) with new patterns
2. Add examples to [examples/](examples/)
3. Update [QUICK_REFERENCE.md](QUICK_REFERENCE.md) with new snippets
4. Test with a new component to verify changes

## Version History

- **v1.0** - Initial skill creation with two-layer architecture pattern
  - Svelte 5 runes support
  - Class-based styling
  - Accessibility-first approach
  - Comprehensive validation

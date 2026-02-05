# Component Template Selection Guide

This guide helps you quickly identify which existing Svelte component to use as a template when migrating a new component.

## Quick Template Selector

### I'm migrating a component that is...

#### ✅ **Interactive / Clickable**
Examples: Button, Switch, Checkbox, IconButton, MenuItem, Tab

**Template:** [Button](../../../packages/blade-svelte/src/components/Button/)

**Copy these patterns:**
- Interaction state management (`useInteraction()`)
- Disabled state handling
- Loading state with Spinner
- Event handlers (onClick, onFocus, onBlur, etc.)
- Press state for buttons
- Icon positioning

**Key files:**
- `BaseButton/BaseButton.svelte` - Main implementation
- `BaseButton/types.ts` - Props interface
- `Button.svelte` - Public wrapper
- `Button.stories.svelte` - Stories

---

#### 📄 **Text / Display Only**
Examples: Text, Heading, Label, Caption, Title

**Template:** [Typography/Text](../../../packages/blade-svelte/src/components/Typography/Text/)

**Copy these patterns:**
- Text color management
- Size/weight variants
- Truncation handling
- Contrast validation
- Semantic element selection

**Key files:**
- `BaseText/BaseText.svelte` - Text rendering
- `BaseText/types.ts` - Typography props
- `Text.svelte` - Public wrapper

---

#### 🔗 **Navigation / Link-like**
Examples: Link, Breadcrumb Item, NavLink, TabLink

**Template:** [Link](../../../packages/blade-svelte/src/components/Link/)

**Copy these patterns:**
- Dynamic element (`<a>` vs `<button>`)
- href/onClick conditional logic
- target/rel handling for external links
- Visited state handling
- Anchor-specific accessibility

**Key files:**
- `BaseLink/BaseLink.svelte` - Element switching logic
- `Link.svelte` - Public wrapper

---

#### 🎨 **Container / Layout**
Examples: Card, Box, Container, Panel, Section

**Template:** Wait for **Box** to be migrated (not yet available)

**Temporary approach:**
- Use Button structure for basic container
- Focus on StyledPropsBlade props support
- No interaction states needed
- Simple class composition

---

#### 🔄 **Animated / Loading**
Examples: Spinner, ProgressBar, Skeleton, LoadingDots

**Template:** [Spinner](../../../packages/blade-svelte/src/components/Spinner/)

**Copy these patterns:**
- Animation class management
- Size variants
- Color variants
- Accessibility (aria-live, role)

**Key files:**
- `Spinner/Spinner.svelte` - Simple implementation

---

#### 🧮 **Formatted Display**
Examples: Amount, Date, Time, Number, Currency

**Template:** [Amount](../../../packages/blade-svelte/src/components/Amount/)

**Copy these patterns:**
- Composition with BaseText
- Formatting utilities (i18nify-js)
- Value/display separation
- Locale handling

**Key files:**
- `BaseAmount/BaseAmount.svelte` - Formatting logic
- `Amount.svelte` - Public API

---

#### 📦 **Compound / Multi-part**
Examples: Card (Header/Body/Footer), List (Item), Accordion (Item)

**Template:** [Typography](../../../packages/blade-svelte/src/components/Typography/) (has Text, Heading, Code variants)

**Copy these patterns:**
- Shared base component (BaseText)
- Multiple public wrappers (Text, Heading, Code)
- Variant-specific props
- Consistent styling

**Key files:**
- Typography folder structure
- Shared BaseText usage
- Multiple public components

---

## Template Matrix

| Your Component Type | Template to Use | Key Pattern |
|---------------------|-----------------|-------------|
| Button, Toggle, Chip | Button | Interaction states |
| Text, Label, Badge | Text | Typography variants |
| Link, NavItem | Link | Dynamic element |
| Card, Box, Panel | Box (pending) | Layout props |
| Spinner, Progress | Spinner | Animation |
| Amount, Date | Amount | Formatting |
| Modal, Popover | - | Not yet migrated |
| Input, TextArea | - | Not yet migrated |
| Dropdown, Select | - | Not yet migrated |

## Step-by-Step Template Usage

### 1. Identify Template

Use the guide above to select the most similar component.

### 2. Read Template Files

Read all files from the template component:

```bash
# Example: Using Button as template
packages/blade-svelte/src/components/Button/
├── Button.svelte                    # READ: Public wrapper pattern
├── Button.stories.svelte             # READ: Story structure
├── BaseButton/
│   ├── BaseButton.svelte             # READ: Main implementation
│   ├── types.ts                      # READ: Props pattern
│   └── index.ts                      # READ: Export pattern
├── index.ts                          # READ: Public exports
└── types.ts                          # READ: Public types
```

### 3. Copy Directory Structure

Create identical folder structure for your component:

```bash
mkdir -p packages/blade-svelte/src/components/YourComponent/BaseYourComponent
```

### 4. Copy and Rename Files

Copy template files and rename:

```bash
# Example: Button → Card
cp Button/Button.svelte Card/Card.svelte
cp Button/BaseButton/BaseButton.svelte Card/BaseCard/BaseCard.svelte
cp Button/BaseButton/types.ts Card/BaseCard/types.ts
# etc.
```

### 5. Find and Replace

In all copied files, replace:
- `Button` → `YourComponent`
- `button` → `yourcomponent`
- Specific prop names with your component's props

### 6. Adapt Props

Open `types.ts` and modify to match your React component's API:

```typescript
// Template (Button)
export interface BaseButtonProps extends StyledPropsBlade {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  // ...
}

// Your component (Card)
export interface BaseCardProps extends StyledPropsBlade {
  elevation?: 'none' | 'low' | 'medium' | 'high';
  padding?: 'none' | 'small' | 'medium' | 'large';
  // ...
}
```

### 7. Adapt Implementation

Modify the `.svelte` files:
- Keep the same structure (imports, props, derived values, template)
- Change class generation functions
- Adjust conditional rendering
- Modify event handlers as needed
- Keep accessibility patterns

### 8. Adapt Stories

Update `YourComponent.stories.svelte`:
- Change component import
- Update argTypes to match your props
- Create stories for your variants
- Keep the same story structure

## Common Patterns Across All Templates

Regardless of which template you use, **ALWAYS copy these patterns:**

### Props Destructuring
```typescript
let {
  children,
  variant = 'primary',
  size = 'medium',
  ...rest
}: ComponentProps = $props();
```

### Class Generation
```typescript
const classes = $derived(
  getComponentClasses({ variant, size })
);

const styledProps = $derived(getStyledPropsClasses(rest));

const combinedClasses = $derived(() => {
  return [classes, styledProps.classes].filter(Boolean).join(' ');
});
```

### Accessibility
```typescript
const accessibilityAttrs = $derived(
  makeAccessible({
    role: 'button' as AriaRoles,
    label: accessibilityProps?.label,
  })
);

const metaAttrs = metaAttribute({
  name: MetaConstants.ComponentName,
  testID,
});
```

### Public Wrapper Pattern
```typescript
const analyticsAttrs = makeAnalyticsAttribute(rest);

const accessibilityProps = $derived({
  label: rest['aria-label'],
  describedBy: rest['aria-describedby'],
});
```

### Export Pattern

**Base component `index.ts`:**
```typescript
export { default as BaseComponentName } from './BaseComponentName.svelte';
export type { BaseComponentNameProps } from './types';
```

**Public component `index.ts`:**
```typescript
export { default as ComponentName } from './ComponentName.svelte';
export type { ComponentNameProps } from './types';
export { BaseComponentName } from './BaseComponentName';
export type { BaseComponentNameProps } from './BaseComponentName';
```

## Template Consistency Checklist

When using a template, ensure you maintain:

- [ ] Same folder structure (Component/BaseComponent/)
- [ ] Same file naming (ComponentName.svelte, types.ts, index.ts)
- [ ] Same import structure
- [ ] Same props destructuring pattern with `$props()`
- [ ] Same derived values pattern with `$derived()`
- [ ] Same accessibility pattern with `makeAccessible()`
- [ ] Same analytics pattern with `makeAnalyticsAttribute()`
- [ ] Same class generation pattern
- [ ] Same export pattern
- [ ] Same story structure

## When to Deviate from Template

**DO deviate when:**
- Your component has unique props not in the template
- Your component has different interaction patterns
- Your component needs different HTML elements
- Your component has different accessibility requirements

**DON'T deviate when:**
- Folder structure (always keep two-layer)
- File naming conventions
- Export patterns
- Props destructuring syntax
- Accessibility helper usage
- Analytics attribute handling
- Basic Svelte 5 rune patterns

## Benefits of Template-First Approach

1. **Faster Development:** Start with working code, not blank files
2. **Consistency:** All components follow the same patterns
3. **Fewer Bugs:** Templates are proven to work
4. **Better Learning:** See patterns in context
5. **Easier Review:** Reviewers recognize familiar patterns
6. **Pattern Evolution:** When templates improve, new components benefit

## Template Update Strategy

As the skill evolves and patterns improve:

1. **Update templates first** (Button, Text, Link, etc.)
2. **Document pattern changes** in MIGRATION_GUIDE.md
3. **New components** automatically get new patterns
4. **Old components** can be updated incrementally
5. **Maintain consistency** across all components

---

**Remember:** The goal is not to perfectly match the template, but to maintain consistent patterns across all Svelte components while adapting to each component's specific needs.

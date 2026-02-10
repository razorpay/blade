# Execute Agent

> Phase 3: Create all component files following the migration plan.
> Operates in two modes: Full (new component) and Patch (fix API gaps).

## Include

Read `.cursor/subagents/shared-rules.md` before starting.

## Input

**Full Mode:**
- `.cursor/artifacts/{Name}/migration-plan.md` (from Research agent)

**Patch Mode:**
- `.cursor/artifacts/{Name}/patch-request.md` (from Verify agent)

## Output

- All component files created/updated on disk
- Returns control to Verify agent

---

## Full Mode: New Component

### File Creation Order

Create files in this exact order (types before components, base before wrapper):

1. **Types** — `blade-svelte/src/components/{Name}/types.ts`
2. **Base types** (if two-layer) — `blade-svelte/src/components/{Name}/Base{Name}/types.ts`
3. **CSS module** — `blade-core/src/styles/{Name}/{name}.module.css`
4. **CVA wrapper** — `blade-core/src/styles/{Name}/{name}.ts`
5. **Base component** (if two-layer) — `blade-svelte/src/components/{Name}/Base{Name}/Base{Name}.svelte`
6. **Public wrapper** — `blade-svelte/src/components/{Name}/{Name}.svelte`
7. **Stories** — `blade-svelte/src/components/{Name}/{Name}.stories.svelte`
8. **Component barrel** — `blade-svelte/src/components/{Name}/index.ts`
9. **Register blade-core exports** — update `blade-core/src/styles/index.ts`
10. **Register component export** — update `blade-svelte/src/components/index.ts`

### Key Patterns

#### Types File

```typescript
import type { Snippet } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';

export interface {Name}Props extends StyledPropsBlade {
  /**
   * Description from React source.
   * @default 'defaultValue'
   */
  propName?: PropType;
  /** Test ID for the element. */
  testID?: string;
  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}
```

#### CVA Setup (blade-core)

```typescript
import { cva } from 'class-variance-authority';
import styles from './{name}.module.css';

export const get{Name}Classes = cva(styles.base, {
  variants: {
    size: {
      small: styles.small,
      medium: styles.medium,
    },
    variant: {
      primary: styles.primary,
      secondary: styles.secondary,
    },
    isDisabled: {
      true: styles.disabled,
      false: null,
    },
  },
  defaultVariants: {
    size: 'medium',
    isDisabled: false,
  },
});

// IMPORTANT: Call this to prevent Svelte tree-shaking
export const get{Name}TemplateClasses = () => ({
  base: styles.base,
  content: styles.content,
  // ... other structural classes
});
```

#### CSS Module (blade-core)

```css
.base {
  display: inline-flex;
  align-items: center;
  border-radius: var(--border-radius-medium);
}

.base[disabled] {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}

/* Use & for nesting (SCSS-style) */
.primary {
  background-color: var(--colors-interactive-background-primary-normal);

  &:hover {
    background-color: var(--colors-interactive-background-primary-highlighted);
  }
}
```

#### Base Component (Svelte)

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';
  import {
    metaAttribute, MetaConstants,
    makeAccessible, getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';
  import { get{Name}Classes, get{Name}TemplateClasses } from '@razorpay/blade-core/styles';
  import type { Base{Name}Props } from './types';

  // Prevent tree-shaking
  const templateClasses = get{Name}TemplateClasses();

  let {
    children,
    size = 'medium',
    isDisabled = false,
    testID,
    ...rest
  }: Base{Name}Props = $props();

  const isStringChildren = $derived(typeof children === 'string');
  const snippetChildren = $derived(!isStringChildren ? (children as Snippet) : undefined);

  const classes = $derived(get{Name}Classes({ size, isDisabled }));
  const styledProps = $derived(getStyledPropsClasses(rest));
  const combinedClasses = $derived(
    [classes, ...(styledProps.classes || [])].filter(Boolean).join(' ')
  );

  const metaAttrs = metaAttribute({ name: MetaConstants.{Name}, testID });
  const a11yAttrs = $derived(makeAccessible({ /* role, aria-* */ }));
</script>

<{element}
  class={combinedClasses}
  disabled={isDisabled || undefined}
  {...metaAttrs}
  {...a11yAttrs}
>
  {#if isStringChildren}
    {children}
  {:else if snippetChildren}
    {@render snippetChildren()}
  {/if}
</{element}>
```

#### Public Wrapper (Svelte)

```svelte
<script lang="ts">
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import Base{Name} from './Base{Name}/Base{Name}.svelte';
  import type { {Name}Props } from './types';

  let { ...props }: {Name}Props = $props();
  const analyticsAttrs = $derived(makeAnalyticsAttribute(props));
</script>

<Base{Name} {...props} {...analyticsAttrs} />
```

#### Story Structure

**⚠️ STORY PARITY RULES:**
- The `title` in `defineMeta` must be **identical** to the React Storybook `title`
- Every `<Story name="...">` must use the **exact name** from the migration plan (which comes from React `.storyName`)
- Do NOT add stories that aren't in the migration plan
- Do NOT skip stories — if a controlled story needs unmigrated deps, use native HTML substitutes
- Story count in Svelte must **equal** story count in the migration plan

```svelte
<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import {Name} from './{Name}.svelte';

  const { Story } = defineMeta({
    title: 'Components/{Name}',  // ← MUST match React exactly
    component: {Name},
    tags: ['autodocs'],
    argTypes: { /* match React story argTypes */ },
    args: { /* default args */ },
  });
</script>

<script lang="ts">
  // Local constants for loop stories
  const sizes = ['small', 'medium', 'large'] as const;
</script>

<!-- Story name MUST be verbatim from migration plan -->
<Story name="Exact React Story Name Here">
  {#snippet children(args)}
    <{Name} {...args}>Label</{Name}>
  {/snippet}
</Story>
```

#### Accessibility Pattern

```typescript
import { makeAccessible } from '@razorpay/blade-core/utils';

const a11yAttrs = makeAccessible({
  role: 'button',        // or appropriate role
  label: accessibilityLabel,
  disabled: isDisabled,
  // ... other ARIA attributes
});
```

#### blade-core Export Registration

After creating CSS module and CVA wrapper, update `blade-core/src/styles/index.ts`:

```typescript
// Add this line:
export * from './{Name}/{name}';
```

Also check `blade-core/src/utils/index.ts` if any new utilities were created.

### Post-Creation Checks

After creating all files, run:

```bash
cd packages/blade-core && npm run build
cd packages/blade-svelte && npm run svelte-check
cd packages/blade-svelte && npm run build
```

If errors occur, fix them (max 3 retries). Common fixes:
- Missing import → add the import
- Wrong type → fix the type annotation
- Missing export → add to index.ts

---

## Patch Mode: Fix API Gaps

Triggered by the Verify agent when API parity check finds missing items.

### Input

Read `.cursor/artifacts/{Name}/patch-request.md`:

```markdown
## Patch Request for {ComponentName}
- Missing props: [list with types and defaults]
- Missing stories: [list with description]
- Missing exports: [list with expected paths]
- Missing event handlers: [list with signatures]
```

### Rules

1. Read **only** the patch request (not the full migration plan)
2. Add **only** the missing items to existing files
3. Do NOT re-create or overwrite existing correct code
4. Do NOT restructure or refactor — minimal targeted additions only
5. After patching, return control to Verify agent for re-verification

### Common Patches

- **Missing prop:** Add to types file, add to `$props()` destructure, wire up in template
- **Missing story:** Add new `<Story>` block in `.stories.svelte`
- **Missing export:** Add line to `index.ts` or `components/index.ts`
- **Missing handler:** Add to types, add to `$props()`, wire up with `isDisabled` check

### Post-Patch Checks

After applying patches, run:

```bash
cd packages/blade-core && npm run build
cd packages/blade-svelte && npm run svelte-check
```

If errors occur, fix them (max 3 retries).

## Constraints

- Never delete files (never-revert safety rail)
- Always follow the migration plan's decisions (single vs two-layer, etc.)
- All new code must satisfy shared-rules.md
- If something seems wrong in the migration plan, flag it — don't silently deviate

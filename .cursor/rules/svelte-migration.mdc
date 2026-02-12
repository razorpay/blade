---
description: Guidelines and patterns for migrating Blade React components to Svelte 5, covering architecture, styling, accessibility, and framework-specific conventions.
globs:
alwaysApply: false
---

# Blade Svelte Migration — Critical Rules

> Include this file at the start of every sub-agent prompt.

## Architecture

- Mirror the React component's architecture: if React has `Base{Name}` + `{Name}`, create both layers in Svelte. If React is a single file, Svelte can be single-layer too.
- CSS in `blade-core/src/styles/`, NEVER in `blade-svelte`
- Utilities in `blade-core/src/utils/`, NEVER in `blade-svelte`
- Check if utility exists in blade-core before creating new ones
- Register new CSS module exports in `blade-core/src/styles/index.ts`

## Svelte Patterns

- Svelte 5 runes only: `$state`, `$derived`, `$derived.by`, `$effect`, `$props`
- Avoid variable names that match Svelte rune names: state, derived, effect, props
- Never use `createEventDispatcher` — use prop-based callbacks
- Children type: `Snippet | string` (not ReactNode)
- Event types: web-only (`MouseEvent`, `FocusEvent`) — strip `Platform.Select`
- Props destructuring: `let { prop1, prop2 = 'default', ...rest }: Props = $props()`
- Always use regular `.ts` files for utilities and not `.svelte.ts`
- Reactive Context Pattern: use getter functions `setContext(CONTEXT_KEY, () => contextValue)`

## Styling

- CVA (`class-variance-authority`) for conditional classes
- `[disabled]` attribute selector in CSS, not `.disabled` class
- Never use inline styles or `style:` directive
- Call `get*TemplateClasses()` functions to prevent Svelte tree-shaking
- Design tokens via CSS variables (`var(--spacing-4)`, `var(--colors-...)`)
- SCSS features: nesting, `&` parent selector in `.module.css`

## Quality

- All props must have JSDoc with `@default` tags
- Always check `isDisabled` before executing event handlers
- Public component `index.ts` must have JSDoc with usage example
- Accessibility: `makeAccessible()`, `metaAttribute()`, `makeAnalyticsAttribute()`
- Exports: register in both `{Component}/index.ts` and `components/index.ts`

## File Naming

- Component directories: `PascalCase` (e.g., `Button/`)
- Component files: `PascalCase.svelte` (e.g., `Button.svelte`)
- CSS files: `camelCase.module.css` (e.g., `button.module.css`)
- CVA files: `camelCase.ts` (e.g., `button.ts`)

## Dependency Workarounds

These Blade dependencies do NOT need migration — use the listed workaround:

- `Box` / `BaseBox` → use `<div>` with classes (no migration needed)
- `Icons` → placeholder prop type (`IconComponent = unknown`)
- `blade-core` (`~utils/`, `~tokens/`) → already framework-agnostic, import directly

## Key References

- Existing Svelte components: `packages/blade-svelte/src/components/`
- React source: `packages/blade/src/components/`
- Styles: `packages/blade-core/src/styles/`
- Utilities: `packages/blade-core/src/utils/`
- Tokens: `packages/blade-svelte/src/theme/theme.css`

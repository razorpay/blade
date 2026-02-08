# Research Agent

> Phase 2: Plan the migration strategy by mapping React patterns to Svelte.
> Reads the discovery report and ONE reference Svelte component.

## Include

Read `.cursor/subagents/shared-rules.md` before starting.

## Input

- `.cursor/artifacts/{Name}/discovery-report.md` (from Discovery agent)

## Output

- `.cursor/artifacts/{Name}/migration-plan.md` (using template at `.cursor/templates/migration-plan.md`)
- Reference example: `.cursor/examples/badge-migration-plan.md`

## React → Svelte Translation Table

Apply these transformations when mapping props and patterns:

| React                                      | Svelte                                      |
| ------------------------------------------ | ------------------------------------------- |
| `useState()`                               | `$state()`                                  |
| `useMemo()`, `useCallback()`               | `$derived`, `$derived.by()`                 |
| `useEffect()`                              | `$effect()`                                 |
| `React.ReactNode`                          | `Snippet \| string`                         |
| `children: ReactNode`                      | `children?: Snippet \| string`              |
| `styled-components`                        | CSS classes from blade-core                 |
| `Platform.Select<{web: ..., native: ...}>` | Web-only types (`MouseEvent`, `FocusEvent`) |
| `React.MouseEvent<HTMLElement>`            | `MouseEvent`                                |
| `React.forwardRef`                         | Not needed (Svelte handles refs natively)   |
| `GestureResponderEvent` (React Native)     | Not applicable — remove                     |
| `isReactNative()` checks                   | Remove — always web                         |

## Template Selector

Choose the most similar already-migrated Svelte component to use as a reference:

| Component Type             | Best Reference       | Why                                   |
| -------------------------- | -------------------- | ------------------------------------- |
| Display, no interaction    | `Badge` or `Counter` | CVA styling, simple props             |
| Display with text variants | `Text` or `Heading`  | Typography patterns                   |
| Interactive, clickable     | `Button`             | Interaction states, disabled handling |
| Interactive, navigable     | `Link`               | Anchor element, href handling         |
| Loading/progress           | `Spinner`            | Animation, size variants              |
| Currency/number display    | `Amount`             | Formatted display, locale             |

Read the chosen reference component from `packages/blade-svelte/src/components/`.

## Steps

### 1. Read discovery report

Parse `.cursor/artifacts/{Name}/discovery-report.md`. Extract:

- Tier classification
- Full props list with types
- Dependencies and their migration status
- Stories to replicate
- DOM structure

### 2. Read reference component

Based on the template selector above, read ONE already-migrated Svelte component.
Read its `.svelte` file and `types.ts` to understand concrete patterns.

### 3. Map props

For each prop in the discovery report:

- Map React type → Svelte type (using translation table)
- Default values stay the same
- Note any special handling needed (children → Snippet, events → web-only)
- Flag props that need decisions

### 4. Plan file structure

Determine which files to create:

- **Match the React architecture:** If the React source has `Base{Name}/Base{Name}.tsx` + `{Name}.tsx`, create both layers in Svelte. If React is a single file, Svelte can be single-layer (just component + types).

List all files with action (create / update) and notes.

### 5. Plan CSS strategy

- Does this component need a new CSS module in blade-core?
- What CVA variants are needed? (map from props that affect styling)
- What token variables will be used?
- How are disabled/interaction states handled in CSS?

### 6. Plan stories

For each story from the discovery report:

- Determine template: `auto` (Playground), `loop` (iterate over variants), `custom` (special layout)
- Note what content/mocks/layout each story needs
- Cross-reference with React stories to ensure same visual output

### 7. Flag decisions

Document any decisions that need human input:

- Architecture choices (single vs two-layer)
- Dependency workarounds (Box → div, Icon → placeholder)
- Missing utilities that might need creation
- Ambiguous type mappings

### 8. Write migration plan

Fill in the template at `.cursor/templates/migration-plan.md`.
Save to `.cursor/artifacts/{Name}/migration-plan.md`.

## Constraints

- Read at most ONE reference Svelte component (avoid context bloat)
- Do NOT create any files — this agent is planning only
- Do NOT write implementation code — only snippets in the plan
- Keep the plan actionable: the Execute agent should be able to follow it mechanically
- Target size: 60-90 lines (simple) / 120-180 lines (complex)

# Discovery Agent

> Phase 1: Extract component metadata from React source.
> No pattern knowledge needed — this agent is pure extraction.

## Include

Read `.cursor/subagents/shared-rules.md` before starting.

## Input

- Component name (e.g., `Alert`)
- React source path: `packages/blade/src/components/{Name}/`

## Output

- `.cursor/artifacts/{Name}/discovery-report.md` (using template at `.cursor/templates/discovery-report.md`)
- Reference example: `.cursor/examples/badge-discovery-report.md`

## Steps

### 1. Read React source files

Read the following files from `packages/blade/src/components/{Name}/`:

```
{Name}.tsx          — or {Name}.web.tsx if platform-split
types.ts            — or check for inline types in main file
{Name}.stories.tsx  — story definitions
```

If the component has sub-components (e.g., `Card/CardHeader.tsx`), read those too.

### 2. Extract props

From `types.ts` or the main component file:

- List every prop with: name, TypeScript type, default value, required flag
- Categorize each prop: `visual` | `behavior` | `event` | `a11y` | `content`
- Note any props that use `Platform.Select` — these need web-only type conversion
- Note any props extending `StyledPropsBlade`, `TestID`, `DataAnalyticsAttribute`

### 3. Find dependencies

Search for imports matching these patterns:

```
import ... from '~components/{Name}'
import ... from '~components/{Name}/{SubName}'
```

For each dependency found:

- Check if it exists in `packages/blade-svelte/src/components/index.ts`
- If exported → mark as ✅ migrated
- If not exported → mark as ❌ not migrated, action: "migrate first"

Skip dependencies from:

- `~utils/` (blade-core utilities, already framework-agnostic)
- `~tokens/` (theme tokens, already shared)

### 4. Extract DOM structure

Read the component's JSX `return` statement. Document the HTML element tree:

- What element is the outermost wrapper? (`<div>`, `<button>`, `<a>`, etc.)
- What is the nesting structure?
- Are there conditional elements (icon wrapper, trailing content)?
- What `data-blade-component` attribute is set via `metaAttribute`?

Document this for each key variant (default, with icon, disabled, etc.).

### 5. Extract stories

From `{Name}.stories.tsx`:

- List each exported story by name
- Note what each story demonstrates (sizes, colors, with icon, etc.)
- Note the story template pattern (single component, loop over variants, custom layout)
- Note any mock data, dummy content, or special layout wrappers used

### 6. Classify tier

Apply heuristics:

```
Simple:  propCount <= 6 AND subComponents == 0 AND bladeDeps <= 1
Medium:  propCount 7-15 AND subComponents <= 1 AND bladeDeps <= 3
Complex: propCount > 15 OR subComponents >= 2 OR hasContext OR hasPortal
```

Also check for signals that might upgrade the tier:

- Uses `React.createContext` → complex
- Uses `createPortal` → complex
- Has compound API (`{Name}.Header`, `{Name}.Body`) → complex
- Has animation/transition logic → may upgrade simple→medium

### 7. Write discovery report

Fill in the template at `.cursor/templates/discovery-report.md` with all extracted data.
Save to `.cursor/artifacts/{Name}/discovery-report.md`.

## Constraints

- Do NOT suggest implementation approaches — that's the Research agent's job
- Do NOT modify any files — this agent is read-only
- Do NOT read Svelte components — only React source
- Keep the report factual and concise (target: 50-80 lines for simple, 90-130 lines for complex)

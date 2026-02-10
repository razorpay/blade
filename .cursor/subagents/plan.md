# Plan Agent

> Phase 1: Analyze the React component and produce both the discovery report
> (source of truth for Verify) and the migration plan (instructions for Execute).
> This agent reads React source + one reference Svelte component in a single pass.

## Include

Read `.cursor/subagents/shared-rules.md` before starting.

## Input

- Component name (e.g., `Alert`)
- React source path: `packages/blade/src/components/{Name}/`

## Output

- `.cursor/artifacts/{Name}/discovery-report.md` (using template at `.cursor/templates/discovery-report.md`)
- `.cursor/artifacts/{Name}/migration-plan.md` (using template at `.cursor/templates/migration-plan.md`)
- Reference examples: `.cursor/examples/badge-discovery-report.md`, `.cursor/examples/badge-migration-plan.md`

---

## Step 1: Input Parsing & Validation

1. Parse component name from input (should be a single component, not comma-separated)
2. Verify the component exists: `packages/blade/src/components/{Name}/`
   - If not found: stop with error message "Component {Name} not found in React source"
3. Check if already migrated: `packages/blade-svelte/src/components/index.ts`
   - If already migrated: stop with message "Component {Name} already migrated, skipping"
4. On validation pass: continue to Part A (Discovery)

---

## Part A: Discovery (Extract Facts from React Source)

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

From `{Name}.stories.tsx` (and any related story files like `{SubName}.stories.tsx`):

- List **every** exported story
- Use the **exact `.storyName` value** as the Story Name (e.g., `ChipWithColor.storyName = 'With Color'` → name is `With Color`, NOT `ChipWithColor`)
- If no `.storyName` is set, use the export name converted to title case
- Extract the **Storybook `title`** from the default export (e.g., `title: 'Components/Chip/ChipGroup'`) — this must be preserved verbatim
- Note each story's pattern: `uncontrolled` (static args), `controlled` (uses `useState`/state + `onChange`), `loop` (iterates variants), `custom` (special layout)
- For `controlled` stories: note what external components/state they use (e.g., Dropdown, Button, `React.useState`)
- Note any mock data, dummy content, or special layout wrappers
- **Count total stories** — this count is the parity target for Svelte

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

### 7. Classify architecture

Check if `Base{Name}.tsx` or a `Base{Name}/` directory exists in the React source at
`packages/blade/src/components/{Name}/`:

- If `Base{Name}.tsx` (or `Base{Name}/Base{Name}.tsx`) exists → **two-layer**
  (React has a Base logic layer + a Public API wrapper)
- If no `Base{Name}` file exists → **single-layer**
  (React is a flat component with all logic in `{Name}.tsx`)

Record this in the Classification table's **Architecture** field.

---

## Part B: Research (Plan the Migration Strategy)

Now, without re-reading the React source (you already have it in context), plan the Svelte migration.

### 8. Read reference component

Choose the most similar already-migrated Svelte component to use as a template:

| Component Type             | Best Reference       | Why                                   |
| -------------------------- | -------------------- | ------------------------------------- |
| Display, no interaction    | `Badge` or `Counter` | CVA styling, simple props             |
| Display with text variants | `Text` or `Heading`  | Typography patterns                   |
| Interactive, clickable     | `Button`             | Interaction states, disabled handling |
| Interactive, navigable     | `Link`               | Anchor element, href handling         |
| Loading/progress           | `Spinner`            | Animation, size variants              |
| Currency/number display    | `Amount`             | Formatted display, locale             |

Read the chosen reference component from `packages/blade-svelte/src/components/`.
Read its `.svelte` file and `types.ts` to understand concrete patterns.

### 9. Map props

For each prop extracted in Step 2, apply these transformations:

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

- Default values stay the same
- Note any special handling needed (children → Snippet, events → web-only)
- Flag props that need decisions

### 10. Plan file structure

**⚠️ MANDATORY CHECK — Architecture must match React:**

1. Read the **Architecture** field from the Classification (Step 7).
2. If `single-layer`: File plan **MUST NOT** include `Base{Name}/` directories.
3. If `two-layer`: File plan **MUST** include `Base{Name}/Base{Name}.svelte` + `{Name}.svelte`.

List all files with action (create / update) and notes.

### 11. Plan CSS strategy

- Does this component need a new CSS module in blade-core?
- What CVA variants are needed? (map from props that affect styling)
- What token variables will be used?
- How are disabled/interaction states handled in CSS?

### 12. Plan stories

**⚠️ STRICT 1:1 PARITY — no additions, no removals, no renames.**

- The Svelte story file must have **exactly** the same stories as the React source (same count).
- The Storybook `title` must be **identical** to the React default export's `title`.
- Each `<Story name="...">` must use the **exact Story Name** from Step 5.
- Do NOT invent new stories that don't exist in React.
- Do NOT skip stories because they seem complex or use unmigrated dependencies.

For each story from Step 5:

- Determine Svelte template: `args-only` (simple), `snippet` (needs children), `loop` (iterate variants), `custom` (special layout), `controlled` (uses `$state` + `onChange`)
- For `controlled` stories: plan the Svelte equivalent of `React.useState` → `$state()`. If the React story uses unmigrated components (e.g., Dropdown), substitute with native HTML (`<select>`, `<button>`) that demonstrates the same controlled behavior.
- Note what content/mocks/layout each story needs — match React exactly

### 13. Flag decisions

Document any decisions that need human input.

**The FIRST decision MUST be the architecture layer choice:**

| #   | Decision            | Choice                     | Rationale                                                                |
| --- | ------------------- | -------------------------- | ------------------------------------------------------------------------ |
| 1   | Single vs two-layer | {single-layer / two-layer} | React source {has / does not have} `Base{Name}`. Architecture = {value}. |

Then add any other decisions:

- Dependency workarounds (Box → div, Icon → placeholder)
- Missing utilities that might need creation
- Ambiguous type mappings

---

## Part C: Write Artifacts

### 14. Write discovery report

Fill in the template at `.cursor/templates/discovery-report.md` with all data extracted in Part A (Steps 1-7).
Save to `.cursor/artifacts/{Name}/discovery-report.md`.

### 15. Write migration plan

Fill in the template at `.cursor/templates/migration-plan.md` with all decisions from Part B (Steps 8-13).
Save to `.cursor/artifacts/{Name}/migration-plan.md`.

---

## Constraints

- Read at most ONE reference Svelte component (avoid context bloat)
- Do NOT create any component files — this agent produces plans only
- Do NOT write implementation code — only snippets in the plan
- Do NOT modify any source files — both artifacts are in `.cursor/artifacts/`
- Keep both artifacts actionable: Execute should be able to follow the plan mechanically, Verify should check the report line-by-line
- The discovery report is factual extraction only — no opinions or suggestions
- The migration plan is decisions and instructions only — no raw React source dumps
- Target sizes: discovery report 50-80 lines (simple) / 90-130 lines (complex), migration plan 60-90 lines (simple) / 120-180 lines (complex)

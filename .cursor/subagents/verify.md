# Verify Agent — Convergent Loop

> Phase 4: Verify the migrated component through static checks, API parity,
> visual comparison, and inline fixes. Owns ALL fix strategies.

## Include

Read `.cursor/subagents/shared-rules.md` before starting.

## Input

- Component name
- `.cursor/artifacts/{Name}/discovery-report.md` (source of truth for expected API, props, stories, DOM structure)

## Output

- `.cursor/artifacts/{Name}/verification-report.md` (using template at `.cursor/templates/verification-report.md`)
- Screenshots in `.cursor/artifacts/{Name}/screenshots/`

## Reference

- Example: `.cursor/examples/badge-verification-report.md`

---

## Step 0: Ensure Storybooks Are Running

Before any visual verification, ensure both Storybooks are running:

1. **React Storybook (port 6006):**
   - `curl -s http://localhost:6006` → check for HTML response
   - If running → reuse
   - If not running → `cd packages/blade && npm run storybook` (background)
   - If port occupied by non-Storybook → warn user, ask to free port

2. **Svelte Storybook (port 6007):**
   - `curl -s http://localhost:6007` → check for HTML response
   - If running → reuse
   - If not running → `cd packages/blade-svelte && npm run storybook` (background)
   - If port occupied by non-Storybook → warn user, ask to free port

3. **Poll both ports** until responsive (max 60s, check every 5s)
   - If timeout → log error, skip visual comparison (Steps 3-4)

4. **After pipeline completes:** Do NOT kill Storybook processes. Log: "Storybooks still running on ports 6006/6007 for manual verification"

---

## Verification Report State Protocol

The report at `.cursor/artifacts/{Name}/verification-report.md` is this loop's persistent state.

**At loop start:** Read existing report → extract iteration number, previous issues.

**After each step:**
- **OVERWRITE** current-state sections: Metadata (bump iteration + timestamp), Static Checks, API Parity, Visual Comparison
- **APPEND** to Iteration History table (never delete rows)
- **UPDATE** Result field (IN PROGRESS / PASS / FAIL / PASS WITH WARNINGS)

**On loop exit:** Write final Result. Iteration History contains the complete audit trail.

---

## Loop

```
iteration = 1
```

### Step 1: Static Checks (fix inline, max 3 retries per iteration)

Run these commands:

```bash
cd packages/blade-svelte && npm run svelte-check
cd packages/blade-svelte && npm run build
```

**On pass:** Update report Static Checks table → continue to Step 2.

**On fail:**

1. Parse error output: extract file path, line number, error code, message
2. Read the offending file
3. Apply fix directly:
   - **Missing import** → add the import statement
   - **Wrong type** → fix the type annotation
   - **Missing export** → add to the appropriate index.ts
   - **Unused variable** → remove or prefix with `_`
   - **Svelte template error** → fix syntax (missing closing tag, wrong directive)
4. Re-run the check
5. Repeat up to 3 times within this step

**On 3 consecutive failures:** Write errors to report, set Result = FAIL, exit loop.

### Step 2: API Parity Check

Read `discovery-report.md` as the source of truth. Compare against actual implementation:

**Props check:**
- Read `types.ts` → compare prop names, types, defaults against discovery report Props table
- Every prop in the discovery report must exist with matching type

**Stories check:**
- Read `.stories.svelte` → extract all `<Story name="...">` blocks
- Verify the Storybook `title` in `defineMeta` is **identical** to the React `title` from the discovery report
- Every story in the discovery report Stories table must exist with the **exact same name**
- There must be **no extra stories** that don't exist in the discovery report
- Story count must match: `Svelte story count === discovery report total story count`
- If names differ (e.g., "Default Value Single" vs "Uncontrolled Single Selection with Default Value"), flag as missing + extra

**Exports check:**
- Read `{Name}/index.ts` → verify component is exported
- Read `components/index.ts` → verify component is re-exported
- Read `blade-core/src/styles/index.ts` → verify CSS module exports are registered

**Event handlers check:**
- Read the `.svelte` component file → verify all handlers from discovery report are wired up
- Verify each handler checks `isDisabled` before executing

**On pass:** Continue to Step 3.

**On missing items:**

1. Write `.cursor/artifacts/{Name}/patch-request.md` listing:
   - Missing props with types and defaults
   - Missing stories with descriptions
   - Missing exports with expected paths
   - Missing event handlers with signatures
2. Invoke Execute agent in **patch mode** (see `.cursor/subagents/execute.md`)
3. After patch applied → return to Step 1 (re-verify everything)
4. Append to Iteration History: "API parity gap → triggered patch mode"

### Step 3: Visual Comparison (LLM-driven reasoning)

**Pre-check:** Confirm Storybooks are running (should already be up from Step 0).
If not running, re-run Step 0 before proceeding.

**Storybook URL pattern:**

Stories are addressed via iframe URLs for clean, isolated screenshots (no Storybook chrome):

```
http://localhost:{port}/iframe.html?id={story-id}
```

The `story-id` is constructed from the story's `title` and `name`:

```
title: "Components/Badge"  +  name: "Subtle Emphasis"
  → components-badge--subtle-emphasis

Rules:
  1. Take the title, lowercase, replace "/" with "-"
     "Components/Badge" → "components-badge"
  2. Take the story name, lowercase, replace spaces with "-"
     "Subtle Emphasis" → "subtle-emphasis"
  3. Join with "--"
     → "components-badge--subtle-emphasis"
```

**Examples from Badge:**

| Story Name | Svelte URL (6007) | React URL (6006) |
|-----------|-------------------|------------------|
| Playground | `http://localhost:6007/iframe.html?id=components-badge--playground` | `http://localhost:6006/iframe.html?id=components-badge--default` |
| Sizes | `http://localhost:6007/iframe.html?id=components-badge--sizes` | `http://localhost:6006/iframe.html?id=components-badge--small-size` |

> **Note:** Svelte and React story names may differ (e.g., "Playground" vs "Default").
> Use the discovery report's Stories table to find the matching React story name for each Svelte story.

**For each story in the discovery report's Stories table:**

1. Construct the Svelte story URL using the pattern above (port 6007)
2. Navigate to the URL using Playwright
3. Wait for the page to be idle (network and animations settled)
4. Take screenshot → save to `.cursor/artifacts/{Name}/screenshots/svelte-{story-slug}.png`
5. Construct the matching React story URL (port 6006) — use discovery report for the React story name
6. Navigate, wait for idle, take screenshot → save to `.cursor/artifacts/{Name}/screenshots/react-{story-slug}.png`

**Compare screenshots using visual reasoning:**

For each pair:
1. Describe what you see in the Svelte screenshot (layout, colors, spacing, text)
2. Describe what you see in the React screenshot
3. List specific differences observed
4. Classify severity with reasoning:

**P0 — Fundamentally broken:**
- Component doesn't render, crashes, blank area
- All items stacked when they should be inline
- Component not visible at all, wrong component rendered

**P1 — Visible differences a user would notice:**
- Color mismatch (e.g., blue-500 vs blue-600, wrong background)
- Spacing off by > 4px (e.g., gap-3 vs gap-5)
- Font size/weight wrong (e.g., semibold vs regular)
- Border radius visibly different (e.g., rounded vs sharp)
- Icon size mismatch, missing icon
- Padding/margin causing visible layout shift
- DOM structure mismatch (different semantic elements)

**P2 — Minor/acceptable:**
- Subpixel rendering / anti-aliasing differences
- Font rendering engine differences
- Off by 1-2px due to browser rounding
- Slight color difference due to color space
- Cursor style differences in screenshots

**Also check DOM structure parity:**
- Inspect rendered DOM (via browser devtools or snapshot)
- Verify semantic element structure matches React (same element types, same nesting)
- Flag structural mismatches as P2

**On all P2 or clean:** All checks passed — set Result = **PASS** (or PASS WITH WARNINGS if any P2), write final report, **exit loop**.

**On P0/P1 issues:** Continue to Step 4.

### Step 4: Two-Pass Visual Fix (inline)

**Root cause principle:** Visual diffs are most often caused by story-level mismatches (different mocks, missing dummy content, different layout wrappers), not CSS bugs.

**Before applying any fix:** Create a `git stash` checkpoint for regression detection.

#### Pass 1: Story Fidelity (check first — most common root cause)

1. Read the failing **React story**: note mocks, dummy content, layout, container styles, number of variants shown, graphics/icons used
2. Read the matching **Svelte story**: compare against React
3. If story content differs:
   - Fix the Svelte story to match React (same mocks, dummy text, layout wrappers, variant counts, icon placeholders)
   - Log "Pass 1: story fidelity fix applied" to Iteration History
   - Return to Step 1 (re-verify after fix)

#### Pass 2: CSS/Component Fix (only if Svelte story already matches React)

1. Stories match but visual still differs → CSS or component issue
2. Read CSS module (`blade-core/src/styles/{Name}/`) + Svelte component template
3. Identify and fix: spacing, colors, sizing, border-radius, font properties
4. **Scope constraint:** max 2 files touched per fix. If more files needed, flag for human.
5. Log "Pass 2: CSS/component fix applied" to Iteration History
6. Return to Step 1 (re-verify after fix)

**Scoped to:** Svelte stories, CSS modules (blade-core/src/styles/), and Svelte component templates.
**Never** create or delete files.

**Fix strategies by issue type:**

| Issue Type | Pass 1: Story Check | Pass 2: CSS Check |
|-----------|--------------------|--------------------|
| `P0` | Story missing content, wrong structure, render crash | Template logic error, missing class, broken conditional |
| `P1` | Different mocks/dummy text, missing variants, layout | Wrong token variable, spacing mismatch, color mismatch |

**Regression detection:** After re-verification, if a previously-passing check now fails:
1. Run `git stash pop` to rollback the fix
2. Flag the regression for human review
3. Append "Regression detected, fix rolled back" to Iteration History

### Step 5: Human Checkpoint (after fixes only, every 2nd iteration)

> This step is only reached when Step 4 applied a fix and the loop
> cycled back through Steps 1-3. If Step 3 finds all clean/P2 on any
> iteration, the loop exits with PASS before reaching here.

```
iteration += 1
```

**Check safety cap:** If `iteration > 6` → set Result = FAIL, write full report, exit loop.

**If `iteration % 2 === 0`:**

Present to the user:
- Current `verification-report.md` content
- Side-by-side screenshot pairs for each story
- Summary: what passed, what has P2 warnings, what was fixed

Ask: **"continue / stop / manual-fix?"**

- `"continue"` → go to Step 1
- `"stop"` → accept current state, set Result = PASS WITH WARNINGS, exit loop
- `"manual-fix"` → pause loop, user makes changes, then resume at Step 1

**If `iteration % 2 !== 0`:** Go directly to Step 1.

---

## Exit Conditions

| Condition | Result |
|-----------|--------|
| All checks pass (static + API + visual) | **PASS** |
| User says "stop" | **PASS WITH WARNINGS** |
| 3 consecutive static failures in same iteration | **FAIL** |
| `iteration > 6` | **FAIL** (safety cap, full report produced) |

---

## Constraints

- Never delete generated files (never-revert safety rail — use git stash instead)
- Always update the verification report after each step
- Screenshots must be saved to the artifacts directory
- If Storybooks aren't running, start them using Step 0
- Keep the verification report under 100 lines per iteration (prune old error blocks)

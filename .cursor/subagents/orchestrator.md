# Orchestrator — Migration Pipeline Controller

> Main entry point for component migration. Classifies tier, resolves
> dependencies, routes to appropriate pipeline, manages Storybooks.

## Include

Read `.cursor/subagents/shared-rules.md` before starting.

## Input

- Component name(s): single name or comma-separated list (e.g., `Alert` or `Alert, Card, Checkbox`)

## Output

- Migrated component files in `blade-svelte/` and `blade-core/`
- Artifacts in `.cursor/artifacts/{Name}/`
- For batch: status in `.cursor/artifacts/batch-status.md`

---

## Step 1: Input Parsing & Validation

1. Parse component name(s) from user input
2. For each component, verify it exists: `packages/blade/src/components/{Name}/`
3. Check if already migrated: `packages/blade-svelte/src/components/index.ts`
4. If already migrated, skip with message

## Step 2: Tier Classification (Suggestion + Confirmation)

For each component, run the Discovery agent's extraction logic (lightweight — just count props, sub-components, deps):

```
Simple:  propCount <= 6 AND subComponents == 0 AND bladeDeps <= 1
Medium:  propCount 7-15 AND subComponents <= 1 AND bladeDeps <= 3
Complex: propCount > 15 OR subComponents >= 2 OR hasContext OR hasPortal
```

**Present to the user for confirmation:**

```
Component: {Name}
Suggested tier: {tier}
Reasoning: {propCount} props, {subComponents} sub-components,
           {bladeDeps} blade deps, context={yes/no}, portal={yes/no}
Proceed with {tier}? [yes / override to simple|medium|complex]
```

The developer can override (e.g., a component with 4 props but complex animations should be medium). For batch migrations, show confirmation once per component before routing.

## Step 3: Dependency Resolution

For each component's unmigrated Blade dependencies:

1. Check `blade-svelte/src/components/index.ts` — is the dep exported?
2. Skip dependencies that have **known workarounds** (no migration needed):
   - `Box` / `BaseBox` → use `<div>` with classes
   - `Icons` → placeholder prop type (`IconComponent = unknown`)
   - Anything from `blade-core` (`~utils/`, `~tokens/`) → already framework-agnostic
3. If unmigrated deps remain (no workaround), **stop the migration** and present:

```
⚠️  Migration blocked: {ComponentName}

Unmigrated dependencies found:
  - {DepName1} (imported from ~components/{DepName1})
  - {DepName2} (imported from ~components/{DepName2})

These components must be migrated first.
Run `/migrate-to-svelte` for each dependency, then retry {ComponentName}.

Suggested migration order:
  1. {DepName1} (simpler, no further deps)
  2. {DepName2} (depends on {DepName1})
  3. {ComponentName} (original request)
```

4. For batch migrations (`Alert, Card, Checkbox`): skip the blocked component, continue with the next one, and note the dependency in `batch-status.md`

## Step 4: Storybook Lifecycle

Before the verify phase begins, ensure Storybooks are running:

```
1. Check port 6006 (React Storybook):
   - curl -s http://localhost:6006 → check for HTML response
   - If running and is Storybook → reuse
   - If not running → `cd packages/blade && npm run storybook` (background)
   - If port occupied by non-Storybook → warn user, ask to free port

2. Check port 6007 (Svelte Storybook):
   - curl -s http://localhost:6007 → check for HTML response
   - If running and is Storybook → reuse
   - If not running → `cd packages/blade-svelte && npm run storybook` (background)
   - If port occupied by non-Storybook → warn user, ask to free port

3. Poll both ports until responsive (max 60s, check every 5s)
   - If timeout → log error, skip visual comparison in verify phase

4. After pipeline completes:
   - DO NOT kill Storybook processes
   - Log: "Storybooks still running on ports 6006/6007 for manual verification"
```

## Step 5: Route to Pipeline

### Simple Tier — Inline Execution

Run all phases inline (no Task sub-agents), skip human gate:

```
1. Discovery (inline):
   - Follow .cursor/subagents/discovery.md steps
   - Save to `.cursor/artifacts/{Name}/discovery-report.md`

2. Research (inline):
   - Follow .cursor/subagents/research.md steps
   - Save to `.cursor/artifacts/{Name}/migration-plan.md`
   - NO human gate (simple components don't need plan approval)

3. Execute (inline):
   - Follow .cursor/subagents/execute.md steps (Full Mode)
   - Create all files

4. Basic Verify (inline, simplified):
   - Run svelte-check + build only (no visual comparison)
   - Fix static errors inline (max 3 retries)

5. Result:
   - If all pass → DONE ✅
   - If errors persist after 3 retries →
     Upgrade to Medium pipeline (see below)
```

**Graceful upgrade:** If a "simple" component has hidden complexity (unexpected errors, broken builds), promote it to the medium pipeline. The inline discovery/research artifacts are reused as input — don't re-run those phases.

### Medium/Complex Tier — Sub-agent Pipeline

Spawn Task sub-agents per phase:

```
1. Discovery Agent (Task)
   - Prompt: Include shared-rules.md + discovery.md instructions
   - Input: Component name
   - Output: discovery-report.md

2. Research Agent (Task)
   - Prompt: Include shared-rules.md + research.md instructions
   - Input: discovery-report.md
   - Output: migration-plan.md

3. 🔒 Human Gate: Plan Review
   - Present migration-plan.md to user
   - Ask: "approve / reject with feedback"
   - On reject: re-run Research with feedback
   - On approve: continue

4. Execute Agent (Task)
   - Prompt: Include shared-rules.md + execute.md instructions
   - Input: migration-plan.md
   - Output: All files created on disk

5. Verify Agent (Task — convergent loop)
   - Prompt: Include shared-rules.md + verify.md instructions
   - Input: discovery-report.md + migration-plan.md + component name
   - Runs the full verify loop (see verify.md)
   - May trigger Execute agent in patch mode

6. 🔒 Human Gate: Final Review
   - Present verification-report.md + screenshots
   - Ask: "accept / request changes"
   - On accept: DONE ✅
   - On request changes: re-enter verify loop with feedback
```

## Step 6: Batch Progress Tracking

For batch migrations, maintain `.cursor/artifacts/batch-status.md`:

```markdown
## Batch Migration Status

| #   | Component | Tier    | Status     | Iteration | Notes             |
| --- | --------- | ------- | ---------- | --------- | ----------------- |
| 1   | Divider   | simple  | ✅ done    | 1         | inline, no issues |
| 2   | Alert     | medium  | 🔄 verify  | 3         | P1 spacing fix    |
| 3   | Checkbox  | complex | ⏳ pending | -         | blocked on Alert  |
```

Update this file after each component completes or changes status.

Process batch components sequentially (not in parallel) to avoid file conflicts.

---

## Error Handling

| Scenario                                | Action                                 |
| --------------------------------------- | -------------------------------------- |
| Component doesn't exist in React source | Log error, skip, continue batch        |
| Component already migrated              | Log skip message, continue batch       |
| Unmigrated dependency (no workaround)   | Stop migration, show deps + suggested order, prompt user to migrate deps first |
| Dependency cycle detected               | Flag for human, skip component         |
| Storybook fails to start                | Skip visual comparison, warn user      |
| Simple tier upgrade needed              | Promote to medium, reuse artifacts     |
| User rejects plan 3 times               | Abort component, move to next in batch |

## Constraints

- Always confirm tier with user before proceeding
- Never run multiple component migrations in parallel
- Never kill Storybook processes
- If any phase produces an unexpected error, save current state and ask user
- All artifacts go in `.cursor/artifacts/{Name}/` (gitignored)

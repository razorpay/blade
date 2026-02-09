# Orchestrator — Migration Pipeline Controller

> Main entry point for component migration. Classifies tier, resolves
> dependencies, routes to appropriate pipeline, manages Storybooks.

## MANDATORY RULES (never skip, never override)

- **You MUST use `run-agent` via shell command to spawn a separate sub-agent for EVERY phase (Discovery, Research, Execute, Verify). No exceptions. No shortcuts. ALL tiers including simple.**
- **You are the ORCHESTRATOR. You coordinate. You do NOT execute phase work yourself.**
- **Reading a sub-agent's `.md` file does NOT mean you should follow its steps inline. The `run-agent` command reads the file and spawns a separate agent automatically.**
- **If you find yourself reading React source files, writing migration plans, creating `.svelte` files, running `svelte-check`, or doing any work described in `discovery.md`, `research.md`, `execute.md`, or `verify.md` — STOP IMMEDIATELY. You are violating the orchestrator boundary. Run `run-agent` instead.**
- Your ONLY permitted jobs are: parse input, classify tier, check dependencies, manage Storybooks, spawn `run-agent` sub-agents, relay outputs between phases, and present human gates.
- "I already have the context" is NOT a valid reason to skip spawning a sub-agent. The sub-agent architecture exists for isolation and reliability. Always spawn.

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

> ⚠️ SELF-CHECK: You MUST run `run-agent` for every phase below.
> If you are about to read component source files, write a plan, create
> `.svelte` files, or run `svelte-check` yourself — STOP. You are the
> orchestrator, not the executor. Run `run-agent` now.

### Sub-agent Pipeline (ALL tiers — simple, medium, and complex)

Every phase MUST be executed by spawning a sub-agent via `run-agent` shell command.
Never execute phase instructions inline, regardless of tier or context.

**Tier-specific adjustments:**
- Simple tier: skip Human Gate at Phase 3 (no plan approval needed), Verify uses simplified checks (static + build only, no visual comparison)
- Medium/Complex tier: full pipeline with all human gates and visual verification

---

#### Phase 1: Discovery Agent

> ⚠️ SELF-CHECK: Am I about to read React source files myself? If yes, STOP. Run `run-agent` now.

1. Run the Discovery agent via shell command:

```bash
run-agent .cursor/subagents/discovery.md "CONTEXT: Component={Name}"
```

2. Wait for the agent to complete, then verify `.cursor/artifacts/{Name}/discovery-report.md` was created

---

#### Phase 2: Research Agent

> ⚠️ SELF-CHECK: Am I about to write a migration plan myself? If yes, STOP. Run `run-agent` now.

1. Run the Research agent via shell command:

```bash
run-agent .cursor/subagents/research.md "CONTEXT: Component={Name}, DiscoveryReport=.cursor/artifacts/{Name}/discovery-report.md"
```

2. Wait for the agent to complete, then verify `.cursor/artifacts/{Name}/migration-plan.md` was created

---

#### Phase 3: 🔒 Human Gate — Plan Review (skip for simple tier)

- Present `migration-plan.md` to user
- Ask: "approve / reject with feedback"
- On reject: re-run Phase 2 (Research) with the user's feedback appended to the prompt
- On approve: continue to Phase 4

---

#### Phase 4: Execute Agent

> ⚠️ SELF-CHECK: Am I about to create `.svelte` files or write CSS myself? If yes, STOP. Run `run-agent` now.

1. Run the Execute agent via shell command:

```bash
run-agent .cursor/subagents/execute.md "CONTEXT: Component={Name}, MigrationPlan=.cursor/artifacts/{Name}/migration-plan.md"
```

2. Wait for the agent to complete, then verify the component files were created successfully

---

#### Phase 5: Verify Agent

> ⚠️ SELF-CHECK: Am I about to run `svelte-check` or take screenshots myself? If yes, STOP. Run `run-agent` now.

1. Run the Verify agent via shell command:

```bash
run-agent .cursor/subagents/verify.md "CONTEXT: Component={Name}, DiscoveryReport=.cursor/artifacts/{Name}/discovery-report.md, MigrationPlan=.cursor/artifacts/{Name}/migration-plan.md"
```

2. The Verify agent runs the full convergent loop (see verify.md)
3. If Verify agent reports API parity gaps needing a patch, run the Execute agent in patch mode, then re-run the Verify agent:

```bash
run-agent .cursor/subagents/execute.md "CONTEXT: Component={Name}, Mode=patch, PatchRequest=.cursor/artifacts/{Name}/patch-request.md"
```

---

#### Phase 6: 🔒 Human Gate — Final Review

- Present `verification-report.md` + screenshots to user
- Ask: "accept / request changes"
- On accept: DONE ✅
- On request changes: re-enter Phase 5 (Verify) with user feedback

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
| User rejects plan 3 times               | Abort component, move to next in batch |

## Constraints

- **ALWAYS use `run-agent` shell command for Discovery, Research, Execute, and Verify phases — no inline execution, no exceptions, regardless of tier**
- Always confirm tier with user before proceeding
- Never run multiple component migrations in parallel
- Never kill Storybook processes
- If any phase produces an unexpected error, save current state and ask user
- All artifacts go in `.cursor/artifacts/{Name}/` (gitignored)
- Never rationalize skipping sub-agents ("I already have context", "it's simpler inline", etc.)

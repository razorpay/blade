# Orchestrator — Migration Pipeline Controller

> Main entry point for component migration. Parses input, routes to
> sub-agent phases, manages human gates, tracks batch progress.

## Include

Read these before starting:

1. `.cursor/subagents/shared-rules.md`
2. `.cursor/rules/orchestrator-guardrails.mdc` (sub-agent enforcement rules)

## Input

- Component name(s): single name or comma-separated list (e.g., `Alert` or `Alert, Card, Checkbox`)

## Output

- Migrated component files in `blade-svelte/` and `blade-core/`
- Artifacts in `.cursor/artifacts/{Name}/`
- For batch: status in `.cursor/artifacts/batch-status.md`

---

## Batch Parsing

1. Parse component name(s) from user input
2. If comma-separated list, create batch status file: `.cursor/artifacts/batch-status.md`
3. Process components **sequentially** (not in parallel) through Steps 1-6 below
4. For batch: update status file after each component completes

---

## Step 1: Plan Agent

The Plan agent validates the component input, reads the React source and a reference Svelte component in a single pass,
producing both the discovery report (source of truth for Verify) and the migration plan
(instructions for Execute).

**Pass a single component name** — if batch, loop through components one at a time.

```bash
run-agent .cursor/subagents/plan.md "CONTEXT: Component={Name}"
```

Wait for completion. Verify both artifacts were created:

- `.cursor/artifacts/{Name}/discovery-report.md`
- `.cursor/artifacts/{Name}/migration-plan.md`

## Step 2: Dependency Check

Read the dependencies section of the discovery report. For any dependency marked as ❌ not migrated:

1. Check against the workarounds list in `shared-rules.md` — skip deps with known workarounds
2. If unmigrated deps remain (no workaround), **block the migration** and suggest migration order and workarounds
3. For batch migrations: skip the blocked component, continue with the next, note in `batch-status.md`

## Step 3: Human Gate — Plan Review

- Present `migration-plan.md` to user (includes tier classification from discovery)
- Ask: "approve / reject with feedback"
- On reject: re-run Step 1 (Plan) with user feedback appended
- On approve: continue

## Step 4: Execute Agent

```bash
run-agent .cursor/subagents/execute.md "CONTEXT: Component={Name}, MigrationPlan=.cursor/artifacts/{Name}/migration-plan.md"
```

Wait for completion. Verify component files were created.

## Step 5: Verify Agent

```bash
run-agent .cursor/subagents/verify.md "CONTEXT: Component={Name}, DiscoveryReport=.cursor/artifacts/{Name}/discovery-report.md"
```

If Verify reports API parity gaps needing a patch, run Execute in patch mode then re-run Verify:

```bash
run-agent .cursor/subagents/execute.md "CONTEXT: Component={Name}, Mode=patch, PatchRequest=.cursor/artifacts/{Name}/patch-request.md"
```

## Step 6: Human Gate — Final Review

- Present `verification-report.md` + screenshots to user
- Ask: "accept / request changes"
- On accept: DONE
- On request changes: re-enter Step 5 with user feedback

---

## Tier-Specific Adjustments

- **Simple:** skip Human Gate at Step 3 (no plan approval needed)
- **Medium/Complex:** Human Gate at step 3 (plan approval needed)

## Batch Progress Tracking

For batch migrations, maintain `.cursor/artifacts/batch-status.md`:

| #   | Component | Tier    | Status     | Iteration | Notes            |
| --- | --------- | ------- | ---------- | --------- | ---------------- |
| 1   | Divider   | simple  | ✅ done    | 1         | no issues        |
| 2   | Alert     | medium  | 🔄 verify  | 3         | P1 spacing fix   |
| 3   | Checkbox  | complex | ⏳ pending | -         | blocked on Alert |

Process batch components **sequentially** (not in parallel) to avoid file conflicts.

## Error Handling

| Scenario                                | Action                                                   |
| --------------------------------------- | -------------------------------------------------------- |
| Component doesn't exist in React source | Log error, skip, continue batch                          |
| Component already migrated              | Log skip message, continue batch                         |
| Unmigrated dependency (no workaround)   | Block migration, show deps + suggested order             |
| Dependency cycle detected               | Flag for human, skip component                           |
| User rejects plan 3 times               | Abort component, move to next in batch                   |
| Unexpected error in any phase           | Save current state to artifacts, ask user how to proceed |

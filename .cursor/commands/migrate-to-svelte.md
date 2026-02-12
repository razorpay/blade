# Orchestrator — Migration Pipeline Controller

> Main entry point for component migration. Parses input, routes to
> sub-agent phases, manages human gates, tracks batch progress.

## ⚠️ PRE-FLIGHT CHECKLIST — Acknowledge Before Starting

Before you take ANY action, confirm you understand:

- [ ] I will ONLY use the **Shell tool** to run `run-agent` commands for spawning any sub-agent
- [ ] I will NOT read any `.cursor/subagents/*.md` files before running them
- [ ] I will NOT execute any phase work myself (Plan/Execute/Verify)

**Your ONLY Valid Action Pattern:**

```bash
# Use Shell tool with this command:
run-agent .cursor/subagents/PHASE.md "CONTEXT: ..."
```

## ⚠️ Your Role

You are the **orchestrator**. You coordinate the migration pipeline by spawning specialized sub-agents for each phase. You do NOT execute any phase work yourself.

**Your ONLY job:**

1. Use the **Shell tool** to run `run-agent` commands
2. Wait for completion
3. Check artifacts were created
4. Present artifacts to user for gates
5. Move to next phase

## Include

Read these before starting:

1. `.cursor/rules/svelte-migration.md`
2. `.cursor/rules/orchestrator-guardrails.mdc`

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

**YOUR ACTION:** Use Shell tool to run this command (replace `{Name}` with actual component name):

```bash
run-agent .cursor/subagents/plan.md "CONTEXT: Component={Name}"
```

**WAIT** for completion, then verify both artifacts were created:

- `.cursor/artifacts/{Name}/discovery-report.md`
- `.cursor/artifacts/{Name}/migration-plan.md`

## Step 2: Dependency Check

Read the dependencies section of the discovery report. For any dependency marked as ❌ not migrated:

1. Check against the workarounds list in `svelte-migration.md` — skip deps with known workarounds
2. If unmigrated deps remain (no workaround), **block the migration** and suggest migration order and new workarounds
3. For batch migrations: skip the blocked component, continue with the next, note in `batch-status.md`

## Step 3: Human Gate — Plan Review

- Skip: if it's a Simple Component
- Ask for human approval: if it's a medium/complex component.
- Present `migration-plan.md` to user
- On reject: re-run Step 1 (Plan) with user feedback appended
- On approve: continue

## Step 4: Execute Agent

**YOUR ACTION:** Use Shell tool to run this command:

```bash
run-agent .cursor/subagents/execute.md "CONTEXT: MigrationPlan=.cursor/artifacts/{Name}/migration-plan.md"
```

**WAIT** for completion. before moving to verify phase.

## Step 5: Verify Agent

**YOUR ACTION:** Use Shell tool to run this command:

```bash
run-agent .cursor/subagents/verify.md "CONTEXT: DiscoveryReport=.cursor/artifacts/{Name}/discovery-report.md"
```

**WAIT** for completion.

If Verify reports API parity gaps needing a patch, run Execute in patch mode then re-run Verify:

```bash
run-agent .cursor/subagents/execute.md "CONTEXT: Mode=patch, PatchRequest=.cursor/artifacts/{Name}/patch-request.md"
```

## Step 6: Human Gate — Final Review

- Present `verification-report.md` + screenshots to user
- Share storybook link

---

## Batch Progress Tracking

For batch migrations, maintain `.cursor/artifacts/batch-status.md`:

| #   | Component | Tier    | Status     | Iteration | Notes            |
| --- | --------- | ------- | ---------- | --------- | ---------------- |
| 1   | Divider   | simple  | ✅ done    | 1         | no issues        |
| 2   | Alert     | medium  | 🔄 verify  | 3         | P1 spacing fix   |
| 3   | Checkbox  | complex | ⏳ pending | -         | blocked on Alert |

Process batch components **sequentially** (not in parallel) to avoid file conflicts.

## Error Handling

| Scenario                              | Action                                                   |
| ------------------------------------- | -------------------------------------------------------- |
| Unmigrated dependency (no workaround) | Block migration, show deps + suggested order             |
| Dependency cycle detected             | Flag for human, skip component                           |
| User rejects plan 3 times             | Abort component, move to next in batch                   |
| Unexpected error in any phase         | Save current state to artifacts, ask user how to proceed |

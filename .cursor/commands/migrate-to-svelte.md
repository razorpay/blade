# Orchestrator — Parallel Migration Pipeline Controller

> Main entry point for component migration. Parses input, sets up
> isolated git worktrees per component, runs Plan/Execute/Verify in
> parallel where safe, manages per-component human gates, and opens one
> PR per component (honoring intra-batch dependency ordering).

## ⚠️ PRE-FLIGHT CHECKLIST — Acknowledge Before Starting

Before you take ANY action, confirm you understand:

- [ ] I will spawn agents via the **Task tool** (`subagent_type: planner | execute | verify`).
- [ ] I will NOT read `.cursor/agents/*.md` myself — those files are loaded by the Task tool when the matching `subagent_type` is invoked.
- [ ] I will pass each component's worktree absolute path in the Task `prompt` so the agent can scope all its file/shell operations to that worktree.
- [ ] To run agents in parallel for a phase, I will send **one message containing multiple Task tool calls** (one per component). All N agents execute concurrently and the orchestrator only proceeds once they all return.

**Your ONLY Valid Action Patterns:**

```text
# Spawn an agent in the worktree (parent waits for all parallel calls in the
# same message to complete):
Task(
  subagent_type: "planner" | "execute" | "verify",
  description: "<short, distinct title>",
  prompt: "<see prompt templates in Steps 1, 4, 5>",
  run_in_background: false,
)
```

```bash
# Worktree management (Shell tool):
git worktree add -B feat/blade-svelte/{Name} .cursor/worktrees/{Name} origin/master
git worktree remove .cursor/worktrees/{Name}
```

```bash
# Per-component PR creation (Shell tool, run inside the worktree):
git push -u origin feat/blade-svelte/{Name}
gh pr create --base master --title "..." --body "..."
```

## ⚠️ Your Role

You are the **orchestrator**. You coordinate the migration pipeline by spawning specialized agents in parallel inside isolated git worktrees. You do NOT execute any phase work yourself.

**Your ONLY job:**

1. Set up one git worktree + one branch per component.
2. Spawn Plan/Execute/Verify agents in parallel via the Task tool, passing each component's worktree absolute path in the prompt.
3. Read the artifacts each agent produces.
4. Present artifacts to the user at human gates.
5. Open one PR per migrated component.
6. Maintain `.cursor/artifacts/batch-status.md` as the live source of truth.

## Include

Read these before starting:

1. `.cursor/rules/svelte-migration.mdc`
2. `.cursor/rules/orchestrator-guardrails.mdc`

## Input

- Component name(s): single name or comma-separated list (e.g., `Alert` or `Alert, Card, Checkbox`).

## Output

- One git worktree per component at `.cursor/worktrees/{Name}/`.
- One branch per component: `feat/blade-svelte/{Name}` (based on `origin/master`).
- One PR per component (base = `master`, title = `feat (blade-svelte): {Name} component`).
- Per-component artifacts at `.cursor/worktrees/{Name}/.cursor/artifacts/{Name}/`.
- Live batch tracker at `.cursor/artifacts/batch-status.md` (in the **main checkout**, not in any worktree).

---

## Step 0: Setup — Worktrees, Branches, Port Allocation

### 0.1 Parse and validate input

1. Parse component name(s) from user input. Trim whitespace, dedupe.
2. For each component, verify `packages/blade/src/components/{Name}/` exists in the **main checkout**. If missing → drop from batch and warn user.
3. Check `packages/blade-svelte/src/components/index.ts` in the main checkout. If `{Name}` is already exported → drop from batch with "already migrated".
4. Capture the **main checkout absolute path** (`pwd`) once. You will use it to construct worktree absolute paths for the Task prompts.

### 0.2 Allocate slots and ports

Number the surviving components `1..N` (in input order). For each component at slot `i`:

- React Storybook port: `9000 + i*100 + 9` → slot 1 = `9109`, slot 2 = `9209`, …, slot 5 = `9509`.
- Svelte Storybook port: `6000 + i*100 + 7` → slot 1 = `6107`, slot 2 = `6207`, …, slot 5 = `6507`.

The main checkout reserves `9009` (React, `yarn react:storybook` in `packages/blade`) and `6007` (Svelte, `yarn storybook` in `packages/blade-svelte`); the `i*100` offset keeps every slot clear of those defaults and of every other worktree.

### 0.3 Create worktrees + clone node_modules

For each component, run (via Shell tool, sequential — these are quick):

```bash
git worktree add -B feat/blade-svelte/{Name} .cursor/worktrees/{Name} origin/master
```

Then **APFS-clone** the dependency directories from the main checkout into the worktree so each worktree gets a fully private, mutable `node_modules` tree (see Assumptions below for the non-APFS fallback).

```bash
# Run from the main checkout root.
WT=.cursor/worktrees/{Name}

# Idempotency guard: cp -cR onto an existing directory nests the clone inside it
# (e.g. $WT/node_modules/node_modules) instead of replacing it, which silently
# corrupts module resolution. Strip any prior copies before re-cloning.
# (Worktree is fresh out of `git worktree add` on the happy path — these only fire on retry.)
rm -rf "$WT/node_modules" \
       "$WT/packages/blade/node_modules" \
       "$WT/packages/blade-svelte/node_modules" \
       "$WT/packages/blade-core/node_modules"

# APFS only: `cp -c` returns non-zero on non-APFS filesystems, so every clone fails
# fast and we fall through to `yarn install` per worktree (~30–60s each).
if cp -cR "$(pwd)/node_modules" "$WT/node_modules" 2>/dev/null; then
  [ -d packages/blade/node_modules ]        && cp -cR "$(pwd)/packages/blade/node_modules"        "$WT/packages/blade/node_modules"
  [ -d packages/blade-svelte/node_modules ] && cp -cR "$(pwd)/packages/blade-svelte/node_modules" "$WT/packages/blade-svelte/node_modules"
  [ -d packages/blade-core/node_modules ]   && cp -cR "$(pwd)/packages/blade-core/node_modules"   "$WT/packages/blade-core/node_modules"
else
  # Fallback: non-APFS filesystem. Install fresh inside the worktree.
  ( cd "$WT" && yarn install --prefer-offline --frozen-lockfile )
fi
```

If cloning fails for any other reason (corrupt `node_modules`, permissions, etc.), fall back to running `yarn install` inside the worktree.

#### Assumptions

Load-bearing preconditions for the clone-based approach. If any stop holding, revisit this step:

- **Yarn 1.x classic with `nohoist: ["**"]`and relative workspace symlinks.** If the project migrates to yarn berry's`nodeLinker: pnp`, pnpm, or any setup that uses absolute symlinks, the cloned `node_modules` would still point back into the main checkout and the isolation benefit disappears.
- **macOS APFS filesystem.** Linux/CI takes the `yarn install` fallback per worktree.

### 0.4 Initialize batch-status.md

Write `.cursor/artifacts/batch-status.md` in the **main checkout** with this layout:

```markdown
# Batch Migration Status

| #   | Component | Tier | Worktree                   | Branch                     | Ports (R/S) | Status          | Iteration | PR  | Notes |
| --- | --------- | ---- | -------------------------- | -------------------------- | ----------- | --------------- | --------- | --- | ----- |
| 1   | Alert     | -    | .cursor/worktrees/Alert    | feat/blade-svelte/Alert    | 9109/6107   | ⏳ plan-pending | -         | -   | -     |
| 2   | Card      | -    | .cursor/worktrees/Card     | feat/blade-svelte/Card     | 9209/6207   | ⏳ plan-pending | -         | -   | -     |
| 3   | Checkbox  | -    | .cursor/worktrees/Checkbox | feat/blade-svelte/Checkbox | 9309/6307   | ⏳ plan-pending | -         | -   | -     |
```

`Tier` is filled in after Plan completes. `PR` is filled in after Step 6.

Update this file after every status change.

---

## Step 1: Plan (parallel)

Spawn one Plan agent per component (parallel pattern — see pre-flight).

Per Task call:

- `subagent_type`: `planner`
- `description`: `Plan {Name} migration`
- `run_in_background`: `false`
- `prompt`: see template below

**Prompt template:**

```text
Plan the migration of the {Name} React component to Svelte 5.

- Component name: {Name}
- Worktree: {WorktreeAbs}

Follow the steps in your agent definition.
```

`{WorktreeAbs}` = `<main checkout absolute path>/.cursor/worktrees/{Name}`.

After all Plan agents return, verify both artifacts exist for each component (paths inside the worktree):

- `.cursor/worktrees/{Name}/.cursor/artifacts/{Name}/discovery-report.md`
- `.cursor/worktrees/{Name}/.cursor/artifacts/{Name}/migration-plan.md`

Update batch-status.md per component:

- On success: `Status = ✅ planned`, fill `Tier` from the discovery report.
- On failure: `Status = ❌ plan-failed`, capture the failure reason in `Notes`.

## Step 2: Dependency Resolution & Topological Order

After all Plans complete, read every successful component's `discovery-report.md` and build a dependency graph.

For each component:

1. Read its dependencies list from the discovery report.
2. For every unmigrated dependency:
   - Check the workarounds list in `svelte-migration.mdc` (e.g., `Box → div`, `Icons → placeholder`). Skip deps with known workarounds.
   - If the dep is **also in this batch** → record an intra-batch edge `{Name} → {Dep}` (this affects PR merge order).
   - If the dep is **not in this batch and has no workaround** → mark this component as `❌ blocked-by-dep` with the dep name in `Notes`. The user is told to migrate the dep first.

Compute a topological ordering of the un-blocked components. This ordering controls Step 6 (PR creation order).

Detect cycles → mark all members of the cycle `❌ dep-cycle` and skip.

## Step 3: Plan Gate (per-component, sequential)

For each successfully-planned, non-blocked component (in topological order):

1. **Skip the gate** if the component's tier is `simple`. Auto-approve and continue.
2. **Otherwise**, present the component's `migration-plan.md` to the user and ask for approval.
3. On reject: re-run that component's Plan (Step 1) with the user feedback appended to the prompt. Max 3 reject cycles per component; after 3 → mark `❌ plan-rejected` and continue with the others.
4. On approve: mark `Status = 🟢 plan-approved`.

This gate is sequential because it requires human input. The components themselves run independently afterwards.

## Step 4: Execute (parallel)

Spawn one Execute agent per plan-approved component (parallel pattern — see pre-flight).

Per Task call:

- `subagent_type`: `execute`
- `description`: `Execute {Name} migration`
- `run_in_background`: `false`
- `prompt`: see template below

**Prompt template (Full mode):**

```text
Implement the {Name} Svelte component.

- Component name: {Name}
- Mode: Full
- Worktree: {WorktreeAbs}

Follow the Full mode steps in your agent definition.
```

Update batch-status.md as each finishes:

- Success → `Status = 🛠️ executed`.
- Failure → `Status = ❌ execute-failed`, capture reason.

## Step 5: Verify (parallel)

Spawn one Verify agent per executed component (parallel pattern — see pre-flight).

Per Task call:

- `subagent_type`: `verify`
- `description`: `Verify {Name} migration`
- `run_in_background`: `false`
- `prompt`: see template below

**Prompt template:**

```text
Verify the {Name} Svelte component.

- Component name: {Name}
- Worktree: {WorktreeAbs}
- React Storybook port: {ReactPort}
- Svelte Storybook port: {SveltePort}

Follow the steps in your agent definition. Boot the React and Svelte Storybooks
on the assigned ports if they aren't already running. Do NOT kill them when
finished — the orchestrator needs them up for the final review gate.
```

`{ReactPort}` and `{SveltePort}` come from Step 0.2 (e.g., `9209` / `6207`).

If Verify reports API parity gaps requiring a patch, it writes `patch-request.md`. Re-spawn Execute in patch mode for that component, then re-spawn Verify:

**Execute Patch mode prompt:**

```text
Apply the patch request for {Name}.

- Component name: {Name}
- Mode: Patch
- Worktree: {WorktreeAbs}

Follow the Patch mode steps in your agent definition.
```

Update batch-status.md per component:

- PASS / PASS-WITH-WARNINGS → `Status = ✅ verified`.
- FAIL → `Status = ❌ verify-failed`.

## Step 6: Final Gate + PR (per-component, ordered by dep graph)

Process components in **topological order** (deps before dependents). For each verified component:

### 6.1 Wait for prerequisite PRs to merge (intra-batch deps only)

If this component has intra-batch dependencies recorded in Step 2:

1. For each dep, poll `gh pr view {DepNumber} --json mergedAt,state` until `state == MERGED`.
2. Use `AwaitShell` with sleep-style polling (e.g., 60-second blocks) so the user sees progress.
3. Once all deps are merged, rebase this component's worktree onto fresh master:

   ```bash
   # Inside .cursor/worktrees/{Name}
   git fetch origin master
   git rebase origin/master
   ```

   On rebase conflict: stop, surface the conflict to the user, ask how to proceed.

### 6.2 Final review

Present `verification-report.md` + screenshots to the user. Include the Storybook URL pattern so they can spot-check:

- Svelte: `http://localhost:{SveltePort}/iframe.html?id=components-{name}--{story}`

The Verify agent leaves Storybooks running on the worktree's ports for manual inspection.

On reject: ask the user what to fix. Re-spawn Verify (or Execute → Verify) as appropriate. Max 2 reject cycles, then mark `❌ final-rejected` and continue.

### 6.3 Commit, push, open PR

On approve, run inside the worktree:

```bash
# Stage migrated files. Exact paths come from the discovery report's "File Plan" section.
git add packages/blade-svelte/src/components/{Name} \
        packages/blade-core/src/styles/{Name} \
        packages/blade-svelte/src/components/index.ts \
        packages/blade-core/src/styles/index.ts

# (Add any other modified files surfaced by `git status` that belong to this component.)

git commit -m "feat (blade-svelte): {Name} component"
git push -u origin feat/blade-svelte/{Name}

gh pr create \
  --base master \
  --title "feat (blade-svelte): {Name} component" \
  --body "$(cat <<'EOF'
## Summary

Migrates the React {Name} component to Svelte 5.

## Artifacts

- Discovery report: `.cursor/artifacts/{Name}/discovery-report.md`
- Migration plan: `.cursor/artifacts/{Name}/migration-plan.md`
- Verification report: `.cursor/artifacts/{Name}/verification-report.md`

## Verification

See attached verification report and screenshots in the artifacts directory.

EOF
)"
```

Capture the PR URL from `gh pr create` output and update batch-status.md `PR` column.

If this component has dependents waiting in the batch, mark them `🟡 awaiting-dep-merge` so the user knows they will start once this PR merges.

## Step 7: Cleanup (manual, after all PRs merge)

Do **not** auto-remove worktrees. The user may want to keep them for hotfixes.

Print a summary at the end of the run:

```
Pipeline complete.
Worktrees still in place at .cursor/worktrees/{Name}/.
To remove a worktree after its PR merges:

  git worktree remove .cursor/worktrees/{Name}

Storybooks may still be running on the per-component ports. Stop them via the
processes listed in the terminals folder, or close the terminals.
```

---

## Failure Handling Summary

| Scenario                               | Effect on this component                                          | Effect on others |
| -------------------------------------- | ----------------------------------------------------------------- | ---------------- |
| Component already migrated             | Dropped at Step 0                                                 | Continue         |
| React source not found                 | Dropped at Step 0                                                 | Continue         |
| Plan agent fails                       | `❌ plan-failed`                                                  | Continue         |
| Unmigrated dependency, no workaround   | `❌ blocked-by-dep`                                               | Continue         |
| Dependency cycle detected              | `❌ dep-cycle` (all in cyc)                                       | Continue         |
| User rejects plan 3 times              | `❌ plan-rejected`                                                | Continue         |
| Execute agent fails (incl. retries)    | `❌ execute-failed`                                               | Continue         |
| Verify agent FAIL (after 6 iterations) | `❌ verify-failed`                                                | Continue         |
| User rejects final review 2 times      | `❌ final-rejected`                                               | Continue         |
| Rebase conflict during PR opening      | Pause, ask user                                                   | Continue         |
| Intra-batch dep PR never merges        | Stays `🟡 awaiting-dep-merge` indefinitely; user resumes manually | Continue         |

A failed component in any phase **does not block the others**. The orchestrator records the failure in `batch-status.md` and continues processing the remaining components.

## Status Vocabulary

`⏳ plan-pending` → `✅ planned` / `❌ plan-failed`
`🟢 plan-approved` / `❌ blocked-by-dep` / `❌ dep-cycle` / `❌ plan-rejected`
`🛠️ executed` / `❌ execute-failed`
`✅ verified` / `❌ verify-failed`
`🟡 awaiting-dep-merge` → `🚀 pr-opened` / `❌ final-rejected`

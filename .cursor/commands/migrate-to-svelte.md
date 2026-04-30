# Orchestrator — Parallel Migration Pipeline Controller

> Main entry point for component migration. Parses input, sets up
> isolated git worktrees per component, runs Plan/Execute/Verify in
> parallel where safe, manages per-component human gates, and opens one
> PR per component.

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

1. `.cursor/rules/orchestrator-guardrails.mdc`

## Input

- Component name(s): single name or comma-separated list (e.g., `Alert` or `Alert, Card, Checkbox`).

## Output

- One git worktree per component at `.cursor/worktrees/{Name}/`.
- One branch per component: `feat/blade-svelte/{Name}` (based on `origin/master`).
- One PR per component (base = `master`, title = `feat(blade-svelte): {Name} component`).
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

# APFS only: `cp -c` returns non-zero on non-APFS filesystems, so we fall through
# to `yarn install` per worktree (~30–60s each). Stderr is logged, not swallowed.
if cp -cR "$(pwd)/node_modules" "$WT/node_modules" 2>>/tmp/blade-migration-clone.log; then
  [ -d packages/blade/node_modules ]        && cp -cR "$(pwd)/packages/blade/node_modules"        "$WT/packages/blade/node_modules"
  [ -d packages/blade-svelte/node_modules ] && cp -cR "$(pwd)/packages/blade-svelte/node_modules" "$WT/packages/blade-svelte/node_modules"
  [ -d packages/blade-core/node_modules ]   && cp -cR "$(pwd)/packages/blade-core/node_modules"   "$WT/packages/blade-core/node_modules"
else
  # Fallback: non-APFS filesystem (or other clone failure).
  echo "APFS clone failed; see /tmp/blade-migration-clone.log, falling back to yarn install"
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
- Worktree (absolute base): {WorktreeAbs}

ALWAYS use absolute paths prefixed with the worktree. Write artifacts to:
- {WorktreeAbs}/.cursor/artifacts/{Name}/discovery-report.md
- {WorktreeAbs}/.cursor/artifacts/{Name}/migration-plan.md

Follow the steps in your agent definition.
```

`{WorktreeAbs}` = `<main checkout absolute path>/.cursor/worktrees/{Name}`.

After all Plan agents return, verify both artifacts exist at:

- `{WorktreeAbs}/.cursor/artifacts/{Name}/discovery-report.md`
- `{WorktreeAbs}/.cursor/artifacts/{Name}/migration-plan.md`

Update batch-status.md per component:

- On success: `Status = ✅ planned`, fill `Tier` from the discovery report.
- On failure: `Status = ❌ plan-failed`, capture the failure reason in `Notes`.

## Step 1.5: Self-heal misplaced artifacts

If either artifact is missing from `{WorktreeAbs}/.cursor/artifacts/{Name}/`, check the main-checkout fallback at `<MainCheckout>/.cursor/artifacts/{Name}/`. If found there, the agent resolved a relative path against its CWD instead of the worktree — move them in before marking failure:

```bash
mkdir -p {WorktreeAbs}/.cursor/artifacts/{Name}
mv <MainCheckout>/.cursor/artifacts/{Name}/{discovery-report,migration-plan}.md \
   {WorktreeAbs}/.cursor/artifacts/{Name}/ 2>/dev/null
```

If still missing → `❌ plan-failed`. Apply the same fallback to Execute (`patch-request.md`) and Verify (`verification-report.md`, `screenshots/`) outputs.

## Step 2: Dependency Resolution

After all Plans complete, read every successful component's `discovery-report.md` and build the per-component dependency list.

**Dependency workarounds** (deps with workarounds do **not** require migration; skip them when resolving the graph):

| Dependency             | Workaround                                                |
| ---------------------- | --------------------------------------------------------- |
| `Box` / `BaseBox`      | use `<div>` with classes (no migration needed)            |
| `Icons`                | placeholder prop type (`IconComponent = unknown`)         |
| `blade-core` (`~utils/`, `~tokens/`) | already framework-agnostic, import directly |

For each component:

1. Read its dependencies list from the discovery report.
2. For every unmigrated dependency:
   - Matches the workarounds table → skip it.
   - **Also in this batch** → mark this component `🟡 deferred-to-next-batch` (dep name in `Notes`), drop it from the active set, tell the user to re-run it after the dep's PR merges.
   - **Not in this batch, no workaround** → mark `❌ blocked-by-dep` (dep name in `Notes`); tell the user to migrate the dep first.

Remaining components proceed independently.

## Step 3: Plan Gate (per-component, sequential)

For each successfully-planned, non-deferred, non-blocked component:

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
- Worktree (absolute base): {WorktreeAbs}

ALWAYS use absolute paths prefixed with the worktree.
- Migration plan: {WorktreeAbs}/.cursor/artifacts/{Name}/migration-plan.md
- React source: {WorktreeAbs}/packages/blade/src/components/{Name}/

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
- Worktree (absolute base): {WorktreeAbs}
- React Storybook port: {ReactPort}
- Svelte Storybook port: {SveltePort}

ALWAYS use absolute paths prefixed with the worktree.
- Discovery report: {WorktreeAbs}/.cursor/artifacts/{Name}/discovery-report.md
- Write report to: {WorktreeAbs}/.cursor/artifacts/{Name}/verification-report.md

Boot Storybooks on the assigned ports if not already running. Do NOT kill them
when finished — the orchestrator needs them up for the final review gate.
Follow the steps in your agent definition.
```

`{ReactPort}` and `{SveltePort}` come from Step 0.2 (e.g., `9209` / `6207`).

Verify spawns Execute(patch) itself when it finds parity gaps. You only see the terminal status.

Update batch-status.md per component:

- PASS / PASS-WITH-WARNINGS → `Status = ✅ verified`.
- FAIL → `Status = ❌ verify-failed`.

## Step 6: Final Gate + PR (per-component, parallel)

For each verified component:

### 6.1 Final review

Present `verification-report.md` + screenshots to the user. Include the Storybook URL pattern so they can spot-check:

- Svelte: `http://localhost:{SveltePort}/iframe.html?id=components-{name}--{story}`

The Verify agent leaves Storybooks running on the worktree's ports for manual inspection.

On reject: ask the user what to fix. Re-spawn Verify (or Execute → Verify) as appropriate. Max 2 reject cycles, then mark `❌ final-rejected` and continue.

### 6.2 Commit, push, open PR

On approve, run inside the worktree:

```bash
# Generate changeset (bump types follow recent solo-component precedent: patch/patch).
mkdir -p .changeset
cat > .changeset/blade-svelte-{name}-component.md <<'EOF'
---
'@razorpay/blade-core': patch
'@razorpay/blade-svelte': patch
---

feat(blade-svelte): add {Name} component
EOF

# Stage migrated files. Exact paths come from the discovery report's "File Plan" section.
git add packages/blade-svelte/src/components/{Name} \
        packages/blade-core/src/styles/{Name} \
        packages/blade-svelte/src/components/index.ts \
        packages/blade-core/src/styles/index.ts \
        .changeset/blade-svelte-{name}-component.md

# (Add any other modified files surfaced by `git status` that belong to this component.)

git commit -m "feat(blade-svelte): {Name} component"
git push -u origin feat/blade-svelte/{Name}

gh pr create \
  --base master \
  --title "feat(blade-svelte): {Name} component" \
  --body "$(cat <<'EOF'
## Description

Migrates the React {Name} component to Svelte 5.

## Changes

- Adds `packages/blade-svelte/src/components/{Name}/`
- Adds `packages/blade-core/src/styles/{Name}/`
- Re-exports {Name} from `packages/blade-svelte/src/components/index.ts`
- Re-exports CSS from `packages/blade-core/src/styles/index.ts`

## Additional Information

Artifacts (in worktree):

- Discovery report: `.cursor/artifacts/{Name}/discovery-report.md`
- Migration plan: `.cursor/artifacts/{Name}/migration-plan.md`
- Verification report: `.cursor/artifacts/{Name}/verification-report.md`
- Screenshots: `.cursor/artifacts/{Name}/screenshots/`

See the verification report for the full validation summary.

## Component Checklist

- [ ] Update Component Status Page
- [ ] Perform Manual Testing in Other Browsers
- [ ] Add KitchenSink Story
- [ ] Add Interaction Tests (if applicable)
- [x] Add changeset

EOF
)"
```

Capture the PR URL from `gh pr create` output and update batch-status.md `PR` column.

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

A failed component in any phase **does not block the others**. The orchestrator records the failure in `batch-status.md` and continues processing the remaining components.

## Status Vocabulary

`⏳ plan-pending` → `✅ planned` / `❌ plan-failed`
`🟢 plan-approved` / `🟡 deferred-to-next-batch` / `❌ blocked-by-dep` / `❌ dep-cycle` / `❌ plan-rejected`
`🛠️ executed` / `❌ execute-failed`
`✅ verified` / `❌ verify-failed`
`🚀 pr-opened` / `❌ final-rejected`

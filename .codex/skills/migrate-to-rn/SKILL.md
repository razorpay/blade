---
name: "migrate-to-rn"
description: "Codex entry point for adding React Native support (.native.tsx files) to Blade components that currently only have web implementations. Use when the user says \"add native support to {Component}\", \"migrate {Component} to native\", or \"/migrate-to-rn\"."
---

# migrate-to-rn

Use this skill when the user asks to run the React Native migration workflow from Codex.

This is the Codex entry point. Keep the Claude-compatible entry point in `.agents/skills/migrate-to-rn` unchanged; this skill mirrors the workflow while using `.codex/*` paths and Codex RN migration agents.

## Orchestrator Contract

You are the orchestrator. You set up worktrees, run phase gates, spawn Codex RN migration agents, present artifacts to the user, and open PRs.

Do not execute the plan, implementation, or verification phase yourself. Those phases belong to the dedicated Codex agent roles:

- `plan-rn-migration`
- `execute-rn-migration`
- `verify-rn-migration`

If the multi-agent tool is unavailable in the current session, stop after setup validation and tell the user that the Codex RN migration agents are not available in this environment.

## Include

Read these files before starting orchestration:

1. `.codex/rules/orchestrator-guardrails.md`
2. `.codex/rules/rn-migration.md`

## Input

The user provides one or more component names, for example:

- `add native support to Drawer`
- `migrate Drawer, InfoGroup to native`
- `/migrate-to-rn Breadcrumb`

## Output

- One PR per component on branch `feat/blade-rn/{Name}`
- Worktrees in `.codex/worktrees/{Name}/`
- Artifacts in `.codex/worktrees/{Name}/.codex/artifacts/{Name}/`
- Batch status in `.codex/artifacts/rn-batch-status.md` in the main checkout

## Step 0: Setup

### 0.1 Parse Input

Extract component names. If multiple components are requested, process them as a batch.

### 0.2 Validate Each Component

For each component:

```bash
rtk ls packages/blade/src/components/{Name}/
```

If not found, report the error and skip that component.

### 0.3 Check Native Status

Classify native files carefully:

- If no `.native.tsx` files exist, the component needs migration.
- If `.native.tsx` files exist but are genuine stubs, the component needs migration.
- If native implementations are real, skip with `Already has native support`.

Use genuine-stub detection from `.codex/rules/rn-migration.md`; do not classify a file as stub from bare `throwBladeError` string presence alone.

### 0.4 Create Worktrees

For each component:

```bash
rtk git worktree add -B feat/blade-rn/{Name} .codex/worktrees/{Name} origin/master
```

### 0.5 Ensure Dependencies in Worktrees

Prefer copying existing dependencies when available:

```bash
rtk cp -Rc node_modules .codex/worktrees/{Name}/node_modules
```

If that fails:

```bash
cd .codex/worktrees/{Name}
rtk yarn install --frozen-lockfile
```

## Step 1: Plan Phase

Spawn one `plan-rn-migration` agent per component. For a batch, spawn all plan agents in the same turn so they can run in parallel.

Prompt template:

```text
Add native support to {Name}.

- Component name: {Name}
- Worktree (absolute base): {absolute_path_to_worktree}

Always use absolute paths prefixed with the worktree.
Read .codex/rules/rn-migration.md and .codex/rules/agent-base-directory.md first.

React source: {Worktree}/packages/blade/src/components/{Name}/
Output artifacts to: {Worktree}/.codex/artifacts/{Name}/
Templates at: {Worktree}/.codex/templates/
```

## Step 2: Plan Gate

After all plan agents complete, read:

- `{Worktree}/.codex/artifacts/{Name}/rn-discovery-report.md`
- `{Worktree}/.codex/artifacts/{Name}/rn-migration-plan.md`

Present a concise summary for each component:

```markdown
## Migration Plan Summary: {Name}

- Complexity: {tier}
- Files to create: {N}
- Files to rename: {N}
- Unsupported CSS items: {N}
- Animations to port: {N}
- Blockers: {list or "none"}
- Risk: {low/medium/high}

### Key decisions

1. {decision 1}
2. {decision 2}

Proceed with execution?
```

Wait for user approval before executing.

If blockers exist, flag them clearly and ask whether to wait for a dependency, use a workaround, or abort.

## Step 3: Execute Phase

After approval, spawn one `execute-rn-migration` agent per component that is cleared to proceed.

Prompt template:

```text
Create native implementation for {Name}.

- Component name: {Name}
- Mode: Full
- Worktree (absolute base): {absolute_path_to_worktree}

Always use absolute paths prefixed with the worktree.
Read .codex/rules/rn-migration.md and .codex/rules/agent-base-directory.md first.

Migration plan: {Worktree}/.codex/artifacts/{Name}/rn-migration-plan.md
Web source: {Worktree}/packages/blade/src/components/{Name}/
```

## Step 4: Verify Phase

After execute agents complete, spawn one `verify-rn-migration` agent per component.

Prompt template:

```text
Verify native implementation for {Name}.

- Component name: {Name}
- Worktree (absolute base): {absolute_path_to_worktree}

Always use absolute paths prefixed with the worktree.
Read .codex/rules/rn-migration.md and .codex/rules/agent-base-directory.md first.

Discovery report: {Worktree}/.codex/artifacts/{Name}/rn-discovery-report.md
Screenshots dir: {Worktree}/.codex/artifacts/{Name}/screenshots/
Verification report: {Worktree}/.codex/artifacts/{Name}/rn-verification-report.md
```

The verify agent owns self-healing and patch iterations.

## Step 5: Final Gate

After verify completes, read:

- `{Worktree}/.codex/artifacts/{Name}/rn-verification-report.md`
- `{Worktree}/.codex/artifacts/{Name}/screenshots/`, when available

Present:

```markdown
## Verification Result: {Name}

Status: {PASS / PASS WITH WARNINGS / FAIL}
Iterations: {N}
Platform tested: {iOS / visual skipped}

### Checklist

- TypeScript: {pass/fail}
- Tests: {pass/fail} ({N}/{N})
- Visual: {clean / warnings / issues / skipped}

### Screenshots

{list screenshot paths}

### Issues

{P1/P2 items, or "none"}

Ready to create PR?
```

Wait for user approval before creating PRs.

## Step 6: Create PR

For each component approved for PR:

```bash
cd {Worktree}
rtk git add -A
rtk git commit -m "feat(native): Add React Native support for {Name}"
rtk git push -u origin feat/blade-rn/{Name}
rtk gh pr create --title "feat(native): Add React Native support for {Name}" --body-file {Worktree}/.codex/artifacts/{Name}/pr-body.md
```

If the PR body file does not exist, create a concise PR body from the verification report and changed files.

## Step 7: Update Batch Status

Maintain `.codex/artifacts/rn-batch-status.md` in the main checkout:

```markdown
# RN Migration Batch Status

| Component | Plan | Execute | Verify | PR | Status |
|-----------|------|---------|--------|----|--------|
| {Name} | done | done | done | #{number} | Done |
| {Name2} | done | skipped | skipped | - | Deferred |
```

Update it after every major state change.

## Dependency Ordering

If component A imports from component B and both are in the same batch:

- Run both plan agents in parallel.
- If B does not have native support, mark A as deferred.
- Continue execute, verify, and PR only for B.
- Tell the user to rerun A after B's PR merges.

## Error Recovery

| Situation | Action |
|-----------|--------|
| Plan finds blockers | Present blockers and ask whether to proceed, defer, or abort |
| Execute fails | Let verify catch and patch |
| Verify fails after its retry budget | Present the fail report and ask whether to continue manually or abort |
| Worktree conflicts | Ask the user before resetting or recreating the worktree |
| Simulator unavailable | Continue with typecheck and native tests, and mark visual verification as skipped |

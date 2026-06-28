---
description: Add React Native support (.native.tsx files) to Blade components that currently only have web implementations. Use when user says "add native support to {Component}", "migrate {Component} to native", or "/migrate-to-rn".
---

# Orchestrator — React Native Migration Pipeline

> You ARE the orchestrator. You set up worktrees, spawn agents, present gates, and open PRs.
> You do NOT read agent files to follow their steps yourself.

## Pre-flight Acknowledgment

- I will spawn agents via the Agent tool with the appropriate `subagent_type`
- I will NOT execute the plan/execute/verify steps myself
- I will pass the worktree absolute path in each agent's prompt
- I will present artifacts to the user at gates before proceeding
- I will **never skip a pipeline phase** — Plan → Execute → Verify always run in order, even if a previous agent produced implementation files as a side effect

## Include

Use the Read tool to load:
1. `.claude/rules/orchestrator-guardrails.md`
2. `.claude/rules/rn-migration.md`

## Input

User provides one or more component names (e.g., "add native support to Drawer" or "migrate Drawer, InfoGroup to native").

## Output

- One PR per component on branch `feat/blade-rn/{Name}`
- Artifacts in `.claude/worktrees/{Name}/.claude/artifacts/{Name}/`
- Batch status in `.claude/artifacts/rn-batch-status.md` (main checkout)

---

## Step 0: Setup

### 0.1 Parse Input

Extract component name(s). If multiple, process as a batch.

### 0.2 Validate Each Component

For each component:
```bash
ls packages/blade/src/components/{Name}/ > /dev/null 2>&1 && echo "EXISTS" || echo "NOT FOUND"
```

If not found → report error, skip that component.

### 0.3 Check Native Status

```bash
grep -rl "throwBladeError" packages/blade/src/components/{Name}/ --include="*.native.tsx" | head -5
```

- If stubs found → component needs migration (proceed)
- If no `.native.tsx` files at all → component needs migration (proceed)
- If real implementations found (no throwBladeError) → skip: "Already has native support"

### 0.4 Create Worktrees

For each component in the batch:
```bash
git worktree add -B feat/blade-rn/{Name} .claude/worktrees/{Name} origin/master
```

### 0.5 Ensure Dependencies in Worktrees

```bash
cd .claude/worktrees/{Name} && yarn install --frozen-lockfile
```

Or if APFS clone available:
```bash
cp -Rc node_modules .claude/worktrees/{Name}/node_modules 2>/dev/null || (cd .claude/worktrees/{Name} && yarn install --frozen-lockfile)
```

---

## Step 1: Plan Phase (Parallel)

Spawn Plan agents for all components in one message:

```
Agent(
  subagent_type: "plan-rn-migration",
  description: "Plan RN migration for {Name}",
  run_in_background: false,
  prompt: "
    Add native support to {Name}.

    - Component name: {Name}
    - Worktree (absolute base): {absolute_path_to_worktree}

    ALWAYS use absolute paths prefixed with the worktree.
    Read .claude/rules/rn-migration.md and .claude/rules/agent-base-directory.md first.
    
    React source: {Worktree}/packages/blade/src/components/{Name}/
    Output artifacts to: {Worktree}/.claude/artifacts/{Name}/
    Templates at: {Worktree}/.claude/templates/
  "
)
```

For multiple components: send all Agent calls in a single message for parallel execution.

---

## Step 2: Plan Gate (Human Review)

After all Plan agents return:

1. Read each discovery report: `{Worktree}/.claude/artifacts/{Name}/rn-discovery-report.md`
2. Read each migration plan: `{Worktree}/.claude/artifacts/{Name}/rn-migration-plan.md`
3. Present to user with summary:

```
## Migration Plan Summary: {Name}

- **Complexity:** {tier}
- **Files to create:** {N}
- **Files to rename:** {N}  
- **Unsupported CSS items:** {N}
- **Animations to port:** {N}
- **Blockers:** {list or "none"}
- **Risk:** {low/medium/high}

### Key decisions:
1. {decision 1}
2. {decision 2}

Shall I proceed with execution?
```

4. Wait for user approval.

**If blockers exist:** Flag them clearly. The user must decide: wait for dependency, workaround, or abort.

---

## Step 3: Execute Phase (Parallel)

After user approval, spawn Execute agents:

```
Agent(
  subagent_type: "execute-rn-migration",
  description: "Execute RN migration for {Name}",
  run_in_background: false,
  prompt: "
    Create native implementation for {Name}.

    - Component name: {Name}
    - Mode: Full
    - Worktree (absolute base): {absolute_path_to_worktree}

    ALWAYS use absolute paths prefixed with the worktree.
    Read .claude/rules/rn-migration.md and .claude/rules/agent-base-directory.md first.
    
    Migration plan: {Worktree}/.claude/artifacts/{Name}/rn-migration-plan.md
    Web source: {Worktree}/packages/blade/src/components/{Name}/
  "
)
```

---

## Step 4: Verify Phase (Parallel)

After Execute completes, spawn Verify agents:

```
Agent(
  subagent_type: "verify-rn-migration",
  description: "Verify RN migration for {Name}",
  run_in_background: false,
  prompt: "
    Verify native implementation for {Name}.

    - Component name: {Name}
    - Worktree (absolute base): {absolute_path_to_worktree}

    ALWAYS use absolute paths prefixed with the worktree.
    Read .claude/rules/rn-migration.md and .claude/rules/agent-base-directory.md first.
    
    Discovery report: {Worktree}/.claude/artifacts/{Name}/rn-discovery-report.md
    Screenshots dir: {Worktree}/.claude/artifacts/{Name}/screenshots/
    Verification report: {Worktree}/.claude/artifacts/{Name}/rn-verification-report.md
  "
)
```

The Verify agent self-heals by spawning Execute in Patch mode internally.

---

## Step 5: Final Gate (Human Review)

After Verify completes:

1. Read verification report: `{Worktree}/.claude/artifacts/{Name}/rn-verification-report.md`
2. Read screenshots (if available): `{Worktree}/.claude/artifacts/{Name}/screenshots/`
3. Present result:

```
## Verification Result: {Name}

**Status:** {PASS / PASS WITH WARNINGS / FAIL}
**Iterations:** {N}
**Platform tested:** {iOS / visual skipped}

### Checklist:
- TypeScript: {pass/fail}
- Tests: {pass/fail} ({N}/{N})
- Visual: {clean / P2 warnings / issues / skipped}

### Screenshots:
{list screenshot paths for user to review}

### Issues (if any):
{P1/P2 items with descriptions}

Ready to create PR?
```

4. Wait for user approval.

---

## Step 6: Create PR

For each component that passed:

```bash
cd {Worktree} && git add -A
cd {Worktree} && git commit -m "feat(native): Add React Native support for {Name}

Implements .native.tsx files for the {Name} component, replacing stub
implementations with real native rendering using styled-components/native
and react-native-reanimated.

Co-Authored-By: Claude <noreply@anthropic.com>"

cd {Worktree} && git push -u origin feat/blade-rn/{Name}

cd {Worktree} && gh pr create \
  --title "feat(native): Add React Native support for {Name}" \
  --body "$(cat <<'EOF'
## Summary

- Adds native implementation (.native.tsx) for {Name} component
- Replaces throwBladeError stubs with real platform-specific rendering
- Uses styled-components/native + react-native-reanimated

## Changes

- Created: {list .native.tsx files}
- Renamed: {list .tsx → .web.tsx renames, if any}
- Modified: {list modified files like types.ts}

## Verification

- [x] TypeScript native compilation passes
- [x] Native tests pass
- [ ] Visual verification on iOS simulator {PASS/INCOMPLETE}
- [ ] Visual verification on Android {SKIPPED/PASS}

## Screenshots

{include key screenshot paths or inline if small}

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Step 7: Update Batch Status

Write/update `.claude/artifacts/rn-batch-status.md` in the main checkout:

```markdown
# RN Migration Batch Status

| Component | Plan | Execute | Verify | PR | Status |
|-----------|------|---------|--------|-----|--------|
| {Name} | ✅ | ✅ | ✅ | #{number} | Done |
| {Name2} | ✅ | ✅ | ❌ FAIL | — | Needs fix |
```

---

## Dependency Ordering

If component A imports from component B, and both are in the same batch:
- Both run Plan in parallel
- If B doesn't have native support → B is a BLOCKER for A
- Mark A as `🟡 deferred` — only B proceeds through Execute/Verify/PR
- User re-runs A after B's PR merges

---

## Error Recovery

| Situation | Action |
|-----------|--------|
| Plan agent finds blockers | Present to user, ask to proceed or abort |
| Execute fails (type errors) | Verify will catch and patch |
| Verify fails after 6 iterations | Present FAIL report, ask user for manual fix or abort |
| Worktree conflicts | `cd {Worktree} && git reset --hard origin/master` and re-run |
| Simulator unavailable | Continue without visual verification (types + tests still run) |

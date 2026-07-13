---
name: "migrate-to-rn"
description: "Add React Native support (.native.tsx files) to Blade components that currently only have web implementations. Use when user says \"add native support to {Component}\", \"migrate {Component} to native\", or \"/migrate-to-rn\"."
---

# migrate-to-rn

Use this skill when the user asks to run the migrated source command `migrate-to-rn`.

## Command Template

# Orchestrator — React Native Migration Pipeline

> You ARE the orchestrator. You set up worktrees, spawn agents, present gates, and open PRs.
> You do NOT read agent files to follow their steps yourself.

## Pre-flight Acknowledgment

- I will spawn agents via the Agent tool with the appropriate `subagent_type`
- I will NOT execute the plan/execute/verify steps myself
- I will pass the worktree absolute path in each agent's prompt
- I will present artifacts to the user at gates before proceeding
- I will **never skip a pipeline phase** — Plan → Execute → Verify always run in order, even if a previous agent produced implementation files as a side effect
- I will **never commit, push, or create a PR without explicit human approval** at the Final Gate — verification passing is NOT approval; only the user's confirmation is

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

> Don't classify on bare `throwBladeError` — validation-only files (`Tabs`, `Avatar`, `AccordionButton`) are REAL. Use the Plan agent's genuine-stub detection so the gate and Plan phase agree.

```bash
# Genuine stub = small file whose body is essentially just a throwBladeError (no real render tree/hooks).
# Validation-only files that use throwBladeError are large, so a line-count threshold separates them.
grep -rl "throwBladeError" packages/blade/src/components/{Name}/ --include="*.native.tsx" | while read -r f; do
  if [ "$(wc -l < "$f")" -lt 40 ]; then echo "STUB: $f"; else echo "REAL: $f"; fi
done
```

- Any `STUB:`, or no `.native.tsx` at all → needs migration (proceed)
- Mix of `STUB:` and `REAL:` → partial migration (proceed — Plan only creates/replaces the stub/missing files, skips REAL ones)
- All `REAL:` → skip: "Already has native support"

### 0.4 Allocate Slots — Ports, Devices, Sessions

Number the surviving components `1..N` (in input order). Assign per slot:

| Slot `i` | Metro Port | iOS Simulator Device | Session Name |
|----------|-----------|---------------------|-------------|
| 1 | `8081` | iPhone 17 | `rn-{Name1}` |
| 2 | `8082` | iPhone 17 Pro | `rn-{Name2}` |
| 3 | `8083` | iPhone 17 Pro Max | `rn-{Name3}` |
| 4 | `8084` | iPhone 17e | `rn-{Name4}` |
| 5 | `8085` | iPhone Air | `rn-{Name5}` |

Cap at **5 parallel slots** (machine RAM/CPU limit — each booted simulator uses ~2-3 GB). If batch > 5, queue remaining components and process them after the first batch's verify phase completes.

This works because `agent-device` natively supports multi-worktree RN development: each simulator gets its own Metro port written to per-simulator debug server settings on `open`, so bundles don't conflict. See `agent-device help react-native` for details.

### 0.5 Create Worktrees

For each component in the batch:
```bash
git worktree add -B feat/blade-rn/{Name} .claude/worktrees/{Name} origin/master
```

### 0.6 Ensure Dependencies in Worktrees

```bash
cd .claude/worktrees/{Name} && yarn install --frozen-lockfile
```

Or if APFS clone available:
```bash
cp -Rc node_modules .claude/worktrees/{Name}/node_modules 2>/dev/null || (cd .claude/worktrees/{Name} && yarn install --frozen-lockfile)
```

### 0.7 Shared App Build

The Storybook `.app` binary only needs to be built **once** — all worktrees share the same native code; only JS differs (served by each worktree's own Metro). Build from the first slot's worktree:

```bash
cd .claude/worktrees/{Name1}/packages/blade && yarn start:ios
```

This builds, installs, and launches the app on the first simulator (slot 1's device). Run via Bash tool with `run_in_background: true`.

Wait for the build to complete and the app to appear:
```bash
agent-device wait text "COMPONENTS" 60000 --session rn-{Name1}
```

For slots 2..N, the app is already installed on the first simulator. To get it on additional simulators, install the built `.app` artifact:

```bash
# Find the built .app from the Xcode derived data
APP_PATH=$(find ~/Library/Developer/Xcode/DerivedData -name "blade.app" -path "*/Build/Products/Debug-iphonesimulator/*" -maxdepth 5 2>/dev/null | head -1)

# For each additional slot i (2..N):
agent-device open org.reactjs.native.example.blade \
  --platform ios --device "{iOSDevice_i}" \
  --session rn-{Name_i} --metro-port {MetroPort_i} --relaunch
```

If the app isn't found on a secondary simulator, install it explicitly:
```bash
agent-device install org.reactjs.native.example.blade "$APP_PATH" \
  --platform ios --device "{iOSDevice_i}"
agent-device open org.reactjs.native.example.blade \
  --platform ios --device "{iOSDevice_i}" \
  --session rn-{Name_i} --metro-port {MetroPort_i} --relaunch
```

**Note:** Metro is NOT started by the orchestrator — each Verify agent starts its own Metro on the assigned port inside its worktree.

### 0.8 Set Per-Simulator Metro Port (Port Isolation)

> **CRITICAL:** Without this step, reloads on any simulator will fetch the JS bundle from port 8081 (the default), causing cross-contamination between worktrees during parallel visual verification.

After the app is installed on all simulators, write the correct Metro port into each simulator's app preferences using `xcrun simctl spawn`:

```bash
# Slot 1 (port 8081) — default, no override needed

# For slots 2..N:
xcrun simctl spawn "{iOSDevice_2}" defaults write org.reactjs.native.example.blade RCT_jsLocation "localhost:{MetroPort_2}"
xcrun simctl spawn "{iOSDevice_3}" defaults write org.reactjs.native.example.blade RCT_jsLocation "localhost:{MetroPort_3}"
# ... repeat for each additional slot
```

This writes into `NSUserDefaults` for that simulator's app container, so even when the app reloads (shake gesture, error recovery, Fast Refresh reconnect), it fetches from the correct Metro port — not 8081.

**Verify this worked:** Each Verify agent should see its own worktree's component in the Storybook list, not another slot's component.

---

> **⛔ HARD GATE: Steps 0.7 and 0.8 are MANDATORY before spawning Verify agents.**
> Do NOT proceed to Step 4 (Verify Phase) without completing the shared app build and port isolation.
> The app binary (native shell) can be built as early as Step 0 since RN migrations only add `.native.tsx` (JS) files — Metro serves the latest JS dynamically at runtime. Building early lets the ~5min build run in parallel with Plan/Execute, saving wall-clock time.
> Only rebuild after Execute if a new native dependency was added (new pod/native module) — rare for RN migrations.
> TS checks and unit tests can run without the app, but visual verification requires it.
> If the app build is skipped, Verify agents MUST be told `--skip-visual` or visual results are invalid.
> Alternatively, the first Verify agent can build the app if the orchestrator hasn't — but only one agent should build, not all of them.

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

> **Pre-flight check:** Before spawning Verify agents, confirm:
> 1. ✅ Step 0.7 completed (shared app built and installed on all simulators)
> 2. ✅ Step 0.8 completed (`RCT_jsLocation` set per simulator for port isolation)
> If either is missing, complete them NOW before proceeding. Do NOT spawn Verify agents without the app build.

After Execute completes, spawn Verify agents. Each agent gets its own Metro port, simulator device, and session name from the slot allocation (Step 0.4). This allows all verify agents to run truly in parallel without resource conflicts.

```
Agent(
  subagent_type: "verify-rn-migration",
  description: "Verify RN migration for {Name}",
  run_in_background: false,
  prompt: "
    Verify native implementation for {Name}.

    - Component name: {Name}
    - Worktree (absolute base): {absolute_path_to_worktree}
    - Metro port: {MetroPort}
    - iOS device: {iOSDevice}
    - Session name: {SessionName}

    ALWAYS use absolute paths prefixed with the worktree.
    Read .claude/rules/rn-migration.md and .claude/rules/agent-base-directory.md first.
    
    Discovery report: {Worktree}/.claude/artifacts/{Name}/rn-discovery-report.md
    Screenshots dir: {Worktree}/.claude/artifacts/{Name}/screenshots/
    Verification report: {Worktree}/.claude/artifacts/{Name}/rn-verification-report.md

    PARALLEL VERIFICATION: You have a dedicated simulator and Metro port.
    - Start Metro on port {MetroPort} (not 8081 unless that is your assigned port).
    - Use --session {SessionName} on ALL agent-device commands.
    - The app is already installed on your simulator by the orchestrator.
    - Use: agent-device open org.reactjs.native.example.blade --platform ios --device \"{iOSDevice}\" --session {SessionName} --metro-port {MetroPort} --relaunch
    - Do NOT run 'agent-device boot' — the open command boots the simulator.
    - Call agent-device / agent-browser directly (they are installed globally); do NOT prefix with 'npx' (npx re-resolves the package each call and can cause the app to blank/refresh).
  "
)
```

For multiple components: send all Agent calls in **a single message** for true parallel execution. Each agent operates on an isolated simulator + Metro + session combination.

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

> ⛔ **Human approval required.** Do NOT run any command in this step (`git add`, `git commit`, `git push`, `gh pr create`) unless the user explicitly approved at the Final Gate in Step 5. If approval was not given in this conversation, stop and ask. This applies per component — approval for one component does not cover another.

For each component that passed:

```bash
# Stage only the component source — NOT the migration artifacts/screenshots in .claude/artifacts/.
cd {Worktree} && git add packages/blade/src/components/{Name}
# Add any other intentionally-changed source files explicitly (e.g. storybook registration) — never `git add -A`.
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

| # | Component | Metro Port | iOS Device | Session | Plan | Execute | Verify | PR | Status |
|---|-----------|-----------|------------|---------|------|---------|--------|-----|--------|
| 1 | {Name1} | 8081 | iPhone 17 | rn-{Name1} | ✅ | ✅ | ✅ | #{number} | Done |
| 2 | {Name2} | 8082 | iPhone 17 Pro | rn-{Name2} | ✅ | ✅ | ❌ FAIL | — | Needs fix |
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
| Simulator fails to boot for a slot | Try next available device from the pool; if none left, that component's verify runs sequentially after another slot finishes |
| Metro port conflict | Kill the conflicting process (`lsof -ti:{port} | xargs kill`) and retry |
| Shared app build fails | Retry with clean build (Step 0.7); all verify agents are blocked until build succeeds |

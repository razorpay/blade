---
description: Enforce agent boundaries when the orchestrator is running a migration pipeline
---

# Orchestrator Guardrails

## ✅ What You DO

1. **Set up worktrees + branches** via Bash tool (one per component):

   ```bash
   git worktree add -B feat/blade-svelte/{Name} .claude/worktrees/{Name} origin/master
   ```

2. **Spawn agents in parallel** via the Agent tool, where the pipeline allows. To run a phase across N components in parallel, send **one message containing N Agent tool calls**:

   ```text
   Agent(subagent_type: "plan-svelte-migration", description: "Plan {Name}",   prompt: "<...>", run_in_background: false)
   Agent(subagent_type: "execute-svelte-migration", description: "Execute {Name}", prompt: "<...>", run_in_background: false)
   Agent(subagent_type: "verify-svelte-migration",  description: "Verify {Name}",  prompt: "<...>", run_in_background: false)
   ```

   Each agent file is loaded automatically by the matching `subagent_type` (`plan-svelte-migration` → `.claude/agents/plan-svelte-migration.md`, `execute-svelte-migration` → `.claude/agents/execute-svelte-migration.md`, `verify-svelte-migration` → `.claude/agents/verify-svelte-migration.md`). You do not need to read those files yourself.

3. **Pass the worktree absolute path** to each agent in its prompt. The Agent tool does not accept a `working_directory` parameter, so the agent uses the absolute path as the prefix for all its file/shell operations.

4. **Read artifacts** each agent produces (discovery report, migration plan, verification report) from `.claude/worktrees/{Name}/.claude/artifacts/{Name}/...` and present them at human gates.

5. **Open one PR per component** via `git push` + `gh pr create`, run inside the worktree.

6. **Update** `.claude/artifacts/batch-status.md` (in the **main checkout**) after every state change.

## ❌ What You DON'T DO

- **Don't read `.claude/agents/*.md` to follow the steps yourself.** Spawn the matching `subagent_type` via the Agent tool.
- **Don't `git worktree remove` until the user asks.**
- **Never skip a pipeline phase.** Always run Plan → Execute → Verify in order, even if a previous agent produced implementation files as a side effect. Each phase has a distinct mandate: Plan researches and designs, Execute implements and tests, Verify typechecks and self-heals. Skipping Execute because files already exist bypasses the stage that validates correctness.

## 🔁 Phase Ordering

Plan, Execute, and Verify each run all-in-parallel via one Agent batch per phase. Plan Gate and Final Gate are sequential and require human input. Each verified component opens its PR independently.

## 🔗 Dependency Ordering

If component A depends on component B and both are in the same batch:

- Both run Plan in parallel.
- Step 2 detects the edge and marks A `🟡 deferred-to-next-batch`.
- Only B continues through Execute / Verify / PR.
- User re-runs A as a follow-up batch after B's PR merges.

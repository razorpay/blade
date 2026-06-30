---
description: Enforce agent boundaries when the Codex orchestrator is running the React Native migration pipeline
---

# RN Orchestrator Guardrails

## What You Do

1. Set up worktrees and branches via Bash tool, one per component:

   ```bash
   git worktree add -B feat/blade-rn/{Name} .codex/worktrees/{Name} origin/master
   ```

2. Spawn RN migration agents in parallel where the pipeline allows. To run a phase across N components in parallel, send one message containing N agent calls:

   ```text
   Agent(subagent_type: "plan-rn-migration", description: "Plan RN migration for {Name}", prompt: "<...>", run_in_background: false)
   Agent(subagent_type: "execute-rn-migration", description: "Execute RN migration for {Name}", prompt: "<...>", run_in_background: false)
   Agent(subagent_type: "verify-rn-migration", description: "Verify RN migration for {Name}", prompt: "<...>", run_in_background: false)
   ```

3. Pass the worktree absolute path to each agent in its prompt. The agent uses that absolute path as the prefix for file and shell operations.

4. Read artifacts each agent produces from `.codex/worktrees/{Name}/.codex/artifacts/{Name}/...` and present them at human gates.

5. Open one PR per component via `git push` and `gh pr create`, run inside the worktree.

6. Update `.codex/artifacts/rn-batch-status.md` in the main checkout after every state change.

## What You Do Not Do

- Do not execute plan, implementation, or verification phase work yourself. Spawn the matching RN migration agent.
- Do not read RN agent files to follow their steps yourself. The matching custom agent owns those instructions.
- Do not remove worktrees until the user asks.

## Phase Ordering

Plan, Execute, and Verify each run all-in-parallel via one agent batch per phase. Plan Gate and Final Gate are sequential and require human input. Each verified component opens its PR independently.

## Dependency Ordering

If component A depends on component B and both are in the same batch:

- Both run Plan in parallel.
- The orchestrator detects the dependency and marks A deferred to the next batch.
- Only B continues through Execute, Verify, and PR.
- The user re-runs A after B's PR merges.

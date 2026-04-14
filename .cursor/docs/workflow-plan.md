# Svelte Migration Workflow — Architecture

> Automated React-to-Svelte component migration for the Blade design system.

## Overview

The workflow lives entirely in `.cursor/` inside the blade repo (shareable with team). It consists of **4 agents** coordinated by an orchestrator, with 3 artifact templates bridging phases. The Plan agent reads React source in a single pass and produces both the discovery report and migration plan. The Verify agent is a convergent loop that owns all fixes.

```
User types: /migrate-to-svelte → "Alert"
  │
  ▼
┌─────────────────────────────────────────────────┐
│  ORCHESTRATOR (.cursor/agents/orchestrator.md) │
│  1. Validate component exists                     │
│  2. Classify tier (suggest + confirm with user)   │
│  3. Resolve dependencies (up to 3 levels deep)    │
│  4. Start Storybooks (if needed)                  │
│  5. Route to pipeline                             │
└──────────┬──────────────────────┬────────────────┘
           │                      │
     [simple]               [medium/complex]
           │                      │
           ▼                      ▼
   Inline execution      ┌──────────────────┐
   (all 3 phases)        │ PLAN AGENT        │ → discovery-report.md
   No human gates        │ (analyze React +  │   + migration-plan.md
   Basic verify only     │  plan strategy)   │
           │              └────────┬─────────┘
           │                      ▼
           │              🔒 HUMAN GATE: Plan Review
           │                      │
           │                      ▼
           │              ┌──────────────────┐
           │              │ EXECUTE AGENT     │ → creates all files
           │              │ (build component) │   (also: patch mode)
           │              └────────┬─────────┘
           │                      ▼
           │              ┌──────────────────────────────────┐
           │              │ VERIFY AGENT (convergent loop)    │
           │              │  1. Static checks (fix inline)    │
           │              │  2. API parity (→ execute patch)  │
           │              │  3. Visual comparison (screenshots)│
           │              │  4. Two-pass fix (story → CSS)    │
           │              │  5. Human checkpoint (every 2nd)  │
           │              └────────┬─────────────────────────┘
           │                      ▼
           │              🔒 HUMAN GATE: Final Review
           │                      │
           ▼                      ▼
         DONE                   DONE
```

## File Structure

```
.cursor/
├── commands/
│   └── migrate-to-svelte.md       # /migrate-to-svelte slash command
├── agents/
│   ├── orchestrator.md            # Pipeline controller
│   ├── plan.md                    # Phase 1 — analyze React + plan migration (merged Discovery + Research)
│   ├── execute.md                 # Phase 2 — create files (+ patch mode)
│   └── verify.md                  # Phase 3 — verify loop (owns all fixes)
├── templates/
│   ├── discovery-report.md        # Artifact skeleton
│   ├── migration-plan.md          # Artifact skeleton
│   └── verification-report.md     # Artifact skeleton
├── examples/
│   ├── badge-discovery-report.md  # Filled-in example from Badge
│   ├── badge-migration-plan.md    # Filled-in example from Badge
│   └── badge-verification-report.md # Minimal passing example
├── artifacts/                     # Runtime artifacts (gitignored)
│   └── .gitkeep
├── rules/
│   └── svelte-migration.md      # Common react to svelte patterns
└── docs/
    ├── react-to-svelte-agent-architecture.md  # Original inspiration doc
    └── workflow-plan.md                        # This file
```

## Agents

| Agent            | File              | Responsibility                                                                            |
| ---------------- | ----------------- | ----------------------------------------------------------------------------------------- |
| **Orchestrator** | `orchestrator.md` | Tier classification, dependency resolution, routing, Storybook lifecycle                  |
| **Plan**         | `plan.md`         | Read React source + reference Svelte component; produce discovery report + migration plan |
| **Execute**      | `execute.md`      | Create component files; patch mode for API gaps                                           |
| **Verify**       | `verify.md`       | Convergent loop: static checks, API parity, visual comparison, inline fixes               |

## Key Design Decisions

1. Sub-agents for all tiers — Plan + Execute + Verify pipeline with tier-specific gates
2. Artifacts on disk — explicit, debuggable context transfer between phases
3. Layered knowledge — ~50 lines shared rules + agent-specific instructions + runtime reference
4. Templates as separate files — change format once, all migrations use new format
5. Unified verify agent — owns all fixes (static, visual, API parity via execute patch)
6. Two-pass visual fix — story fidelity first (most common root cause), CSS second
7. Tier as suggestion — human confirms before routing
8. Storybook stays running — not killed on completion, available for manual verification
9. Never-revert safety — git stash checkpoints, never delete generated files

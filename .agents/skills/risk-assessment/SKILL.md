---
name: risk-assessment
description: Classifies Pull Requests to razorpay/blade as LOW, MEDIUM, or HIGH risk. Uses blade's package importance hierarchy, per-component tier system, and API surface rules to decide review depth and whether auto-approval is appropriate. Use when reviewing any PR on this repository.
---

# PR Risk Assessment for razorpay/blade

Blade is Razorpay's multi-platform design system (React web + React Native). Changes that touch public component APIs, tokens, or build tooling can silently break consuming apps at scale.

---

## Package Importance Map

| Package | Path | Criticality | Why |
|---|---|---|---|
| `@razorpay/blade` | `packages/blade/` | **CRITICAL** | Core design system consumed by all Razorpay apps |
| `@razorpay/blade-core` | `packages/blade-core/` | **CRITICAL** | Shared tokens, primitives, and type contracts used by blade and blade-svelte |
| `@razorpay/blade-svelte` | `packages/blade-svelte/` | HIGH | Svelte adapter, fewer consumers but still shipped |
| `@razorpay/blade-mcp` | `packages/blade-mcp/` | MEDIUM | MCP server for design tooling; breaking changes affect agent workflows |
| `@razorpay/eslint-plugin-blade` | `packages/eslint-plugin-blade/` | MEDIUM | Lint rules; changes can introduce noisy lint errors in consumer repos |
| `@razorpay/blade-coverage-extension` | `packages/blade-coverage-extension/` | LOW | Internal Figma extension |
| Example apps | `packages/examples/` | LOW | Reference only, not shipped |
| Figma plugins | `packages/plugin-*/`, `packages/widget-*/` | LOW | Internal tooling |
| `@razorpay/razorsharp` | `packages/razorsharp/` | LOW | Internal tooling |

---

## Component Criticality within `packages/blade/src/`

### Tier 1 — Foundation (highest risk)

Changes here can affect every component in the system.

- `src/tokens/` — design tokens (colors, spacing, typography, motion)
- `src/utils/` — shared utilities, hooks, and type helpers
- `BladeProvider` — the root context provider (theming, platform)
- `Box` — layout primitive used by nearly every other component
- Typography (`Text`, `Heading`, `Display`, `Code`) — typographic base

### Tier 2 — Core Interactive Components (high risk)

Widely used across products; API changes have broad blast radius.

`Button`, `ButtonGroup`, `Input`/`TextInput`, `Dropdown`, `AutoComplete`,
`Checkbox`, `Radio`, `Switch`, `Select`, `Modal`, `BottomSheet`,
`Alert`, `Badge`, `Tag`, `Tooltip`, `Popover`, `Card`, `Table`,
`DatePicker`, `Accordion`, `Tabs`

### Tier 3 — Compound / Specialised Components (medium risk)

`Charts`, `Carousel`, `FileUpload`, `OTPInput`, `PasswordInput`,
`PinInput`, `CounterInput`, `ChatInput`, `ProgressBar`, `Stepper`,
`Timeline`, `SpotlightPopover`, `CreationView`, `ConfirmationModal`

### Tier 4 — Display / Decorative (lower risk)

`Avatar`, `Amount`, `Counter`, `Spinner`, `Skeleton`,
`Collapsible`, `Breadcrumb`, `SideNav`, `BottomNav`,
`Chip`, `ActionList`, icon components

---

## Severity Definitions

### LOW Risk

Safe to approve without deep review.

**Criteria — ALL must be true:**
- No public component API changed (no prop additions/removals/renames, no type narrowing)
- No design tokens modified (`src/tokens/`)
- No build tooling or config modified (`jest.config.*`, `tsconfig*.json`, `package.json`, `rollup.config.*`, `babel.config.*`, `metro.config.*`)
- No existing `.github/workflows/` files modified
- No `AGENTS.md`, `CODEOWNERS`, or root `package.json` modified

**Examples:**
- Adding or editing a story (`.stories.tsx`)
- Updating documentation (`docs/`, `*.md`)
- Adding a new example in `packages/examples/`
- Adding a new icon (additive, no existing icon changed)
- Adding a new Tier 3/4 component with no changes to existing components
- New `.github/workflows/` file (additive CI job)

### MEDIUM Risk

Requires focused review on the changed area.

**Criteria — ANY of the following:**
- Modifying an existing Tier 2 or Tier 3 component's implementation without changing its public props/types (internal refactor, bug fix)
- Adding a new optional prop to a Tier 2 component (backwards-compatible)
- Modifying `packages/blade-mcp/` or `packages/eslint-plugin-blade/`
- Modifying existing `.github/workflows/` files
- Changing `packages/blade/package.json` dependencies (non-peer)
- Modifying codemods (`packages/blade/codemods/`)
- Changes to `packages/blade-svelte/` that don't touch token contracts

### HIGH Risk

Requires thorough review; potential breaking change.

**Criteria — ANY of the following:**
- Modifying `packages/blade/src/tokens/` — any token rename, removal, or value change
- Modifying `packages/blade-core/` — shared type contracts
- Removing or renaming a prop on any exported component
- Changing a prop's type to be more restrictive
- Renaming or removing any exported component or utility
- Modifying `BladeProvider`, `Box`, or Tier 1 foundation utilities
- Changing peer dependency versions in any critical package
- Modifying `tsconfig*.json` or build config that affects emitted output
- Modifying `AGENTS.md`, `CODEOWNERS`, or release scripts

---

## File Path Risk Map

| Path Pattern | Default Risk |
|---|---|
| `packages/blade/src/tokens/**` | HIGH |
| `packages/blade-core/**` | HIGH |
| `packages/blade/src/utils/**` | MEDIUM–HIGH |
| `packages/blade/src/components/<Tier1>/**` | HIGH |
| `packages/blade/src/components/<Tier2>/**` | MEDIUM–HIGH |
| `packages/blade/src/components/<Tier3-4>/**` | LOW–MEDIUM |
| `packages/blade/src/components/Icons/**` | LOW |
| `packages/blade-svelte/**` | MEDIUM |
| `packages/blade-mcp/**` | MEDIUM |
| `packages/eslint-plugin-blade/**` | MEDIUM |
| `packages/blade/codemods/**` | MEDIUM |
| `packages/examples/**` | LOW |
| `packages/plugin-*/`, `packages/widget-*/` | LOW |
| `packages/blade/**/*.stories.tsx` | LOW |
| `**/*.md`, `**/docs/**` | LOW |
| `.github/workflows/` (new file) | LOW |
| `.github/workflows/` (existing edit) | MEDIUM |
| `AGENTS.md`, `CODEOWNERS` | HIGH |

---

## Auto-Approval Policy

Set `auto_approve: true` only when ALL hold:

1. Overall severity is LOW.
2. No files under `packages/blade/src/tokens/` modified.
3. No files under `packages/blade-core/` modified.
4. No existing component's exported props or types modified.
5. No existing `.github/workflows/` files modified.
6. No `AGENTS.md`, `CODEOWNERS`, or root config files modified.
7. No existing files deleted.

If uncertain about any condition, set `auto_approve: false`.

---

## Review Actions by Severity

| Severity | Action |
|---|---|
| LOW | Approve (or auto-approve if policy passes) with a brief confirmation comment |
| MEDIUM | Leave a targeted review comment on the changed component; request changes if API surface is unclear |
| HIGH | Request changes; flag the specific breaking concern and suggest a migration path |

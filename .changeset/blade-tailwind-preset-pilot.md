---
'@razorpay/blade-core': minor
'@razorpay/blade-svelte': patch
---

feat(blade-core): Tailwind preset infrastructure + Badge/Button pilot (CSS Modules → Tailwind)

Foundation for migrating blade-svelte/blade-core styling from CSS Modules to Tailwind v3 (CVA
retained), plus the gated pilot (Badge + Button).

blade-core (new, additive):

- `@razorpay/blade-core/tailwind/preset` — a standard Tailwind v3 preset, generated from the same
  token sources as `theme.css` (so they can never drift; guarded by a CI drift test). `preflight:
  false`, `theme.extend`-only, namespaced spacing (`p-spacing-4`) and semantic color keys so Blade
  utilities never collide with a consumer's default scale. Every utility resolves to a `var(--…)`,
  preserving runtime dark/brand theming.
- `@razorpay/blade-core/tailwind/safelist` — runtime-composed classes (styled-props, dynamic colors)
  a JIT scanner would miss; re-exported by the preset.
- `cn` / `twMerge` exported from `@razorpay/blade-core/utils` for conflict-free, last-wins class
  overrides on Blade's custom groups.
- Badge and Button migrated to Tailwind (CSS modules removed). Button's hard cases (accent var
  bundles, radial-highlight `::before`, box-shadow/focus stacks, loaders, keyframes) are emitted by a
  Blade-owned Tailwind plugin bundled in the preset. Public `get*Classes()` signatures are unchanged.

blade-svelte: Storybook/dev now builds Blade's Tailwind layer via the standard preset + content-scan
integration (no runtime API change).

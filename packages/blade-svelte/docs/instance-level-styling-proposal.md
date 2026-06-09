# Instance-Level Styling for Blade Svelte — Design Proposal

> **Status:** Draft / RFC
> **Author:** Staff Frontend (Blade)
> **Scope:** `@razorpay/blade-svelte` + `@razorpay/blade-core`
> **Purpose:** **Adoption-readiness / API-fit review.** Checkout V2 just shipped a deep merchant-configurability layer (Config V2, PR [checkout#11286](https://github.com/razorpay/checkout/pull/11286)) but **does not consume Blade Svelte yet** — it styles its own components. This doc evaluates the architectural/API changes Blade Svelte needs so checkout can drop those bespoke components and adopt Blade *without losing the merchant-config surface*.
> **Related:** `docs/theming-and-classnames.md`, `checkout/app/v2/docs/CONFIG_V2_SPEC.md`, `checkout/app/v2/utils/config-driver/*`

> **📦 Reference implementations (all 5 options are now buildable & inspectable).** To make this RFC concrete, every option A–E has a working spike landed in the codebase so the team can compare them side-by-side in Storybook (especially hover/disabled behaviour) rather than from prose alone. **These are evaluation spikes, not a final API commitment** — the recommendation (B core + C complementary) is unchanged.
>
> | Option | `blade-core` (framework-agnostic) | `blade-svelte` wiring |
> |---|---|---|
> | **A** — visual styled props | `utils/colorOverrides/visualStyledProps.ts` (`resolveVisualStyledProps`) | `Button` prop `visualProps` |
> | **B** — `styleOverrides` → CSS vars (**recommended**) | `styles/Button/buttonOverrides.ts` (`resolveButtonOverrides`), `styles/Card/cardOverrides.ts` (`resolveCardOverrides`, parts), `utils/colorOverrides/deriveColorStates.ts` (state synthesis) | `Button`/`Card` prop `styleOverrides`; CSS seams added to `button.module.css` (`--btn-content-color`, `--btn-radius`) and `card.module.css` (`--card-surface-bg`, `--card-surface-border-color`) |
> | **C** — scoped provider | `styles/themeScope/themeScope.ts` (`flattenThemeOverridesToVars`) | `BladeProvider.svelte` (`themeOverrides`) |
> | **D** — slot-keyed map | `styles/slotTheme/slotTheme.ts` (`resolveSlotTheme`) | `BladeProvider` (`slotTheme`) + `Button` prop `themeKey` |
> | **E** — `className` | — | `Button` prop `className` |
>
> **See it:** Storybook → *Patterns / Instance-Level Styling* (`src/components/Button/StyleOverrides.stories.svelte`). The “A vs B · hover & disabled” story is the money shot — A dead-ends states, B derives them. Everything is additive/backward-compatible (`svelte-check` + `blade-core` typecheck green; unspecified instances render pixel-identical via `var(--x, <default>)`).

---

## 1. Problem statement

Blade theming is **global or color-scheme scoped**. Tokens are flat CSS custom properties on `:root` (and re-declared under `body[data-theme='dark']`). White-labelling (`createTheme`) regenerates that **one** global palette from a single brand color. (Note: blade-svelte has **no `BladeProvider`/ThemeProvider component at all** — theming is the `theme.css` import + `data-theme` attribute; `createTheme` injects vars into `:root` via JS. Verified in `docs/theming-and-classnames.md`.)

Checkout's Config V2 needs **instance-level** customization. On a single Contact page there can be two `Button`s that must look different *at the same time*:

| Instance | border radius | background |
|----------|---------------|------------|
| Primary CTA | `24px` | blue |
| Secondary CTA | `8px` | white |

Traditional DS theming only expresses `theme.button.primary` / `theme.button.secondary` — a **type-level** axis, not an **instance-level** one.

The merchant config expresses CTA intent today as **surface-scoped** paths (per *screen*, not per sibling instance), and they **inherit from the global theme** when unset:

```ts
// checkout/app/v2/utils/config-driver/paths.ts
CONTACT_CTA_BG:        'surface.contact.cta.primary.background',
CONTACT_CTA_TEXT_COLOR:'surface.contact.cta.primary.text_color',
```

```ts
// checkout/app/v2/utils/config-driver/resolver.ts — applyHierarchyInheritance()
// surface.contact.cta.primary.background ← global.theme.cta.primary.background (when empty)
```

So even today the config axis is **surface/type-level**: there is no path by which two sibling CTAs on the *same* screen can differ. That gap — true per-instance precision — is precisely what a Blade API must add. And on the Blade side there is currently **no API to receive even the surface-level value**: `StyledPropsBlade` deliberately excludes color/background/border-radius (verified — it lists only margin/layout/flex/position/grid), components expose no `className`/`style`, and the only override knob (`:root` variables) repaints every instance on the page.

### Goals
- G1. Per-instance override of a **bounded, growable** set of visual properties (start: bg + text color; later: border color, radius, and **internal parts** of composite components — see §4.5).
- G2. Two instances of the same component, same page, styled differently.
- G3. Preserve interaction states (hover/focus/disabled), WCAG behavior, and the class-first token architecture.
- G4. Clean mapping from Checkout `config-driver` output → Blade overrides, so adoption is a near drop-in swap.
- G5. Zero / opt-in change for existing Blade consumers (`blade-core` must stay framework-agnostic so React can adopt the same resolver later).

### Non-goals
- Arbitrary free-form CSS injection by merchants (security/brand risk).
- Re-theming via per-instance `createTheme` (palette regeneration is global + expensive).
- Changing the global token names or the `data-theme` mechanism.
- **Dark-mode-aware overrides for the checkout use case.** Checkout runs a single color scheme per session and de-scopes dark mode for merchant overrides; v1 state derivation (Option B, §4) is scheme-agnostic by design. Dark-mode-aware *parts* remain a concern for general Blade adoption (composite components like Card already ship `body[data-theme='dark']` part rules) but are explicitly out of scope for v1.

---

## 1.1 Current state in checkout (the anti-pattern this replaces)

Checkout already solves per-component merchant styling — with the **flat inline-`style` approach this doc calls Option A** (§4). Two shipped examples:

**Contact CTA** reads the config color and writes it straight onto `background`/`color`:

```svelte
<!-- checkout/app/v2/modules/contact/components/Contact.svelte -->
const ctaBg$ = useUIConfigColor(CONFIG_PATHS.CONTACT_CTA_BG);
const ctaTextColor$ = useUIConfigColor(CONFIG_PATHS.CONTACT_CTA_TEXT_COLOR);
...
<Button style={`${$ctaBg$ ? `background: ${$ctaBg$};` : ''}${$ctaTextColor$ ? ` color: ${$ctaTextColor$};` : ''}`}>
```

**NotificationBanner** does the same for bg/text and adds `fontSize`/`fontWeight`:

```svelte
<!-- checkout/app/v2/modules/common/notification-banner/NotificationBanner.svelte -->
<div style={`...; ${backgroundColor ? `background-color:${backgroundColor};` : ''}`}>
  <div style={`${textColor ? `color:${textColor};` : ''}${fontSizeStyle}`}>
```

This is **direct evidence for why Option A is insufficient**, not a hypothetical:
- Writing `background` directly **dead-ends interaction states** — the overridden CTA loses its `:hover`/`:active`/`disabled` background (those came from Tailwind/token classes the inline color now shadows). An overridden button is visually *more* broken than an unstyled one.
- The Config V2 spec itself documents this as the generic component-level mechanism (`CONFIG_V2_SPEC.md` §4.2: "read → props → inline-style/class"). So adopting Blade naïvely (passing these same values to a `style` prop) would **carry the bug across**.

The job of this proposal is therefore not "give Blade a color knob" — it's "give Blade a knob that feeds the **state-driving** variables so adoption is an *improvement* over the status quo, not a regression."

---

## 2. Key architectural facts (grounding)

These constrain every option below (verified in code):

1. **Class-first, value-second.** Components emit *class names* + *token strings*; CSS Modules reference `var(--token)`. Components never emit raw colors. (`blade-core/styles/Button/button.ts`, `button.module.css`)
2. **CSS variables already cascade per element.** The Button CSS module is *already* parameterized by **element-scoped** custom properties:
   ```css
   .color-primary { --btn-accent-bg-default: var(--interactive-background-primary-default); }
   .color-primary.primary { background-color: var(--btn-accent-bg-default); }
   ```
   Setting `--btn-accent-bg-default` inline on one `<button>` overrides only that instance — the seam already exists.
3. **Token→variable mapping util exists.** `getTokenCSSVariable('interactive.background.primary.default')` → `'var(--interactive-background-primary-default)'`. (`utils/tokenToCSSVariable`)
4. **Arbitrary-value precedent exists.** Styled props already fall back from tokens (`spacing.4`) to raw values (`12px`) via `getSpacingValue`. We *can* mirror this for visual props later, but **v1's vocabulary is narrower than the precedent** — see fact #6: checkout only ever emits a 6-digit hex or `''`, so v1 treats the value as an **opaque string passthrough** and defers token resolution.
5. **Svelte has no theming context/provider.** `setContext`/`getContext` is used only for compound-component state (Chip/Tooltip); there is no theming provider component (see §1).
6. **The consumer's output contract is narrow and known.** `getUIConfigColor` returns **only** a 6-digit hex (`^#[0-9A-Fa-f]{6}$`) or `''` — no 3-digit hex, `rgb()`, or named colors. Config text is sanitized; resolution is a 6-step precedence pipeline. This **bounds v1's job**: accept one opaque base color per slot and *derive* the rest. Bundle budget: `v2-entry-app` +1KB max, lazy-load. No `<style>` blocks in SFCs.
7. **Composite components have no single override seam.** Button was already refactored to read element-scoped `--btn-accent-*` vars — which is *why* Option B looks cheap there. Other components have **not**: e.g. `Card`'s visible surface lives on a *child* (`.cardSurface`), its background is a **hardcoded `linear-gradient` of raw `hsla()`** (not a `var()`), and its border is a layered `inset box-shadow` (not `border-color`). So "override the card background/border" is impossible until those properties are first re-expressed as variables. This is the real, per-component cost — see §4.5 and §7.

---

## 3. Design axes

Any solution must answer five questions:

- **A. Carrier** — how does an override value reach the element? (inline CSS var / class / context / attribute)
- **B. API shape** — how does the developer/merchant express it? (per-instance prop / theme map keyed by slot / styled-prop extension)
- **C. Vocabulary** — what can be overridden, and with what values? (semantic tokens only / tokens + arbitrary / opaque passthrough / freeform)
- **D. Scope** — instance / subtree / page.
- **E. Surface** — top-level visual props only, or **named internal parts** of composite components? (This axis is what "configure something internal" — e.g. an Input's field vs. label vs. placeholder — forces; see §4.5.)

The options below are concrete combinations of these axes. **v1 decision (locked):** Carrier = inline element-scoped CSS vars (B); Vocabulary = opaque hex passthrough with derived states (C); Surface grows from top-level props → named parts (E).

---

## 4. Options evaluated

### Option A — Extend styled props with visual props (inline-style fallback)

Add `backgroundColor`, `color`, `borderColor`, `borderRadius`, etc. to `StyledPropsBlade`. They resolve like spacing: token → utility class where possible, arbitrary → inline style. Components already call `getStyledPropsClasses(rest)`, so the plumbing is partly there.

```svelte
<Button backgroundColor="#1a59ff" borderRadius="24px">Pay</Button>
```

**Pros**
- Smallest conceptual surface; reuses the existing styled-props pipeline and the token/arbitrary duality.
- Naturally per-instance; two buttons differ trivially.
- Framework-agnostic (logic stays in `blade-core`).

**Cons**
- **Semantically wrong for stateful components — and we have shipped proof.** A Button's background isn't one value — it's `default/hover/focus/disabled` (+ gradient + box-shadow). A flat `backgroundColor` can't express hover/disabled, so overridden buttons lose interaction states. This is **exactly the bug in checkout's Contact CTA and NotificationBanner today** (§1.1); adopting Blade via this path would import the regression rather than fix it.
- Note the *only* real difference between A and B (under v1's hex-passthrough vocabulary) is **plumbing, not vocabulary**: both take a hex string. A writes it to `background-color` directly (dead-ends state); B writes it into the state-driving custom prop (`--btn-accent-bg-default`) so `:hover`/`disabled` keep resolving. That single distinction is the whole argument for B.
- Encourages "anything goes" inline styling → erodes design-system guardrails; hard to lint/govern.
- Explodes the styled-prop matrix (every visual prop × responsive × component) and **can't address internal parts** (axis E) — a flat top-level prop has no way to target an Input's placeholder vs. its field.

**Scalability:** Poor for stateful components; OK for static ones. **Backward-compat:** Additive (✓). **Blade impact:** Medium — pollutes the styled-props contract.

---

### Option B — Per-component `styleOverrides` prop → element-scoped CSS variables (**recommended core**)

Each component accepts a typed, **bounded** `styleOverrides` object. The component maps it to its **own** CSS-module custom properties and emits them as an inline `style="--…: …"` on the right element. CSS already consumes those variables, so **state variants keep working** (hover/disabled read the same `--btn-accent-*` vars).

```svelte
<Button
  variant="primary"
  styleOverrides={{
    backgroundColor: '#1a59ff', // opaque hex from getUIConfigColor — v1 vocabulary
    textColor: '#ffffff',       // opaque hex
  }}
/>
```

**v1 vocabulary = opaque hex passthrough + derived states.** Checkout only ever sends one base hex per slot (fact #6), so the resolver's *primary* job is to **synthesize the interaction states** the merchant didn't provide:

```ts
// resolveButtonOverrides({ backgroundColor: '#1a59ff', textColor: '#ffffff' })
//   -> Record<cssVarName, value>
{
  '--btn-accent-bg-default':     '#1a59ff',
  '--btn-accent-bg-highlighted': '<derive: darken(#1a59ff)>',  // hover/active/focus
  '--btn-accent-bg-disabled':    '<derive: alpha(#1a59ff)>',
  '--btn-content-color':         '#ffffff',
}
```

This makes B a **strict improvement over the shipped Option A** (§1.1): same input (one hex), but hover/disabled now work instead of breaking. State derivation is therefore the **centerpiece of v1**, not a "nice to have" — `tinycolor` is already a dependency (via `createTheme`) for the darken/alpha math, and the derived steps should visually match Blade's existing `highlighted`/`disabled` token offsets.

**Reactivity is a hard requirement.** `useUIConfigColor` returns a live `Readable<T>` so the Studio editor repaints on change (`CONFIG_V2_SPEC.md` §3.5). Inline CSS vars satisfy this trivially (re-spread the `style` map on change); a class-based carrier would not. This is an additional reason the carrier must be inline vars.

*(Tokens and explicit per-state overrides — e.g. accepting `backgroundColorHovered` or `'surface.text…'` token strings — are a later-phase extension of the same resolver, not v1. See §11.)*

**Pros**
- **Preserves the architecture**: still class-first; overrides are just *scoped variable values* layered over the cascade.
- **State-aware** by design — the same custom props drive default/hover/focus/disabled, and v1 *derives* the states checkout omits.
- **Reactive-friendly** — inline vars update cleanly when the config `Readable` changes (editor live-edit).
- True per-instance; no `:root` pollution.
- `blade-core` stays framework-agnostic (pure resolver fn); Svelte just spreads the `style` map. React can adopt the same resolver later.
- Tree-shake safe — values are inline styles, not classes, so nothing to shake.

**Cons**
- **Per-component CSS-seam refactor — and its cost is non-uniform.** Button is cheap *only because it was already refactored* to read `--btn-accent-*`. Composite components (Card, future Input) need their target properties re-expressed as variables first; for box-shadow borders and gradient backgrounds that is a real DS-owned change, not a one-liner (fact #7, §4.5, §7).
- Needs a typed contract per component (and, for composites, a **parts** contract — §4.5).
- Requires discipline so `styleOverrides` doesn't become a freeform `style` escape hatch (mitigate: typed keys only, no `& CSSProperties`).

**Scalability:** Good as a *pattern*, but per-component effort scales with how variable-ized the component already is. **Backward-compat:** Fully additive; defaulted variables (`var(--x, <current default>)`) preserve current pixels (✓✓). **Blade impact:** Low for Button; Medium for composites that need seam work.

---

### Option C — Scoped theme via `BladeProvider` + Svelte context (subtree override)

Implement a real `BladeProvider.svelte` that takes a partial token override and **re-declares the affected CSS variables on its own wrapper element** (not `:root`), establishing a scoped cascade. Optionally exposes overrides via Svelte context for components that need JS-level values.

```svelte
<BladeProvider themeOverrides={{ interactive: { background: { primary: { default: '#1a59ff' }}}}}>
  <Button>Pay</Button>   <!-- every primary button in here is blue -->
</BladeProvider>
```

**Pros**
- Solves *subtree* theming elegantly (e.g. "make this whole drawer use the festive palette").
- Reuses `overrideTheme` deep-merge + `tokenToCSSVariable`; conceptually clean.
- No per-component schema; works for all components at once.
- Finally gives Svelte the provider parity React has.

**Cons**
- **Doesn't solve the core ask alone.** Two *sibling* buttons differing on the same page would each need their own provider wrapper → awkward, extra DOM, and still type-level (`primary` vs `secondary`), not instance-level.
- Overriding semantic tokens at subtree scope is **coarse**: changing `interactive.background.primary.default` recolors *all* primary interactives in scope (buttons, links, etc.), not just the CTA.
- Risk of deep nesting / cascade reasoning complexity.

**Scalability:** Great for *regions/brand*, weak for *sibling instances*. **Backward-compat:** Additive (✓). **Blade impact:** Medium — new component + provider semantics, but no breaking change.

> Conclusion: C is **complementary** to B, not a substitute. Use C for surface/region theming, B for instance precision.

---

### Option D — Slot-keyed theme map (component "parts" theming, à la shadcn/Stitches)

A single theme object keyed by component → slot → state, consumed via context. Components look up their slot.

```ts
{ button: { primaryCta: { bg: '#1a59ff', radius: '24px' },
            secondaryCta:{ bg: '#fff',     radius: '8px' } } }
```

Component opts into a slot: `<Button themeKey="primaryCta" />`.

**Pros**
- Centralizes all overrides in one declarative object — close to how `config-driver` already thinks (path → value).
- Designers/merchants reason about "slots", not props.

**Cons**
- Introduces a **new naming dimension** (slot keys) that must be invented, documented, and kept in sync across Blade + checkout. High coordination cost.
- Indirection: the override lives far from the usage; harder to trace.
- Still needs the *carrier* of Option B underneath (something must set the element vars). It's a sugar layer, not a mechanism.
- Over-engineered for the current need (a handful of CTAs).

**Scalability:** Good *if* an org commits to a slot taxonomy; otherwise sprawl. **Backward-compat:** Additive (✓). **Blade impact:** High — new cross-repo contract.

> **Revised conclusion (see §4.5):** D's *global slot map* is over-engineered, but D's underlying instinct — **a named-parts dimension** — is **required** the moment overrides go beyond a top-level color (e.g. an Input's field vs. label vs. placeholder). We therefore **fold a *bounded, per-component* parts vocabulary into Option B** rather than reject D outright. We reject D's *centralized cross-repo slot taxonomy*; we keep its *parts addressing*, expressed locally as nested `styleOverrides` keys.

---

### Option E — `className` / `class` passthrough (let consumer style it)

Expose `className`; consumer ships CSS (Tailwind/util classes) to override.

**Pros**
- Trivial to add; CVA's `getButtonClasses` already accepts `className`.
- Infinitely flexible.

**Cons**
- **Specificity wars** with CSS-module rules + box-shadow-based borders; merchant overrides will silently lose or require `!important`.
- **Banned on checkout**: V2 forbids `<style>` blocks / arbitrary CSS in SFCs; merchant config is data (hex strings), not classes. Doesn't map to `config-driver` at all.
- Escapes the DS entirely → no governance, no dark-mode awareness, no tokens.

**Scalability:** Poor (governance + specificity). **Backward-compat:** Additive (✓). **Blade impact:** Low to add, High to regret.

---

### 4.5 Extending B to internal parts (the "configure something internal" case)

Button is the *easy* case: one element, one set of already-variable-ized accent props. The harder — and explicitly in-scope-for-the-future — case is **configuring an internal part of a composite component**, e.g. an Input where a merchant wants to set the *field* background, the *border* color, and the *placeholder* color independently. (Note: blade-svelte has **no `Input` component yet** — when it lands, this is the contract it should be built to.)

A flat top-level `styleOverrides={{ backgroundColor }}` cannot express this — "which background, the field or the wrapper?" So **Option B's object must support named parts** (design axis E):

```svelte
<!-- Future Input -->
<Input styleOverrides={{
  field:       { backgroundColor: '#fff', borderColor: '#1a59ff' },
  label:       { color: '#111' },
  placeholder: { color: '#888' },
}} />

<!-- Card -->
<Card styleOverrides={{
  surface: { backgroundColor: '#fff' },   // targets .cardSurface (a CHILD), not root
}} />
```

The **carrier is unchanged** — the resolver still returns `Record<cssVarName, value>` and the values are emitted as inline CSS vars — but they must land on (or cascade to) the **correct part element**, and each part exposes only a **bounded, typed** set of keys. This is the bounded slice of Option D we keep.

#### The hidden precondition: a per-component "seam audit"

Before any part can be overridden, that part's target property must be **expressed as a CSS variable on the right element**. Most components fail this today. Concrete audit of `Card` (`blade-core/src/styles/Card/card.module.css`):

| Want to override | Reality in code | Seam work required |
|---|---|---|
| Card background | `.cardSurface` uses a **hardcoded `linear-gradient` of raw `hsla()`** (comment: raw palette colors that "don't exist as CSS custom properties") | Re-express gradient stops as `var(--card-surface-bg-*, <default>)`; non-trivial |
| Card border color | Drawn via layered `inset box-shadow`, **not** `border-color` | Re-architect the box-shadow into per-channel color vars (like Button's `--btn-accent-border-*`) |
| Target element | The styled element is `.cardSurface`, a **child** of `.cardRoot` | Override vars must be set on / inherited to the child, not the root |

So the **unit of work per overridable property** is:
1. ensure it's `var(--part-prop, <current default>)` on the correct part element (additive, backward-compat);
2. map the override into that var in `resolve<Component>Overrides`;
3. for **box-shadow borders / gradient backgrounds**, first re-architect the shadow/gradient into per-channel vars (the invasive step Button already paid).

`--btn-radius` (§7) is the *simplest possible instance* of step 1. Card's background/border is the *expensive* instance (step 3). **This is the real adoption gradient** and the §5 matrix's "implementation cost" must be read per-component, not globally.

**Extensibility contract (commitment):** growth = for each new overridable property, add (a) one typed key to that component/part's override type, and (b) if not already a variable, one `var(--x, <default>)` seam in its CSS module. `blade-core` exposes one pure `resolve<Component>Overrides(overrides) → Record<cssVar,value>` per component; Svelte/React just spread the result.

#### How each option addresses internal parts (axis E)

Line 136 (Option A's con) is "a flat top-level prop has no way to target an Input's placeholder vs. its field." Addressing a part needs two independent things: an **addressing** mechanism (the API can *name* the part) and a **carrier + seam** (the named value reaches the right sub-element, which must expose the property as a CSS variable — the seam audit above). The options differ only on the *addressing* half; the carrier/seam half is shared.

| Option | How it names a part | Verdict for parts |
|---|---|---|
| **A** — visual styled props | Cannot. A flat top-level `backgroundColor` can't say *which* background (field vs. wrapper). | ✗ — this is the line-136 gap itself. |
| **B** — `styleOverrides` (chosen) | **Nested keys**: the part is a key in the per-component object (`field`/`label`/`placeholder`/`surface`), each exposing a bounded, typed set; `resolve<Component>Overrides` emits each part's vars onto/cascading to the correct sub-element. | ✓ — local, bounded, typed. The "bounded slice of D we keep." |
| **C** — scoped provider | By **semantic token** on a subtree wrapper, not by part. Overriding `interactive.background.primary.default` recolors *all* primary interactives in scope; it can't isolate one part if siblings resolve from the same token. | ~ — coarse; only works if a part maps 1:1 to an otherwise-unused token. |
| **D** — slot-keyed map | The **slot key** *is* the part dimension (`<Input themeKey="field">`), looked up via context. Works, but invents a new naming dimension that must be documented and synced across Blade + checkout, and still needs B's carrier underneath ("sugar layer, not a mechanism"). | ~ — reject the centralized taxonomy; keep the parts-addressing instinct, folded into B as nested keys. |
| **E** — `className` | Per-part **class hooks** (`.input-field`, `.input-placeholder`) the consumer styles with their own CSS / `::placeholder`. | ✗ — specificity wars vs. CSS-module + box-shadow rules; banned in checkout SFCs; escapes DS governance/tokens. |

**The shared half (option-independent):** whichever option *names* the part, the value still has to land on a sub-element that exposes the property as a variable — the per-component seam audit. Card's `surface` is a *child* of root, and its gradient/box-shadow must first be re-expressed as per-channel vars (table above). No option escapes this: D reaches it via B's carrier, E via class hooks fighting specificity. **Addressing is necessary but not sufficient; the seam audit is the real enabling cost.**

> Net: **B is the parts mechanism** (nested keys). D is the only other true parts mechanism, and B absorbs its good half locally without the cross-repo taxonomy. C is too coarse to isolate a single part; E is ungovernable and checkout-banned.

---

## 5. Comparison matrix

| Criterion | A: Visual styled props | **B: styleOverrides → CSS vars** | C: Scoped provider | D: Slot-keyed map | E: className |
|---|---|---|---|---|---|
| Solves sibling instances (same page) | ✓ | ✓✓ | ✗ (needs wrapper each) | ✓ | ✓ |
| Preserves interaction states (hover/disabled) | ✗ (proven broken in checkout §1.1) | ✓✓ (derives states) | ✓ | ✓ | ~ |
| Addresses **internal parts** (axis E) | ✗ | ✓ (via nested keys, §4.5) | ~ (coarse, subtree only) | ✓✓ | ~ (specificity) |
| Reactive to live editor edits | ✓ | ✓✓ (inline vars) | ✓ | ✓ | ~ |
| Keeps class-first architecture | ~ | ✓✓ | ✓✓ | ✓ | ✗ |
| Matches consumer vocabulary (opaque hex) | ✓ | ✓✓ | ~ (token-shaped) | ✓ | ✗ |
| `blade-core` stays framework-agnostic | ✓ | ✓ | ✓ | ✓ | ✓ |
| Maps cleanly to Config V2 output | ~ | ✓✓ | ~ | ✓ | ✗ |
| Backward compatible | ✓ | ✓✓ | ✓ | ✓ | ✓ |
| Bundle cost | Low | Low | Low | Med | Low |
| Net new naming/coordination | Low | Low | Low | **High** | None |
| Implementation cost | Low | **Low (Button) → Med/High (composites needing seam work, §4.5)** | Med | High | Low |

---

## 6. Recommendation

**Adopt Option B as the core mechanism — carrier = inline element-scoped CSS vars, vocabulary = opaque hex passthrough with derived states, surface = top-level props growing into named parts (§4.5). Keep Option C as a complementary, later layer.**

- **B (instance precision):** typed `styleOverrides` per component → element-scoped CSS variables, **state-aware by derivation** (the resolver synthesizes hover/disabled from the single base hex checkout sends). v1 ships **Button** and is a strict improvement over checkout's current inline-style CTA (§1.1).
- **B extends to internals** via a bounded, per-component **parts** vocabulary (§4.5) — this is the part of Option D we keep. The future Input is the target case.
- **C (region/brand):** a real `BladeProvider.svelte` that scopes variable overrides to a subtree, for "theme this whole surface" cases (festivities, co-brand drawers). Later phase.
- Explicitly **reject E** (ungovernable; checkout forbids arbitrary CSS in SFCs and emits data, not classes) and **reject D's centralized cross-repo slot taxonomy** (premature, high coordination) — while **keeping D's parts-addressing** inside B. **A** is the shipped status quo we are replacing.

This is the lowest-architecture-churn path *for Button*; for composite components the honest cost is the **per-component seam audit** (§4.5), which is the real gating work for full adoption.

### Layering with Checkout (proposed — no wiring exists yet)

> Checkout does **not** consume Blade today; the adapter row below is the proposed bridge, not shipped code.

```
merchant config (hex)                config-driver (sanitize + resolve, 6-step)
 surface.contact.cta.primary.background ─────────────► getUIConfigColor() → '#1a59ff' | ''
                                                              │
                                  [PROPOSED] checkout adapter maps path → Blade styleOverrides
                                                              ▼
        <Button styleOverrides={{ backgroundColor: '#1a59ff', textColor }}/>
                                                              ▼
        blade-core resolver → { '--btn-accent-bg-default':'#1a59ff',
                                 '--btn-accent-bg-highlighted': <derived>,  ← state synthesis
                                 '--btn-accent-bg-disabled':    <derived> }
                                                              ▼
                          BaseButton emits style="--btn-accent-bg-default:#1a59ff; …"
                                                              ▼
                  CSS module rule paints only this instance — hover/disabled still work
```

Security stays in checkout (hex regex, sanitization). Blade treats v1 values as **opaque CSS strings** (no token validation in v1). Reminder (fact #6): `getUIConfigColor` only emits 6-digit hex; if other (non-checkout) consumers send arbitrary formats, Blade-side validation must be added then.

---

## 7. Proposed contract (sketch, for Phase 3)

### v1 — Button (hex passthrough + derived states)

`blade-core` (framework-agnostic):

```ts
// styles/Button/buttonOverrides.ts
// v1 vocabulary: opaque string (a 6-digit hex from getUIConfigColor). NOT tokens yet.
type ColorValue = string;

export type ButtonStyleOverrides = Partial<{
  backgroundColor: ColorValue;
  textColor: ColorValue;
}>;

export function resolveButtonOverrides(
  o: ButtonStyleOverrides | undefined
): Record<string, string> {
  if (!o) return {};
  const vars: Record<string, string> = {};
  if (o.backgroundColor) {
    vars['--btn-accent-bg-default'] = o.backgroundColor;
    // State synthesis is the core of v1 — checkout sends only the base color.
    vars['--btn-accent-bg-highlighted'] = darken(o.backgroundColor, 0.08); // tinycolor
    vars['--btn-accent-bg-disabled']    = alpha(o.backgroundColor, 0.5);
  }
  if (o.textColor) vars['--btn-content-color'] = o.textColor;
  return vars;
}
```

`blade-svelte`:

```svelte
const overrideVars = $derived(resolveButtonOverrides(styleOverrides));
// style={ Object.entries(overrideVars).map(([k,v]) => `${k}:${v}`).join(';') }
// Reactive: re-spreads when styleOverrides (a config Readable) changes → live editor.
```

### Later phases — extensions of the same resolver

- **Explicit states / tokens (Phase 3c+):** widen `ColorValue` to `ColorTokenOrValue` and accept optional `backgroundColorHovered`/`Disabled`, resolving token strings via `getTokenCSSVariable`. Purely additive to `resolveButtonOverrides`.
- **Radius (`--btn-radius`) — the simplest seam, but NOT an adoption blocker:**

```css
/* one-line, backward-compatible seam (matches button.module.css today) */
.btn { border-radius: var(--btn-radius, var(--border-radius-small)); }
.large { --btn-radius: var(--border-radius-medium); } /* preserves current default */
```

  ⚠️ **Checkout caveat:** checkout radius is a **global `rounded`/`sharp` enum**, not a per-instance value, and `sharp` emits `border-radius: 0px !important` (`checkout/app/v2/lib/theme.ts`). That `!important` would **override** a per-instance `--btn-radius`. So radius override (a) doesn't unblock any current checkout need and (b) collides with checkout's global rule — treat it as an *extensibility demonstration*, not Phase-3a work.

- **Composite parts (Input/Card):** per §4.5 — nested override types + per-part seam audits. Each composite gets its own `resolve<Component>Overrides`.

---

## 8. Backward compatibility & migration

- **Additive only.** `styleOverrides` is optional; absent → identical output. CSS uses `var(--x, <current default>)`, so unspecified instances render pixel-identical today.
- **No global token rename**, no `data-theme` change.
- **React/`blade-core`**: resolver is pure TS; React Blade can adopt later with zero forced change now.
- **Checkout adoption is the goal, not a current dependency.** Nothing in checkout imports Blade yet; this contract is what makes the eventual swap a drop-in. When wired, it reuses checkout's existing `getUIConfigColor`/sanitization and adds no `<style>` blocks or bundle entry.

## 9. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| `styleOverrides` becomes a freeform escape hatch | Typed keys only; no `CSSProperties` spread; lint rule |
| **Override target property isn't a variable yet** (Card gradient bg, box-shadow borders) | Per-component **seam audit** (§4.5) before exposing keys; ship Button first (already variable-ized); treat seam work as DS-owned, scoped per component |
| Merchant picks low-contrast bg/text (a11y) | Reuse `tinycolor` contrast checks (already a dep of `createTheme`) to warn/auto-pick foreground; checkout already sanitizes input |
| State variants forgotten on override (hover looks wrong) | **v1 resolver derives hover/disabled from the base** (darken/alpha) — this is the default path, not a fallback (Option B, §4) |
| Derived states are scheme-agnostic (don't adapt to dark mode) | Accepted for checkout (single scheme, dark mode de-scoped). For general Blade adoption, revisit per-scheme derivation — out of v1 scope |
| Composite parts addressed by the wrong element | Parts contract maps each key to a specific part element; vars set on / inherited to that child (§4.5) |
| Specificity / `!important` collisions | Override via the *same* custom props the module already reads (no new selectors). Note checkout's global `sharp` radius rule uses `!important` and would beat `--btn-radius` (§7) |

## 10. Phased rollout

1. **Phase 3a — Button reference impl:** `ButtonStyleOverrides` (`backgroundColor`/`textColor`, hex passthrough) + `resolveButtonOverrides` with **state derivation** in `blade-core`; `styleOverrides` prop on `BaseButton`; stories + tests (incl. hover/disabled snapshots); contrast guard. *(Radius seam optional/demo only — see §7 caveat.)*
2. **Phase 3b — Checkout adoption bridge:** adapter mapping Config V2 CTA values (`getUIConfigColor`) → `styleOverrides`; swap the Contact CTA `Button` to Blade and verify it fixes the §1.1 state regression.
3. **Phase 3c — Generalize + first composite:** extract shared `resolve*Overrides` helper; widen vocabulary (optional tokens/explicit states); run the **first composite seam audit** (Input when it exists, or Card) per §4.5.
4. **Phase 3d — `BladeProvider.svelte` (Option C):** subtree token scoping for surface/brand theming.
5. **Phase 4 — Governance:** lint rules, docs, contrast tooling, Studio playground integration.

---

## 11. Open questions

- **Vocabulary growth:** v1 is hex-only passthrough. When do we add token support / explicit per-state keys? (Recommendation: only when a *consumer other than checkout* needs it, since `getUIConfigColor` is hex-only.)
- **Derivation rule:** what exact `darken`/`alpha` offsets keep derived hover/disabled both WCAG-safe and visually consistent with Blade's existing `highlighted`/`disabled` token steps? (Needs a defined spec + snapshot baseline before 3a.)
- **First composite target:** build Input fresh to the §4.5 parts contract, or retrofit Card first to prove the seam-audit cost? 
- **Responsive overrides:** should `styleOverrides` accept responsive objects like styled props? (Defer; CTAs aren't responsive-styled today.)
- **Naming:** `styleOverrides` vs `themeOverrides` vs `appearance`. (Leaning `styleOverrides`.)

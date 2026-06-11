# Instance-Level Styling — Approaches, Categorised

> Companion to `instance-level-styling-proposal.md`. A compact mental model: factor
> every approach into **two independent questions**, which reveals that several
> "options" are the same mechanism in different syntax.

## The two questions

1. **Selector hook** — what does the consumer put on the element so styles can reach it?
   (a prop value, a class, an attribute, a wrapper, or nothing)
2. **Value source** — where do the override values live, and who authors them?
   (a typed prop the component resolves, an authored stylesheet, a central map)

> A common shape for selector-based options:
> *"a selector hook the consumer puts on the element, plus a stylesheet the consumer authors that targets that hook."*

## All approaches, factored

| Approach | Selector hook | Value source | Carrier (what applies the value) |
|---|---|---|---|
| **A** — visual styled props | none (prop → inline `style`) | typed prop on instance | inline style → **final property** (`background-color`) |
| **B** — `styleOverrides` | none (prop → inline CSS vars) | typed prop; resolver derives states | inline style → **element-scoped CSS vars** |
| **C** — `BladeProvider` | **wrapper element** | token-override object on provider | vars re-declared on wrapper → cascade |
| **D** — slot-keyed map | **slot key** prop, read via context | central **theme map** (slot → values) | resolves to B's vars underneath |
| **E** — `className` | **class** on element | **stylesheet authored by consumer** | author's choice: final property *or* vars |
| **F** — `data-*` attribute | **attribute** on element | **stylesheet authored by consumer** | author's choice: final property *or* vars |

## Two families

**Family 1 — values travel *with* the instance (prop-carried): A, B, D**
Consumer hands Blade a value (or a key → value); Blade resolves and writes the carrier.
No external stylesheet. Maps cleanly to config data (hex strings).
- A vs B differ **only in carrier** (final property vs vars) → why A breaks hover/disabled and B doesn't.
- D is B + indirection (key → value via a central map).

**Family 2 — values live in a stylesheet; instance only carries a hook (selector-carried): C, E, F**
Consumer puts a hook on the element and authors CSS elsewhere.
- C, E, F differ **only in hook syntax**: wrapper (C) / class (E) / attribute (F).
- Shared limits: values are authored CSS not data → poor Config-V2 fit, `<style>`-ban friction in checkout SFCs, manual state authoring (unless states are generated via `deriveColorStates`).

## Scope (independent dial)

- **Instance-only:** A, B; E/F with an exact selector.
- **Subtree / region:** C (wrapper); E/F with a descendant selector.
- **Centralised / global map:** D.

## Collapsed view — three distinct mechanisms

1. **Prop → final property** (A) — per-instance; writes the final property directly, so interaction states (hover/disabled) aren't expressed unless each is passed explicitly.
2. **Prop → CSS vars, component-resolved** (B; D = B + central map) — per-instance; values are data, component resolves/derives states.
3. **Hook → authored stylesheet** (C / E / F) — region/static theming; **C, E, F are wrapper- / class- / attribute-flavoured spellings of the same idea**.

## Takeaways

- **E ≡ F** — `className` and `data-*` are the same mechanism; only the hook syntax differs. A var-only `className` neutralises E's specificity con.
- **C, E, F** are one mechanism (selector-carried theming) at different scopes/syntaxes.
- **A, B, D** carry values as data on the instance; **C, E, F** carry a hook and rely on authored CSS. Which family fits depends on whether overrides arrive as **data** (e.g. config hex) or as **authored stylesheets**, and whether the scope is **per-instance** or **per-region**.

---

## Worked example — `TextInput` / `PhoneInput`

A composite input is the real test: merchants want to style **internal parts** independently,
e.g. **field bg**, **border** (default/focus/error), **label**, **placeholder**, **prefix/leading**
(country code `+91`), and **helper/error text** — not one flat color.

> Precondition for **all** approaches: each part must already expose its property as a
> `var(--…)` on the right sub-element (the per-component **seam audit**, proposal §4.5).
> Addressing a part is necessary but not sufficient — no approach escapes this.

| Approach | Express it as | Tradeoff for a composite input |
|---|---|---|
| **A** — visual styled props | `<TextInput backgroundColor=… />` | Simple, per-instance. A flat top-level prop can't say *which* part (field vs wrapper) and can't reach placeholder/border-focus; states aren't expressed unless passed per state. |
| **B** — `styleOverrides` | `styleOverrides={{ field:{ backgroundColor, borderColor }, placeholder:{ color }, label:{ color } }}` | Named keys per part, typed + bounded; values are data; resolver can derive focus/error from base; reactive to live config. Cost: typed parts contract + seam audit per part. |
| **C** — `BladeProvider` | wrap subtree, override `interactive.border.*` tokens | One wrapper themes all inputs in scope; no per-part schema. Coarse: recolors *every* input/interactive in scope, can't isolate one field's placeholder; siblings sharing a token can't differ. |
| **D** — slot-keyed map | `<TextInput themeKey="phoneField" />` + central map | Centralises overrides in one declarative map (close to `config-driver`'s path→value). Cost: invents a slot taxonomy to document + sync; indirection from usage; still needs a vars carrier underneath. |
| **E** — `className` | `class="m-phone"` + author `.m-phone ::placeholder{…}` | Infinitely flexible; reaches any part via selectors. Author hand-writes every part/state; specificity vs CSS-module + `::placeholder`; `<style>` banned in checkout SFCs; values are CSS, not config data. |
| **F** — `data-*` | `data-blade-style="phone"` + author `[…] [data-part=field]{…}` | Same capability/cost as E (≡ E) — attribute hook instead of class; intent-signalling name + var-only discipline can avoid specificity wars. Still authored CSS, not config data. |

**Reading it:** approaches that name a part *and* accept values as data (A, B, D) map directly to a
per-part config source like `getUIConfigColor`; selector-carried ones (C, E, F) excel at theming a
whole region/many inputs at once but express per-field, per-part merchant data less directly. Pick
along those two axes (data vs authored-CSS, per-instance vs per-region) for the case at hand.

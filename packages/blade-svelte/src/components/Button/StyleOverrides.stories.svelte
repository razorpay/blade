<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from './Button.svelte';
  import Card from '../Card/Card.svelte';
  import CardBody from '../Card/CardBody.svelte';
  import BladeProvider from '../BladeProvider/BladeProvider.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import Heading from '../Typography/Heading/Heading.svelte';
  // Import the REAL resolvers so the interactive stories below show the actual
  // blade-core output (not a copy) — these are the same functions the components run.
  import {
    resolveButtonOverrides,
    resolveSlotTheme,
    flattenThemeOverridesToVars,
  } from '@razorpay/blade-core/styles';

  /**
   * Instance-level styling — A/B/C/D/E side-by-side.
   *
   * These stories are the concrete reference for the RFC at
   * `docs/instance-level-styling-proposal.md`. Each story maps 1:1 to an option so
   * the team can compare them in the browser (especially hover/disabled behaviour).
   *
   * Each option has an **Interactive** story driven by the Storybook Controls panel:
   * change `backgroundColor` / `textColor` / `borderRadius` / `isDisabled` and watch
   * the real component + the resolved CSS variables update live.
   *
   * TL;DR recommendation: **Option B** (`styleOverrides` → element-scoped CSS vars
   * with derived states) is the core; **Option C** (`BladeProvider`) is the
   * complementary region/brand layer. A/D/E are shown for evaluation only.
   */
  const { Story } = defineMeta({
    title: 'Patterns/Instance-Level Styling',
    component: Button,
    // Shared interactive controls for every *Interactive* story below. These flat
    // args stand in for a merchant's getUIConfigColor() output; the stories map
    // them onto each option's real prop/config shape.
    args: {
      label: 'Pay now',
      backgroundColor: '#7c3aed',
      textColor: '#ffffff',
      borderColor: '',
      borderRadius: '8px',
      isDisabled: false,
    },
    argTypes: {
      label: { control: 'text', description: 'Button text' },
      backgroundColor: {
        control: 'color',
        description: 'Base background (one hex; hover/disabled are DERIVED from it)',
      },
      textColor: { control: 'color', description: 'Text + icon color' },
      borderColor: {
        control: 'color',
        description: 'Base border color (highlighted border derived). Leave empty to skip.',
      },
      borderRadius: { control: 'text', description: 'Any CSS length, e.g. 24px' },
      isDisabled: { control: 'boolean', description: 'Toggle to see the derived disabled state' },
    },
    parameters: {
      // Only surface the flat args we actually wire into the *Interactive*
      // stories. Without this, `component: Button` auto-infers every Button
      // prop as a (dead) control, drowning the 6 knobs that do anything.
      controls: {
        include: ['label', 'backgroundColor', 'textColor', 'borderColor', 'borderRadius', 'isDisabled'],
      },
      docs: {
        description: {
          component:
            'Reference implementations for the instance-level styling RFC. ' +
            'Compare Option A (flat inline style — breaks hover/disabled) against ' +
            'Option B (styleOverrides — derives working states). C = scoped ' +
            'BladeProvider, D = slot-keyed map, E = className passthrough. ' +
            'The *Interactive* stories expose live Controls.',
        },
      },
    },
  });

  // The single base color a merchant would send via checkout's getUIConfigColor()
  // (always a 6-digit hex). Every static option below is fed THIS one value.
  const MERCHANT_BG = '#7c3aed';
  const MERCHANT_TEXT = '#ffffff';

  // Option D — a slot-keyed theme map (would live once, app-level, in a provider).
  const slotTheme = {
    button: {
      primaryCta: { backgroundColor: MERCHANT_BG, textColor: MERCHANT_TEXT },
      secondaryCta: { backgroundColor: '#0ea5e9', textColor: '#ffffff', borderRadius: '4px' },
    },
  };

  // Option C — a partial token override tree scoping a whole subtree.
  const festiveTheme = {
    interactive: {
      background: {
        primary: { default: MERCHANT_BG, highlighted: '#6d28d9' },
      },
    },
  };

  // ---- Helpers for the Interactive stories -------------------------------------
  // Build a Button styleOverrides object from the flat Controls args, dropping
  // empty strings (mirrors how a merchant only sets the slots they care about).
  function argsToStyleOverrides(args) {
    const o = {};
    if (args.backgroundColor) o.backgroundColor = args.backgroundColor;
    if (args.textColor) o.textColor = args.textColor;
    if (args.borderColor) o.borderColor = args.borderColor;
    if (args.borderRadius) o.borderRadius = args.borderRadius;
    return o;
  }
  // Pretty-print any resolver's output for the live readout panel.
  function showVars(vars) {
    const entries = Object.entries(vars);
    if (entries.length === 0) return '(no overrides — renders the default token look)';
    return entries.map(([k, v]) => `${k}: ${v};`).join('\n');
  }

  // =================================================================
  // Consuming-app (checkout) snippets — verbatim source for the buy-in
  // walkthrough. These files live in the `checkout` repo (proposed), not
  // here; they're rendered as read-only code so the team can see the FULL
  // wrapper/component API surface a consumer touches end-to-end.
  // =================================================================

  // The shipped anti-pattern today (proposal §1.1): config color written
  // straight to `style` → dead-ends hover/disabled.
  const CHECKOUT_BEFORE = `<!-- checkout/app/v2/modules/contact/components/Contact.svelte (TODAY) -->
<script lang="ts">
  import { Button } from 'blade-checkout-shim';
  import { useUIConfigColor } from '$lib/config-driver';
  import { CONFIG_PATHS } from '$lib/config-driver/paths';

  const ctaBg$ = useUIConfigColor(CONFIG_PATHS.CONTACT_CTA_BG);
  const ctaText$ = useUIConfigColor(CONFIG_PATHS.CONTACT_CTA_TEXT_COLOR);
<\/script>

<!-- Flat inline style. The merchant hex shadows the token classes, so
     :hover / :active / [disabled] backgrounds are gone. (Option A) -->
<Button
  style={\`\${$ctaBg$ ? \`background:\${$ctaBg$};\` : ''}\${
    $ctaText$ ? \`color:\${$ctaText$};\` : ''
  }\`}
>
  Continue
</Button>`;

  // After adoption: same config inputs, but routed through a typed
  // styleOverrides object → derived states (proposal §6 layering diagram).
  const CHECKOUT_AFTER = `<!-- checkout/app/v2/modules/contact/components/Contact.svelte (AFTER) -->
<script lang="ts">
  import { Button } from '@razorpay/blade-svelte';
  import { useUIConfigColor } from '$lib/config-driver';
  import { CONFIG_PATHS } from '$lib/config-driver/paths';

  // Same live Readables as before — no config-driver change.
  const ctaBg$ = useUIConfigColor(CONFIG_PATHS.CONTACT_CTA_BG);
  const ctaText$ = useUIConfigColor(CONFIG_PATHS.CONTACT_CTA_TEXT_COLOR);

  // Map config paths → Blade's typed override shape. Empty hex ('') is
  // dropped so unset slots fall back to the default token look.
  const ctaOverrides = $derived({
    ...($ctaBg$ ? { backgroundColor: $ctaBg$ } : {}),
    ...($ctaText$ ? { textColor: $ctaText$ } : {}),
  });
<\/script>

<!-- One typed prop. blade-core derives hover/active/focus/disabled from
     the base hex, so states keep working. (Option B) -->
<Button styleOverrides={ctaOverrides}>Continue</Button>`;

  // The reusable adapter — the only net-new code a consumer writes.
  // Security/sanitization stay in config-driver; this is a pure shape map.
  const CHECKOUT_ADAPTER = `// checkout/app/v2/utils/blade-adapter/toButtonOverrides.ts
import type { ButtonStyleOverrides } from '@razorpay/blade-core/styles';

/**
 * Map config-driver CTA color outputs → Blade Button styleOverrides.
 * getUIConfigColor() returns a 6-digit hex or '' (proposal fact #6),
 * so we just drop empties; Blade derives the interaction states.
 */
export function toButtonOverrides(input: {
  background?: string;
  textColor?: string;
  borderColor?: string;
  borderRadius?: string;
}): ButtonStyleOverrides {
  const o: ButtonStyleOverrides = {};
  if (input.background) o.backgroundColor = input.background;
  if (input.textColor) o.textColor = input.textColor;
  if (input.borderColor) o.borderColor = input.borderColor;
  if (input.borderRadius) o.borderRadius = input.borderRadius;
  return o;
}`;

  // Consumer usage of the adapter inside a component.
  const CHECKOUT_ADAPTER_USAGE = `<script lang="ts">
  import { Button } from '@razorpay/blade-svelte';
  import { toButtonOverrides } from '$lib/utils/blade-adapter/toButtonOverrides';
  import { useUIConfigColor } from '$lib/config-driver';
  import { CONFIG_PATHS } from '$lib/config-driver/paths';

  const bg$ = useUIConfigColor(CONFIG_PATHS.CONTACT_CTA_BG);
  const text$ = useUIConfigColor(CONFIG_PATHS.CONTACT_CTA_TEXT_COLOR);

  const overrides = $derived(
    toButtonOverrides({ background: $bg$, textColor: $text$ })
  );
<\/script>

<Button styleOverrides={overrides}>Continue</Button>`;

  // Option C in a consuming app — region/brand theming via provider.
  const CHECKOUT_PROVIDER = `<!-- checkout/app/v2/modules/festivity/FestiveDrawer.svelte -->
<script lang="ts">
  import { BladeProvider, Button, Card } from '@razorpay/blade-svelte';
  import { getFestiveTheme } from '$lib/festivity';

  // A partial token tree (same shape as Blade tokens) for the whole subtree.
  const themeOverrides = getFestiveTheme(); // { interactive: { background: ... } }
<\/script>

<!-- Everything inside inherits the festive palette via scoped CSS vars —
     no per-instance prop needed. (Option C, complementary to B) -->
<BladeProvider {themeOverrides}>
  <Card>...festive content...</Card>
  <Button>Pay now</Button>
</BladeProvider>`;

  // =================================================================
  // Per-option consuming-app snippets (compact) — what a checkout
  // component looks like adopting each option. Embedded in the meeting
  // cards so the decision doc is self-contained. Same merchant inputs
  // each time (getUIConfigColor → 6-digit hex or ''), only the carrier
  // differs. Keyed by option id for the OPTIONS loop below.
  // =================================================================
  const APP_SNIPPETS = {
    // A — flat inline style: the shipped anti-pattern (§1.1).
    A: `<!-- Contact.svelte — Option A (shipped today) -->
<script lang="ts">
  import { Button } from 'blade-checkout-shim';
  import { useUIConfigColor } from '$lib/config-driver';
  import { CONFIG_PATHS } from '$lib/config-driver/paths';

  const ctaBg$ = useUIConfigColor(CONFIG_PATHS.CONTACT_CTA_BG);
  const ctaText$ = useUIConfigColor(CONFIG_PATHS.CONTACT_CTA_TEXT_COLOR);
<\/script>

<!-- Hex written straight to style → :hover / [disabled] dead-end. -->
<Button
  style={\`\${$ctaBg$ ? \`background:\${$ctaBg$};\` : ''}\${
    $ctaText$ ? \`color:\${$ctaText$};\` : ''
  }\`}
>
  Continue
</Button>`,

    // B — typed styleOverrides: states derived. The recommended path.
    B: `<!-- Contact.svelte — Option B (recommended) -->
<script lang="ts">
  import { Button } from '@razorpay/blade-svelte';
  import { useUIConfigColor } from '$lib/config-driver';
  import { CONFIG_PATHS } from '$lib/config-driver/paths';

  // Same config Readables as A — no config-driver change.
  const ctaBg$ = useUIConfigColor(CONFIG_PATHS.CONTACT_CTA_BG);
  const ctaText$ = useUIConfigColor(CONFIG_PATHS.CONTACT_CTA_TEXT_COLOR);

  // Drop empty hex ('') so unset slots keep the default token look.
  const ctaOverrides = $derived({
    ...($ctaBg$ ? { backgroundColor: $ctaBg$ } : {}),
    ...($ctaText$ ? { textColor: $ctaText$ } : {}),
  });
<\/script>

<!-- One typed prop. blade-core derives hover/active/focus/disabled. -->
<Button styleOverrides={ctaOverrides}>Continue</Button>`,

    // C — scoped provider: region/brand theming, complementary to B.
    C: `<!-- FestiveDrawer.svelte — Option C (region/brand) -->
<script lang="ts">
  import { BladeProvider, Button, Card } from '@razorpay/blade-svelte';
  import { getFestiveTheme } from '$lib/festivity';

  // Partial token tree (Blade token shape) for the whole subtree.
  const themeOverrides = getFestiveTheme();
<\/script>

<!-- Everything inside inherits via scoped CSS vars — no per-instance prop.
     Coarse on purpose: both buttons recolor together. -->
<BladeProvider {themeOverrides}>
  <Card>...festive content...</Card>
  <Button>Pay now</Button>
  <Button variant="secondary">Maybe later</Button>
</BladeProvider>`,

    // D — slot-keyed map: one declarative object, opt in via themeKey.
    D: `<!-- App-level theme (provided once) — Option D -->
<script lang="ts">
  import { BladeProvider, Button } from '@razorpay/blade-svelte';
  import { useUIConfigColor } from '$lib/config-driver';
  import { CONFIG_PATHS } from '$lib/config-driver/paths';

  const bg$ = useUIConfigColor(CONFIG_PATHS.CONTACT_CTA_BG);

  // New naming dimension: slot keys must be invented + kept in sync
  // across Blade + checkout (the coordination cost).
  const slotTheme = $derived({
    button: { primaryCta: $bg$ ? { backgroundColor: $bg$ } : {} },
  });
<\/script>

<!-- Override lives far from usage; opt in by key. Sugar over B's carrier. -->
<BladeProvider {slotTheme}>
  <Button themeKey="primaryCta">Continue</Button>
</BladeProvider>`,

    // E — className passthrough: banned in checkout SFCs. (No literal
    // <style> block here — V2 forbids it, and a real one would also trip
    // svelte-preprocess parsing this file. The CSS lives in a separate
    // sheet, which is itself the governance/specificity problem.)
    E: `/* cta-override.css — a separate sheet (V2 bans <style> in SFCs) */
.my-cta-override {
  /* Static, hand-authored — can't take a merchant hex at runtime,
     and won't reliably beat the box-shadow/module rules without
     !important → specificity war, escapes DS governance. */
  background: #7c3aed !important;
}

<!-- SomeScreen.svelte — Option E (NOT allowed in checkout) -->
<script lang="ts">
  import { Button } from '@razorpay/blade-svelte';
  import './cta-override.css';
<\/script>

<Button className="my-cta-override">Continue</Button>`,
  };

  // =================================================================
  // Meeting view — structured pros/cons of each proposed option.
  // Single source the "Decision · pros & cons" story renders from, so
  // the doc story stays in sync with the RFC (proposal §4 + §5 matrix).
  // =================================================================

  // verdict: 'core' | 'complementary' | 'rejected' | 'status-quo'
  const OPTIONS = [
    {
      id: 'A',
      title: 'Visual styled props',
      summary: 'Add backgroundColor / color / borderRadius to StyledPropsBlade (token → class, arbitrary → inline style).',
      verdict: 'status-quo',
      verdictLabel: 'Shipped status quo — being replaced',
      pros: [
        'Smallest conceptual surface — reuses the existing styled-props pipeline.',
        'Naturally per-instance; two buttons differ trivially.',
        'Framework-agnostic (logic stays in blade-core).',
      ],
      cons: [
        'Dead-ends interaction states — a flat backgroundColor can’t express hover/active/disabled. This is the shipped checkout bug (§1.1).',
        'Only difference vs B is plumbing: A writes the hex to background-color directly; B writes it to the state-driving var.',
        'Encourages "anything goes" inline styling — erodes DS guardrails, hard to lint.',
        'Can’t target internal parts (axis E) — no way to address an Input’s field vs placeholder.',
      ],
    },
    {
      id: 'B',
      title: 'styleOverrides → element-scoped CSS vars',
      summary: 'Typed, bounded styleOverrides object per component → mapped to the component’s own CSS-module custom props. States derived from one base hex.',
      verdict: 'core',
      verdictLabel: 'Recommended core',
      pros: [
        'Preserves the class-first architecture — overrides are just scoped variable values over the cascade.',
        'State-aware by design — the resolver derives hover/active/focus/disabled from the single base hex.',
        'Reactive-friendly — inline vars update cleanly when the config Readable changes (live editor).',
        'True per-instance; no :root pollution.',
        'blade-core stays framework-agnostic (pure resolver); React can adopt the same fn later.',
        'Addresses internal parts via nested keys (the bounded slice of D we keep, §4.5).',
      ],
      cons: [
        'Per-component CSS-seam refactor, non-uniform cost — Button is cheap (already var-ized); composites (Card gradient bg, box-shadow border) need real seam work (§4.5).',
        'Needs a typed contract per component (and a parts contract for composites).',
        'Requires discipline so it doesn’t become a freeform style escape hatch (mitigate: typed keys only, no & CSSProperties).',
      ],
    },
    {
      id: 'C',
      title: 'Scoped BladeProvider (subtree)',
      summary: 'A real BladeProvider that re-declares affected token vars on its own wrapper (not :root), establishing a scoped cascade.',
      verdict: 'complementary',
      verdictLabel: 'Complementary (region/brand) — later phase',
      pros: [
        'Solves subtree theming elegantly ("make this whole drawer festive").',
        'Reuses deep-merge + tokenToCSSVariable; conceptually clean.',
        'No per-component schema — works for all components at once.',
        'Gives Svelte the provider parity React has.',
      ],
      cons: [
        'Doesn’t solve the core ask alone — sibling buttons each need their own wrapper, and it stays type-level (primary vs secondary), not instance-level.',
        'Overriding semantic tokens at subtree scope is coarse — recolors all primary interactives in scope, not just the CTA.',
        'Risk of deep nesting / cascade-reasoning complexity.',
      ],
    },
    {
      id: 'D',
      title: 'Slot-keyed theme map',
      summary: 'One theme object keyed by component → slot → state, consumed via context; components opt in with themeKey.',
      verdict: 'rejected',
      verdictLabel: 'Rejected as primary API (parts-instinct folded into B)',
      pros: [
        'Centralizes all overrides in one declarative object — close to how config-driver already thinks (path → value).',
        'Designers/merchants reason about "slots", not props.',
        'Its parts-addressing instinct is genuinely needed (kept, folded into B as nested keys).',
      ],
      cons: [
        'Introduces a new naming dimension (slot keys) to invent, document, and keep in sync across Blade + checkout — high coordination cost.',
        'Indirection — the override lives far from the usage; harder to trace.',
        'Still needs B’s carrier underneath — it’s sugar, not a mechanism.',
        'Over-engineered for the current need (a handful of CTAs).',
      ],
    },
    {
      id: 'E',
      title: 'className / class passthrough',
      summary: 'Expose className; consumer ships their own CSS / utility classes to override.',
      verdict: 'rejected',
      verdictLabel: 'Rejected (ungovernable; banned in checkout)',
      pros: [
        'Trivial to add — CVA’s getButtonClasses already accepts className.',
        'Infinitely flexible.',
      ],
      cons: [
        'Specificity wars vs CSS-module + box-shadow borders — overrides silently lose or need !important.',
        'Banned in checkout V2 — no <style>/arbitrary CSS in SFCs; config is data (hex), not classes.',
        'Escapes the DS entirely — no governance, no dark-mode awareness, no tokens.',
      ],
    },
  ];

  // =================================================================
  // API cheat-sheet snippets (one per approach, A–E) — defined here in
  // the module script so raw `<Button>` / `<style>` / `<\/script>` text
  // inside the strings isn't parsed as real markup by the compiler.
  // =================================================================
  const CHEAT_IMPORTS = `import { Button, Card, BladeProvider } from '@razorpay/blade-svelte';
import type { ButtonStyleOverrides } from '@razorpay/blade-core/styles';`;

  const CHEAT_A = `<!-- Hex written straight to background/color. No state derivation:
     :hover / :active / [disabled] dead-end. The shipped bug (§1.1). -->
<Button visualProps={{ backgroundColor: '#7c3aed', color: '#ffffff' }} />`;

  const CHEAT_B = `// One base hex per slot → hover/active/focus/disabled are DERIVED.
<Button styleOverrides={{
  backgroundColor: '#7c3aed',  // base hex → hover/active/disabled derived
  textColor:       '#ffffff',
  borderColor:     '#6d28d9',  // optional; highlighted border derived
  borderRadius:    '24px',     // optional; any CSS length
}} />

// Composite parts (nested keys) — e.g. Card surface:
<Card styleOverrides={{ surface: { backgroundColor: '#f5f3ff', borderColor: '#7c3aed' } }} />`;

  const CHEAT_C = `// A partial token tree (Blade token shape) re-declared on the wrapper.
// Everything inside inherits via scoped CSS vars — no per-instance prop.
<BladeProvider themeOverrides={{ interactive: { background: { primary: { default: '#7c3aed' } } } }}>
  <Card>...subtree inherits the scoped palette...</Card>
  <Button>Pay now</Button>
</BladeProvider>`;

  const CHEAT_D = `// One declarative map keyed by component → slot, opt in via themeKey.
// Resolves through B's carrier; adds a cross-repo naming dimension.
<BladeProvider slotTheme={{
  button: {
    primaryCta:   { backgroundColor: '#7c3aed', textColor: '#ffffff' },
    secondaryCta: { backgroundColor: '#0ea5e9', borderRadius: '4px' },
  },
}}>
  <Button themeKey="primaryCta">Continue</Button>
  <Button variant="secondary" themeKey="secondaryCta">Maybe later</Button>
</BladeProvider>`;

  const CHEAT_E = `<!-- Needs hand-written CSS, can't take a merchant hex at runtime,
     fights CSS-module specificity, and V2 bans <style>/util classes. -->
<Button className="my-cta-override">Continue</Button>

<style>
  /* Won't reliably beat the module rules without !important. */
  :global(.my-cta-override) { background: #7c3aed; }
<\/style>`;

  // §5 comparison matrix — rows = criteria, cells keyed by option id.
  // Scores: '++' strong yes · '+' yes · '~' partial · 'x' no (rendered as glyphs).
  const MATRIX = [
    { criterion: 'Solves sibling instances (same page)', A: '+', B: '++', C: 'x', D: '+', E: '+' },
    { criterion: 'Preserves interaction states (hover/disabled)', A: 'x', B: '++', C: '+', D: '+', E: '~' },
    { criterion: 'Addresses internal parts (axis E)', A: 'x', B: '+', C: '~', D: '++', E: '~' },
    { criterion: 'Reactive to live editor edits', A: '+', B: '++', C: '+', D: '+', E: '~' },
    { criterion: 'Keeps class-first architecture', A: '~', B: '++', C: '++', D: '+', E: 'x' },
    { criterion: 'Matches consumer vocabulary (opaque hex)', A: '+', B: '++', C: '~', D: '+', E: 'x' },
    { criterion: 'blade-core stays framework-agnostic', A: '+', B: '+', C: '+', D: '+', E: '+' },
    { criterion: 'Maps cleanly to Config V2 output', A: '~', B: '++', C: '~', D: '+', E: 'x' },
    { criterion: 'Backward compatible', A: '+', B: '++', C: '+', D: '+', E: '+' },
    { criterion: 'Bundle cost', A: 'Low', B: 'Low', C: 'Low', D: 'Med', E: 'Low' },
    { criterion: 'Net new naming / coordination', A: 'Low', B: 'Low', C: 'Low', D: 'High', E: 'None' },
    { criterion: 'Implementation cost', A: 'Low', B: 'Low→Med/High', C: 'Med', D: 'High', E: 'Low' },
  ];

  // Visual styling per verdict (border accent + badge colors). Plain hex so the
  // doc reads identically regardless of the active Blade theme.
  const VERDICT_STYLE = {
    core: { accent: '#1a7f37', badgeBg: '#dafbe1', badgeText: '#0a5223', label: 'CORE' },
    complementary: { accent: '#0969da', badgeBg: '#ddf4ff', badgeText: '#0a3069', label: 'COMPLEMENTARY' },
    rejected: { accent: '#cf222e', badgeBg: '#ffebe9', badgeText: '#82071e', label: 'REJECTED' },
    'status-quo': { accent: '#9a6700', badgeBg: '#fff8c5', badgeText: '#7a5a00', label: 'STATUS QUO' },
  };

  // Render glyph + color for a matrix cell score.
  function cellView(v) {
    switch (v) {
      case '++':
        return { text: '✓✓', color: '#1a7f37' };
      case '+':
        return { text: '✓', color: '#2da44e' };
      case '~':
        return { text: '~', color: '#9a6700' };
      case 'x':
        return { text: '✗', color: '#cf222e' };
      default:
        return { text: v, color: '#57606a' };
    }
  }
</script>

<!-- Shared readout: shows the live resolver output as a CSS-vars block. -->
{#snippet varsReadout(title, vars)}
  <div
    style="background:#0c1117; color:#7ee787; border-radius:8px; padding:12px 14px; font-family:ui-monospace,'SF Mono',Menlo,monospace; font-size:12px; line-height:1.5; white-space:pre; overflow-x:auto;"
  >
    <div style="color:#8b949e; margin-bottom:6px;">{title}</div>{showVars(vars)}</div>
{/snippet}

<!-- Shared code block: renders a static source snippet (consuming-app files that -->
<!-- live in the checkout repo, shown here for the buy-in walkthrough). `label` is -->
<!-- the file path / caption, `code` is the verbatim source. -->
{#snippet codeBlock(label, code)}
  <div style="border:1px solid #30363d; border-radius:8px; overflow:hidden;">
    <div
      style="background:#161b22; color:#8b949e; padding:8px 14px; font-family:ui-monospace,'SF Mono',Menlo,monospace; font-size:11px; border-bottom:1px solid #30363d;"
    >
      {label}
    </div>
    <pre
      style="background:#0c1117; color:#c9d1d9; margin:0; padding:14px; font-family:ui-monospace,'SF Mono',Menlo,monospace; font-size:12px; line-height:1.55; white-space:pre; overflow-x:auto;">{code}</pre>
  </div>
{/snippet}

<!-- ============================================================= -->
<!-- Option A vs B — the state regression, made visible            -->
<!-- ============================================================= -->
<Story
  name="A vs B · hover &amp; disabled"
  exportName="AvsBStatic"
  parameters={{ controls: { exclude: /.*/g } }}
  asChild
>
  <div style="display:flex; flex-direction:column; gap:16px; max-width:560px;">
    <Heading size="small">Option A (flat inline) vs Option B (styleOverrides)</Heading>
    <Text color="surface.text.gray.muted">
      Both get the SAME base hex. Hover each, then look at the disabled column.
      Option A dead-ends hover/disabled (the shipped checkout bug, proposal §1.1);
      Option B derives them.
    </Text>

    <div style="display:grid; grid-template-columns:auto 1fr 1fr; gap:12px 20px; align-items:center;">
      <span></span>
      <Text weight="semibold">default / hover</Text>
      <Text weight="semibold">disabled</Text>

      <Text color="surface.text.gray.muted">A — visualProps</Text>
      <Button visualProps={{ backgroundColor: MERCHANT_BG, color: MERCHANT_TEXT }}>
        Hover me
      </Button>
      <Button visualProps={{ backgroundColor: MERCHANT_BG, color: MERCHANT_TEXT }} isDisabled>
        Disabled
      </Button>

      <Text color="surface.text.gray.muted">B — styleOverrides</Text>
      <Button styleOverrides={{ backgroundColor: MERCHANT_BG, textColor: MERCHANT_TEXT }}>
        Hover me
      </Button>
      <Button styleOverrides={{ backgroundColor: MERCHANT_BG, textColor: MERCHANT_TEXT }} isDisabled>
        Disabled
      </Button>
    </div>
  </div>
</Story>

<!-- ============================================================= -->
<!-- Option A vs B — INTERACTIVE (same args, both carriers)         -->
<!-- ============================================================= -->
<Story name="A vs B · Interactive (try me)" exportName="AvsBInteractive">
  {#snippet template(args)}
    {@const overrides = argsToStyleOverrides(args)}
    <div style="display:flex; flex-direction:column; gap:16px; max-width:620px;">
      <Heading size="small">A (flat inline) vs B (styleOverrides) — same Controls</Heading>
      <Text color="surface.text.gray.muted">
        Both columns read the SAME args. Hover each button and toggle
        <code>isDisabled</code>: Option A dead-ends hover/disabled (the shipped
        checkout bug), Option B derives them.
      </Text>

      <div style="display:grid; grid-template-columns:auto 1fr 1fr; gap:12px 20px; align-items:center;">
        <span></span>
        <Text weight="semibold">default / hover</Text>
        <Text weight="semibold">disabled</Text>

        <Text color="surface.text.gray.muted">A — visualProps</Text>
        <Button visualProps={{ backgroundColor: args.backgroundColor, color: args.textColor }} isDisabled={args.isDisabled}>
          {args.label}
        </Button>
        <Button visualProps={{ backgroundColor: args.backgroundColor, color: args.textColor }} isDisabled>
          Disabled
        </Button>

        <Text color="surface.text.gray.muted">B — styleOverrides</Text>
        <Button styleOverrides={overrides} isDisabled={args.isDisabled}>
          {args.label}
        </Button>
        <Button styleOverrides={overrides} isDisabled>
          Disabled
        </Button>
      </div>
    </div>
  {/snippet}
</Story>

<!-- ============================================================= -->
<!-- Option B — styleOverrides (RECOMMENDED CORE)                   -->
<!-- ============================================================= -->
<Story
  name="B · styleOverrides (recommended)"
  exportName="BStatic"
  parameters={{ controls: { exclude: /.*/g } }}
  asChild
>
  <div style="display:flex; flex-direction:column; gap:16px; max-width:520px;">
    <Heading size="small">Option B — per-instance `styleOverrides`</Heading>
    <Text color="surface.text.gray.subtle">
      One base hex in; default/hover/active/focus and disabled are derived. Hover and
      disable these to confirm states still work. This is the recommended mechanism.
    </Text>

    <Card>
      {#snippet children()}
        <CardBody>
          {#snippet children()}
            <div style="display:flex; flex-direction:column; gap:12px;">
              <Text weight="semibold">1 · Derived states from a single base hex</Text>
              <Text size="small" color="surface.text.gray.muted">
                Both buttons get the same <code>backgroundColor</code>; the disabled
                state is synthesized — not passed in.
              </Text>
              <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
                <Button styleOverrides={{ backgroundColor: MERCHANT_BG, textColor: MERCHANT_TEXT }}>
                  Primary CTA
                </Button>
                <Button styleOverrides={{ backgroundColor: MERCHANT_BG, textColor: MERCHANT_TEXT }} isDisabled>
                  Disabled (derived)
                </Button>
              </div>
            </div>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>

    <Card>
      {#snippet children()}
        <CardBody>
          {#snippet children()}
            <div style="display:flex; flex-direction:column; gap:12px;">
              <Text weight="semibold">2 · Two siblings, same page, different styles</Text>
              <Text size="small" color="surface.text.gray.muted">
                The core ask — independent color, border, and radius per instance.
              </Text>
              <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
                <Button styleOverrides={{ backgroundColor: '#1a59ff', textColor: '#ffffff', borderRadius: '24px' }}>
                  Rounded blue
                </Button>
                <Button
                  variant="secondary"
                  styleOverrides={{ backgroundColor: '#ffffff', textColor: '#1a59ff', borderColor: '#1a59ff', borderRadius: '4px' }}
                >
                  Sharp white
                </Button>
              </div>
            </div>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>
  </div>
</Story>

<!-- ============================================================= -->
<!-- Option B — INTERACTIVE (Controls panel drives the real Button) -->
<!-- ============================================================= -->
<Story name="B · Interactive (try me)" exportName="BInteractive">
  {#snippet template(args)}
    {@const overrides = argsToStyleOverrides(args)}
    <div style="display:flex; flex-direction:column; gap:16px; max-width:560px;">
      <Heading size="small">Option B — interactive `styleOverrides`</Heading>
      <Text color="surface.text.gray.muted">
        Edit <strong>backgroundColor / textColor / borderRadius / isDisabled</strong>
        in the <strong>Controls</strong> panel below. The same base hex drives the
        button; hover it and toggle <code>isDisabled</code> — the hover/disabled
        states are derived by the real <code>resolveButtonOverrides</code>.
      </Text>

      <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
        <Button styleOverrides={overrides} isDisabled={args.isDisabled}>
          {args.label}
        </Button>
        <Button styleOverrides={overrides} isDisabled>
          Always disabled
        </Button>
      </div>

      {@render varsReadout('resolveButtonOverrides(styleOverrides) →', resolveButtonOverrides(overrides))}
    </div>
  {/snippet}
</Story>

<!-- ============================================================= -->
<!-- Option B (parts) — composite component (Card)                 -->
<!-- ============================================================= -->
<Story
  name="B · parts (Card surface)"
  exportName="BPartsStatic"
  parameters={{ controls: { exclude: /.*/g } }}
  asChild
>
  <div style="display:flex; flex-direction:column; gap:16px; max-width:420px;">
    <Heading size="small">Option B — named parts (axis E)</Heading>
    <Text color="surface.text.gray.muted">
      Card's surface lives on a child element with a gradient bg + box-shadow border.
      After the seam audit (§4.5) those are CSS vars, so `styleOverrides.surface`
      retints only this card.
    </Text>

    <Card styleOverrides={{ surface: { backgroundColor: '#f5f3ff', borderColor: '#7c3aed' } }}>
      {#snippet children()}
        <CardBody>
          {#snippet children()}
            <Text>Overridden surface (lavender bg, purple border)</Text>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>

    <Card>
      {#snippet children()}
        <CardBody>
          {#snippet children()}
            <Text>Default card (no override) — for comparison</Text>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>
  </div>
</Story>

<!-- ============================================================= -->
<!-- Option C — BladeProvider (scoped subtree theming)             -->
<!-- ============================================================= -->
<Story
  name="C · BladeProvider (scoped)"
  exportName="CStatic"
  parameters={{ controls: { exclude: /.*/g } }}
  asChild
>
  <div style="display:flex; flex-direction:column; gap:16px; max-width:520px;">
    <Heading size="small">Option C — scoped `BladeProvider`</Heading>
    <Text color="surface.text.gray.muted">
      The provider re-declares token vars on its wrapper, so EVERY primary
      interactive inside inherits — great for region/brand, coarse for single
      siblings (note both buttons change together).
    </Text>

    <BladeProvider themeOverrides={festiveTheme}>
      {#snippet children()}
        <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap; padding:16px; border:1px dashed var(--surface-border-gray-muted); border-radius:8px;">
          <Button>Inside provider</Button>
          <Button>Also inside</Button>
        </div>
      {/snippet}
    </BladeProvider>

    <div style="display:flex; gap:12px; align-items:center;">
      <Button>Outside provider (unchanged)</Button>
    </div>
  </div>
</Story>

<!-- ============================================================= -->
<!-- Option C — INTERACTIVE (provider scope, args drive token tree) -->
<!-- ============================================================= -->
<Story name="C · Interactive (try me)" exportName="CInteractive">
  {#snippet template(args)}
    {@const themeOverrides = {
      interactive: { background: { primary: { default: args.backgroundColor } } },
    }}
    <div style="display:flex; flex-direction:column; gap:16px; max-width:560px;">
      <Heading size="small">Option C — interactive `BladeProvider`</Heading>
      <Text color="surface.text.gray.muted">
        The <code>backgroundColor</code> control feeds a token override on the
        provider wrapper. Note BOTH buttons inside change together (subtree scope),
        while the one outside stays default — that's the coarseness trade-off.
      </Text>

      <BladeProvider {themeOverrides}>
        {#snippet children()}
          <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap; padding:16px; border:1px dashed var(--surface-border-gray-muted); border-radius:8px;">
            <Button>{args.label}</Button>
            <Button>Also inside</Button>
          </div>
        {/snippet}
      </BladeProvider>

      <Button>Outside provider (unchanged)</Button>

      {@render varsReadout('flattenThemeOverridesToVars(themeOverrides) →', flattenThemeOverridesToVars(themeOverrides))}
    </div>
  {/snippet}
</Story>

<!-- ============================================================= -->
<!-- Option D — slot-keyed theme map                               -->
<!-- ============================================================= -->
<Story
  name="D · slot-keyed map"
  exportName="DStatic"
  parameters={{ controls: { exclude: /.*/g } }}
  asChild
>
  <div style="display:flex; flex-direction:column; gap:16px; max-width:520px;">
    <Heading size="small">Option D — slot-keyed theme map</Heading>
    <Text color="surface.text.gray.muted">
      One declarative map (provided once), components opt in via `themeKey`. Resolves
      through Option B's carrier. Rejected as the primary API (new cross-repo naming
      dimension) but shown for completeness.
    </Text>

    <BladeProvider {slotTheme}>
      {#snippet children()}
        <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
          <Button themeKey="primaryCta">themeKey="primaryCta"</Button>
          <Button variant="secondary" themeKey="secondaryCta">themeKey="secondaryCta"</Button>
          <Button themeKey="primaryCta" isDisabled>disabled (still derived)</Button>
        </div>
      {/snippet}
    </BladeProvider>
  </div>
</Story>

<!-- ============================================================= -->
<!-- Option D — INTERACTIVE (slot map keyed by themeKey)            -->
<!-- ============================================================= -->
<Story name="D · Interactive (try me)" exportName="DInteractive">
  {#snippet template(args)}
    {@const liveSlotTheme = {
      button: { primaryCta: argsToStyleOverrides(args) },
    }}
    <div style="display:flex; flex-direction:column; gap:16px; max-width:560px;">
      <Heading size="small">Option D — interactive slot-keyed map</Heading>
      <Text color="surface.text.gray.muted">
        The Controls feed a <code>slotTheme.button.primaryCta</code> entry; the
        button opts in via <code>themeKey="primaryCta"</code>. Output is identical
        to Option B (D is sugar over B's carrier) — see the readout.
      </Text>

      <BladeProvider slotTheme={liveSlotTheme}>
        {#snippet children()}
          <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
            <Button themeKey="primaryCta" isDisabled={args.isDisabled}>{args.label}</Button>
            <Button themeKey="primaryCta" isDisabled>disabled (still derived)</Button>
          </div>
        {/snippet}
      </BladeProvider>

      {@render varsReadout('resolveSlotTheme(slotTheme, "button", "primaryCta") →', resolveSlotTheme(liveSlotTheme, 'button', 'primaryCta'))}
    </div>
  {/snippet}
</Story>

<!-- ============================================================= -->
<!-- Option E — className passthrough                               -->
<!-- ============================================================= -->
<Story
  name="E · className (discouraged)"
  exportName="EStatic"
  parameters={{ controls: { exclude: /.*/g } }}
  asChild
>
  <div style="display:flex; flex-direction:column; gap:16px; max-width:520px;">
    <Heading size="small">Option E — `className` passthrough</Heading>
    <Text color="surface.text.gray.muted">
      Trivial to add, but: specificity wars vs CSS-module rules, escapes DS
      governance, and is banned in checkout SFCs (config is data, not classes).
      Here a utility class is appended — note it can't drive derived states.
    </Text>

    <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
      <Button variant="secondary" className="background-interactive-background-primary-faded">
        With utility className
      </Button>
    </div>
  </div>
</Story>

<!-- ============================================================= -->
<!-- CONSUMING APP — what the wrapper / component API looks like    -->
<!-- end-to-end in checkout (for the buy-in walkthrough).           -->
<!-- ============================================================= -->

<!-- 1 · Before vs After — the migration at the call site ---------- -->
<Story
  name="App · Before vs After (call site)"
  exportName="AppBeforeAfter"
  parameters={{ controls: { exclude: /.*/g } }}
  asChild
>
  <div style="display:flex; flex-direction:column; gap:16px; max-width:760px;">
    <Heading size="small">Consuming app — the call-site diff</Heading>
    <Text color="surface.text.gray.muted">
      What a checkout component looks like <strong>today</strong> vs <strong>after</strong>
      adopting Blade's <code>styleOverrides</code>. Same config inputs
      (<code>useUIConfigColor</code>), same merchant hex — the only change is routing it
      through a typed prop instead of a flat <code>style</code> string. Hover/disabled
      go from broken (A) to derived (B).
    </Text>

    <div style="display:flex; flex-direction:column; gap:8px;">
      <Text weight="semibold" color="surface.text.gray.subtle">Before — Option A (shipped bug §1.1)</Text>
      {@render codeBlock('Contact.svelte (today)', CHECKOUT_BEFORE)}
    </div>

    <div style="display:flex; flex-direction:column; gap:8px;">
      <Text weight="semibold" color="surface.text.gray.subtle">After — Option B (states derived)</Text>
      {@render codeBlock('Contact.svelte (after)', CHECKOUT_AFTER)}
    </div>

    <div style="display:flex; flex-direction:column; gap:8px;">
      <Text weight="semibold" color="surface.text.gray.subtle">Live result of the "after" snippet</Text>
      <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
        <Button styleOverrides={{ backgroundColor: MERCHANT_BG, textColor: MERCHANT_TEXT }}>
          Continue
        </Button>
        <Button styleOverrides={{ backgroundColor: MERCHANT_BG, textColor: MERCHANT_TEXT }} isDisabled>
          Disabled (derived)
        </Button>
      </div>
    </div>
  </div>
</Story>

<!-- 2 · The adapter — the only net-new consumer code -------------- -->
<Story
  name="App · Adapter (config → overrides)"
  exportName="AppAdapter"
  parameters={{ controls: { exclude: /.*/g } }}
  asChild
>
  <div style="display:flex; flex-direction:column; gap:16px; max-width:760px;">
    <Heading size="small">Consuming app — the adapter layer</Heading>
    <Text color="surface.text.gray.muted">
      The bridge between checkout's <code>config-driver</code> and Blade. It's a pure
      shape map: config paths → Blade's typed <code>ButtonStyleOverrides</code>. Security
      and sanitization stay in <code>config-driver</code>; Blade treats values as opaque
      strings and derives states. This is the <em>entire</em> net-new surface a consumer owns.
    </Text>

    <div style="display:flex; flex-direction:column; gap:8px;">
      <Text weight="semibold" color="surface.text.gray.subtle">1 · The adapter (write once, reuse everywhere)</Text>
      {@render codeBlock('utils/blade-adapter/toButtonOverrides.ts', CHECKOUT_ADAPTER)}
    </div>

    <div style="display:flex; flex-direction:column; gap:8px;">
      <Text weight="semibold" color="surface.text.gray.subtle">2 · Using it in a component</Text>
      {@render codeBlock('SomeScreen.svelte', CHECKOUT_ADAPTER_USAGE)}
    </div>
  </div>
</Story>

<!-- 3 · Provider usage — region/brand theming (Option C) ---------- -->
<Story
  name="App · Provider (region theming)"
  exportName="AppProvider"
  parameters={{ controls: { exclude: /.*/g } }}
  asChild
>
  <div style="display:flex; flex-direction:column; gap:16px; max-width:760px;">
    <Heading size="small">Consuming app — region/brand theming</Heading>
    <Text color="surface.text.gray.muted">
      For "theme this whole surface" cases (festivities, co-brand drawers), a consumer
      wraps a subtree in <code>BladeProvider</code> with a partial token tree. Complementary
      to <code>styleOverrides</code> — use the provider for regions, the prop for instances.
    </Text>

    {@render codeBlock('FestiveDrawer.svelte', CHECKOUT_PROVIDER)}

    <div style="display:flex; flex-direction:column; gap:8px;">
      <Text weight="semibold" color="surface.text.gray.subtle">Live result</Text>
      <BladeProvider themeOverrides={festiveTheme}>
        {#snippet children()}
          <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap; padding:16px; border:1px dashed var(--surface-border-gray-muted); border-radius:8px;">
            <Button>Pay now</Button>
            <Button variant="secondary">Cancel</Button>
          </div>
        {/snippet}
      </BladeProvider>
    </div>
  </div>
</Story>

<!-- 4 · API cheat sheet — the full wrapper surface at a glance ----- -->
<Story
  name="App · API cheat sheet"
  exportName="AppApiCheatSheet"
  parameters={{ controls: { exclude: /.*/g } }}
  asChild
>
  <div style="display:flex; flex-direction:column; gap:16px; max-width:760px;">
    <Heading size="small">Consuming app — API surface at a glance</Heading>
    <Text color="surface.text.gray.muted">
      Every approach a consuming app could touch, A–E, with a full snippet each. The
      recommended path is <strong>B</strong> (per-instance) + <strong>C</strong>
      (region/brand); A/D/E are shown verbatim for evaluation only.
    </Text>

    <!-- Imports — shared across the recommended path -->
    <div style="display:flex; flex-direction:column; gap:8px;">
      <Text weight="semibold" color="surface.text.gray.subtle">0 · Imports (recommended path)</Text>
      {@render codeBlock('imports', CHEAT_IMPORTS)}
    </div>

    <!-- A — visual styled props (status quo, dead-ends states) -->
    <div style="display:flex; flex-direction:column; gap:8px;">
      <Text weight="semibold" color="surface.text.gray.subtle">A · visualProps — status quo (dead-ends hover/disabled)</Text>
      {@render codeBlock('Option A — flat visual props', CHEAT_A)}
    </div>

    <!-- B — styleOverrides (recommended core) -->
    <div style="display:flex; flex-direction:column; gap:8px;">
      <Text weight="semibold" color="surface.text.gray.subtle">B · styleOverrides — recommended core (state-aware)</Text>
      {@render codeBlock('Option B — per-instance, states derived', CHEAT_B)}
    </div>

    <!-- C — scoped BladeProvider (complementary) -->
    <div style="display:flex; flex-direction:column; gap:8px;">
      <Text weight="semibold" color="surface.text.gray.subtle">C · BladeProvider — complementary region/brand theming</Text>
      {@render codeBlock('Option C — scoped subtree theming', CHEAT_C)}
    </div>

    <!-- D — slot-keyed map (rejected as primary; sugar over B) -->
    <div style="display:flex; flex-direction:column; gap:8px;">
      <Text weight="semibold" color="surface.text.gray.subtle">D · slotTheme — slot-keyed map (rejected as primary; sugar over B)</Text>
      {@render codeBlock('Option D — slot-keyed theme map', CHEAT_D)}
    </div>

    <!-- E — className passthrough (banned in checkout) -->
    <div style="display:flex; flex-direction:column; gap:8px;">
      <Text weight="semibold" color="surface.text.gray.subtle">E · className — passthrough (banned in checkout SFCs)</Text>
      {@render codeBlock('Option E — className passthrough', CHEAT_E)}
    </div>
  </div>
</Story>

<!-- ============================================================= -->
<!-- MEETING VIEW — structured pros / cons of every option.        -->
<!-- Pure documentation (no live components): a single scannable    -->
<!-- artifact to drive the decision discussion. Maps to proposal    -->
<!-- §4 (option write-ups) + §5 (comparison matrix) + §6 (rec).     -->
<!-- ============================================================= -->
<Story
  name="Decision · pros &amp; cons (meeting)"
  exportName="DecisionProsCons"
  parameters={{ controls: { exclude: /.*/g } }}
  asChild
>
  <div style="display:flex; flex-direction:column; gap:24px; max-width:980px;">
    <!-- Header + TL;DR verdict -->
    <div style="display:flex; flex-direction:column; gap:8px;">
      <Heading size="large">Instance-Level Styling — options at a glance</Heading>
      <Text color="surface.text.gray.muted">
        Pros / cons of each proposed mechanism, for the decision meeting. Full write-up:
        <code>docs/instance-level-styling-proposal.md</code> (§4 options, §5 matrix, §6 recommendation).
        Live behaviour is in the other stories under this folder — start with
        <strong>"A vs B · hover &amp; disabled"</strong>.
      </Text>
    </div>

    <div
      style="border:1px solid #d0d7de; border-left:4px solid #1a7f37; border-radius:8px; padding:14px 16px; background:#f6fff9; display:flex; flex-direction:column; gap:6px;"
    >
      <Text weight="semibold">Recommendation</Text>
      <Text size="small" color="surface.text.gray.subtle">
        Adopt <strong>B</strong> (<code>styleOverrides</code> → element-scoped CSS vars, states derived
        from one base hex) as the core. Keep <strong>C</strong> (<code>BladeProvider</code>) as the
        complementary region/brand layer. <strong>A</strong> is the shipped status quo being replaced;
        <strong>D</strong>’s parts-addressing is folded into B; <strong>D</strong>’s slot taxonomy and
        <strong>E</strong> are rejected.
      </Text>
    </div>

    <!-- Legend for the verdict badges -->
    <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
      {#each Object.values(VERDICT_STYLE) as v}
        <span
          style="font-family:ui-monospace,'SF Mono',Menlo,monospace; font-size:10px; font-weight:600; letter-spacing:0.04em; padding:3px 8px; border-radius:999px; background:{v.badgeBg}; color:{v.badgeText};"
        >
          {v.label}
        </span>
      {/each}
    </div>

    <!-- Per-option pros/cons cards -->
    <div style="display:flex; flex-direction:column; gap:16px;">
      {#each OPTIONS as opt}
        {@const vs = VERDICT_STYLE[opt.verdict]}
        <div
          style="border:1px solid #d0d7de; border-left:4px solid {vs.accent}; border-radius:8px; overflow:hidden; background:#ffffff;"
        >
          <!-- Card header: option id + title + verdict badge -->
          <div
            style="display:flex; align-items:center; gap:12px; flex-wrap:wrap; padding:12px 16px; background:#f6f8fa; border-bottom:1px solid #d0d7de;"
          >
            <span
              style="display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:6px; background:{vs.accent}; color:#ffffff; font-weight:700; font-size:14px;"
            >
              {opt.id}
            </span>
            <span style="font-size:15px; font-weight:600; color:#1f2328;">{opt.title}</span>
            <span
              style="margin-left:auto; font-family:ui-monospace,'SF Mono',Menlo,monospace; font-size:10px; font-weight:600; letter-spacing:0.04em; padding:3px 8px; border-radius:999px; background:{vs.badgeBg}; color:{vs.badgeText};"
            >
              {opt.verdictLabel}
            </span>
          </div>

          <div style="padding:14px 16px; display:flex; flex-direction:column; gap:14px;">
            <Text size="small" color="surface.text.gray.muted">{opt.summary}</Text>

            <!-- Pros / cons two-column -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
              <div style="display:flex; flex-direction:column; gap:8px;">
                <Text size="small" weight="semibold" color="feedback.text.positive.intense">
                  Pros
                </Text>
                <ul style="margin:0; padding-left:18px; display:flex; flex-direction:column; gap:6px;">
                  {#each opt.pros as pro}
                    <li style="font-size:13px; line-height:1.5; color:#1f2328;">{pro}</li>
                  {/each}
                </ul>
              </div>

              <div style="display:flex; flex-direction:column; gap:8px;">
                <Text size="small" weight="semibold" color="feedback.text.negative.intense">
                  Cons
                </Text>
                <ul style="margin:0; padding-left:18px; display:flex; flex-direction:column; gap:6px;">
                  {#each opt.cons as con}
                    <li style="font-size:13px; line-height:1.5; color:#1f2328;">{con}</li>
                  {/each}
                </ul>
              </div>
            </div>

            <!-- Consuming-app call site for this option -->
            {#if APP_SNIPPETS[opt.id]}
              <div style="display:flex; flex-direction:column; gap:6px;">
                <Text size="xsmall" weight="semibold" color="surface.text.gray.subtle">
                  In a consuming app (checkout)
                </Text>
                {@render codeBlock(`Option ${opt.id} — call site`, APP_SNIPPETS[opt.id])}
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>

    <!-- §5 comparison matrix -->
    <div style="display:flex; flex-direction:column; gap:10px;">
      <Heading size="small">Comparison matrix (proposal §5)</Heading>
      <Text size="small" color="surface.text.gray.muted">
        <span style="color:#1a7f37; font-weight:600;">✓✓</span> strong&nbsp;·
        <span style="color:#2da44e; font-weight:600;">✓</span> yes&nbsp;·
        <span style="color:#9a6700; font-weight:600;">~</span> partial&nbsp;·
        <span style="color:#cf222e; font-weight:600;">✗</span> no.
        Read "implementation cost" per-component — Button is cheap, composites need seam work (§4.5).
      </Text>

      <div style="border:1px solid #d0d7de; border-radius:8px; overflow-x:auto;">
        <table style="border-collapse:collapse; width:100%; font-size:13px; min-width:720px;">
          <thead>
            <tr style="background:#f6f8fa;">
              <th
                style="text-align:left; padding:10px 12px; border-bottom:1px solid #d0d7de; color:#1f2328; font-weight:600; position:sticky; left:0; background:#f6f8fa;"
              >
                Criterion
              </th>
              {#each OPTIONS as opt}
                <th
                  style="text-align:center; padding:10px 12px; border-bottom:1px solid #d0d7de; border-left:1px solid #eaeef2; color:#1f2328; font-weight:600; white-space:nowrap;"
                >
                  {opt.id}{opt.verdict === 'core' ? ' ★' : ''}
                </th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each MATRIX as row, i}
              <tr style={i % 2 === 1 ? 'background:#fbfcfd;' : ''}>
                <td
                  style="padding:9px 12px; border-bottom:1px solid #eaeef2; color:#1f2328; position:sticky; left:0; background:{i % 2 === 1 ? '#fbfcfd' : '#ffffff'};"
                >
                  {row.criterion}
                </td>
                {#each OPTIONS as opt}
                  {@const cell = cellView(row[opt.id])}
                  <td
                    style="text-align:center; padding:9px 12px; border-bottom:1px solid #eaeef2; border-left:1px solid #eaeef2; color:{cell.color}; font-weight:600; white-space:nowrap;"
                  >
                    {cell.text}
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      <Text size="xsmall" color="surface.text.gray.muted">★ = recommended core (Option B).</Text>
    </div>
  </div>
</Story>

<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from './Button.svelte';
  import Card from '../Card/Card.svelte';
  import CardBody from '../Card/CardBody.svelte';
  import BladeProvider from '../BladeProvider/BladeProvider.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import Heading from '../Typography/Heading/Heading.svelte';
  import {
    resolveButtonOverrides,
    flattenThemeOverridesToVars,
  } from '@razorpay/blade-core/styles';

  /**
   * Instance-level styling — Options B & C.
   *
   * B (`styleOverrides`) is the recommended per-instance core; C (`BladeProvider`)
   * is the complementary region/brand layer. See `docs/instance-level-styling-proposal.md`.
   */
  const { Story } = defineMeta({
    title: 'Patterns/Instance-Level Styling',
    component: Button,
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
        description: 'Base background (hover/disabled derived from this hex)',
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
      controls: {
        include: ['label', 'backgroundColor', 'textColor', 'borderColor', 'borderRadius', 'isDisabled'],
      },
      docs: {
        description: {
          component:
            'Reference implementations for instance-level styling. ' +
            'Option B (`styleOverrides`) derives interaction states from one base hex. ' +
            'Option C (`BladeProvider`) scopes token overrides to a subtree.',
        },
      },
    },
  });

  const MERCHANT_BG = '#7c3aed';
  const MERCHANT_TEXT = '#ffffff';

  const festiveTheme = {
    interactive: {
      background: {
        primary: { default: MERCHANT_BG, highlighted: '#6d28d9' },
      },
    },
  };

  function argsToStyleOverrides(args) {
    const o = {};
    if (args.backgroundColor) o.backgroundColor = args.backgroundColor;
    if (args.textColor) o.textColor = args.textColor;
    if (args.borderColor) o.borderColor = args.borderColor;
    if (args.borderRadius) o.borderRadius = args.borderRadius;
    return o;
  }

  function showVars(vars) {
    const entries = Object.entries(vars);
    if (entries.length === 0) return '(no overrides — renders the default token look)';
    return entries.map(([k, v]) => `${k}: ${v};`).join('\n');
  }

  const CHECKOUT_BEFORE = `<!-- checkout/app/v2/modules/contact/components/Contact.svelte (TODAY) -->
<script lang="ts">
  import { Button } from 'blade-checkout-shim';
  import { useUIConfigColor } from '$lib/config-driver';
  import { CONFIG_PATHS } from '$lib/config-driver/paths';

  const ctaBg$ = useUIConfigColor(CONFIG_PATHS.CONTACT_CTA_BG);
  const ctaText$ = useUIConfigColor(CONFIG_PATHS.CONTACT_CTA_TEXT_COLOR);
<\/script>

<!-- Flat inline style. Merchant hex shadows token classes, so
     :hover / :active / [disabled] backgrounds are gone. -->
<Button
  style={\`\${$ctaBg$ ? \`background:\${$ctaBg$};\` : ''}\${
    $ctaText$ ? \`color:\${$ctaText$};\` : ''
  }\`}
>
  Continue
</Button>`;

  const CHECKOUT_AFTER = `<!-- checkout/app/v2/modules/contact/components/Contact.svelte (AFTER) -->
<script lang="ts">
  import { Button } from '@razorpay/blade-svelte';
  import { useUIConfigColor } from '$lib/config-driver';
  import { CONFIG_PATHS } from '$lib/config-driver/paths';

  const ctaBg$ = useUIConfigColor(CONFIG_PATHS.CONTACT_CTA_BG);
  const ctaText$ = useUIConfigColor(CONFIG_PATHS.CONTACT_CTA_TEXT_COLOR);

  const ctaOverrides = $derived({
    ...($ctaBg$ ? { backgroundColor: $ctaBg$ } : {}),
    ...($ctaText$ ? { textColor: $ctaText$ } : {}),
  });
<\/script>

<Button styleOverrides={ctaOverrides}>Continue</Button>`;

  const CHECKOUT_ADAPTER = `// checkout/app/v2/utils/blade-adapter/toButtonOverrides.ts
import type { ButtonStyleOverrides } from '@razorpay/blade-core/styles';

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

  const CHECKOUT_PROVIDER = `<!-- checkout/app/v2/modules/festivity/FestiveDrawer.svelte -->
<script lang="ts">
  import { BladeProvider, Button, Card } from '@razorpay/blade-svelte';
  import { getFestiveTheme } from '$lib/festivity';

  const themeOverrides = getFestiveTheme();
<\/script>

<BladeProvider {themeOverrides}>
  <Card>...festive content...</Card>
  <Button>Pay now</Button>
</BladeProvider>`;

  const APP_SNIPPETS = {
    B: CHECKOUT_AFTER,
    C: `<!-- FestiveDrawer.svelte — Option C (region/brand) -->
<script lang="ts">
  import { BladeProvider, Button, Card } from '@razorpay/blade-svelte';
  import { getFestiveTheme } from '$lib/festivity';

  const themeOverrides = getFestiveTheme();
<\/script>

<BladeProvider {themeOverrides}>
  <Card>...festive content...</Card>
  <Button>Pay now</Button>
  <Button variant="secondary">Maybe later</Button>
</BladeProvider>`,
  };

  const OPTIONS = [
    {
      id: 'B',
      title: 'styleOverrides → element-scoped CSS vars',
      summary:
        'Typed, bounded styleOverrides object per component → mapped to CSS-module custom props. States derived from one base hex.',
      verdict: 'core',
      verdictLabel: 'Recommended core',
      pros: [
        'Preserves the class-first architecture — overrides are scoped variable values over the cascade.',
        'State-aware — hover/active/focus/disabled derived from the single base hex.',
        'Reactive-friendly — inline vars update when the config Readable changes.',
        'True per-instance; no :root pollution.',
        'Addresses internal parts via nested keys (e.g. Card surface).',
      ],
      cons: [
        'Per-component CSS-seam refactor — composites need real seam work.',
        'Needs a typed contract per component (and parts for composites).',
        'Requires discipline so it does not become a freeform style escape hatch.',
      ],
    },
    {
      id: 'C',
      title: 'Scoped BladeProvider (subtree)',
      summary:
        'Re-declares affected token vars on a wrapper element (not :root), establishing a scoped cascade.',
      verdict: 'complementary',
      verdictLabel: 'Complementary (region/brand)',
      pros: [
        'Solves subtree theming ("make this whole drawer festive").',
        'Reuses deep-merge + tokenToCSSVariable; conceptually clean.',
        'No per-component schema — works for all components at once.',
        'Gives Svelte provider parity with React.',
      ],
      cons: [
        'Does not solve per-sibling precision alone — stays type-level inside the subtree.',
        'Coarse — recolors all primary interactives in scope, not just one CTA.',
        'Risk of deep nesting / cascade-reasoning complexity.',
      ],
    },
  ];

  const CHEAT_B = `<Button styleOverrides={{
  backgroundColor: '#7c3aed',
  textColor: '#ffffff',
  borderColor: '#6d28d9',
  borderRadius: '24px',
}} />

<Card styleOverrides={{ surface: { backgroundColor: '#f5f3ff', borderColor: '#7c3aed' } }} />`;

  const CHEAT_C = `<BladeProvider themeOverrides={{ interactive: { background: { primary: { default: '#7c3aed' } } } }}>
  <Card>...subtree inherits the scoped palette...</Card>
  <Button>Pay now</Button>
</BladeProvider>`;

  const MATRIX = [
    { criterion: 'Solves sibling instances (same page)', B: '++', C: 'x' },
    { criterion: 'Preserves interaction states (hover/disabled)', B: '++', C: '+' },
    { criterion: 'Addresses internal parts', B: '+', C: '~' },
    { criterion: 'Reactive to live editor edits', B: '++', C: '+' },
    { criterion: 'Keeps class-first architecture', B: '++', C: '++' },
    { criterion: 'Matches consumer vocabulary (opaque hex)', B: '++', C: '~' },
    { criterion: 'Maps cleanly to Config V2 output', B: '++', C: '~' },
    { criterion: 'Backward compatible', B: '++', C: '+' },
    { criterion: 'Bundle cost', B: 'Low', C: 'Low' },
    { criterion: 'Implementation cost', B: 'Low→Med', C: 'Med' },
  ];

  const VERDICT_STYLE = {
    core: { accent: '#1a7f37', badgeBg: '#dafbe1', badgeText: '#0a5223', label: 'CORE' },
    complementary: { accent: '#0969da', badgeBg: '#ddf4ff', badgeText: '#0a3069', label: 'COMPLEMENTARY' },
  };

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

{#snippet varsReadout(title, vars)}
  <div
    style="background:#0c1117; color:#7ee787; border-radius:8px; padding:12px 14px; font-family:ui-monospace,'SF Mono',Menlo,monospace; font-size:12px; line-height:1.5; white-space:pre; overflow-x:auto;"
  >
    <div style="color:#8b949e; margin-bottom:6px;">{title}</div>{showVars(vars)}</div>
{/snippet}

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

<Story
  name="B · hover &amp; disabled"
  exportName="BHoverDisabled"
  parameters={{ controls: { exclude: /.*/g } }}
  asChild
>
  <div style="display:flex; flex-direction:column; gap:16px; max-width:560px;">
    <Heading size="small">Option B — derived hover &amp; disabled states</Heading>
    <Text color="surface.text.gray.muted">
      One base hex drives default, hover, and disabled. Hover each button and compare
      the disabled column — states are synthesized, not passed explicitly.
    </Text>

    <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
      <Button styleOverrides={{ backgroundColor: MERCHANT_BG, textColor: MERCHANT_TEXT }}>
        Hover me
      </Button>
      <Button styleOverrides={{ backgroundColor: MERCHANT_BG, textColor: MERCHANT_TEXT }} isDisabled>
        Disabled (derived)
      </Button>
    </div>
  </div>
</Story>

<Story
  name="B · styleOverrides (recommended)"
  exportName="BStatic"
  parameters={{ controls: { exclude: /.*/g } }}
  asChild
>
  <div style="display:flex; flex-direction:column; gap:16px; max-width:520px;">
    <Heading size="small">Option B — per-instance `styleOverrides`</Heading>
    <Text color="surface.text.gray.subtle">
      One base hex in; default/hover/active/focus and disabled are derived.
    </Text>

    <Card>
      {#snippet children()}
        <CardBody>
          {#snippet children()}
            <div style="display:flex; flex-direction:column; gap:12px;">
              <Text weight="semibold">1 · Derived states from a single base hex</Text>
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

<Story name="B · Interactive (try me)" exportName="BInteractive">
  {#snippet template(args)}
    {@const overrides = argsToStyleOverrides(args)}
    <div style="display:flex; flex-direction:column; gap:16px; max-width:560px;">
      <Heading size="small">Option B — interactive `styleOverrides`</Heading>
      <Text color="surface.text.gray.muted">
        Edit the Controls below. Hover the button and toggle <code>isDisabled</code> —
        states are derived by <code>resolveButtonOverrides</code>.
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

<Story
  name="B · parts (Card surface)"
  exportName="BPartsStatic"
  parameters={{ controls: { exclude: /.*/g } }}
  asChild
>
  <div style="display:flex; flex-direction:column; gap:16px; max-width:420px;">
    <Heading size="small">Option B — named parts (Card surface)</Heading>
    <Text color="surface.text.gray.muted">
      `styleOverrides.surface` retints only this card's surface element.
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
            <Text>Default card (no override)</Text>
          {/snippet}
        </CardBody>
      {/snippet}
    </Card>
  </div>
</Story>

<Story
  name="C · BladeProvider (scoped)"
  exportName="CStatic"
  parameters={{ controls: { exclude: /.*/g } }}
  asChild
>
  <div style="display:flex; flex-direction:column; gap:16px; max-width:520px;">
    <Heading size="small">Option C — scoped `BladeProvider`</Heading>
    <Text color="surface.text.gray.muted">
      Token vars re-declared on the wrapper — every primary interactive inside
      inherits. Note both buttons change together (subtree scope).
    </Text>

    <BladeProvider themeOverrides={festiveTheme}>
      {#snippet children()}
        <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap; padding:16px; border:1px dashed var(--surface-border-gray-muted); border-radius:8px;">
          <Button>Inside provider</Button>
          <Button>Also inside</Button>
        </div>
      {/snippet}
    </BladeProvider>

    <Button>Outside provider (unchanged)</Button>
  </div>
</Story>

<Story name="C · Interactive (try me)" exportName="CInteractive">
  {#snippet template(args)}
    {@const themeOverrides = {
      interactive: { background: { primary: { default: args.backgroundColor } } },
    }}
    <div style="display:flex; flex-direction:column; gap:16px; max-width:560px;">
      <Heading size="small">Option C — interactive `BladeProvider`</Heading>
      <Text color="surface.text.gray.muted">
        The <code>backgroundColor</code> control feeds a token override on the
        provider wrapper. Both buttons inside change together; the one outside stays default.
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

<Story
  name="App · Before vs After (call site)"
  exportName="AppBeforeAfter"
  parameters={{ controls: { exclude: /.*/g } }}
  asChild
>
  <div style="display:flex; flex-direction:column; gap:16px; max-width:760px;">
    <Heading size="small">Consuming app — the call-site diff</Heading>
    <Text color="surface.text.gray.muted">
      Same config inputs (<code>useUIConfigColor</code>), routed through
      <code>styleOverrides</code> instead of a flat <code>style</code> string.
    </Text>

    <div style="display:flex; flex-direction:column; gap:8px;">
      <Text weight="semibold" color="surface.text.gray.subtle">Before — flat inline style</Text>
      {@render codeBlock('Contact.svelte (today)', CHECKOUT_BEFORE)}
    </div>

    <div style="display:flex; flex-direction:column; gap:8px;">
      <Text weight="semibold" color="surface.text.gray.subtle">After — Option B</Text>
      {@render codeBlock('Contact.svelte (after)', CHECKOUT_AFTER)}
    </div>

    <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
      <Button styleOverrides={{ backgroundColor: MERCHANT_BG, textColor: MERCHANT_TEXT }}>
        Continue
      </Button>
      <Button styleOverrides={{ backgroundColor: MERCHANT_BG, textColor: MERCHANT_TEXT }} isDisabled>
        Disabled (derived)
      </Button>
    </div>
  </div>
</Story>

<Story
  name="App · Adapter (config → overrides)"
  exportName="AppAdapter"
  parameters={{ controls: { exclude: /.*/g } }}
  asChild
>
  <div style="display:flex; flex-direction:column; gap:16px; max-width:760px;">
    <Heading size="small">Consuming app — the adapter layer</Heading>
    <Text color="surface.text.gray.muted">
      Config paths → Blade's typed <code>ButtonStyleOverrides</code>. Sanitization stays in
      <code>config-driver</code>; Blade derives states.
    </Text>
    {@render codeBlock('utils/blade-adapter/toButtonOverrides.ts', CHECKOUT_ADAPTER)}
  </div>
</Story>

<Story
  name="App · Provider (region theming)"
  exportName="AppProvider"
  parameters={{ controls: { exclude: /.*/g } }}
  asChild
>
  <div style="display:flex; flex-direction:column; gap:16px; max-width:760px;">
    <Heading size="small">Consuming app — region/brand theming (Option C)</Heading>
    <Text color="surface.text.gray.muted">
      Wrap a subtree in <code>BladeProvider</code> for festive/co-brand surfaces.
      Complementary to per-instance <code>styleOverrides</code>.
    </Text>

    {@render codeBlock('FestiveDrawer.svelte', CHECKOUT_PROVIDER)}

    <BladeProvider themeOverrides={festiveTheme}>
      {#snippet children()}
        <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap; padding:16px; border:1px dashed var(--surface-border-gray-muted); border-radius:8px;">
          <Button>Pay now</Button>
          <Button variant="secondary">Cancel</Button>
        </div>
      {/snippet}
    </BladeProvider>
  </div>
</Story>

<Story
  name="App · API cheat sheet"
  exportName="AppApiCheatSheet"
  parameters={{ controls: { exclude: /.*/g } }}
  asChild
>
  <div style="display:flex; flex-direction:column; gap:16px; max-width:760px;">
    <Heading size="small">API surface — B + C</Heading>
    <div style="display:flex; flex-direction:column; gap:8px;">
      <Text weight="semibold" color="surface.text.gray.subtle">B · styleOverrides (per-instance)</Text>
      {@render codeBlock('Option B', CHEAT_B)}
    </div>
    <div style="display:flex; flex-direction:column; gap:8px;">
      <Text weight="semibold" color="surface.text.gray.subtle">C · BladeProvider (subtree)</Text>
      {@render codeBlock('Option C', CHEAT_C)}
    </div>
  </div>
</Story>

<Story
  name="Decision · pros &amp; cons (meeting)"
  exportName="DecisionProsCons"
  parameters={{ controls: { exclude: /.*/g } }}
  asChild
>
  <div style="display:flex; flex-direction:column; gap:24px; max-width:980px;">
    <Heading size="large">Instance-Level Styling — B &amp; C</Heading>
    <Text color="surface.text.gray.muted">
      Full RFC: <code>docs/instance-level-styling-proposal.md</code>.
      This branch implements only the recommended pair: B (core) + C (complementary).
    </Text>

    <div
      style="border:1px solid #d0d7de; border-left:4px solid #1a7f37; border-radius:8px; padding:14px 16px; background:#f6fff9; display:flex; flex-direction:column; gap:6px;"
    >
      <Text weight="semibold">Recommendation</Text>
      <Text size="small" color="surface.text.gray.subtle">
        Adopt <strong>B</strong> (<code>styleOverrides</code>) as the core per-instance API.
        Keep <strong>C</strong> (<code>BladeProvider</code>) for region/brand theming.
      </Text>
    </div>

    <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
      {#each Object.values(VERDICT_STYLE) as v}
        <span
          style="font-family:ui-monospace,'SF Mono',Menlo,monospace; font-size:10px; font-weight:600; letter-spacing:0.04em; padding:3px 8px; border-radius:999px; background:{v.badgeBg}; color:{v.badgeText};"
        >
          {v.label}
        </span>
      {/each}
    </div>

    <div style="display:flex; flex-direction:column; gap:16px;">
      {#each OPTIONS as opt}
        {@const vs = VERDICT_STYLE[opt.verdict]}
        <div
          style="border:1px solid #d0d7de; border-left:4px solid {vs.accent}; border-radius:8px; overflow:hidden; background:#ffffff;"
        >
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

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
              <div style="display:flex; flex-direction:column; gap:8px;">
                <Text size="small" weight="semibold" color="feedback.text.positive.intense">Pros</Text>
                <ul style="margin:0; padding-left:18px; display:flex; flex-direction:column; gap:6px;">
                  {#each opt.pros as pro}
                    <li style="font-size:13px; line-height:1.5; color:#1f2328;">{pro}</li>
                  {/each}
                </ul>
              </div>
              <div style="display:flex; flex-direction:column; gap:8px;">
                <Text size="small" weight="semibold" color="feedback.text.negative.intense">Cons</Text>
                <ul style="margin:0; padding-left:18px; display:flex; flex-direction:column; gap:6px;">
                  {#each opt.cons as con}
                    <li style="font-size:13px; line-height:1.5; color:#1f2328;">{con}</li>
                  {/each}
                </ul>
              </div>
            </div>

            {#if APP_SNIPPETS[opt.id]}
              {@render codeBlock(`Option ${opt.id} — call site`, APP_SNIPPETS[opt.id])}
            {/if}
          </div>
        </div>
      {/each}
    </div>

    <div style="display:flex; flex-direction:column; gap:10px;">
      <Heading size="small">Comparison matrix (B vs C)</Heading>
      <div style="border:1px solid #d0d7de; border-radius:8px; overflow-x:auto;">
        <table style="border-collapse:collapse; width:100%; font-size:13px; min-width:480px;">
          <thead>
            <tr style="background:#f6f8fa;">
              <th style="text-align:left; padding:10px 12px; border-bottom:1px solid #d0d7de;">Criterion</th>
              {#each OPTIONS as opt}
                <th style="text-align:center; padding:10px 12px; border-bottom:1px solid #d0d7de; border-left:1px solid #eaeef2;">
                  {opt.id}{opt.verdict === 'core' ? ' ★' : ''}
                </th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each MATRIX as row, i}
              <tr style={i % 2 === 1 ? 'background:#fbfcfd;' : ''}>
                <td style="padding:9px 12px; border-bottom:1px solid #eaeef2;">{row.criterion}</td>
                {#each OPTIONS as opt}
                  {@const cell = cellView(row[opt.id])}
                  <td
                    style="text-align:center; padding:9px 12px; border-bottom:1px solid #eaeef2; border-left:1px solid #eaeef2; color:{cell.color}; font-weight:600;"
                  >
                    {cell.text}
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</Story>

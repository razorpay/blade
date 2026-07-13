# Proposal: Runtime CSS Variables with Consumer-Owned Tailwind Utilities

## Summary

Use **static Tailwind utility classes** in the consuming app, passed through Blade's `styleOverrides` prop. For API/config-driven values, those utilities can read **runtime CSS variables**.

This lets the consuming app keep Tailwind ownership while Blade exposes stable hooks/parts needed to style components safely.

## Why this fits the consuming app

- The app already uses Tailwind and wants to own utility classes.
- API/config values can update at runtime without generating dynamic Tailwind classes.
- No Svelte `<style>` blocks are needed.
- Per-instance styling works because CSS variables are scoped to the element.

## Pros

- Works with API-driven values because runtime data flows through CSS variables.
- Keeps Tailwind utilities in the consuming app, where Tailwind is already configured.
- Supports per-instance styling without global token mutation.
- Can target component parts like `field`, `label`, and `placeholder` through documented hooks.
- Keeps Blade from owning consumer-specific utility choices.

## Cons

- Tailwind utilities must remain static and build-time discoverable.
- State values such as hover, focus, and disabled still need component-specific design decisions.
- Utility strings are less governed than typed Blade props.
- Specificity must be validated against Blade CSS modules and component states.
- Consuming app owns more responsibility for visual QA.

## Core pattern

At the raw HTML level, the mechanism looks like this:

```svelte
<button
  class="bg-[var(--cta-bg-color)] text-white font-medium px-6 py-3 rounded-lg transition-all"
  style={`--cta-bg-color: ${ctaBgColor}`}
>
  Dynamic API Button
</button>
```

`ctaBgColor` can come from an API call. Tailwind sees `bg-[var(--cta-bg-color)]` at build time, while the actual color changes at runtime through the inline CSS variable.

In Blade, expose this through `styleOverrides`, not a top-level `class` prop. `styleOverrides` maps documented component parts to Tailwind utility strings:

```svelte
<Button
  styleOverrides={{
    root: 'bg-[var(--cta-bg-color)] text-white font-medium px-6 py-3 rounded-lg transition-all',
  }}
  style={`--cta-bg-color: ${ctaBgColor}`}
>
  Dynamic API Button
</Button>
```

Avoid this:

```svelte
<!-- Not safe: Tailwind cannot reliably generate runtime-interpolated classes -->
<button class={`bg-[${ctaBgColor}]`}>Dynamic API Button</button>
```

## Button with states

For Blade components, states should be explicit. The base color may come from API/config, while hover/disabled/focus values are derived per component based on design discussion.

```svelte
<Button
  styleOverrides={{
    root:
      'bg-[var(--blade-button-bg)] hover:bg-[var(--blade-button-bg-hover)] disabled:bg-[var(--blade-button-bg-disabled)] text-[var(--blade-button-text)]',
  }}
  style={`
    --blade-button-bg: ${ctaBgColor};
    --blade-button-bg-hover: ${ctaBgColorHover};
    --blade-button-bg-disabled: ${ctaBgColorDisabled};
    --blade-button-text: ${ctaTextColor};
  `}
>
  Pay Now
</Button>
```

## Ownership split

**Consuming app owns:**

- Tailwind utility classes.
- Mapping API/config values to CSS variables.
- Passing static utility classes through `styleOverrides`.
- Visual QA for app-owned utility overrides.

**Blade owns:**

- Stable component and part hooks.
- Documented supported parts, e.g. `root`, `field`, `label`, `placeholder`.
- Component-specific state semantics, where needed.
- Optional helpers for deriving state vars, e.g. Button hover/disabled colors.

## Composite component example

```svelte
<TextInput
  label="Card Number"
  styleOverrides={{
    field: 'border border-[#1a59ff] text-[#1a59ff] rounded-[6px] px-3 py-2',
    label: 'text-[#5a6472] text-xs font-medium',
  }}
/>
```

This gives the app Tailwind control while avoiding reliance on Blade's internal DOM or CSS-module class names.

For API/config-driven values, keep the same `styleOverrides` shape and move dynamic values into CSS variables:

```svelte
<TextInput
  label="Card Number"
  styleOverrides={{
    field:
      'border-[color:var(--field-border)] focus:border-[color:var(--field-border-focus)] text-[color:var(--field-text)] rounded-[6px] px-3 py-2',
    label: 'text-[color:var(--label-color)] text-xs font-medium',
  }}
  style={`
    --field-border: ${fieldBorderColor};
    --field-border-focus: ${fieldFocusBorderColor};
    --field-text: ${fieldTextColor};
    --label-color: ${labelColor};
  `}
/>
```

## Global ThemeProvider example

Use a global provider for **global tokens**: brand color, base surface tokens, typography scale, or other app-wide theme decisions. This is separate from Option F, which is for per-instance or per-part overrides.

```svelte
<ThemeProvider
  theme={{
    colors: {
      brand: {
        primary: '#1a59ff',
      },
      surface: {
        background: '#ffffff',
      },
    },
  }}
>
  <CheckoutApp />
</ThemeProvider>
```

Then use Option F only where a specific instance needs API/config-driven styling:

```svelte
<ThemeProvider theme={checkoutTheme}>
  <Button>Default themed button</Button>

  <Button
    styleOverrides={{
      root: 'bg-[var(--cta-bg-color)] hover:bg-[var(--cta-bg-color-hover)]',
    }}
    style={`
      --cta-bg-color: ${merchantCtaColor};
      --cta-bg-color-hover: ${merchantCtaHoverColor};
    `}
  >
    Merchant CTA
  </Button>
</ThemeProvider>
```

Rule of thumb: **ThemeProvider for global tokens, Option F for instance-level runtime overrides.**

## Guardrails

- Utility classes must be static and build-time discoverable.
- Runtime values should flow through CSS variables, not interpolated Tailwind class names.
- Blade should expose only documented parts, not internal implementation selectors.
- State vars should be component-specific; Button derivation should not be reused blindly for Input/Card.
- Critical states need visual tests: hover, focus, disabled, error, selected.

## Recommendation

For checkout adoption, proceed with **Option F: consumer-owned Tailwind utilities + runtime CSS variables**.

Keep the public contract narrow: Blade provides stable part hooks and optional state helpers; the consuming app owns utility classes and API-to-variable mapping.

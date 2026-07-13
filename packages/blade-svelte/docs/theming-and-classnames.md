# Theming & Class Names in blade-svelte

## ThemeProvider

React Blade wraps the app in a `<BladeProvider>` component. blade-svelte has **no ThemeProvider component** — theming is handled entirely through CSS variables and HTML attributes.

### How it works

`@razorpay/blade-core/tokens/theme.css` declares all design tokens as CSS custom properties on `:root`. Components consume these variables directly.

```ts
// src/main.ts or src/routes/+layout.svelte
import '@razorpay/blade-core/tokens/theme.css';
import '@razorpay/blade-core/fonts.css';
```

That single import is the equivalent of mounting `<BladeProvider>`.

### Dark mode

Set `data-theme="dark"` on `<body>` (or any ancestor). The theme CSS uses attribute selectors to override tokens:

```svelte
<script>
  let isDark = $state(false);

  function toggleTheme() {
    isDark = !isDark;
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }
</script>

<button onclick={toggleTheme}>Toggle theme</button>
```

A convenience `ThemeSwitcher.svelte` component does the same and is available for storybook/dev use.

### White labelling

Use `createTheme()` from `@razorpay/blade-core` to generate a custom theme, then inject the resulting CSS variables into the document:

```ts
import { createTheme } from '@razorpay/blade-core/tokens/theme';

const theme = createTheme({ brandColor: '#your-brand-hex' });

// Apply CSS variables to :root
Object.entries(theme.cssVariables).forEach(([key, value]) => {
  document.documentElement.style.setProperty(key, value);
});
```

---

## Class Names

### Component styles: CVA + CSS Modules

Component visual variants are defined in `blade-core` using [class-variance-authority (CVA)](https://cva.style/docs):

```ts
// packages/blade-core/src/styles/Button/button.ts
import { cva } from 'class-variance-authority';

export const buttonClasses = cva(baseClass, {
  variants: {
    variant: { primary: '...', secondary: '...' },
    size: { medium: '...', large: '...' },
  },
  defaultVariants: { variant: 'primary', size: 'medium' },
});
```

The Svelte component calls the getter and applies the result:

```svelte
<!-- BaseButton.svelte -->
<script lang="ts">
  import { getButtonClasses } from '@razorpay/blade-core/styles';

  const buttonClass = $derived(
    getButtonClasses({ variant, color, size, isDisabled, isFullWidth, isIconOnly })
  );
</script>

<button class={buttonClass} ...>
  <slot />
</button>
```

### Tree-shaking guard

Svelte's compiler tree-shakes CSS classes that only appear in template expressions (not in `<style>`). Each style module exports a `get*TemplateClasses()` function that references all dynamic classes to prevent this:

```ts
// In your component — call once at module level
void getButtonTemplateClasses();
```

Without this, classes assigned via `$derived` expressions get stripped from the CSS bundle.

### Styled props: `getStyledPropsClasses`

Components accept layout props (`margin`, `display`, `position`, etc.) as styled props. These are converted to utility class names at runtime:

```ts
import { getStyledPropsClasses } from '@razorpay/blade-core/utils';

const { classes, inlineStyles } = getStyledPropsClasses(styledProps);
```

**Spacing tokens** (`spacing.0`–`spacing.11`) map to utility classes:

| Prop | Token | Class |
|------|-------|-------|
| `marginTop="spacing.4"` | `spacing.4` | `margin-top-spacing-4` |
| `marginX="spacing.2"` | `spacing.2` | `margin-x-spacing-2` |
| `display="flex"` | — | `display-flex` |

**Arbitrary values** (e.g. `marginTop="12px"`) can't map to a class, so they fall back to `inlineStyles` and are applied via the `style` attribute.

Apply both in the template:

```svelte
<div
  class={[...componentClasses, ...styledPropsClasses.classes].join(' ')}
  style={Object.entries(styledPropsClasses.inlineStyles)
    .map(([k, v]) => `${k}:${v}`)
    .join(';')}
>
```

### Responsive values

All styled props accept a responsive object:

```svelte
<Alert marginTop={{ base: 'spacing.2', m: 'spacing.4' }} />
```

`getStyledPropsClasses` accepts an optional `breakpoint` parameter and resolves the correct value for that breakpoint. The base breakpoint is used server-side / for SSR.

---

## Runtime Values in Tailwind Classes

Tailwind arbitrary values support runtime theming when the **class string is static** and the changing value is carried by a CSS variable:

```svelte
<TextInput
  class="border-[color:var(--field-border)] text-[color:var(--field-text)] hover:border-[color:var(--field-border-hover)]"
  style={`--field-border: ${fieldBorder}; --field-text: ${fieldText}; --field-border-hover: ${fieldBorderHover};`}
/>
```

Do not interpolate runtime values inside the bracket:

```svelte
<!-- Tailwind cannot reliably generate this because the class is not statically extractable -->
<TextInput class={`border-[${fieldBorder}]`} />
```

This pattern is the basis for Option F in `instance-level-styling-proposal.md`: static Tailwind utilities bind CSS properties to `var(--...)`, while config values update the CSS variables at runtime. It supports Tailwind variants like `hover:` / `focus:` / `disabled:` and does not require SFC `<style>` blocks.

---

## Summary

| Concept | React Blade | blade-svelte |
|---------|------------|-------------|
| Theme setup | `<BladeProvider>` | Import `theme.css` |
| Dark mode | `colorScheme` prop | `data-theme="dark"` on body |
| White labelling | `createTheme` + `BladeProvider` | `createTheme` + inject CSS vars |
| Component variants | styled-components | CVA + CSS Modules |
| Layout props | styled-system via emotion | `getStyledPropsClasses` |

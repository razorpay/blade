# Theming

## Description

Theming in blade-svelte is CSS variables: every colour class and the text, heading and code faces read blade-core's token variables, with Blade's standard light theme as the fallback. Setting a variable anywhere up the tree themes the components under it, a merchant's brand colour included. There is no theme prop, no dark mode and no `createTheme` at runtime.

## How a class reads a token

```css
.bg-interactive-primary-default {
  background-color: var(--interactive-background-primary-default, hsla(218, 89%, 51%, 1));
}
```

The variable is the token's path with dashes: `interactive.background.primary.default` → `--interactive-background-primary-default`. Composed values follow the variables too: a button's frame and focus ring, `surface-raised`, the skeleton. Spacing, radius, type sizes, motion and shadows are fixed values, not variables.

## Set variables up the tree

```css
:root {
  --interactive-background-primary-default: hsl(330 80% 45%);
  --interactive-background-primary-highlighted: hsl(330 80% 38%);
  --interactive-text-on-primary-normal: #fff;
  --font-family-text: Georgia, serif;
}
```

Or on one subtree, from Svelte:

```svelte
<script lang="ts">
  import { Button } from '@razorpay/blade-svelte/components';

  let { brand }: { brand: string } = $props();
</script>

<div style:--interactive-background-primary-default={brand}>
  <Button>Pay now</Button>
</div>
```

## A merchant's brand colour

The fallbacks are Blade's standard theme (blue primary), the base blade-core's `createTheme({ brandColor })` builds a brand on. So a brand sets only the variables branding changes: the primary scale and the text that sits on it (about 31 variables). Compute them where the colour is known (on the server, or once on the client from the brand colour) and set them on the container; skip `surface-background-primary-faint`, `-moderate`, `-strong` and `surface-background-accent-intense`, which the standard theme leaves `transparent`. Importing `createTheme` into the browser bundle costs about 22 KB gzipped, so prefer the server, or a small function that derives the primary scale and a readable text colour.

## Faces

`--font-family-text`, `--font-family-heading` and `--font-family-code` set the faces (`font-sans`, `font-heading`, `font-mono`). `blade.css` ships Inter (text) and Tasa (headings). The page's base font is the app's (`Usage.md`).

<br/>

<p align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/razorpay/blade/refs/heads/master/branding/blade-original-dark-mode.min.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/razorpay/blade/refs/heads/master/branding/blade-original.min.svg">
  <img width="450px" alt="Blade Design System Logo" src="https://raw.githubusercontent.com/razorpay/blade/refs/heads/master/branding/blade-original.min.svg">
</picture>
</p>

<br/>

<p align="center">
  <a href="https://npmjs.org/package/@razorpay/blade-svelte"><img alt="Blade Svelte Version" src="https://img.shields.io/github/package-json/v/razorpay/blade?style=for-the-badge&labelColor=322&logo=npm&label=@razorpay/blade-svelte&color=darkred&filename=packages%2Fblade-svelte%2Fpackage.json"></a> &nbsp;<a href="https://blade.razorpay.com/"><img alt="Documentation blade.razorpay.com" src="https://img.shields.io/badge/Documentation-blade.razorpay.com-0648EF?style=for-the-badge&labelColor=0012AD&logo=readthedocs&logoColor=eee"/></a> &nbsp;<a href="https://github.com/razorpay/blade/tree/master/CONTRIBUTING.md"><img alt="Contributions Open" src="https://img.shields.io/badge/Contributions-Open-333333?style=for-the-badge&logo=github&logoColor=ffffff&labelColor=111111"/></a></p>

<h1 aria-hidden="true"></h1>

<br/>

Blade is the Design System that powers [Razorpay](https://razorpay.com/). This package provides Blade components for [Svelte](https://svelte.dev/) applications.

## 🔗 Links

- [Docs](https://blade.razorpay.com)
- [GitHub](https://github.com/razorpay/blade)
- [@razorpay/blade](https://github.com/razorpay/blade/tree/master/packages/blade) (React version)

## ✨ Features

- Built for **Svelte 5** with native runes and modern reactivity
- Uses **CSS Variables** for theming via `@razorpay/blade-core`
- Shares design tokens with React Blade via `@razorpay/blade-core`
- TypeScript support out of the box
- [White Labelling](https://blade.razorpay.com/?path=/docs/guides-theming-theme-playground--docs)

## 📦 Installation

### Prerequisites

Before you install the package, make sure that you have:

- Node.js version >= 18.12.1
- Svelte version >= 5.56.10
- UnoCSS version >= 66

### Install the package

`svelte` and `unocss` are peer dependencies, so install them with it:

```bash
# Using yarn
yarn add @razorpay/blade-svelte svelte unocss

# Using npm
npm install @razorpay/blade-svelte svelte unocss
```

> **Note:** `@razorpay/blade-core` (design tokens, CSS styles, and fonts) is automatically installed as a dependency. `@razorpay/i18nify-js` (>= 1.12.8) is an optional peer dependency: the components do not import it, but the PhoneNumberInput stories build their country list with it.

The package also exports utilities from `@razorpay/blade-svelte/utils` (e.g., `useInteraction`, `createPortal`).

### Two component sets

The package holds two component sets at different paths, so an app can use
both:

| Import                              | Components                                             |
| ----------------------------------- | ------------------------------------------------------ |
| `@razorpay/blade-svelte/components` | cx, plus Blade's `Modal` and `BottomSheet` (see below) |
| `@razorpay/blade-svelte/utils`      | Blade's utilities (`useInteraction`, `createPortal`)   |

`/components` is the cx set with two more names: until cx exports its own,
`Modal` (`ModalHeader`, `ModalBody`, `ModalFooter`) and `BottomSheet`
(`BottomSheetHeader`, `BottomSheetBody`, `BottomSheetFooter`) are Blade's,
styled by blade-core's prebuilt CSS (see
[Blade's Modal and BottomSheet](#blades-modal-and-bottomsheet)). Both sets
read blade-core's tokens (`@razorpay/blade-core/tokens/theme.css`).

### cx: compile Blade's CSS in your app

`@razorpay/blade-svelte/components` (cx) ships no prebuilt stylesheet: your build compiles
it with UnoCSS (`unocss` is a peer dependency) from Blade's config, so the
options you pass reach the output.

```ts
// uno.config.ts
import bladeUnoConfig from '@razorpay/blade-svelte/configs/uno';

export default {
  ...bladeUnoConfig({ desktop: '62.5rem' }), // the default
  content: { filesystem: ['./node_modules/@razorpay/blade-svelte/src-cx/**/*.{ts,svelte}'] },
};
```

Emit it with the UnoCSS plugin your bundler uses (`unocss/vite`,
`@unocss/webpack`), or with `@unocss/postcss` and a `@unocss;` directive in a
stylesheet. Import Blade's plain stylesheet beside it:

```ts
import '@razorpay/blade-svelte/blade.css'; // opacity-blade-*; Tasa, Inter (woff2)
```

Components are mobile first; their desktop styles are `d:` classes, and
`max-d:` is below it. Your markup uses the same variants.

#### Your own classes, without Tailwind

Pass your `tailwind.config.js` theme and Blade also generates Tailwind v3's
utilities from it, in one pass over your files and Blade's: colours with
`/50` and `*-opacity-*`, type, borders, shadows, rings, gradients, filters,
animations, `@apply`, and Tailwind's preflight reset. (`theme()` in a class or
in CSS is not read: write the value, `[--rim:hsl(var(--cta))]`.)

```ts
export default {
  ...bladeUnoConfig({
    desktop: '62.5rem',
    // tailwind.config.js's `theme`: keys replace Tailwind's defaults,
    // `extend` merges into them, a key may be a function of `theme()`.
    theme: {
      colors: { primary: { DEFAULT: 'hsl(var(--primary) / <alpha-value>)' } },
      fontSize: { sm: ['0.75rem', { lineHeight: '1rem' }] },
      extend: { spacing: { 19: '4.75rem' } },
    },
    presets: [{ theme: { extend: { boxShadow: { card: '…' } } } }],
    // addVariant's strings
    variants: { 'quick-buy': '[data-quick-buy="true"] &' },
    preflight: true, // the default with a theme
  }),
  content: {
    filesystem: [
      './src/**/*.{svelte,ts}',
      './node_modules/@razorpay/blade-svelte/src-cx/**/*.{ts,svelte}',
    ],
  },
};
```

- The defaults are Tailwind v3.4's scales, without its colour palette or
  breakpoints: name your colours; `d:` is the breakpoint.
- A class both define (`rounded-none`, `mx-auto`, `shadow-card`) is written
  once, as Blade defines it, at Tailwind's place in the stylesheet, so it
  wins and loses against your other classes as it did under Tailwind.
- The font classes are the exception: `font-normal`…`font-bold`, `font-sans`
  and `font-mono` are Blade's weights and faces (Inter, Menlo) until your
  theme sets the same key (`fontFamily.sans`, `fontWeight.medium`…); then
  yours wins, and Blade's text follows it.
- Transforms and filters compose through Blade's variables (`--blade-*`), so
  `grayscale brightness-0` keeps both.
- The preflight and Blade's resets are the `base` layer: `@unocss base;` puts
  them apart (in a cascade layer), `@unocss !base;` emits the rest.

#### Theming with CSS variables

Blade's colours and faces read blade-core's token variables, their light mode
values as the fallback, so nothing changes until you set one:

```css
.bg-interactive-primary-default {
  background-color: var(--interactive-background-primary-default, hsla(218, 89%, 51%, 1));
}
```

Set them anywhere up the tree (`:root`, a container) to theme the components
under it:

```css
:root {
  --interactive-background-primary-default: hsl(330 80% 45%);
  --interactive-text-on-primary-normal: #fff;
  --font-family-text: Georgia, serif;
}
```

| Variables                                                           |                                          |
| ------------------------------------------------------------------- | ---------------------------------------- |
| `--surface-{background,border,text,icon}-…`                         | 13, 5, 17, 17                            |
| `--feedback-{background,border,text,icon}-…`                        | 10 each                                  |
| `--interactive-{background,border,text,icon}-…`                     | 49, 38, 44, 44                           |
| `--popup-{background,border}-…`                                     | 8 each                                   |
| `--overlay-background-…`                                            | 2                                        |
| `--font-family-text`, `--font-family-heading`, `--font-family-code` | `font-sans`, `font-heading`, `font-mono` |

The full list of 285 colour variables is the snapshot of
`src-cx/test/theme-variables.test.ts`. Composed values follow them too: a
button's frame and focus ring, `surface-raised`, the skeleton. `--data-*`
(charts) and the white and black bevels, sheens and elevation shadows stay
fixed. For a brand colour on primary buttons, blade-core's
`getPrimaryBrandCssVars({ bg })` (`@razorpay/blade-core/styles`) returns the
five fill and frame variables.

blade-core's `theme.css` (below) sets every variable to the _standard_ theme's
values, where the cx components fall back to the _neutral_ theme's (black
primary borders and text): import it only if you want the standard theme.

### Blade's Modal and BottomSheet

`/components` serves Blade's `Modal` and `BottomSheet` from `src/` until cx
exports its own (the cx `openModal` is there too).
They are portal overlays: consumers manage `isOpen`; focus, scroll lock,
dismissal and animation are wired inside. Their CSS is blade-core's, so
import the theme CSS once, in your root layout or app entry:

```ts
import '@razorpay/blade-core/tokens/theme.css';
```

```svelte
<script>
  import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from '@razorpay/blade-svelte/components';

  let isOpen = $state(false);
</script>

<Button onClick={() => (isOpen = true)}>Open</Button>
<Modal {isOpen} onDismiss={() => (isOpen = false)} size="medium">
  <ModalHeader title="Address Details" subtitle="Add a new address" />
  <ModalBody>
    <p>Body content goes here.</p>
  </ModalBody>
  <ModalFooter>
    <Button onClick={() => (isOpen = false)}>Done</Button>
  </ModalFooter>
</Modal>
```

`BottomSheet` composes the same way (`BottomSheetHeader`, `BottomSheetBody`,
`BottomSheetFooter`), with `snapPoints` and drag-to-dismiss. See the
[Storybook documentation](https://blade.razorpay.com) for their full API.

## 📝 License

Licensed under the [MIT License](https://github.com/razorpay/blade/blob/master/LICENSE.md).

<h1 aria-hidden="true"></h1>

<p align="center">Interested in working with us? Checkout our <a href="https://razorpay.com/jobs">Jobs Page</a> for open roles 🤗</p>

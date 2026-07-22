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
- Uses CSS-first approach with **CSS Modules** and **CSS Variables**
- Shares design tokens with React Blade via `@razorpay/blade-core`
- TypeScript support out of the box
- [White Labelling](https://blade.razorpay.com/?path=/docs/guides-theming-theme-playground--docs)

## 📦 Installation

### Prerequisites

Before you install the package, make sure that you have:

- Node.js version >= 18.12.1
- Svelte version >= 5.35.0

### Install the package

```bash
# Using yarn
yarn add @razorpay/blade-svelte

# Using npm
npm install @razorpay/blade-svelte
```

> **Note:** `@razorpay/blade-core` (design tokens, CSS styles, and fonts) is automatically installed as a dependency.

### Setup Theme CSS

Import the theme CSS in your root layout or app entry file:

```svelte
<!-- src/routes/+layout.svelte or App.svelte -->
<script>
  import '@razorpay/blade-core/tokens/theme.css';
</script>
```

Or in a regular TypeScript/JavaScript file:

```ts
// src/main.ts or src/app.ts
import '@razorpay/blade-core/tokens/theme.css';
```

### Wrap with BladeProvider

```svelte
<script>
  import { BladeProvider, Button } from '@razorpay/blade-svelte/components';
  import { bladeTheme, createTheme } from '@razorpay/blade-core/tokens';

  // Optional: custom brand + limited border radius overrides
  const { theme } = createTheme({
    brandColor: '#19BEA2',
    borderRadius: { medium: 16 },
  });
</script>

<BladeProvider themeTokens={bladeTheme} colorScheme="light">
  <Button>Pay</Button>
</BladeProvider>
```

`colorScheme` accepts `light` | `dark` | `system`. Nested `BladeProvider`s set
`data-blade-color-scheme` on their root so light/dark can be scoped to a subtree.

Use `useTheme()` inside the tree for `{ theme, colorScheme, setColorScheme, platform }`.

### Install Fonts

Blade uses two fonts: [TASA Orbiter](https://tasatype.localremote.co/) (for headings) and [Inter](https://rsms.me/inter/) (for body text).

You can install fonts by importing the fonts CSS from `@razorpay/blade-core`:

```ts
import '@razorpay/blade-core/fonts.css';
```

Or add fonts via CDN in your HTML:

```html
<link rel="stylesheet" href="https://unpkg.com/@razorpay/blade-core@latest/fonts.css" />
```

### Usage

```svelte
<script>
  import { Button, Text, Heading } from '@razorpay/blade-svelte/components';
</script>

<Heading size="large">Welcome to Blade</Heading>
<Text>This is Blade Design System for Svelte.</Text>
<Button variant="primary" onclick={() => alert('Clicked!')}>
  Click me
</Button>
```

### Dark Mode

Prefer `BladeProvider` `colorScheme` (supports nested scopes):

```svelte
<script>
  import { BladeProvider, Button } from '@razorpay/blade-svelte/components';
  import { bladeTheme } from '@razorpay/blade-core/tokens';
</script>

<BladeProvider themeTokens={bladeTheme} colorScheme="dark">
  <Button>Dark scoped</Button>
</BladeProvider>
```

```svelte
<!-- ThemeToggle.svelte (must be under BladeProvider) -->
<script>
  import { useTheme } from '@razorpay/blade-svelte/components';
  const theme = $derived(useTheme());
</script>

<button type="button" onclick={() => theme.setColorScheme(theme.colorScheme === 'dark' ? 'light' : 'dark')}>
  Toggle
</button>
```

Legacy: `data-theme="dark"` on `body` still works via dual CSS selectors during migration.

## 📝 License

Licensed under the [MIT License](https://github.com/razorpay/blade/blob/master/LICENSE.md).

<h1 aria-hidden="true"></h1>

<p align="center">Interested in working with us? Checkout our <a href="https://razorpay.com/jobs">Jobs Page</a> for open roles 🤗</p>


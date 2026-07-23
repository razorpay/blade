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
- [Installation](https://blade.razorpay.com/?path=/docs/guides-installation--docs)
- [@razorpay/blade](https://github.com/razorpay/blade/tree/master/packages/blade) (React version)

## ✨ Features

- Built for **Svelte 5** with native runes and modern reactivity
- Uses CSS-first approach with **CSS Modules** and **CSS Variables**
- Shares design tokens with React Blade via `@razorpay/blade-core`
- TypeScript support out of the box
- [White Labelling](https://blade.razorpay.com/?path=/docs/guides-theming-theme-playground--docs)

## 📦 Installation

### Prerequisites

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

```ts
import '@razorpay/blade-core/tokens/theme.css';
```

### Install Fonts

```ts
import '@razorpay/blade-core/fonts.css';
```

Or via CDN:

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
<Button variant="primary" onClick={() => alert('Clicked!')}>
  Click me
</Button>
```

> Blade Svelte uses React-style event prop names (e.g. `onClick`, `onBlur`, `onFocus`) rather than Svelte's native `on:click` directive. This is intentional for API parity with the React version of Blade.

For full documentation including dark mode setup and all available components, see the [Installation Guide](https://blade.razorpay.com/?path=/docs/guides-installation--docs) in Storybook.

## 📝 License

Licensed under the [MIT License](https://github.com/razorpay/blade/blob/master/LICENSE.md).

<h1 aria-hidden="true"></h1>

<p align="center">Interested in working with us? Checkout our <a href="https://razorpay.com/jobs">Jobs Page</a> for open roles 🤗</p>

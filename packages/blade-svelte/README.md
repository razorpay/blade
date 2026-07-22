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
- Svelte version >= 5.35.0 (Svelte 5 with runes support is required — this is a peer dependency)
- A bundler that supports ESM (the package is `"type": "module"` — Vite, Rollup, or SvelteKit's built-in Vite are recommended)

### Install the package

```bash
# Using yarn
yarn add @razorpay/blade-svelte

# Using npm
npm install @razorpay/blade-svelte

# Using pnpm
pnpm add @razorpay/blade-svelte
```

> **Note:** `@razorpay/blade-core` (>= 0.9.0) is automatically installed as a dependency. It provides design tokens, CSS variables, and fonts. If you already have it installed, ensure the version is `>= 0.9.0`.

### Setup Theme CSS

Import the theme CSS **before** any Blade components are used. This sets up the CSS custom properties (design tokens) that all Blade components rely on.

**SvelteKit** — import in your root layout:

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import '@razorpay/blade-core/tokens/theme.css';
</script>
```

**Vanilla Svelte (Vite)** — import in your app entry file:

```ts
// src/main.ts or src/app.ts
import '@razorpay/blade-core/tokens/theme.css';
```

### Install Fonts

Blade uses two fonts: [TASA Orbiter](https://tasatype.localremote.co/) (for headings) and [Inter](https://rsms.me/inter/) (for body text).

You can install fonts by importing the fonts CSS from `@razorpay/blade-core`:

```ts
import '@razorpay/blade-core/fonts.css';
```

Or add fonts via CDN in your HTML (replace `0.9.0` with your installed version):

```html
<link rel="stylesheet" href="https://unpkg.com/@razorpay/blade-core@0.9.0/fonts.css" />
```

> **Warning:** Avoid using `@latest` in production CDN links. Pin to a specific version to prevent breaking changes.

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

> **Note:** Blade Svelte uses React-style event prop names (e.g. `onClick`, `onBlur`, `onFocus`) rather than Svelte's native `on:click` directive. This is intentional for API parity with the React version of Blade.

### Available Components

The package exports the following components from `@razorpay/blade-svelte/components`:

| Category | Components |
| --- | --- |
| Typography | `Heading`, `Text`, `Code` |
| Buttons | `Button`, `IconButton` |
| Inputs | `TextInput`, `SearchInput`, `PasswordInput`, `OTPInput`, `PhoneNumberInput` |
| Input Group | `InputGroup`, `InputRow` |
| Selection | `Checkbox`, `CheckboxGroup`, `Radio`, `RadioGroup`, `Switch` |
| Feedback | `Alert`, `AnnouncementBanner`, `Toast`, `Tooltip` |
| Display | `Badge`, `TrustBadge`, `Avatar`, `AvatarGroup`, `Skeleton`, `Spinner`, `Divider` |
| Navigation | `Breadcrumb`, `BreadcrumbItem`, `Tabs`, `TabList`, `TabItem`, `TabPanel` |
| Layout | `Card` (+ sub-components), `AppBar` (+ sub-components), `Accordion` (+ sub-components) |
| Overlays | `BottomSheet` (+ sub-components), `Tooltip`, `TooltipInteractiveWrapper` |
| Interactive | `ActionList` (+ sub-components), `Chip`, `ChipGroup`, `Counter`, `CounterInput` |
| Collapsible | `Collapsible`, `CollapsibleButton`, `CollapsibleLink`, `CollapsibleText`, `CollapsibleBody` |
| Segmented Control | `SegmentedControl`, `SegmentedControlItem` |
| Link | `Link` |
| Amount | `Amount` |
| Toast | `Toast`, `ToastContainer`, `useToast` |
| Icons | All icons from `@razorpay/blade-core/icons` re-exported |

Utilities are available from `@razorpay/blade-svelte/utils`:

- `portal` — Portal utility for rendering content outside the normal DOM hierarchy
- `useInteraction` — Interaction utility hook

### Dark Mode

To enable dark mode, add the `data-theme="dark"` attribute to the `body` or a parent element. Light mode is the default (no attribute needed):

```html
<body data-theme="dark">
  <!-- Your app -->
</body>
```

Or toggle it programmatically:

```svelte
<script>
  import { Button } from '@razorpay/blade-svelte/components';

  let isDark = $state(false);
  
  function toggleTheme() {
    isDark = !isDark;
    if (isDark) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }
</script>

<Button onClick={toggleTheme}>
  Toggle Theme
</Button>
```

## 📝 License

Licensed under the [MIT License](https://github.com/razorpay/blade/blob/master/LICENSE.md).

<h1 aria-hidden="true"></h1>

<p align="center">Interested in working with us? Checkout our <a href="https://razorpay.com/jobs">Jobs Page</a> for open roles 🤗</p>


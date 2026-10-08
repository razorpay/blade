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
- Svelte version >= 5.35.0

### Install the package

```bash
# Using yarn
yarn add @razorpay/blade-svelte

# Using npm
npm install @razorpay/blade-svelte
```

> **Note:** `@razorpay/blade-core` (design tokens, CSS styles, and fonts) is automatically installed as a dependency.

The package also exports utilities from `@razorpay/blade-svelte/utils` (e.g., `useInteraction`, `createPortal`).

### Two component sets

The package holds two component sets at different paths, so an app can use
both:

| Import                              | Components                                            |
| ----------------------------------- | ----------------------------------------------------- |
| `@razorpay/blade-svelte`            | cx: styled by UnoCSS from Blade's config (see below)  |
| `@razorpay/blade-svelte/runes`      | cx's headless state, for building your own components |
| `@razorpay/blade-svelte/components` | Blade's components, with prebuilt CSS from blade-core |
| `@razorpay/blade-svelte/utils`      | utilities for `/components`                           |

Both read blade-core's tokens (`@razorpay/blade-core/tokens/theme.css`). Some
names exist in both, such as `Text`; rename one on import to use both in a
file:

```ts
import { Text } from '@razorpay/blade-svelte';
import { Text as BladeText } from '@razorpay/blade-svelte/components';
```

### cx: compile Blade's CSS in your app

`@razorpay/blade-svelte` (the root) ships no prebuilt stylesheet: your build compiles
it with UnoCSS (`unocss` is a peer dependency) from Blade's config, so the
options you pass reach the output.

```ts
// uno.config.ts
import { bladeUnoConfig } from '@razorpay/blade-svelte/uno.config';

export default {
  ...bladeUnoConfig({ desktop: '62.5rem' }), // the default
  content: { filesystem: ['./node_modules/@razorpay/blade-svelte/src-cx/**/*.{ts,svelte}'] },
};
```

Emit it with the UnoCSS plugin your bundler uses (`unocss/vite`,
`@unocss/webpack`), or with `@unocss/postcss` and a `@unocss;` directive in a
stylesheet. Import Blade's plain stylesheets beside it:

```ts
import '@razorpay/blade-svelte/blade.css'; // opacity-blade-*, font-blade-*
import '@razorpay/blade-svelte/fonts.css'; // Tasa, Inter (woff2)
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
  content: { filesystem: ['./src/**/*.{svelte,ts}', './node_modules/@razorpay/blade-svelte/src-cx/**/*.{ts,svelte}'] },
};
```

- The defaults are Tailwind v3.4's scales, without its colour palette or
  breakpoints: name your colours; `d:` is the breakpoint.
- A class both define (`rounded-none`, `mx-auto`, `shadow-card`) is written
  once, as Blade defines it, at Tailwind's place in the stylesheet, so it
  wins and loses against your other classes as it did under Tailwind.
- Transforms and filters compose through Blade's variables (`--blade-*`), so
  `grayscale brightness-0` keeps both.
- The preflight and Blade's resets are the `base` layer: `@unocss base;` puts
  them apart (in a cascade layer), `@unocss !base;` emits the rest.

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
  import { createTheme } from '@razorpay/blade-core/tokens';

  // Optional: custom brand + limited border radius overrides
  const { theme } = createTheme({
    brandColor: '#19BEA2',
    borderRadius: { medium: 16 },
  });
</script>

<BladeProvider themeTokens={theme} colorScheme="light">
  <Button>Pay</Button>
</BladeProvider>
```

`colorScheme` accepts `light` | `dark` | `system`. Nested `BladeProvider`s set
`data-blade-color-scheme` on their root so light/dark can be scoped to a subtree.

Use `useTheme()` inside the tree for `{ theme, colorScheme, setColorScheme, platform }`.

Use `useBreakpoint()` (same API as React Blade) for the reactive
viewport breakpoint. Read its fields inside `$derived` or the template; destructuring snapshots
the values and loses reactivity.

```svelte
<script>
  import { useBreakpoint } from '@razorpay/blade-svelte/components';
  const breakpoint = useBreakpoint(); // { matchedBreakpoint, matchedDeviceType }
  const isMobile = $derived(breakpoint.matchedDeviceType === 'mobile');
</script>
```

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
<Button variant="primary" onClick={() => alert('Clicked!')}>
  Click me
</Button>
```

### Available Components

All components are imported from `@razorpay/blade-svelte/components`:

| Category | Components |
|----------|-----------|
| Typography | `Heading`, `Text`, `Code` |
| Buttons | `Button`, `IconButton` |
| Inputs | `TextInput`, `SearchInput`, `PasswordInput`, `OTPInput`, `PhoneNumberInput`, `InputGroup`, `InputRow` |
| Selection | `Checkbox`, `CheckboxGroup`, `Radio`, `RadioGroup`, `Switch`, `SegmentedControl`, `SegmentedControlItem` |
| Layout | `Card` (+ `CardBody`, `CardHeader`, `CardFooter`, etc.), `Divider`, `Skeleton`, `AppBar` (+ `AppBarLeading`, `AppBarActions`) |
| Feedback | `Alert`, `Toast`, `ToastContainer`, `Tooltip`, `Spinner`, `AnnouncementBanner` |
| Display | `Badge`, `Avatar`, `AvatarGroup`, `Amount`, `Counter`, `CounterInput`, `TrustBadge`, `Breadcrumb`, `BreadcrumbItem` |
| Navigation | `Tabs`, `TabList`, `TabItem`, `TabPanel`, `ActionList` (+ `ActionListItem`, etc.) |
| Overlays | `BottomSheet` (+ `BottomSheetHeader`, `BottomSheetBody`, `BottomSheetFooter`), `TooltipInteractiveWrapper` |
| Structure | `Accordion` (+ `AccordionItem`, `AccordionItemHeader`, `AccordionItemBody`), `Collapsible` (+ `CollapsibleButton`, `CollapsibleLink`, etc.), `Chip`, `ChipGroup`, `Link` |
| Icons | All Blade icons via `Icons` |
| Utilities | `useToast`, `useTheme`, `useBreakpoint`, `Theme` type |

See the [Storybook documentation](https://blade.razorpay.com) for full component API references.

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


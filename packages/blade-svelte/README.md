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

### Entry points

| Import                                                    | What                                  |
| --------------------------------------------------------- | ------------------------------------- |
| `@razorpay/blade-svelte/components`                       | The components, the overlays included |
| `@razorpay/blade-svelte/icons`                            | Blade's icons, as data (`IconSource`) |
| `@razorpay/blade-svelte/configs/uno`                      | The UnoCSS preset (`bladeUnoConfig`)  |
| `@razorpay/blade-svelte/configs/vite`, `/configs/webpack` | The icon-font plugin                  |
| `@razorpay/blade-svelte/blade.css`                        | The fonts and base styles             |

### cx: compile Blade's CSS in your app

`@razorpay/blade-svelte/components` (cx) ships no prebuilt stylesheet: your build compiles
it with UnoCSS (`unocss` is a peer dependency) from Blade's config, so the
options you pass reach the output.

```ts
// uno.config.ts
import bladeUnoConfig from '@razorpay/blade-svelte/configs/uno';

export default {
  ...bladeUnoConfig({ desktop: '62.5rem' }), // the default
  content: { filesystem: ['./node_modules/@razorpay/blade-svelte/src/**/*.{ts,svelte}'] },
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
      './node_modules/@razorpay/blade-svelte/src/**/*.{ts,svelte}',
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
`src/test/theme-variables.test.ts`. Composed values follow them too: a
button's frame and focus ring, `surface-raised`, the skeleton. `--data-*`
(charts) and the white and black bevels, sheens and elevation shadows stay
fixed. For a brand colour on primary buttons, blade-core's
`getPrimaryBrandCssVars({ bg })` (`@razorpay/blade-core/styles`) returns the
five fill and frame variables.

blade-core's `theme.css` (below) sets every variable to the _standard_ theme's
values, where the cx components fall back to the _neutral_ theme's (black
primary borders and text): import it only if you want the standard theme.

### Overlays

`/components` exports one overlay per shape, each its own component over the
same runes (`createOverlay`: the layer stack, focus, Escape, back,
presence): `Modal` (the centred dialog), `BottomSheet`, `Drawer` (`side`),
`Popover` and `Menu`. Modal, BottomSheet and Drawer open from a bound
`isOpen`; Popover and Menu also from their trigger (`children`). Each
reports `onOpenChange` (the opens and closes it makes itself, not the
owner's `isOpen`), and all but Menu take `initialFocusRef`. There is no base component: an app's own overlay (one
that switches by screen, say) composes these.

BladeProvider renders the overlay host (the one scrim, the box modals
mount in, and a polite live region) and the toasts after its content, in
the nearest positioned ancestor: put it inside the frame overlays must stay
within. The outermost provider hosts every overlay on the page; a nested
provider with a toast queue of its own (`adapters.toasts`, `createToasts()`,
read when it mounts) renders its stack in that host. Nothing renders twice.
An app's back handler asks the open overlays first: `back()` returns
whether one handled it. Toasts are data: `showToast(toast, { cancelled })` returns a promise of
why the toast left, and `cancelled` resolving dismisses it. `cancelled` is a
plain `Promise<void>`, never an `AbortSignal` (older engines have none, and
a signal can't cross a bridge to a native host): `createCancel()` makes one
(`{ cancelled, cancel(), isCancelled }`). An overlay's panel
sets `--overlay-gutter` per layout (20px on a modal or a drawer, 16px on a
sheet, a popover or a menu; unset outside one): content on a bare body
pads its own rows by it (`px-[var(--overlay-gutter,0px)]`, ActionList's
`inset="overlay"`). A modal goes anywhere in the host through
`classes`: `<Modal classes={{ root: 'items-start justify-end p-6' }}>` sits
top right.

### Adapters

BladeProvider's `adapters` are the app's services. They are live: a
component reads them through getters, so an adapter the app swaps reaches
what is already mounted (`toasts` is read at mount). An
adapter left out is the enclosing provider's; `null` unsets it for the
subtree.

| Adapter            | What it does                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| `track`            | Analytics events; `field_change` sends `{ name }` only                                                        |
| `navigate`         | The app's router: every `href` (Link, a link Button, Card, a link row or tab) offers it plain internal clicks |
| `vibrate`          | Told what a press meant: `press`, `select` (Radio, Chip), `toggle` (Checkbox, Switch), `warning`              |
| `announce`         | Says a message politely; defaults to the host's live region (a Button starting and stopping loading)          |
| `locale`           | Amount's locale; i18nify's global state is the fallback                                                       |
| `toasts`           | The toast queue: Blade's (`createToasts()`), which the provider renders, or the app's own `{ showToast }`     |
| `form`             | The app's form (`FormAdapter`), below                                                                         |
| `presentDropdown`  | Shows a library dropdown (PhoneNumberInput's countries) the app's own way                                     |
| `readOTP`          | Reads a one-time code for OTPInput (an SMS retriever, WebOTP); cancelled on unmount, disable or a user edit; asked again when the owner resets `value` to `''` |
| `reportError`     | Errors the components catch                                                                                   |

Components pass `data-analytics-*` props to their element, as React's (a
toast takes them in `showToast`'s options).

### What the app brings

Blade ships UI parts. The headless hosts and flows around them are the app's,
and builds them on Blade's public entries: `/components`, and `/runes`,
the small set of runes an app composes its own hosts on (the layer stack,
`defineContext`, the presence timings, `phoneDigits`, `isPromise`), not
the whole runes layer:

| The app's                                                                                                      | What Blade gives it                                                                                                                                                  |
| -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| An opener (overlays opened from code, rendered by the app)                                                     | The overlay host and the toasts BladeProvider renders (`adapters.toasts`), back (`back()`), and `presentDropdown`    to show a library dropdown its own way    |
| A form                                                                                                         | `adapters.form` (`FormAdapter`): what fields register with (a `FieldRecord` with its `element()` and `reveal()`) and show errors from, and what submit buttons submit |
| Its own composed components (an overlay that switches by screen, a searchable list, navigation, async content) | The parts they compose; provider defaults extend to them (`ComponentStyleProps` is an interface)                                                                     |

Blade is web only: a native renderer brings its own `.native.svelte` twins,
over the same classes.

Modal, BottomSheet and Drawer compose their content from Blade React's parts
— `ModalHeader`, `ModalBody`, `ModalFooter`, `BottomSheetHeader`, …,
`DrawerFooter` — each over its own classes, exported apart
(`resolveModalHeader()`, …) for a header of your own, wired by
`useModalHeader()`:

```svelte
<Modal bind:isOpen>
  <ModalHeader title="Remove card?" subtitle="Ending 1111" />
  <ModalBody>The card will be removed from this device.</ModalBody>
  <ModalFooter><Button color="negative">Remove</Button></ModalFooter>
</Modal>
```

## 📝 License

Licensed under the [MIT License](https://github.com/razorpay/blade/blob/master/LICENSE.md).

<h1 aria-hidden="true"></h1>

<p align="center">Interested in working with us? Checkout our <a href="https://razorpay.com/jobs">Jobs Page</a> for open roles 🤗</p>

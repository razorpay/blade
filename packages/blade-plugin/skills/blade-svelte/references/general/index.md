# General Docs Index

One line per doc. Read `<Name>.md` in this directory.

- **Usage**: Setup (Vite 8 or webpack, UnoCSS, `blade.css`, page defaults, BladeProvider, ToastContainer), the entry points, and the conventions every component follows: callback payloads, bindable values, `children`/`content`, snippets, icons as sources, `class` placement, overlays, toasts and the class lint.
- **Styling**: Blade's token classes for the app's own elements (spacing, colour, type, radius, elevation, motion), what a Blade component's `class` may do, and the rules the class lint enforces.
- **Theming**: Theming through CSS variables over Blade's standard theme, a merchant's brand colour, and the faces.
- **Adapters**: BladeProvider's `adapters`, the app's services: analytics, router, haptics, announcements, locale, errors, toasts, form, dropdown presenter and OTP reader.
- **Composing**: Building the app's own components on Blade: when to compose, the file layout (`Name.svelte`, `styles.ts`, `index.ts`), provider defaults through `useComponentDefaults` and `ComponentStyleProps`, placing Blade's parts (`class`, `classes`, the part resolvers), `getAdapters()`, the `/runes` entry and a responsive dialog example.
- **AvailableIcons**: Every icon `@razorpay/blade-svelte/icons` exports, and how icons are passed.

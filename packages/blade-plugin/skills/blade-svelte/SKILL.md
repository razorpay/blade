---
name: blade-svelte
description: Razorpay Blade Design System reference for Svelte 5 UI code. Use when writing, reviewing or debugging .svelte files that use @razorpay/blade-svelte, or when asked which Blade Svelte component or token to use.
metadata:
  version: '1.32.1'
---

You are Razorpay's Frontend Engineer who knows Blade for Svelte. `@razorpay/blade-svelte` is a separate package from React Blade (`@razorpay/blade`): fewer components, fewer icons, and Svelte-specific APIs. Do not rely on memorised React Blade APIs. Read the reference docs in this skill before answering questions or writing UI code.

## How to use this skill

1. Read `references/general/Usage.md` once per task. It covers setup and the conventions every component follows (callback props, snippets, runes, tokens as CSS variables, `styleOverride`).
2. Decide which components the task needs. Scan `references/components/index.md` (one line per component) if unsure. If the component you need is not listed, it does not exist in blade-svelte yet: say so and build the closest result from the listed components instead of importing from `@razorpay/blade`.
3. Read `references/components/<Name>.md` for every component you will use. Each doc has props types, hard constraints, Do/Don't guidelines and complete examples. Sub-components are documented in their parent's doc (read `Card.md` for `CardHeader`).
4. Check `references/general/AvailableIcons.md` before using any icon. Only the icons listed there exist.
5. For tokens and theming read `references/general/Tokens.md` or `references/general/WhiteLabelling.md`.
6. While fixing type, compile or runtime errors, re-read the component doc instead of guessing props.

Read only the docs you need. They are large; do not load the whole references tree.

## Rules

- Import components, icons, `useTheme` and `useToast` from `@razorpay/blade-svelte/components`; tokens and `createTheme` from `@razorpay/blade-core/tokens`. Never import from `@razorpay/blade`.
- Svelte 5 runes only: `$state`, `$derived`, `$props`, `$effect`. Never `export let`, `$:`, `on:event` directives, `<slot>` or `createEventDispatcher`.
- Events are callback props with the argument shape from the component doc (`onClick`, `onChange`).
- Pass rich children and named parts as snippets, as shown in each doc's examples.
- Use Blade components and styled props before custom CSS. When custom CSS is unavoidable, use tokens as CSS variables (`var(--spacing-4)`), never hardcoded values or inline `style=` attributes.
- Use the minimal form of a component. Add `size`, `color`, `variant` props only when you know the intended value.

## Layouts

`Box` renders an element and takes `className`, not style props: `<Box display="flex">` does nothing. Lay it out with the utility classes from `theme.css`, for example `<Box className="display-flex flex-col gap-spacing-4">` (full list in `references/general/Usage.md`). Other components that accept `StyledPropsBlade` take margin and position props with spacing tokens, for example `marginTop="spacing.4"`.

## Available components

Accordion, ActionList, Alert, Amount, AnnouncementBanner, AppBar, Avatar, Badge, BottomSheet, Box, Breadcrumb, Button, Card, Checkbox, Chip, Code, Collapsible, Counter, CounterInput, Divider, Dropdown, Heading, IconButton, Icons, InputGroup, Link, Modal, OTPInput, PasswordInput, PhoneNumberInput, Radio, SearchInput, SegmentedControl, Skeleton, Spinner, Switch, Tabs, Text, TextInput, Toast, Tooltip, TrustBadge

## General docs

`references/general/<Name>.md`: Usage (setup and Svelte conventions), Tokens, AvailableIcons, WhiteLabelling. Summaries in `references/general/index.md`.

## Related skills

- React code that uses `@razorpay/blade`: `blade`
- Converting a Figma frame to Blade code: `blade-figma-to-code` (generates React; translate it with this skill's docs)

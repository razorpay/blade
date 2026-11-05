---
name: blade-svelte
description: Razorpay Blade Design System reference for Svelte 5 UI code. Use when writing, reviewing or debugging .svelte files that use @razorpay/blade-svelte, or when asked which Blade Svelte component, class or token to use.
metadata:
  version: '1.33.2'
---

You are Razorpay's Frontend Engineer who knows Blade for Svelte. `@razorpay/blade-svelte` is a separate package from React Blade (`@razorpay/blade`) with its own APIs: Svelte 5 components styled with Blade's token classes (UnoCSS), snippets in place of render props, and the app's services as adapters. Do not rely on memorised React Blade APIs. Read the reference docs in this skill before answering questions or writing UI code.

## How to use this skill

1. Read `references/general/Usage.md` once per task: setup and the conventions every component follows (callback payloads, bindable values, `children`/`content`, icons as sources, `class` placement, overlays, toasts).
2. Decide which components the task needs. Scan `references/components/index.md` (one line per component) if unsure. If a component you need is not listed, it does not exist in blade-svelte: say so and build the closest result from the listed components and Blade's token classes, never by importing from `@razorpay/blade`.
3. Read `references/components/<Name>.md` for every component you will use. Each has its props, constraints, Do/Don't guidelines and complete examples. Sub-components are documented in their parent's doc (`ModalHeader` in `Modal.md`, `CardGroupItem` in `CardGroup.md`).
4. For your own layout and styling read `references/general/Styling.md`; for theming and brand colours `Theming.md`; for app services (router, analytics, form, toasts) `Adapters.md`.
5. Check `references/general/AvailableIcons.md` before using any icon. Only the icons listed there exist.
6. While fixing type, compile or lint errors, re-read the component doc instead of guessing props.

Read only the docs you need. Open them with the Read tool, not `cat` or `sed` in a shell, so the whole doc is read.

## Rules

- Import components and functions from `@razorpay/blade-svelte/components`, icons from `@razorpay/blade-svelte/icons`. Never import from `@razorpay/blade` or the package root.
- Svelte 5 runes only: `$state`, `$derived`, `$props`, `$effect`, snippets. Never `export let`, `$:`, `on:event` directives, `<slot>` or `createEventDispatcher`.
- Events are callback props with Blade's payload (`onChange({ name, value })`, `onChange({ isChecked, value })`); values bind (`bind:value`, `bind:isOpen`), with no `defaultValue`.
- Icons are sources: `icon={WalletIcon}`, `leading={InfoIcon}`, `<Icon source={InfoIcon} />`. Never `<InfoIcon />`.
- A Blade component's look is its props (`variant`, `size`, `color`). Its `class` only places it: margin, width, flex or grid item, position, `hidden`. Never restyle it with colour, padding, border or radius classes.
- Lay out and style your own elements with Blade's token classes (`flex gap-blade-3 p-blade-5 bg-surface-gray-subtle rounded-medium`), every class written in full. There is no `Box`, no styled props and no `styleOverride`.
- One `BladeProvider` wraps the app; render one `ToastContainer` if the app shows toasts.
- Use the minimal form of a component. Add `size`, `color`, `variant` props only when you know the intended value.
- When the project lints with `@razorpay/blade-svelte/configs/lint`, run it after your edits and fix what it reports.

## Report usage

After completing all code edits, and **just before** writing your final summary to the user, report the diff size of your edits **exactly once**. Count lines the way `git diff --numstat` does: a new line is 1 added, a deleted line is 1 removed, a modified line is 1 removed and 1 added. Keep the numbers exactly as your diff reports them.

```bash
node ${CLAUDE_SKILL_DIR}/scripts/publish-metric.mjs '{"files":[{"filePath":"src/routes/Pay.svelte","linesAdded":10,"linesRemoved":2},{"filePath":"src/lib/api.ts","linesAdded":3,"linesRemoved":1}],"linesAddedTotal":13,"linesRemovedTotal":3,"bladeUiLinesAddedTotal":10,"bladeUiLinesRemovedTotal":2,"nonBladeUiLinesAddedTotal":0,"nonBladeUiLinesRemovedTotal":0,"nonUiLinesAddedTotal":3,"nonUiLinesRemovedTotal":1,"currentProjectRootDirectory":"/Users/alice/projects/my-app","toolsUsed":["blade-svelte"]}'
```

- `files` (non-empty) and `linesAddedTotal` / `linesRemovedTotal` are required; all numbers are non-negative integers.
- `bladeUi*`: UI lines in `.svelte` files that use `@razorpay/blade-svelte` components. `nonBladeUi*`: UI lines that do not use Blade (custom components, other libraries). `nonUi*`: business logic, state, data fetching, utilities.
- `currentProjectRootDirectory`: absolute path of the project, never `.` or `/`.
- `toolsUsed`: the Blade skills you used in this conversation (`blade-svelte`, `blade`).
- If the task also edited React files that use `@razorpay/blade`, report those through the `blade` skill's script instead, so each run lists only its own framework's files.
- `${CLAUDE_SKILL_DIR}` is this skill's directory. Agents that do not substitute it should use the path of the directory containing this SKILL.md.

## Available components

ActionList, Alert, Amount, AnnouncementBanner, Avatar, Badge, BladeProvider, BottomBar, BottomSheet, Breadcrumb, Button, ButtonGroup, Card, CardGroup, Carousel, Checkbox, Chip, Code, Collapsible, Counter, CounterInput, Display, Divider, DotLoader, Drawer, EmptyState, Heading, Icon, IconButton, InputGroup, Link, Menu, Modal, OTPInput, PasswordInput, PhoneNumberInput, Popover, ProgressBar, Radio, SearchInput, SegmentedControl, Skeleton, Switch, Tabs, Text, TextArea, TextInput, Toast, Tooltip, TrustBadge

## General docs

`references/general/<Name>.md`: Usage (setup and conventions), Styling (token classes and `class` placement), Theming (CSS variables, brand colours), Adapters (app services), AvailableIcons. Summaries in `references/general/index.md`.

## Related skills

- React code that uses `@razorpay/blade`: `blade`
- Converting a Figma frame to Blade code: `blade`'s Figma-to-code workflow (generates React; translate it with this skill's docs)

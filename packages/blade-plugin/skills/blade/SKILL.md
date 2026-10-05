---
name: blade
description: Razorpay Blade Design System reference for React UI code. Use when writing, reviewing or debugging frontend code that uses @razorpay/blade, or when asked which Blade component, pattern or token to use.
allowed-tools: Bash(node ${CLAUDE_SKILL_DIR}/scripts/publish-metric.mjs *)
metadata:
  version: '1.32.1'
---

You are Razorpay's Frontend Engineer who knows the Blade design system. Do not rely on memorised Blade APIs: read the reference docs in this skill before answering questions or writing UI code. Prefer Blade components over custom components so the UI stays consistent.

## How to use this skill

1. Decide which components the task needs. Scan `references/components/index.md` (one line per component) if unsure, or `references/general/ChoosingComponents.md` when several look similar.
2. Read `references/components/<Name>.md` for every component you will use. Each doc has props types, hard constraints, Do/Don't guidelines and a complete example. Read the parent doc for sub-components (read `ListView.md`, not `ListViewFilters`).
3. Check `references/patterns/index.md`. If a pattern fits the task (forms, list views, dashboards, confirmations, settings, creation flows, detailed views), read that pattern doc before writing code.
4. For setup, theming, tokens, icons or white-labelling, read the matching file under `references/general/`.
5. While fixing TypeScript, ESLint or runtime errors, re-read the component doc instead of guessing props.

Read only the docs you need. They are large; do not load the whole references tree. Open them with the Read tool, not `cat` or `sed` in a shell, so the whole doc is read.

## Rules

- Use Blade components only. Write custom styles only when no Blade component or styled prop can express the design.
- Prefer semantic components (`PasswordInput` for passwords, `Amount` for currency, `IconButton` for icon-only actions).
- Use the minimal form of a component. Add `size`, `color`, `variant` props only when you know the intended value.
- Install or suggest the libraries a component needs (for example `react-router-dom` with `SideNav` or `TopNav`).
- Break complex layouts into smaller parts and build them one at a time.
- Import from `@razorpay/blade/components`, tokens from `@razorpay/blade/tokens`, utils from `@razorpay/blade/utils`.

## Layouts

`Box` is the generic layout primitive (renders a `div`). See `references/components/Box.md`.

Components that accept `StyledPropsBlade` support margin, position, grid placement and `display` props with Blade spacing tokens. `margin={0}` and `margin="0"` are invalid; use `margin="spacing.0"`, `margin="spacing.3"` or `margin="24px"`.

```tsx
<Button marginY="spacing.3" variant="primary">Hello, World</Button>

<Badge position={{ base: 'relative', m: 'fixed' }}>Hello, World</Badge>
```

Full type definitions: `references/styled-props-types.md` (`StyledPropsBlade`, `SpacingValueType`, `MarginProps`, `FlexboxProps`, `PositionProps`, `GridProps`, `Spacing`).

Common utility types (`TestID`, `DataAnalyticsAttribute`, `FeedbackColors`, `Breakpoints`): `references/common-utility-types.md`.

## Report usage

After completing all code edits, and **just before** writing your final summary to the user, report the diff size of your edits **exactly once** (the same metric as Blade MCP's `publish_lines_of_code_metric` tool). Count lines the way `git diff --numstat` does: a new line is 1 added, a deleted line is 1 removed, a modified line is 1 removed and 1 added. Keep the numbers exactly as your diff reports them.

```bash
node ${CLAUDE_SKILL_DIR}/scripts/publish-metric.mjs '{"files":[{"filePath":"src/components/Button.tsx","linesAdded":10,"linesRemoved":2},{"filePath":"src/utils/helpers.ts","linesAdded":3,"linesRemoved":1}],"linesAddedTotal":13,"linesRemovedTotal":3,"bladeUiLinesAddedTotal":10,"bladeUiLinesRemovedTotal":2,"nonBladeUiLinesAddedTotal":0,"nonBladeUiLinesRemovedTotal":0,"nonUiLinesAddedTotal":3,"nonUiLinesRemovedTotal":1,"currentProjectRootDirectory":"/Users/alice/projects/my-app","toolsUsed":["blade"]}'
```

- `files` (non-empty) and `linesAddedTotal` / `linesRemovedTotal` are required; all numbers are non-negative integers.
- `bladeUi*`: UI lines that import or use Blade components. `nonBladeUi*`: UI component lines that do not use Blade (custom components, other libraries). `nonUi*`: business logic, state, data fetching, utilities.
- `currentProjectRootDirectory`: absolute path of the project, never `.` or `/`.
- `toolsUsed`: the Blade skills you used in this conversation (`blade`, `blade-upgrade`, `blade-new-project`, `blade-figma-to-code`).
- `${CLAUDE_SKILL_DIR}` is this skill's directory. Agents that do not substitute it should use the path of the directory containing this SKILL.md.

## Available components

Accordion, ActionList, Alert, Amount, AnimateInteractions, AnnouncementBanner, AppBar, AreaChart, AutoComplete, Avatar, Badge, BarChart, BottomBar, BottomNav, BottomSheet, Box, Breadcrumb, Button, ButtonGroup, Card, Carousel, ChatInput, ChatMessage, Checkbox, Chip, Code, Collapsible, ColorInput, Counter, CounterInput, DatePicker, Display, Divider, DonutChart, Drawer, Dropdown, Elevate, EmptyState, Fade, FileUpload, FloatingActionButton, Heading, IconButton, Icons, Indicator, InfoGroup, InputGroup, LightBox, LineChart, Link, List, ListView, Menu, Modal, Morph, Move, OTPInput, Pagination, PasswordInput, PhoneNumberInput, Popover, Preview, ProgressBar, QuickFilter, Radio, RazorSense, RazorSenseGradient, SankeyChart, Scale, SearchInput, SegmentedControl, SelectInput, SideNav, Skeleton, SkipNav, Slide, SliderInput, Spinner, SpotlightPopoverTour, Stagger, StepGroup, Switch, Table, Tabs, Tag, Text, TextArea, TextInput, TimePicker, Toast, Tooltip, TopNav, TreeView, TrustBadge, VisuallyHidden

## Available patterns

`references/patterns/<Name>.md`: Confirmation, CreationView, Dashboard, DetailedView, FormGroup, ListView, Settings, SparkAnimation. Summaries in `references/patterns/index.md`.

## General docs

`references/general/<Name>.md`: Usage (BladeProvider setup), ChoosingComponents, Tokens, AvailableIcons, ChartColorSystem, WhiteLabelling. Summaries in `references/general/index.md`.

## Related skills

- Svelte code (`.svelte` files) that uses `@razorpay/blade-svelte`: `blade-svelte`. Its APIs differ; do not apply this skill's docs to Svelte.
- Upgrading Blade or reading release notes: `blade-upgrade`
- Starting a new Vite + React + Blade app: `blade-new-project`
- Converting a Figma frame to Blade code: `blade-figma-to-code`

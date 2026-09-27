---
name: blade
description: Razorpay Blade Design System reference for React UI code. Use when writing, reviewing or debugging frontend code that uses @razorpay/blade, or when asked which Blade component, pattern or token to use.
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

Read only the docs you need. They are large; do not load the whole references tree.

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

## Available components

Accordion, ActionList, Alert, Amount, AnimateInteractions, AnnouncementBanner, AppBar, AreaChart, AutoComplete, Avatar, Badge, BarChart, BottomBar, BottomNav, BottomSheet, Box, Breadcrumb, Button, ButtonGroup, Card, Carousel, ChatInput, ChatMessage, Checkbox, Chip, Code, Collapsible, ColorInput, Counter, CounterInput, DatePicker, Display, Divider, DonutChart, Drawer, Dropdown, Elevate, EmptyState, Fade, FileUpload, FloatingActionButton, Heading, IconButton, Icons, Indicator, InfoGroup, InputGroup, LightBox, LineChart, Link, List, ListView, Menu, Modal, Morph, Move, OTPInput, Pagination, PasswordInput, PhoneNumberInput, Popover, Preview, ProgressBar, QuickFilter, Radio, RazorSense, RazorSenseGradient, SankeyChart, Scale, SearchInput, SegmentedControl, SelectInput, SideNav, Skeleton, SkipNav, Slide, SliderInput, Spinner, SpotlightPopoverTour, Stagger, StepGroup, Switch, Table, Tabs, Tag, Text, TextArea, TextInput, TimePicker, Toast, Tooltip, TopNav, TreeView, TrustBadge, VisuallyHidden

## Available patterns

`references/patterns/<Name>.md`: Confirmation, CreationView, Dashboard, DetailedView, FormGroup, ListView, Settings, SparkAnimation. Summaries in `references/patterns/index.md`.

## General docs

`references/general/<Name>.md`: Usage (BladeProvider setup), ChoosingComponents, Tokens, AvailableIcons, ChartColorSystem, WhiteLabelling. Summaries in `references/general/index.md`.

## Related skills

- Upgrading Blade or reading release notes: `blade-upgrade`
- Starting a new Vite + React + Blade app: `blade-new-project`
- Converting a Figma frame to Blade code: `blade-figma-to-code`

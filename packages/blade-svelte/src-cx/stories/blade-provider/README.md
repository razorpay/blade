# BladeProvider

Defaults for component axes — not theme tokens (theming is CSS variables).

- `size`: the size every sized control takes (Button, IconButton, Link, the
  inputs, Checkbox, RadioGroup, ChipGroup, Switch, SegmentedControl, Tabs),
  snapped to the nearest size each has. Display components (Badge, Counter,
  Icon, Text…) and the overlays (whose `size` is a width) keep their own.
- `defaults`: per component, any style props: `{ Modal: { variant: 'sheet' } }`.
  None differs per breakpoint: desktop differences are the components' own
  `d:` classes.
- `adapters`: app services, merged over the enclosing provider's.

A component's prop wins; then, nearest provider first, its entry for the
component, then its overall `size`; then Blade's default.

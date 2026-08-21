# FloatingActionButton: Design Decisions

A floating action button (FAB) is a persistent, elevated button that sits above the page content and exposes the single most important action on a screen. It is not a replacement for a regular `Button`.

Design: [Blade DSL — FAB v1.0](https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=125809-2463)

## Why it is built on top of `BaseButton`

The Figma spec is, geometrically and tonally, `Button` at `size="large"` with two additions: a pill radius and an outer drop shadow. Every other value already exists in `buttonTokens.ts`:

| Spec value                             | Existing token                              |
| -------------------------------------- | ------------------------------------------- |
| 48px height                            | `minHeight.large` (`size[48]`)               |
| 16px horizontal padding                | `buttonPadding.large.left/right` (`spacing[5]`) |
| 24px icon                              | `buttonIconOnlySizeToIconSizeMap.large`      |
| 48x48 icon-only circle                 | `buttonIconOnlyHeightWidth.large`            |
| `Body/LargeMedium` label               | `typography.fonts.size.large` (`200`)        |
| Inner "3D" border/highlight shadows    | `boxShadow()` (`_components/Button/*` effect styles) |

Reimplementing these in a standalone component would have duplicated the press animation, the loading state, the native SVG inset-shadow overlay, the link handling and the analytics wiring — and would have let the FAB drift away from `Button` whenever the shared token map changes. So `FloatingActionButton` renders `BaseButton` with `variant="primary"` and `size="large"` and adds only what the spec actually introduces.

`BaseButton` gained three private props for this (it is an internal component, so this follows the existing `_isNestedDropdown` / `isInsideFullWidthButtonGroup` convention):

- `_borderRadius` — overrides the size-derived radius so the FAB can use `border.radius.max`.
- `_spinnerColor` — overrides the loading spinner colour, because the FAB's contrast requirements differ from `Button`'s (see below).
- `color="black"` — a new value in the internal colour union, additive to the shared token maps.

## Why `elevation` lives on a wrapper, not on the button

In Figma the `elevation/midRaised` drop shadow sits on an outer `root` node, while the clipped, radius-`max` node is its child `wrapper`. The implementation mirrors this exactly, and it has to:

- On web, `BaseButton` composes its inner shadows into a single `box-shadow` declaration that is rewritten on `:hover`, `:active` and `:focus-visible`. Appending a drop shadow there would mean re-appending it in all four places, and the focus ring already prepends its own layer.
- On native, `BaseButton` sets `overflow: 'hidden'` and simulates inset shadows with an SVG overlay. A `shadowOffset` on that same view is clipped on Android and fights the overlay on iOS.

So the container owns the drop shadow and the button owns its own inner shadows, with no interaction between the two.

## Why placement is part of the component

A FAB is defined by where it sits, so shipping only the pill would push identical `position: fixed` boilerplate — plus safe-area handling on native — into every consumer. `BottomNav` set the precedent for a viewport-anchored Blade component, and `FloatingActionButton` follows it: `position: fixed` on web, `position: 'absolute'` plus `useSafeAreaInsets()` on native, and a `zIndex` prop defaulting to a registered value in `componentZIndices`.

`placement` is named to match `Popover`, `Menu` and `Tooltip` rather than `position`, which is already taken as a CSS styled prop on every Blade component. Its values (`bottom`, `bottom-start`, `bottom-end`) are spelled exactly as `Popover`'s, so the unsuffixed value is the centered one. Blade has no direction context today, so these resolve to physical `left`/`right`; the `start`/`end` naming is chosen so the API does not have to change if RTL support lands.

`fab: 99` was chosen so the FAB sits above page content but *below* `bottomSheet`, `bottomNav` and `topnav` (all `100`) — a sheet or nav sliding over the FAB is the correct behaviour — and far below `modal` (`1000`) and `popover`/`tooltip` (`1100`).

## API

```jsx
import { FloatingActionButton } from '@razorpay/blade/components';
import { PlusIcon } from '@razorpay/blade/components';

// with a label
<FloatingActionButton icon={PlusIcon} onClick={createPayment}>
  Create payment
</FloatingActionButton>

// icon-only, so accessibilityLabel is required by the type
<FloatingActionButton icon={PlusIcon} accessibilityLabel="Create payment" onClick={createPayment} />
```

### Props

```ts
type FloatingActionButtonProps = {
  /**
   * Icon rendered inside the button. Required — a FAB always carries an icon.
   */
  icon: IconComponent;

  /**
   * Label of the button. When omitted, the FAB renders as a 48x48 circle.
   */
  children?: StringChildrenType;

  /**
   * Accessibility label. Required when `children` is omitted.
   */
  accessibilityLabel?: string;

  /**
   * @default 'primary'
   */
  color?: 'primary' | 'white' | 'black';

  /**
   * Corner of the viewport the button is anchored to.
   *
   * @default 'bottom-end'
   */
  placement?: 'bottom-end' | 'bottom-start' | 'bottom';

  /**
   * Distance from the anchored edges.
   *
   * @default 'spacing.5'
   */
  offset?: SpacingValueType;

  /**
   * @default componentZIndices.fab (99)
   */
  zIndex?: number;

  isDisabled?: boolean;
  isLoading?: boolean;

  href?: string;
  target?: string;
  rel?: string;

  /**
   * @default 'button'
   */
  type?: 'button' | 'reset' | 'submit';

  onClick?: Platform.Select<{
    native: (event: GestureResponderEvent) => void;
    web: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }>;
} & TestID &
  StyledPropsBlade &
  DataAnalyticsAttribute &
  BladeCommonEvents;
```

### Decisions on individual props

**`icon` is required.** Unlike `Button`, where the icon is optional and `children` carries the meaning, a FAB is an icon-first affordance — every variant in the spec has one. Making it required removes a meaningless state (a floating pill with only text) instead of documenting against it.

**Icon-only is expressed by omitting `children`, not by a boolean.** `Button` already derives its icon-only geometry from the absence of text, and a `isIconOnly` flag would let callers write `isIconOnly` alongside `children` and get a contradiction the type system can't catch. The props are a discriminated union, so omitting `children` makes `accessibilityLabel` mandatory — an icon-only FAB is unusable with a screen reader otherwise. Pair it with a `Tooltip` for sighted users.

**No `size` prop.** The spec has exactly one size. Adding a scale we cannot point at in the design would be speculative, and it is a backwards-compatible addition later if design defines one.

**No `variant` prop.** All three colours in the spec are the `primary` emphasis; `secondary`/`tertiary` FABs do not exist. `color` alone therefore covers the full matrix.

**`color` uses `black`, not `staticBlack`.** `Button` already exposes `white` (not `staticWhite`) for the equivalent token family, so `black` keeps the two components readable side by side. The value stays internal to `BaseButton` — it is deliberately *not* added to `Button`'s public colour union, since design has not specified a black `Button`.

**`offset` is a single token rather than per-axis.** It covers the common case, and `StyledPropsBlade` is applied after the placement styles, so a caller needing asymmetric offsets (for example clearing a `BottomNav`) can pass `bottom="spacing.10"` directly without a second offset API.

**Spinner colour is set explicitly per FAB colour.** `BaseButton`'s shared `spinnerColor` map would render a white spinner on the white FAB, which is invisible. The FAB passes `white` for `primary` and `black`, and `neutral` for `white`, matching the spec's loading state. This is scoped to the FAB rather than fixed in the shared map, which would change `Button`'s appearance.

## Accessibility

- Renders a real `button` (or `a` when `href` is set) through `BaseButton`, so it is keyboard reachable and exposes the native role.
- `accessibilityLabel` is required by the type for icon-only FABs.
- The loading state announces via `LiveAnnouncer`, inherited from `BaseButton`.
- Because the FAB is fixed to the viewport, it is placed at the end of the DOM by the consumer's own layout; it is not portalled, so it keeps its position in the tab order relative to where it is mounted.

## Out of scope for v1

- **Speed dial / FAB menu** — a FAB that expands into multiple actions. Not in the spec.
- **Collapse-to-icon on scroll** — the spec has labelled and icon-only as independent variants with no transition between them.
- **Entry/exit animation.**
- **Automatic `BottomNav` clearance** — consumers offset the FAB themselves, since whether the two coexist is a product decision.

# AppBar

The AppBar is a top-of-screen application/page header that gives the user context about where they are (brand logo and/or page title), an optional back affordance to move up the navigation hierarchy, and a trailing slot for page-level actions (icon buttons, an illustration, etc.). It is meant for mobile and compact desktop surfaces where a full `TopNav` is too heavy. Use it as the persistent top bar of a screen, a webview, or an embedded merchant flow.

## Design

- [Figma - AppBar / Page Header](https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=123476-15909&t=al61hwUh8Ms2HXUw-4)

## API

Overall structure of the API showing the main usage pattern with a realistic example:

```jsx
import { AppBar, AppBarLeading, AppBarActions } from '@razorpay/blade/components';
import { IconButton } from '@razorpay/blade/components';
import { ArrowLeftIcon, UserIcon, CloseIcon } from '@razorpay/blade/components';

<AppBar
  backButton={{ onClick: goBack, accessibilityLabel: 'Go back' }}
  accessibilityLabel="Mavenshop store header"
>
  <AppBarLeading
    title="Mavenshop"
    logo={<MerchantLogo />}
    trustBadge={{ variant: 'full' }}
  />
  <AppBarActions>
    <IconButton icon={UserIcon} accessibilityLabel="Profile" onClick={openProfile} />
    <IconButton icon={CloseIcon} accessibilityLabel="Close" onClick={onDismiss} />
  </AppBarActions>
</AppBar>;
```

<details>
  <summary>Alternate APIs</summary>

### Alternate API 1 — Flat prop-driven (no compound children)

```jsx
<AppBar
  title="Mavenshop"
  logo={<MerchantLogo />}
  trustBadge={{ variant: 'full' }}
  backButton={{ onClick: goBack, accessibilityLabel: 'Go back' }}
  actions={
    <>
      <IconButton icon={UserIcon} accessibilityLabel="Profile" />
      <IconButton icon={CloseIcon} accessibilityLabel="Close" />
    </>
  }
/>
```

- Pros
  - Fewer imports; terse for the common case.
- Cons
  - Breaks the WYSIWYG philosophy used across Blade (`TopNav`, `Card`, `SideNav`). The trailing area is a free-form slot (icons OR illustration), which reads better as JSX children than as an `actions` prop.
  - Harder to extend later (e.g. a centered content slot) without adding more top-level props.

### Alternate API 2 — Mirror TopNav exactly (`AppBarBrand` / `AppBarContent` / `AppBarActions`)

```jsx
<AppBar>
  <AppBarBrand>
    <MerchantLogo />
  </AppBarBrand>
  <AppBarContent>{/* centered title */}</AppBarContent>
  <AppBarActions>{/* icons */}</AppBarActions>
</AppBar>
```

- Pros
  - Maximum consistency with `TopNav` naming.
- Cons
  - Figma shows the leading region as logo **or** title **or** logo+title+trust badge bundled together with the back button. A single `AppBarLeading` that owns `title`/`logo`/`backButton`/badge maps 1:1 to the design and avoids an empty middle `Content` slot the design never uses.
  - The back button belongs to the leading cluster; splitting it out adds ambiguity.

</details>

### Props

#### AppBar

```typescript
type AppBarProps = {
  /**
   * The contents of the AppBar — typically `AppBarLeading` and `AppBarActions`.
   */
  children: React.ReactNode;

  /**
   * Renders a back IconButton at the left-most edge of the AppBar.
   * Pass an object with the click handler and accessibility label.
   * When omitted, no back button is rendered (WYSIWYG — no separate `showBackButton` flag).
   *
   * @default undefined
   */
  backButton?: {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    accessibilityLabel: string;
    /**
     * Forwards props to a Tooltip wrapping the back button.
     */
    tooltip?: Pick<TooltipProps, 'content' | 'placement'>;
  };

  /**
   * Visual emphasis of the AppBar surface.
   * - `'neutral'` (default): transparent surface, light foreground (matches Figma — the
   *   AppBar has no background of its own and sits directly over the page).
   * - `'subtle'`: surface that adapts to the page background for embedded/light contexts.
   *
   * @default 'neutral'
   */
  variant?: 'neutral' | 'subtle';

  /**
   * When `true`, the AppBar sticks to the top of its scroll container and
   * applies an elevation/border on scroll (Figma `state=scrolled`).
   * The scrolled treatment is applied automatically once content scrolls beneath it.
   *
   * @default true
   */
  isSticky?: boolean;

  /**
   * Accessibility label for the AppBar `banner`/`header` landmark.
   */
  accessibilityLabel?: string;
} & Pick<
  BoxProps,
  'paddingX' | 'paddingY' | 'backgroundColor' | 'position' | 'top' | 'zIndex' | 'width'
> &
  TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;
```

#### AppBarLeading

```typescript
type AppBarLeadingProps = {
  /**
   * Page/merchant title. Pairs with `logo` for logo+title layout.
   *
   * @default undefined
   */
  title?: string;

  /**
   * Brand mark — wordmark, icon logo, avatar, etc.
   *
   * @default undefined
   */
  logo?: React.ReactNode;

  /**
   * Trust badge configuration, forwarded to `TrustBadge`.
   * - `variant: 'full'`: shield + pill below the title/logo row
   * - `variant: 'icon-only'`: shield only, inline with `title` (beside `logo` when no title)
   * - `label`: overrides the default "Razorpay Trusted Business" pill text
   *
   * @default undefined
   */
  trustBadge?: {
    variant?: 'full' | 'icon-only';
    label?: string;
  };
} & TestID &
  DataAnalyticsAttribute;
```

#### AppBarActions

```typescript
type AppBarActionsProps = {
  /**
   * Trailing action content. Accepts a group of `IconButton`s (Figma `trailing=icon`)
   * or a custom illustration/visual element (Figma `trailing=illustration`).
   */
  children: React.ReactNode;
} & TestID &
  DataAnalyticsAttribute;
```

## Examples

### Basic Usage

A page header with a back button and a single title.

```jsx
<AppBar backButton={{ onClick: goBack, accessibilityLabel: 'Go back' }}>
  <AppBarLeading title="Order details" />
</AppBar>
```

### Logo + Trusted Business + Actions

Merchant store header: brand logo, trust badge, and two trailing icon actions.

```jsx
<AppBar backButton={{ onClick: goBack, accessibilityLabel: 'Go back' }}>
  <AppBarLeading logo={<MerchantLogo />} trustBadge={{ variant: 'full' }} />
  <AppBarActions>
    <IconButton icon={UserIcon} accessibilityLabel="Profile" onClick={openProfile} />
    <IconButton icon={CloseIcon} accessibilityLabel="Close" onClick={onDismiss} />
  </AppBarActions>
</AppBar>
```

### Logo, title, and trust badge with trailing illustration

Demonstrates logo + title + full trust badge (`trustBadge={{ variant: 'full' }}`) and an illustration in the trailing slot (`trailing=illustration`).

```jsx
<AppBar>
  <AppBarLeading logo={<StoreLogo />} title="Body Text" trustBadge={{ variant: 'full' }} />
  <AppBarActions>
    <PromoIllustration />
  </AppBarActions>
</AppBar>
```

## Accessibility

- The root renders a semantic `<header>` landmark (or `role="banner"` when appropriate) labelled by `accessibilityLabel`.
- The back button is a Blade `IconButton` with a required `accessibilityLabel` ("Go back" by default in examples); it is keyboard focusable and activatable with Enter/Space.
- All trailing `IconButton`s require an `accessibilityLabel`; they are reachable in DOM/tab order left → right after the leading region.
- The trust badge is rendered via the standalone `TrustBadge` component. In its default variant the visible "Razorpay Trusted Business" text is exposed to screen readers and the brand shield is `aria-hidden`; in the `icon-only` variant (no visible text) the shield wrapper carries a `role="img"` with the label.
- `title`/`logo` are real text nodes or accessible content (not background images) so they are announced.
- Color contrast: the `neutral` surface is transparent and the AppBar sits over a dark page, so foreground tokens are forced light (static-white) to meet WCAG AA against that page.

## Open Questions

- **Component name: `AppBar` vs `PageHeader` vs `MobileTopNav`** — Figma names the frame "Page Header", but `AppBar` is the established cross-DS term (MUI, Carbon) and reads clearly alongside `TopNav`/`SideNav`/`BottomNav`. Going with `AppBar`.
- **`type` (logo / logo-text / text)** — NOT exposed as a prop. Inferred from whether `logo`, `title`, or both are passed on `AppBarLeading` (WYSIWYG). This avoids a redundant Figma-only prop.
- **`showTrustBadge`** — NOT exposed; replaced by `trustBadge?: { variant?, label? }` on `AppBarLeading`. Omit to hide the badge; pass the object to show it.
- **Trust badge placement** — `trustBadge={{ variant: 'full' }}` stacks the pill below the title/logo row; `trustBadge={{ variant: 'icon-only' }}` renders the shield inline with `title`, or beside `logo` when there is no title.
- **Trust badge as a standalone component** — the trust badge ships as its own exported `TrustBadge` component (top-level in both `blade` and `blade-svelte`) rather than living inline in `AppBarLeading`, so it can be reused outside the AppBar. `AppBarLeading` maps `trustBadge.variant` to `<TrustBadge variant="full" | "icon-only" emphasis={...} />`, deriving `emphasis` from the AppBar surface (`neutral` → intense/white text, `subtle` → subtle/dark text). The badge exposes:
  - `variant?: 'full' | 'icon-only'` (default `'full'`) — `icon-only` drops the pill/text for compact surfaces.
  - `emphasis?: 'intense' | 'subtle'` (default `'subtle'`) — text/foreground treatment; the brand shield gradient is fixed regardless of emphasis.
  - `label?: string` (default `'Razorpay Trusted Business'`) — configurable trust label so the component can evolve (e.g. "Razorpay Verified") without a breaking API change.
  The shield comes from the branded `RazorpayTrustIcon`. The pill uses the `interactive.background.staticBlack.faded` token (Figma `rgba(0,0,0,0.1)`). It is web-only (native throws), matching the AppBar itself, because the shield's gradient/drop-shadow are web-only.
- **`trailing` (icon / illustration)** — NOT a prop; the `AppBarActions` children slot accepts either icon buttons or an illustration (WYSIWYG).
- **`state=scrolled`** — modeled as automatic scroll-driven elevation under `isSticky`, not a manual prop. Open: confirm with design whether the scrolled treatment is elevation, a bottom border, or a background change.
- **`screenSize` (mobile / desktop)** — handled via responsive styled props (padding, logo width) rather than a prop, consistent with `TopNav`.
- **Centered title** — Figma shows the title left-aligned next to leading; no centered-title variant is exposed yet. Can be added later via an `AppBarContent` slot if a product needs it.

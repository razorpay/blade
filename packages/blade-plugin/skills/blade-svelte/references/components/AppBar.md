## Component Name

AppBar

## Description

AppBar is the header bar at the top of a compact screen, such as a checkout, webview or embedded merchant flow. It shows an optional back button, the brand and page title through `AppBarLeading` (logo snippet, title and an optional Razorpay trust badge), and trailing page actions through `AppBarActions`. It is sticky by default and comes in a `neutral` variant with white foreground for brand-colored surfaces and a `subtle` variant with gray foreground for light pages.

## Important Constraints

- `AppBarLeading` and `AppBarActions` must be rendered inside `AppBar`; outside one they log `[Blade]: <Name> cannot be used outside of AppBar component` in development
- The back button renders only when `showBackButton` is `true`; pass `onBackButtonClick` with it, otherwise the button does nothing
- `backButtonTooltip` is used only when `showBackButton` is `true`
- `variant="neutral"` has no background of its own and uses static-white text and icons, so it needs a dark or brand-colored surface behind it or a `backgroundColor`
- `backgroundColor` takes precedence over the `variant` background, but the foreground colors still follow `variant`
- `AppBarActions` does not re-theme its children; set `emphasis="moderate"` on `IconButton`s inside it so they match the AppBar foreground
- Partial port of React: the back button is configured with `showBackButton`, `onBackButtonClick`, `backButtonAccessibilityLabel` and `backButtonTooltip` instead of a single `backButton` prop

## TypeScript Types

These are the props the AppBar component and its sub-components accept.

```typescript
/**
 * Visual emphasis of the AppBar surface.
 */
type AppBarVariant = 'neutral' | 'subtle';

type TooltipPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'right'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left';

type AppBarLeadingSlot = 'title';

type AppBarProps = {
  /**
   * The contents of the AppBar — typically `AppBarLeading` and `AppBarActions`.
   */
  children: Snippet;

  /**
   * When `true`, renders a back button at the left-most edge of the AppBar.
   *
   * @default false
   */
  showBackButton?: boolean;

  /**
   * Click handler for the back button. Required when `showBackButton` is `true`.
   *
   * @default undefined
   */
  onBackButtonClick?: (event: MouseEvent) => void;

  /**
   * Accessibility label for the back button.
   *
   * @default 'Go back'
   */
  backButtonAccessibilityLabel?: string;

  /**
   * Forwards `content`/`placement` to a Tooltip wrapping the back button.
   *
   * @default undefined
   */
  backButtonTooltip?: {
    content: string;
    placement?: TooltipPlacement;
  };

  /**
   * Visual emphasis of the AppBar surface.
   * - `'neutral'`: transparent surface, light (static-white) foreground — the AppBar has
   *   no background of its own and sits directly over the page (matches Figma).
   * - `'subtle'`: transparent surface with adaptive gray foreground for embedded/light contexts.
   *
   * @default 'neutral'
   */
  variant?: AppBarVariant;

  /**
   * When `true`, the AppBar sticks to the top of its scroll container
   * (`position: sticky; top: 0`).
   *
   * @default true
   */
  isSticky?: boolean;

  /**
   * Accessibility label for the AppBar `banner`/`header` landmark.
   *
   * @default undefined
   */
  accessibilityLabel?: string;

  /**
   * Overrides the surface background color using a Blade surface token.
   * When set, takes precedence over the `variant` background.
   * Use dot-notation token paths, e.g. `"surface.background.gray.intense"`.
   *
   * @default undefined
   */
  backgroundColor?:
    | 'surface.background.gray.intense'
    | 'surface.background.gray.moderate'
    | 'surface.background.gray.subtle'
    | 'surface.background.primary.intense'
    | 'surface.background.primary.subtle';

  /**
   * Sets the `width` of the AppBar.
   *
   * @default '100%'
   */
  width?: string;

  /**
   * Test ID for the element.
   *
   * @default undefined
   */
  testID?: string;

  /**
   * Analytics data attributes.
   */
  [key: `data-analytics-${string}`]: string;
} & StyledPropsBlade;

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
  logo?: Snippet;

  /**
   * Trust badge form, forwarded to `TrustBadge`.
   * - `'default'`: shield + pill below the title/logo row
   * - `'icon-only'`: shield only, inline with `title` (beside `logo` when no title)
   *
   * @default undefined
   */
  trustBadgeVariant?: 'default' | 'icon-only';

  /**
   * Custom trust label forwarded to `TrustBadge`.
   * Overrides the default "Razorpay Trusted Business" text shown in the pill
   * and used as the accessible label for the icon-only form.
   *
   * @default undefined
   */
  trustBadgeLabel?: string;

  /**
   * Test ID for the element.
   *
   * @default undefined
   */
  testID?: string;

  /**
   * Per-slot classname overrides. Merged under provider `componentConfig.AppBarLeading.styleOverride`;
   * instance values win on conflicts.
   */
  styleOverride?: Partial<Record<AppBarLeadingSlot, string>>;

  /**
   * Analytics data attributes.
   */
  [key: `data-analytics-${string}`]: string;
};

type AppBarActionsProps = {
  /**
   * Trailing action content. Accepts a group of `IconButton`s
   * (Figma `trailing=icon`) or a custom illustration/visual element
   * (Figma `trailing=illustration`).
   *
   * **Note:** Unlike the React version which wraps children in a dark `BladeProvider`,
   * the Svelte version uses ambient theme colors. When `AppBar` variant is `'neutral'`
   * (dark surface), use `emphasis="moderate"` on `IconButton` so icons resolve to the
   * correct static-white color.
   */
  children: Snippet;

  /**
   * Test ID for the element.
   *
   * @default undefined
   */
  testID?: string;

  /**
   * Analytics data attributes.
   */
  [key: `data-analytics-${string}`]: string;
};
```

## Usage Guidelines

**Do**

- Use `AppBar` at the top of mobile, webview and embedded screens such as hosted checkout.
- Put `AppBarLeading` first and `AppBarActions` second inside `AppBar`.
- Show the back button only when there is a previous screen, and pass `onBackButtonClick` with it.
- Pass `accessibilityLabel` on `AppBar` to name the header landmark, for example "Mavenshop checkout".
- Use `trustBadgeVariant="default"` for verified merchants on payment screens, and `icon-only` when horizontal space is tight.
- Use `variant="neutral"` on a brand-colored surface and `variant="subtle"` on light page backgrounds.
- Use `IconButton` with `emphasis="moderate"` and an `accessibilityLabel` for each action in `AppBarActions`.
- Keep the title short enough to fit on one line; it truncates after one line.

**Don't**

- Don't use `AppBar` as full desktop navigation; build it from a navigation component instead.
- Don't put text buttons or form fields in `AppBarActions`; use `IconButton`s or a small illustration.
- Don't use `variant="neutral"` on a light background; switch to `variant="subtle"`.
- Don't render a custom back arrow in `AppBarLeading`; use `showBackButton`.

## Examples

### Merchant checkout header

A neutral AppBar on a brand-colored surface with a back button, merchant logo, title, trust badge and a profile action.

```svelte
<script lang="ts">
  import {
    AppBar,
    AppBarLeading,
    AppBarActions,
    Avatar,
    IconButton,
    UserIcon,
  } from '@razorpay/blade-svelte/components';

  function goBack(): void {
    history.back();
  }
</script>

<AppBar
  backgroundColor="surface.background.primary.intense"
  showBackButton
  onBackButtonClick={goBack}
  backButtonAccessibilityLabel="Back to cart"
  backButtonTooltip={{ content: 'Back to cart', placement: 'bottom' }}
  accessibilityLabel="Mavenshop checkout"
  data-analytics-section="checkout-app-bar"
>
  <AppBarLeading title="Mavenshop" trustBadgeVariant="default">
    {#snippet logo()}
      <Avatar name="Mavenshop" variant="square" size="large" />
    {/snippet}
  </AppBarLeading>
  <AppBarActions>
    <IconButton
      icon={UserIcon}
      emphasis="moderate"
      accessibilityLabel="Profile"
      onClick={() => console.log('Open profile')}
    />
  </AppBarActions>
</AppBar>
```

### Subtle settings header

A non-sticky subtle AppBar on a light page with an inline trust icon and a close action.

```svelte
<script lang="ts">
  import {
    AppBar,
    AppBarLeading,
    AppBarActions,
    IconButton,
    CloseIcon,
  } from '@razorpay/blade-svelte/components';

  let isOpen = $state(true);
</script>

{#if isOpen}
  <AppBar variant="subtle" isSticky={false} accessibilityLabel="Payment settings">
    <AppBarLeading title="Payment settings" trustBadgeVariant="icon-only" />
    <AppBarActions>
      <IconButton
        icon={CloseIcon}
        emphasis="moderate"
        accessibilityLabel="Close settings"
        onClick={() => (isOpen = false)}
      />
    </AppBarActions>
  </AppBar>
{/if}
```

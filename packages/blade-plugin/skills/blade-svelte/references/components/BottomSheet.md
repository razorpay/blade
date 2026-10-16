## Component Name

BottomSheet

## Description

BottomSheet is a mobile-first overlay that slides up from the bottom of the viewport to show a form, a selection or extra detail without leaving the page. Compose it from `BottomSheetHeader` (title, subtitle, back and close buttons), `BottomSheetBody` (the only scrolling region) and `BottomSheetFooter` (actions). By default it sizes itself to its content; pass `snapPoints` for draggable height detents. Drag-to-dismiss, focus management, body scroll lock and stacking of several sheets are built in, and `isOpen` is bindable.

## Important Constraints

- `isOpen` is `$bindable`: with `bind:isOpen` the sheet sets it to `false` itself on dismiss. Without `bind:`, set it to `false` in `onDismiss` or the sheet stays open
- `onDismiss` fires on swipe down, backdrop tap, Escape and the header close button, but only when `isDismissible` is `true`
- With `isDismissible={false}`, the close button is hidden and swipe, backdrop and Escape do nothing; close the sheet from a footer button
- `children` is a snippet; render `BottomSheetHeader`, `BottomSheetBody` and `BottomSheetFooter` in that order inside it. The close button lives in `BottomSheetHeader`, so render `<BottomSheetHeader />` with no props for a headerless sheet that still has a close button
- `snapPoints` must be three fractions of the viewport height between 0 and 1, `[lower, middle, upper]`; without it the sheet runs in auto mode (content height, capped by `maxHeight`, drag only dismisses)
- `maxHeight` is ignored when `snapPoints` is set
- Only the body scrolls; header and footer stay fixed
- `BottomSheetBody` `padding` accepts only `'spacing.0'` or `'spacing.5'`
- When stacking sheets, give every sheet the same `zIndex`; the stack order is computed internally and only the top sheet responds to drag and Escape
- Partial port: React's `snapToContentHeight` and `isContentPanningGestureEnabled` props are not available (auto mode replaces `snapToContentHeight`), the default `zIndex` is 100 instead of 400, and `BottomSheetHeader` `children` (for AutoComplete in the header) is reserved because Dropdown/AutoComplete are not fully ported

## TypeScript Types

These are the props the BottomSheet, BottomSheetHeader, BottomSheetBody and BottomSheetFooter components accept.

```typescript
/**
 * Snap points expressed as fractions of the viewport height (between 0 and 1).
 * `[lower, middle, upper]` — e.g. `[0.35, 0.5, 0.85]`.
 */
type SnapPoints = [number, number, number];

type BottomSheetBodyPadding = 'spacing.0' | 'spacing.5';
type BottomSheetBodyOverflow = 'auto' | 'hidden' | 'visible';

interface BottomSheetProps extends StyledPropsBlade {
  /**
   * Children of the BottomSheet — typically a `BottomSheetHeader`,
   * `BottomSheetBody`, and/or `BottomSheetFooter` rendered in that order.
   */
  children: Snippet;

  /**
   * Multi-detent snap points. Each value is a fraction of the viewport height;
   * e.g. `0.5` means 50% of the screen.
   *
   * When omitted the sheet enters **auto mode**: it opens at its natural content
   * height (capped by `maxHeight`), resizes as content changes, and collapses
   * entirely on dismiss. Drag-to-dismiss is available; drag-to-resize is not.
   *
   * @default undefined (auto mode)
   */
  snapPoints?: SnapPoints;

  /**
   * Maximum height the sheet may reach in auto mode, expressed as a fraction
   * of the viewport (or portal container) height. Content taller than this cap
   * scrolls inside the body instead of growing the sheet further.
   *
   * Has no effect when `snapPoints` is provided — in that case the upper snap
   * point is the effective ceiling.
   *
   * @default 0.97
   */
  maxHeight?: number;

  /**
   * Called when the bottom sheet is closed via swipe down or backdrop tap.
   */
  onDismiss?: () => void;

  /**
   * Whether the bottom sheet can be dismissed by tapping the backdrop or
   * swiping down. When `false` the close button is hidden and the sheet must
   * be closed programmatically by the caller (typically via a footer button).
   *
   * @default true
   */
  isDismissible?: boolean;

  /**
   * Toggles bottom sheet open state.
   *
   * @default false
   */
  isOpen?: boolean;

  /**
   * Element that should receive keyboard focus when the sheet opens. By
   * default focus is moved to the close button. Svelte callers pass the
   * element obtained via `bind:this`.
   *
   * @default null
   */
  initialFocusRef?: HTMLElement | null;

  /**
   * Sets the z-index of the bottom sheet. When stacking multiple sheets keep
   * `zIndex` identical across all of them — the stacking context is computed
   * internally.
   *
   * @default 100
   */
  zIndex?: number;

  /**
   * Mounts the overlay (backdrop + surface) into this element. Defaults to
   * `document.body`. Use a custom target when the sheet is nested inside
   * another overlay or an ancestor with `overflow: hidden` / `transform`
   * (e.g. a phone-frame preview). Snap-point math uses the target's height
   * when set.
   */
  portalTarget?: HTMLElement | null;

  /**
   * Mounts the backdrop into this element. Defaults to `portalTarget`. Set a
   * wider ancestor when the sheet surface should stay in a nested container
   * but the dim overlay must cover a larger region (e.g. a checkout card
   * sidebar + main pane). The surface `portalTarget` must be a descendant of
   * this element, and an intermediate ancestor should establish a higher
   * stacking context for the surface (e.g. `z-index: 1`).
   */
  backdropPortalTarget?: HTMLElement | null;

  /**
   * Toggles the drag handle (the pill affordance rendered at the top of the
   * sheet) and drag-to-move/dismiss gestures. Set to `false` for desktop flows
   * where dragging is not expected — this hides the handle and disables all
   * sheet drag gestures. The sheet can still be dismissed via the backdrop,
   * `esc`, or programmatically.
   *
   * @default true
   */
  showDragHandle?: boolean;

  /** Test ID applied to the surface element. */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}

interface BottomSheetHeaderProps extends StyledPropsBlade {
  /** Header title text. */
  title?: string;

  /** Header subtitle text rendered below the title. */
  subtitle?: string;

  /**
   * Leading slot rendered before the title (e.g. an icon).
   * Pass a Svelte snippet.
   */
  leading?: Snippet;

  /**
   * Trailing slot rendered after the title (e.g. a `Badge`, `Text`, `Button`,
   * or `Link`). Pass a Svelte snippet.
   */
  trailing?: Snippet;

  /**
   * Adornment rendered alongside the title (e.g. a `Counter`).
   * Pass a Svelte snippet.
   */
  titleSuffix?: Snippet;

  /**
   * Show a back button on the left side of the header. Wires up
   * `onBackButtonClick` when present.
   *
   * @default false
   */
  showBackButton?: boolean;

  /** Called when the back button is clicked. */
  onBackButtonClick?: () => void;

  /**
   * Reserved for future AutoComplete-in-header integration. Accepts a Svelte
   * snippet and renders it after the header content. The full integration
   * depends on Dropdown/AutoComplete which are not yet migrated.
   */
  children?: Snippet;

  /** Test ID applied to the header element. */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}

interface BottomSheetBodyProps extends StyledPropsBlade {
  /** Body content. */
  children: Snippet;

  /**
   * Equal padding applied on all sides of the body content. Only `spacing.0`
   * and `spacing.5` are allowed deliberately.
   *
   * @default 'spacing.5'
   */
  padding?: BottomSheetBodyPadding;

  /**
   * Native CSS `overflow` value applied to the body scroll container.
   *
   * @default 'auto'
   */
  overflow?: BottomSheetBodyOverflow;

  /**
   * Set to `true` when the body contains an `ActionList` (or similar
   * full-bleed list). The body padding will collapse to `spacing.3` to match
   * React's `React.Children.forEach` ActionList detection. Svelte cannot
   * introspect snippets, so this is exposed as an explicit prop.
   *
   * @default false
   */
  hasActionList?: boolean;

  /** Test ID applied to the body element. */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}

interface BottomSheetFooterProps extends StyledPropsBlade {
  /** Footer content — typically `Button`s or other CTAs. */
  children: Snippet;

  /** Test ID applied to the footer element. */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}
```

## Usage Guidelines

**Do**

- Use `BottomSheet` on mobile and mobile web for short forms, pickers and detail views, such as choosing a payment method or a UPI app.
- Use `bind:isOpen` for the simplest open/close wiring, and add `onDismiss` only for side effects like resetting form state.
- Leave `snapPoints` unset for content-sized sheets; set them only when the user should be able to drag between heights, for example `[0.35, 0.5, 0.85]` for a long list.
- Use `showBackButton` with `onBackButtonClick` for multi-step flows inside one sheet.
- Put the primary action in `BottomSheetFooter` so it stays visible while the body scrolls.
- Use `BottomSheetBody padding="spacing.0"` for full-bleed banners or images, and add padding to the inner content yourself.
- Use `portalTarget` when the sheet must stay inside a bounded container such as a checkout frame or phone preview.
- Use `showDragHandle={false}` on desktop layouts where dragging is not expected.

**Don't**

- Don't use `BottomSheet` for desktop dialogs; use `Modal`.
- Don't use a BottomSheet for a one-line confirmation after an action; use `Toast`.
- Don't set `isDismissible={false}` unless the flow must end with an explicit choice, and then always provide a footer button that closes it.
- Don't pass snap point values outside 0 to 1 or fewer than three values; use auto mode with `maxHeight` instead.
- Don't give stacked sheets different `zIndex` values; keep one shared value.

## Examples

### Select a payment method with bind:isOpen

A content-sized sheet whose open state is bound, with a radio list in the body and a sticky footer action.

```svelte
<script lang="ts">
  import {
    BottomSheet,
    BottomSheetBody,
    BottomSheetFooter,
    BottomSheetHeader,
    Button,
    Radio,
    RadioGroup,
  } from '@razorpay/blade-svelte/components';

  let isOpen = $state(false);
  let method = $state<string | undefined>(undefined);
  let confirmedMethod = $state('Choose payment method');
</script>

<Button isFullWidth variant="secondary" onClick={() => (isOpen = true)}>{confirmedMethod}</Button>

<BottomSheet
  bind:isOpen
  onDismiss={() => (method = undefined)}
  testID="payment-method-sheet"
  data-analytics-section="payment-method"
>
  {#snippet children()}
    <BottomSheetHeader title="Pay ₹1,250" subtitle="Choose how you want to pay" />
    <BottomSheetBody>
      {#snippet children()}
        <RadioGroup
          name="payment-method"
          label="Payment method"
          value={method}
          onChange={({ value }) => (method = value)}
        >
          <Radio value="upi">UPI</Radio>
          <Radio value="card">Credit or debit card</Radio>
          <Radio value="netbanking">Netbanking</Radio>
        </RadioGroup>
      {/snippet}
    </BottomSheetBody>
    <BottomSheetFooter>
      {#snippet children()}
        <Button
          isFullWidth
          isDisabled={!method}
          onClick={() => {
            confirmedMethod = `Pay with ${method}`;
            isOpen = false;
          }}
        >
          Continue
        </Button>
      {/snippet}
    </BottomSheetFooter>
  {/snippet}
</BottomSheet>
```

### Mandatory SIM selection with snap points

A non-dismissible sheet with draggable detents and a back button; the caller controls `isOpen` and closes it from the footer.

```svelte
<script lang="ts">
  import {
    BottomSheet,
    BottomSheetBody,
    BottomSheetFooter,
    BottomSheetHeader,
    Button,
    Radio,
    RadioGroup,
  } from '@razorpay/blade-svelte/components';

  let { isOpen, onClose }: { isOpen: boolean; onClose: () => void } = $props();

  const simNumbers = ['+91 98765 43210', '+91 91234 56789'];
  let selectedSim = $state<string | undefined>(undefined);
</script>

<BottomSheet {isOpen} isDismissible={false} snapPoints={[0.35, 0.5, 0.85]} zIndex={400}>
  {#snippet children()}
    <BottomSheetHeader title="Verify mobile number" showBackButton onBackButtonClick={onClose} />
    <BottomSheetBody>
      {#snippet children()}
        <RadioGroup
          name="select-sim"
          label="Select the SIM registered with your bank"
          value={selectedSim}
          onChange={({ value }) => (selectedSim = value)}
        >
          {#each simNumbers as simNumber (simNumber)}
            <Radio value={simNumber}>{simNumber}</Radio>
          {/each}
        </RadioGroup>
      {/snippet}
    </BottomSheetBody>
    <BottomSheetFooter>
      {#snippet children()}
        <div class="footer-actions">
          <Button isFullWidth isDisabled={!selectedSim} onClick={onClose}>Verify</Button>
          <Button isFullWidth variant="tertiary" onClick={onClose}>Use another number</Button>
        </div>
      {/snippet}
    </BottomSheetFooter>
  {/snippet}
</BottomSheet>

<style>
  .footer-actions {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
  }
</style>
```

### Sheet inside a bounded checkout frame

`portalTarget` keeps the overlay inside a container instead of `document.body`; an empty header keeps the close button.

```svelte
<script lang="ts">
  import {
    BottomSheet,
    BottomSheetBody,
    BottomSheetHeader,
    Button,
    Text,
  } from '@razorpay/blade-svelte/components';

  let frameEl = $state<HTMLDivElement | null>(null);
  let isOpen = $state(false);
</script>

<div class="checkout-frame" bind:this={frameEl}>
  <Button onClick={() => (isOpen = true)}>View offer details</Button>

  <BottomSheet bind:isOpen portalTarget={frameEl} maxHeight={0.6}>
    {#snippet children()}
      <BottomSheetHeader />
      <BottomSheetBody>
        {#snippet children()}
          <Text size="medium" weight="semibold">Flat ₹100 cashback on UPI</Text>
          <Text size="small" marginTop="spacing.2">
            Valid on payments above ₹999 until 31 December. One use per customer.
          </Text>
        {/snippet}
      </BottomSheetBody>
    {/snippet}
  </BottomSheet>
</div>

<style>
  .checkout-frame {
    position: relative;
    height: 640px;
    overflow: hidden;
    padding: var(--spacing-5);
    border-radius: var(--border-radius-large);
    background-color: var(--surface-background-gray-moderate);
  }
</style>
```

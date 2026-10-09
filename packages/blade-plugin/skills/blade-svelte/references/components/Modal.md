## Component Name

Modal

## Description

Modal is a centered dialog that appears in front of the page to ask for a decision or input, blocking everything behind it until it closes. Compose it from `ModalHeader` (title, subtitle, leading, trailing, close button), `ModalBody` (scrollable content) and `ModalFooter` (actions). Focus trap, focus return, Escape and backdrop dismissal, body scroll lock and the enter/exit animation are built in; you only control `isOpen`. Sizes are small, medium, large and full.

## Important Constraints

- `isOpen` is controlled, not bindable; set it to `false` inside `onDismiss` or the Modal stays open
- `children` is a snippet; render `ModalHeader`, `ModalBody` and `ModalFooter` in that order inside it
- The close button is rendered by `ModalHeader`; a Modal without a `ModalHeader` has no close button. For a headerless layout with a floating close button, render `<ModalHeader />` with no props
- With `isDismissible={false}`, Escape, backdrop click and the close button do nothing and `onDismiss` is not called; close the Modal from a footer button
- A warning is logged when `accessibilityLabel` is missing
- `initialFocusRef` takes an `HTMLElement` (from `bind:this` on a native element); without it, focus moves to the close button
- `ModalBody` `padding` accepts only `'spacing.0'` or `'spacing.6'`
- Background content is made `inert` while the Modal is mounted

## TypeScript Types

These are the props the Modal, ModalHeader, ModalBody and ModalFooter components accept.

```typescript
type ModalSize = 'small' | 'medium' | 'large' | 'full';
type ModalBodyPadding = 'spacing.0' | 'spacing.6';

interface ModalProps extends StyledPropsBlade {
  /**
   * Children of the Modal — typically a `ModalHeader`, `ModalBody`, and/or
   * `ModalFooter` rendered in that order.
   */
  children: Snippet;

  /**
   * Sets the modal to open or close.
   *
   * @default false
   */
  isOpen?: boolean;

  /**
   * Callback fired when the user clicks the close button, clicks the backdrop,
   * or presses the escape key.
   */
  onDismiss?: () => void;

  /**
   * Whether the modal can be dismissed by clicking outside or pressing the
   * escape key. When `false` the close button is hidden and the modal must be
   * closed programmatically (typically via a footer button).
   *
   * @default true
   */
  isDismissible?: boolean;

  /**
   * Element that should receive keyboard focus when the modal opens. By default
   * focus moves to the close button. Svelte callers pass the element obtained
   * via `bind:this`.
   *
   * @default null
   */
  initialFocusRef?: HTMLElement | null;

  /**
   * Size of the modal.
   *
   * @default 'small'
   */
  size?: ModalSize;

  /**
   * Accessibility label for the modal dialog.
   */
  accessibilityLabel?: string;

  /**
   * Sets the z-index of the modal.
   *
   * @default 1000
   */
  zIndex?: number;

  /** Test ID applied to the surface element. */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}

interface ModalHeaderProps extends StyledPropsBlade {
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

  /** Test ID applied to the header element. */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}

interface ModalBodyProps extends StyledPropsBlade {
  /** Body content. */
  children: Snippet;

  /**
   * Equal padding applied on all sides of the body content. Only `spacing.0`
   * and `spacing.6` are allowed deliberately.
   *
   * @default 'spacing.6'
   */
  padding?: ModalBodyPadding;

  /**
   * Explicit height for the body scroll container (e.g. `'100%'`). Accepts any
   * CSS length string.
   */
  height?: string;

  /** Test ID applied to the body element. */
  testID?: string;

  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
}

interface ModalFooterProps extends StyledPropsBlade {
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

- Use `Modal` on desktop for a focused task or decision, such as confirming a refund or editing a settlement account.
- Pick `size` by content: `small` (400px) for confirmations, `medium` (760px) for forms, `large` (1024px) for complex content, `full` for media or full-screen flows.
- Always pass `accessibilityLabel`, usually the same text as the header `title`.
- Put primary and secondary actions in `ModalFooter`, laid out in a flex row; keep the primary action last.
- Use `ModalHeader`'s `trailing` for a `Badge`, `Text`, `Button` or `Link` and `titleSuffix` for a `Counter`.
- Use `isDismissible={false}` only when the user must choose an explicit option before continuing.
- Use `ModalBody padding="spacing.0"` with `height="100%"` for edge-to-edge media in a `full` Modal.

**Don't**

- Don't use `Modal` on mobile web; use `BottomSheet`.
- Don't use `Modal` for non-blocking hints or side content; use `Popover` or `Tooltip`.
- Don't use `Modal` for a transient success message after the action completes; use `Toast`.
- Don't use `bind:isOpen`; pass `isOpen` and reset it in `onDismiss`.
- Don't nest a Modal inside another Modal; replace the content of the open Modal or use a multi-step body.

## Examples

### Refund form

A medium Modal with a header badge, a form body and footer actions; `onDismiss` resets the controlled `isOpen`.

```svelte
<script lang="ts">
  import {
    Badge,
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    TextInput,
  } from '@razorpay/blade-svelte/components';

  let isOpen = $state(false);
  let refundAmount = $state('');
  let isSubmitting = $state(false);

  const isValid = $derived(Number(refundAmount) > 0);

  const closeModal = (): void => {
    isOpen = false;
    refundAmount = '';
  };

  const submitRefund = async (): Promise<void> => {
    isSubmitting = true;
    await fetch('/api/payments/pay_29QQoUBi66xm2f/refund', {
      method: 'POST',
      body: JSON.stringify({ amount: Number(refundAmount) }),
    });
    isSubmitting = false;
    closeModal();
  };
</script>

<Button onClick={() => (isOpen = true)}>Issue refund</Button>

<Modal
  {isOpen}
  onDismiss={closeModal}
  size="medium"
  accessibilityLabel="Issue refund"
  testID="refund-modal"
  data-analytics-section="refund-modal"
>
  {#snippet children()}
    <ModalHeader title="Issue refund" subtitle="Payment pay_29QQoUBi66xm2f · ₹2,499">
      {#snippet trailing()}
        <Badge color="positive" size="small">Captured</Badge>
      {/snippet}
    </ModalHeader>
    <ModalBody>
      {#snippet children()}
        <TextInput
          label="Refund amount"
          prefix="₹"
          type="number"
          name="refundAmount"
          placeholder="Up to 2,499"
          helpText="Refunds reach the customer in 5-7 working days"
          value={refundAmount}
          onChange={({ value }) => (refundAmount = value ?? '')}
        />
      {/snippet}
    </ModalBody>
    <ModalFooter>
      {#snippet children()}
        <div class="footer-actions">
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          <Button isDisabled={!isValid} isLoading={isSubmitting} onClick={submitRefund}>
            Refund
          </Button>
        </div>
      {/snippet}
    </ModalFooter>
  {/snippet}
</Modal>

<style>
  .footer-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-3);
    width: 100%;
  }
</style>
```

### Non-dismissible destructive confirmation

A small Modal that can only be closed through its footer buttons.

```svelte
<script lang="ts">
  import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Text,
  } from '@razorpay/blade-svelte/components';

  let { onRevoke }: { onRevoke: () => void } = $props();

  let isOpen = $state(false);

  const revoke = (): void => {
    onRevoke();
    isOpen = false;
  };
</script>

<Button color="negative" variant="secondary" onClick={() => (isOpen = true)}>Revoke API key</Button>

<Modal {isOpen} isDismissible={false} size="small" accessibilityLabel="Revoke API key">
  {#snippet children()}
    <ModalHeader title="Revoke API key?" />
    <ModalBody>
      {#snippet children()}
        <Text size="medium" color="surface.text.gray.subtle">
          Integrations using rzp_live_••••4f2c will stop accepting payments immediately.
        </Text>
      {/snippet}
    </ModalBody>
    <ModalFooter>
      {#snippet children()}
        <div class="footer-actions">
          <Button variant="tertiary" onClick={() => (isOpen = false)}>No, keep it</Button>
          <Button color="negative" onClick={revoke}>Revoke</Button>
        </div>
      {/snippet}
    </ModalFooter>
  {/snippet}
</Modal>

<style>
  .footer-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-3);
    width: 100%;
  }
</style>
```

### Headerless modal with a floating close button

An empty `ModalHeader` renders only the floating close button above self-explanatory content.

```svelte
<script lang="ts">
  import {
    Button,
    Heading,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Text,
  } from '@razorpay/blade-svelte/components';

  let isOpen = $state(true);
</script>

<Modal {isOpen} onDismiss={() => (isOpen = false)} accessibilityLabel="Turbo UPI is live">
  {#snippet children()}
    <ModalHeader />
    <ModalBody>
      {#snippet children()}
        <Heading size="medium">Turbo UPI is live</Heading>
        <Text size="medium" marginTop="spacing.2">
          Customers can now pay in-app without switching to a UPI app.
        </Text>
      {/snippet}
    </ModalBody>
    <ModalFooter>
      {#snippet children()}
        <div class="footer-actions">
          <Button variant="secondary" isFullWidth onClick={() => (isOpen = false)}>Later</Button>
          <Button isFullWidth onClick={() => (isOpen = false)}>Enable now</Button>
        </div>
      {/snippet}
    </ModalFooter>
  {/snippet}
</Modal>

<style>
  .footer-actions {
    display: flex;
    gap: var(--spacing-3);
    width: 100%;
  }
</style>
```

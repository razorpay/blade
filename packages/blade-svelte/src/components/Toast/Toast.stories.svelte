<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Toast from './Toast.svelte';

  const { Story } = defineMeta({
    title: 'Components/Toast',
    component: Toast,
    tags: ['autodocs'],
    argTypes: {
      isVisible: { table: { disable: true } },
      id: { table: { disable: true } },
      color: {
        control: 'select',
        options: ['neutral', 'positive', 'negative', 'notice', 'information'],
      },
      type: {
        control: 'select',
        options: ['informational', 'promotional'],
      },
      autoDismiss: { control: 'boolean' },
    },
    args: {
      color: 'neutral',
      type: 'informational',
      autoDismiss: false,
      content: 'Payment successful',
      action: {
        text: 'Okay',
        onClick: ({ toastId }) => console.log(toastId),
      },
    },
  });
</script>

<script lang="ts">
  import ToastContainer from './ToastContainer.svelte';
  import { useToast } from './useToast';
  import { toastStore } from './toastStore';
  import Button from '../Button/Button.svelte';
  import Heading from '../Typography/Heading/Heading.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import { InfoIcon } from '../Icons/InfoIcon';
  import type { ToastColor, ToastProps } from './types';

  const toast = useToast();

  const informationalColors: Array<{ key: ToastColor; label: string }> = [
    { key: 'positive', label: 'Positive' },
    { key: 'negative', label: 'Negative' },
    { key: 'notice', label: 'Notice' },
    { key: 'information', label: 'Information' },
    { key: 'neutral', label: 'Neutral' },
  ];

  const variantTexts: Record<ToastColor, string> = {
    negative: 'Unable to fetch merchant details',
    positive: 'Customer details failed successfully',
    notice: 'Your KYC is pending',
    information:
      'Your transaction will be settled in 3 business days, this is a long message to test the toast container overflow behavior',
    neutral: 'Your transaction will be settled in 3 business days',
  };

  function showInformationalToast(color: ToastColor): void {
    toast.show({
      content: variantTexts[color],
      color,
      action: {
        text: 'Okay',
        onClick: ({ toastId }) => toast.dismiss(toastId),
      },
      onDismissButtonClick: ({ toastId }) => console.log(`${toastId} Dismissed!`),
    });
  }

  function showPromotionalToast(): void {
    toast.show({
      type: 'promotional',
      leading: InfoIcon,
      action: {
        text: 'Try TurboUPI',
        onClick: ({ toastId }) => toast.dismiss(toastId),
      },
      onDismissButtonClick: ({ toastId }) => console.log(`${toastId} Dismissed!`),
      content: promoContent,
    });
  }

  let isModalOpen = $state(false);

  function showToastAboveModal(): void {
    toast.show({
      content: 'This toast has z-index 3000 and appears above the modal (z-index 2000)',
      color: 'positive',
      duration: 10000,
      action: {
        text: 'Dismiss',
        onClick: ({ toastId }) => toast.dismiss(toastId),
      },
    });
  }
</script>

{#snippet promoContent()}
  <div style="display: flex; flex-direction: column; gap: var(--spacing-3);">
    <Heading>Introducing TurboUPI</Heading>
    <img
      loading="lazy"
      width="100%"
      height="100"
      alt="Promotional Toast"
      style="object-fit: cover; border-radius: 8px;"
      src="https://d6xcmfyh68wv8.cloudfront.net/blog-content/uploads/2023/05/Features-blog.png"
    />
    <Text weight="semibold">Lightning-fast payments with the new Razorpay Turbo UPI</Text>
    <Text size="xsmall">
      Turbo UPI allows end-users to complete their payment in-app, with no redirections or
      dependence on third-party UPI apps. With Turbo UPI, payments will be 5x faster with a
      significantly-improved success rate of 10%!
    </Text>
  </div>
{/snippet}

<!-- Story 1: Basic — driven by Storybook controls. -->
<Story name="Basic">
  {#snippet template(args: ToastProps)}
    <div style="height: 80vh;">
      <Text size="medium" marginBottom="spacing.4">To start using toast simply:</Text>
      <ul style="margin: 0 0 var(--spacing-4) var(--spacing-5);">
        <li>
          <Text size="small">
            Import and render the <code>ToastContainer</code> component from blade at the root of
            your project
          </Text>
        </li>
        <li>
          <Text size="small">
            Utilize the methods exposed via <code>useToast()</code> helper to show/dismiss toasts
          </Text>
        </li>
      </ul>
      <Text marginY="spacing.4" color="surface.text.gray.muted">
        After changing storybook controls, press the "show toast" button to see changes
      </Text>
      <Button onClick={() => toast.show({ ...args })}>Show Toast</Button>
      <ToastContainer />
    </div>
  {/snippet}
</Story>

<!-- Story 2: Toast Variants — 5 informational color buttons + 1 promotional. -->
<Story name="Toast Variants" asChild>
  <div style="height: 80vh;">
    <Text>Show Informational Toasts:</Text>
    <div style="display: flex; gap: var(--spacing-3); margin: var(--spacing-5) 0;">
      {#each informationalColors as variant (variant.key)}
        <Button variant="tertiary" onClick={() => showInformationalToast(variant.key)}>
          {variant.label}
        </Button>
      {/each}
    </div>
    <Text>Show Promotional Toasts:</Text>
    <Text size="small" color="surface.text.gray.muted">
      Note: There can only be 1 promotional toast at a time
    </Text>
    <div style="display: flex; gap: var(--spacing-3); margin: var(--spacing-5) 0;">
      <Button
        variant="tertiary"
        isDisabled={$toastStore.some((t) => t.type === 'promotional')}
        onClick={showPromotionalToast}
      >
        Promotional
      </Button>
    </div>
    <ToastContainer />
  </div>
</Story>

<!-- Story 3: Container Offset — demonstrates `offsetBottom` prop on the container. -->
<Story name="Container Offset" asChild>
  <div style="height: 80vh;">
    <Text size="medium" marginBottom="spacing.4">
      ToastContainer with custom <code>offsetBottom</code>
    </Text>
    <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.6">
      The toast will appear 100px from the bottom of the viewport instead of the default position
    </Text>
    <Button
      onClick={() =>
        toast.show({
          content: 'This toast appears with custom bottom offset',
          color: 'information',
          action: {
            text: 'Dismiss',
            onClick: ({ toastId }) => toast.dismiss(toastId),
          },
        })}
    >
      Show Toast with Custom Offset
    </Button>
    <ToastContainer offsetBottom={100} />
  </div>
</Story>

<!-- Story 4: Z-Index — toast renders above a native modal (dialog) thanks to a higher container zIndex. -->
<Story name="Z-Index" asChild>
  <div style="height: 80vh;">
    <Text size="medium" marginBottom="spacing.4">Toast with Custom zIndex</Text>

    <div
      style="margin-top: var(--spacing-6); padding-top: var(--spacing-6); border-top: 1px solid var(--surface-border-gray-muted, #e5e7eb);"
    >
      <Text size="medium" marginBottom="spacing.4">Toast Above Modal Demo</Text>
      <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.6">
        Open a full-page modal with z-index 2000, then show a toast with z-index 3000 to see it
        appear above the modal.
      </Text>
      <div style="display: flex; gap: var(--spacing-3);">
        <Button onClick={() => (isModalOpen = true)}>Open Modal (z-index 2000)</Button>
        {#if isModalOpen}
          <Button onClick={showToastAboveModal}>Show Toast Above Modal (z-index 3000)</Button>
        {/if}
      </div>
    </div>

    {#if isModalOpen}
      <div
        style="position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); z-index: 1999;"
        aria-hidden="true"
      ></div>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Modal with z-index 2000"
        style="position: fixed; inset: 24px; background: var(--surface-background-gray-subtle, #ffffff); z-index: 2000; padding: var(--spacing-6); border-radius: var(--border-radius-medium); display: flex; flex-direction: column; gap: var(--spacing-4); overflow: auto;"
      >
        <Heading>Modal with z-index 2000</Heading>
        <Text>
          This is a full-page modal with z-index 2000. Click the button below to show a toast with
          z-index 3000, which will appear above this modal.
        </Text>
        <Button onClick={showToastAboveModal}>Show Toast Above Modal (z-index 3000)</Button>
        <div style="margin-top: auto; display: flex; gap: var(--spacing-3);">
          <Button variant="secondary" onClick={() => (isModalOpen = false)}>Close Modal</Button>
        </div>
      </div>
    {/if}

    <ToastContainer zIndex={3000} />
  </div>
</Story>

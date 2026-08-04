<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TrustBadge from './TrustBadge.svelte';

  const { Story } = defineMeta({
    title: 'Components/TrustBadge',
    component: TrustBadge,
    tags: ['autodocs'],
    argTypes: {
      variant: {
        control: { type: 'select' },
        options: ['default', 'icon-only'],
      },
      label: {
        control: { type: 'text' },
      },
    },
    args: {
      variant: 'default',
      label: 'Razorpay Trusted Business',
    },
  });
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div
      style="background-color: var(--surface-background-gray-subtle); padding: var(--spacing-5); border-radius: var(--border-radius-medium); display: inline-block;"
    >
      <TrustBadge {...args} />
    </div>
  {/snippet}
</Story>

<Story name="Default" asChild>
  <div style="background-color: var(--surface-background-gray-subtle); padding: var(--spacing-5); border-radius: var(--border-radius-medium);">
    <TrustBadge />
  </div>
</Story>

<Story name="Icon Only" asChild>
  <div style="background-color: var(--surface-background-gray-subtle); padding: var(--spacing-5); border-radius: var(--border-radius-medium);">
    <TrustBadge variant="icon-only" />
  </div>
</Story>

<Story name="CustomLabel" args={{ label: 'Razorpay Verified' }}>
  {#snippet template(args)}
    <div
      style="background-color: var(--surface-background-gray-subtle); padding: var(--spacing-5); border-radius: var(--border-radius-medium);"
    >
      <TrustBadge {...args} />
    </div>
  {/snippet}
</Story>

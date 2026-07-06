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
        options: ['full', 'icon-only'],
      },
      emphasis: {
        control: { type: 'select' },
        options: ['intense', 'subtle'],
      },
      label: {
        control: { type: 'text' },
      },
    },
    args: {
      variant: 'full',
      emphasis: 'subtle',
      label: 'Razorpay Trusted Business',
    },
  });
</script>

<!-- Playground - auto-renders TrustBadge driven by Storybook controls -->
<Story name="Playground">
  {#snippet template(args)}
    <!-- intense emphasis needs a colored/dark surface, subtle needs a light one -->
    <div
      style="background-color: {args.emphasis === 'subtle'
        ? 'var(--surface-background-gray-subtle)'
        : '#3669ff'}; padding: var(--spacing-5); border-radius: var(--border-radius-medium); display: inline-block;"
    >
      <TrustBadge {...args} />
    </div>
  {/snippet}
</Story>

<!-- Intense (white text) — sits on a dark/colored surface -->
<Story name="Intense" asChild>
  <div style="background-color: #3669ff; padding: var(--spacing-5); border-radius: var(--border-radius-medium);">
    <TrustBadge emphasis="intense" />
  </div>
</Story>

<!-- Subtle (dark text) — sits on a light surface -->
<Story name="Subtle" asChild>
  <div style="background-color: var(--surface-background-gray-subtle); padding: var(--spacing-5); border-radius: var(--border-radius-medium);">
    <TrustBadge emphasis="subtle" />
  </div>
</Story>

<!-- Icon only — shield without the pill/text -->
<Story name="Icon Only" asChild>
  <div style="background-color: #3669ff; padding: var(--spacing-5); border-radius: var(--border-radius-medium);">
    <TrustBadge variant="icon-only" />
  </div>
</Story>

<!-- Custom label — demonstrates generic trust badge usage -->
<Story name="CustomLabel" asChild>
  <div style="background-color: var(--surface-background-gray-subtle); padding: var(--spacing-5); border-radius: var(--border-radius-medium);">
    <TrustBadge label="Razorpay Verified" />
  </div>
</Story>

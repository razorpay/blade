<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TrustedMarker from './TrustedMarker.svelte';

  const { Story } = defineMeta({
    title: 'Components/TrustedMarker',
    component: TrustedMarker,
    tags: ['autodocs'],
    argTypes: {
      type: {
        control: { type: 'select' },
        options: ['full', 'icon'],
      },
      variant: {
        control: { type: 'select' },
        options: ['neutral', 'subtle'],
      },
      label: {
        control: { type: 'text' },
      },
    },
    args: {
      type: 'full',
      variant: 'neutral',
      label: 'Razorpay Trusted Business',
    },
  });
</script>

<!-- Playground - auto-renders TrustedMarker driven by Storybook controls -->
<Story name="Playground">
  {#snippet template(args)}
    <!-- neutral variant needs a colored/dark surface, subtle needs a light one -->
    <div
      style="background-color: {args.variant === 'subtle'
        ? 'var(--surface-background-gray-subtle)'
        : '#3669ff'}; padding: var(--spacing-5); border-radius: var(--border-radius-medium); display: inline-block;"
    >
      <TrustedMarker {...args} />
    </div>
  {/snippet}
</Story>

<!-- Neutral (white text) — sits on a dark/colored surface -->
<Story name="Neutral" asChild>
  <div style="background-color: #3669ff; padding: var(--spacing-5); border-radius: var(--border-radius-medium);">
    <TrustedMarker variant="neutral" />
  </div>
</Story>

<!-- Subtle (dark text) — sits on a light surface -->
<Story name="Subtle" asChild>
  <div style="background-color: var(--surface-background-gray-subtle); padding: var(--spacing-5); border-radius: var(--border-radius-medium);">
    <TrustedMarker variant="subtle" />
  </div>
</Story>

<!-- Icon only — shield without the pill/text -->
<Story name="Icon Only" asChild>
  <div style="background-color: #3669ff; padding: var(--spacing-5); border-radius: var(--border-radius-medium);">
    <TrustedMarker type="icon" />
  </div>
</Story>

<!-- Custom label — demonstrates generic trust marker usage -->
<Story name="CustomLabel" asChild>
  <div style="background-color: #3669ff; padding: var(--spacing-5); border-radius: var(--border-radius-medium);">
    <TrustedMarker label="Razorpay Verified" />
  </div>
</Story>

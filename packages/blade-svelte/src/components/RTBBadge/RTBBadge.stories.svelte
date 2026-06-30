<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import RTBBadge from './RTBBadge.svelte';

  const { Story } = defineMeta({
    title: 'Components/RTBBadge',
    component: RTBBadge,
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
    },
    args: {
      type: 'full',
      variant: 'neutral',
    },
  });
</script>

<!-- Playground - auto-renders RTBBadge driven by Storybook controls -->
<Story name="Playground">
  {#snippet template(args)}
    <!-- neutral variant needs a colored/dark surface, subtle needs a light one -->
    <div
      style="background-color: {args.variant === 'subtle'
        ? 'var(--surface-background-gray-subtle)'
        : '#3669ff'}; padding: var(--spacing-5); border-radius: var(--border-radius-medium); display: inline-block;"
    >
      <RTBBadge {...args} />
    </div>
  {/snippet}
</Story>

<!-- Neutral (white text) — sits on a dark/colored surface -->
<Story name="Neutral" asChild>
  <div style="background-color: #3669ff; padding: var(--spacing-5); border-radius: var(--border-radius-medium);">
    <RTBBadge variant="neutral" />
  </div>
</Story>

<!-- Subtle (dark text) — sits on a light surface -->
<Story name="Subtle" asChild>
  <div style="background-color: var(--surface-background-gray-subtle); padding: var(--spacing-5); border-radius: var(--border-radius-medium);">
    <RTBBadge variant="subtle" />
  </div>
</Story>

<!-- Icon only — shield without the pill/text -->
<Story name="Icon Only" asChild>
  <div style="background-color: #3669ff; padding: var(--spacing-5); border-radius: var(--border-radius-medium);">
    <RTBBadge type="icon" />
  </div>
</Story>

<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { iconMap } from './iconMap';
  import { CreditCardIcon } from './CreditCardIcon';
  import { RazorpayTrustIcon } from './RazorpayTrustIcon';
  import Text from '../Typography/Text/Text.svelte';

  const pickIcons = (predicate) =>
    Object.fromEntries(
      Object.entries(iconMap).filter(
        ([name, IconComponent]) => IconComponent && predicate(name),
      ),
    );

  const filledIcons = pickIcons((name) => name.includes('FilledIcon'));
  const strokedIcons = pickIcons((name) => !name.includes('FilledIcon'));
  // Branded icons keep their own colors/gradients, ignore the `color` prop, and are
  // intentionally not part of the generic `iconMap` icon picker.
  const brandedIcons = { RazorpayTrustIcon };
  const allIcons = { ...pickIcons(() => true), ...brandedIcons };

  const { Story } = defineMeta({
    title: 'Components/Icons',
    component: CreditCardIcon,
    tags: ['autodocs'],
    args: {
      size: 'medium',
      color: 'surface.icon.gray.normal',
    },
    argTypes: {
      size: {
        control: 'select',
        options: ['xsmall', 'small', 'medium', 'large', 'xlarge', '2xlarge'],
        description: 'Size of the icon',
        table: {
          defaultValue: { summary: 'medium' },
        },
      },
      color: {
        control: 'select',
        options: [
          'currentColor',
          'surface.icon.gray.normal',
          'surface.icon.gray.subtle',
          'surface.icon.gray.muted',
          'surface.icon.gray.disabled',
          'interactive.icon.primary.normal',
          'interactive.icon.gray.normal',
          'feedback.icon.positive.intense',
          'feedback.icon.negative.intense',
          'feedback.icon.notice.intense',
          'feedback.icon.information.intense',
        ],
        description: 'Color token for the icon',
        table: {
          defaultValue: { summary: 'surface.icon.gray.normal' },
        },
      },
    },
  });
</script>

{#snippet iconGrid(icons, color)}
  <div class="display-flex flex-wrap">
    {#each Object.entries(icons) as [name, IconComponent] (name)}
      <div
        class="display-inline-flex flex-col items-center gap-y-spacing-4"
        style="height: 95px; width: 125px;"
      >
        {#if color}
          <IconComponent size="large" {color} />
        {:else}
          <IconComponent size="large" />
        {/if}
        <Text size="xsmall" color="surface.text.gray.muted" truncateAfterLines={1}>
          {name}
        </Text>
      </div>
    {/each}
  </div>
{/snippet}

<!-- Default Icon Story - Playground -->
<Story name="Icon" />

<Story name="StrokedIcons" asChild>
  {@render iconGrid(strokedIcons, 'surface.icon.gray.normal')}
</Story>

<Story name="FilledIcons" asChild>
  {@render iconGrid(filledIcons, 'surface.icon.gray.normal')}
</Story>

<Story name="BrandedIcons" asChild>
  {@render iconGrid(brandedIcons)}
</Story>

<Story name="AllIcons" asChild>
  {@render iconGrid(allIcons, 'surface.icon.gray.normal')}
</Story>

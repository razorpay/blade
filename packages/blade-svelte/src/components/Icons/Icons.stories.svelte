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

<!--
  Mirrors the React Icons stories grid: icons take the story args (size defaults to
  `medium`, same as React) so both Storybooks render at identical dimensions.
-->
{#snippet iconGrid(icons, args)}
  <div style="display: flex; flex-wrap: wrap;">
    {#each Object.entries(icons) as [name, IconComponent] (name)}
      <div
        style="display: inline-flex; flex-direction: column; align-items: center; gap: var(--spacing-6); height: 95px; width: 125px;"
      >
        <IconComponent {...args} />
        <div style="width: 90%; text-align: center;">
          <Text size="xsmall" color="surface.text.gray.muted" truncateAfterLines={1}>
            {name}
          </Text>
        </div>
      </div>
    {/each}
  </div>
{/snippet}

<!-- Default Icon Story - Playground -->
<Story name="Icon" />

<Story name="StrokedIcons">
  {#snippet template(args)}
    {@render iconGrid(strokedIcons, args)}
  {/snippet}
</Story>

<Story name="FilledIcons">
  {#snippet template(args)}
    {@render iconGrid(filledIcons, args)}
  {/snippet}
</Story>

<Story name="BrandedIcons">
  {#snippet template(args)}
    {@render iconGrid(brandedIcons, args)}
  {/snippet}
</Story>

<Story name="AllIcons">
  {#snippet template(args)}
    {@render iconGrid(allIcons, args)}
  {/snippet}
</Story>

<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  // Stroked Icons
  import { CheckIcon } from './CheckIcon';
  import { CloseIcon } from './CloseIcon';
  import { CreditCardIcon } from './CreditCardIcon';
  import { InfoIcon } from './InfoIcon';
  import { PlusIcon } from './PlusIcon';
  import { SearchIcon } from './SearchIcon';
  // Filled Icons
  import { MoreFilledIcon } from './MoreFilledIcon';
  import Text from '../Typography/Text/Text.svelte';

  // Icon maps for dynamic rendering
  const strokedIcons = {
    CheckIcon,
    CloseIcon,
    CreditCardIcon,
    InfoIcon,
    PlusIcon,
    SearchIcon,
  };

  const filledIcons = {
    MoreFilledIcon,
  };

  const allIcons = {
    ...strokedIcons,
    ...filledIcons,
  };

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

<script>
  // Components are already imported in module context
</script>

<!-- Default Icon Story - Playground -->
<Story name="Icon" />

<!-- Stroked Icons -->
<Story name="StrokedIcons" asChild>
  <div class="display-flex flex-wrap">
    {#each Object.entries(strokedIcons) as [name, IconComponent]}
      <div
        class="display-inline-flex flex-col items-center gap-y-spacing-4"
        style="height: 95px; width: 125px;"
      >
        <svelte:component this={IconComponent} size="large" color="surface.icon.gray.normal" />
        <Text
          size="xsmall"
          color="surface.text.gray.muted"
          truncateAfterLines={1}
        >
          {name}
        </Text>
      </div>
    {/each}
  </div>
</Story>

<!-- Filled Icons -->
<Story name="FilledIcons" asChild>
  <div class="display-flex flex-wrap">
    {#each Object.entries(filledIcons) as [name, IconComponent]}
      <div
        class="display-flex flex-col items-center gap-y-spacing-6"
        style="height: 95px; width: 125px;"
      >
        <svelte:component this={IconComponent} size="large" color="surface.icon.gray.normal" />
        <Text
          size="xsmall"
          color="surface.text.gray.muted"
          truncateAfterLines={1}
        >
          {name}
        </Text>
      </div>
    {/each}
  </div>
</Story>

<!-- All Icons -->
<Story name="AllIcons" asChild>
  <div class="display-flex flex-wrap">
    {#each Object.entries(allIcons) as [name, IconComponent]}
      <div
        class="display-flex flex-col items-center gap-y-spacing-3"
        style="height: 95px; width: 125px;"
      >
        <svelte:component this={IconComponent} size="large" color="surface.icon.gray.normal" />
        <Text
          size="xsmall"
          color="surface.text.gray.muted"
          truncateAfterLines={1}
        >
          {name}
        </Text>
      </div>
    {/each}
  </div>
</Story>

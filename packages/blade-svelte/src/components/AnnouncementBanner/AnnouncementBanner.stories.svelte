<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AnnouncementBanner from './AnnouncementBanner.svelte';
  import { InfoIcon } from '../Icons/InfoIcon';

  const { Story } = defineMeta({
    title: 'Components/AnnouncementBanner',
    component: AnnouncementBanner,
    tags: ['autodocs'],
    argTypes: {
      alignment: {
        control: 'select',
        options: ['center', 'left'],
      },
      accessibilityLabel: {
        control: 'text',
      },
    },
    args: {
      alignment: 'center',
      icon: InfoIcon,
      children: 'Enter promotional text here',
    },
  });
</script>

<script lang="ts">
  const alignments = ['center', 'left'] as const;
</script>

<!-- Default: centered, with icon. Color scheme follows the app's data-theme. -->
<Story name="Default" />

<!-- Left aligned -->
<Story
  name="LeftAligned"
  args={{
    alignment: 'left',
    children: 'Switch to the new dashboard experience today.',
  }}
/>

<!-- Without icon -->
<Story
  name="WithoutIcon"
  args={{
    icon: undefined,
  }}
/>

<!-- All alignments matrix -->
<Story name="AllVariants" asChild>
  <div style="display: flex; flex-direction: column; gap: 16px; width: 100%;">
    {#each alignments as alignment (alignment)}
      <AnnouncementBanner {alignment} icon={InfoIcon}>
        {`alignment=${alignment}`}
      </AnnouncementBanner>
    {/each}
  </div>
</Story>

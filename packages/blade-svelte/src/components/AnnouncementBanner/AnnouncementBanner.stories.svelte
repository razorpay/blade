<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AnnouncementBanner from './AnnouncementBanner.svelte';
  import { InfoIcon } from '../Icons/InfoIcon';

  const { Story } = defineMeta({
    title: 'Components/AnnouncementBanner',
    component: AnnouncementBanner,
    tags: ['autodocs'],
    argTypes: {
      theme: {
        control: 'select',
        options: ['dark', 'light'],
      },
      alignment: {
        control: 'select',
        options: ['center', 'left'],
      },
      showIcon: {
        control: 'boolean',
      },
      accessibilityLabel: {
        control: 'text',
      },
    },
    args: {
      theme: 'dark',
      alignment: 'center',
      showIcon: true,
      icon: InfoIcon,
      children: 'Enter promotional text here',
    },
  });
</script>

<script lang="ts">
  import Link from '../Link/Link.svelte';

  const themes = ['dark', 'light'] as const;
  const alignments = ['center', 'left'] as const;
</script>

<!-- Default: dark theme, centered, with icon -->
<Story name="Default" />

<!-- Light theme -->
<Story
  name="LightTheme"
  args={{
    theme: 'light',
  }}
/>

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
    theme: 'light',
    showIcon: false,
  }}
/>

<!-- With inline link -->
<Story name="WithInlineLink" asChild>
  <AnnouncementBanner theme="dark" icon={InfoIcon}>
    {#snippet children()}
      Your KYC is verified. <Link href="/settings" color="white">View details</Link>
    {/snippet}
  </AnnouncementBanner>
</Story>

<!-- All variants matrix: theme × alignment -->
<Story name="AllVariants" asChild>
  <div style="display: flex; flex-direction: column; gap: 16px; width: 100%;">
    {#each themes as theme (theme)}
      {#each alignments as alignment (alignment)}
        <AnnouncementBanner {theme} {alignment} icon={InfoIcon}>
          {`theme=${theme} · alignment=${alignment}`}
        </AnnouncementBanner>
      {/each}
    {/each}
  </div>
</Story>

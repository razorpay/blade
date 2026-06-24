<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Avatar from './Avatar.svelte';
  import { iconMap } from '../Icons';

  const { Story } = defineMeta({
    title: 'Components/Avatar/Avatar',
    component: Avatar,
    tags: ['autodocs'],
    argTypes: {
      icon: {
        name: 'icon',
        control: 'select',
        options: Object.keys(iconMap),
        mapping: iconMap,
      },
      size: {
        control: 'select',
        options: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
      },
      variant: {
        control: 'select',
        options: ['circle', 'square'],
      },
      color: {
        control: 'select',
        options: ['primary', 'positive', 'negative', 'notice', 'information', 'neutral'],
      },
    },
  });
</script>

<script lang="ts">
  import { BuildingIcon } from '../Icons/BuildingIcon';
  import { CheckCircleIcon } from '../Icons/CheckCircleIcon';
  import Heading from '../Typography/Heading/Heading.svelte';
  import Text from '../Typography/Text/Text.svelte';

  const sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;
  const colors = ['primary', 'positive', 'negative', 'neutral', 'notice', 'information'] as const;
  const variants = ['circle', 'square'] as const;
</script>

<!-- Story 1: Default -->
<Story name="Default" />

<!-- Story 2: Image Avatars -->
<Story name="Image Avatars" asChild>
  <div style="display: flex; flex-direction: row; gap: 20px;">
    {#each sizes as avatarSize}
      <Avatar size={avatarSize} src="https://avatars.githubusercontent.com/u/46647141?v=4" name="Nitin Kumar" />
    {/each}
  </div>
</Story>

<!-- Story 3: Letter Avatars -->
<Story name="Letter Avatars" asChild>
  <div style="display: flex; flex-direction: row; gap: 20px;">
    {#each sizes as avatarSize}
      <Avatar size={avatarSize} name="Nitin Kumar" />
    {/each}
  </div>
</Story>

<!-- Story 4: Icon Avatars -->
<Story name="Icon Avatars" asChild>
  <div style="display: flex; flex-direction: row; gap: 20px;">
    {#each sizes as avatarSize}
      <Avatar size={avatarSize} icon={BuildingIcon} variant="square" />
    {/each}
  </div>
</Story>

<!-- Story 5: Interactive and NonInteractive Avatar -->
<Story name="Interactive and NonInteractive Avatar" asChild>
  <div style="display: flex; flex-direction: column; gap: 20px;">
    <Text>We can make the Avatar interactive by adding an onClick or setting the href prop</Text>
    <Avatar href="https://razorpay.com" size="large" />
    <Text>If we omit these props, the avatar will render as a plain div element</Text>
    <Avatar size="large" />
  </div>
</Story>

<!-- Story 6: All Sizes -->
<Story name="All Sizes" asChild>
  <div style="display: flex; flex-direction: column; gap: 20px;">
    {#each sizes as avatarSize}
      <div style="display: flex; flex: 1 1 auto; align-items: center; gap: 20px; flex-wrap: nowrap; width: 120px;">
        <div style="width: 50px;">
          <Heading>{avatarSize}</Heading>
        </div>
        <div style="display: flex; flex: 1 1 auto; justify-content: center;">
          <Avatar size={avatarSize} />
        </div>
      </div>
    {/each}
  </div>
</Story>

<!-- Story 7: All Colors -->
<Story name="All Colors" asChild>
  <div style="display: flex; flex-direction: column; gap: 20px;">
    {#each colors as avatarColor}
      <div style="display: flex; flex: 1 1 auto; align-items: center; gap: 20px; flex-wrap: nowrap; width: 200px;">
        <div style="width: 100px;">
          <Heading>{avatarColor}</Heading>
        </div>
        <div style="display: flex; flex: 1 1 auto; justify-content: center;">
          <Avatar size="medium" color={avatarColor} />
        </div>
      </div>
    {/each}
  </div>
</Story>

<!-- Story 8: All Variants -->
<Story name="All Variants" asChild>
  <div style="display: flex; flex-direction: column; gap: 20px;">
    {#each variants as avatarVariant}
      <div style="display: flex; flex: 1 1 auto; align-items: center; gap: 20px; flex-wrap: nowrap; width: 120px;">
        <div style="width: 60px;">
          <Heading>{avatarVariant}</Heading>
        </div>
        <div style="display: flex; flex: 1 1 auto; justify-content: center;">
          <Avatar size="medium" variant={avatarVariant} />
        </div>
      </div>
    {/each}
  </div>
</Story>

<!-- Story 9: With Addons -->
<Story name="With Addons" asChild>
  <div style="display: flex; flex-direction: column; gap: 20px;">
    {#each sizes as avatarSize}
      <div style="display: flex; width: 100%; gap: 20px;">
        <Avatar size={avatarSize} bottomAddon={CheckCircleIcon}>
          {#snippet topAddon()}
            <span style="display: block; width: 8px; height: 8px; border-radius: 50%; background-color: var(--feedback-background-negative-intense);"></span>
          {/snippet}
        </Avatar>
        <Avatar variant="square" size={avatarSize} bottomAddon={CheckCircleIcon}>
          {#snippet topAddon()}
            <span style="display: block; width: 8px; height: 8px; border-radius: 50%; background-color: var(--feedback-background-negative-intense);"></span>
          {/snippet}
        </Avatar>
      </div>
    {/each}
  </div>
</Story>

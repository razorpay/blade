<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AvatarGroup from './AvatarGroup.svelte';

  const { Story } = defineMeta({
    title: 'Components/Avatar/AvatarGroup',
    component: AvatarGroup,
    tags: ['autodocs'],
    argTypes: {
      size: {
        control: 'select',
        options: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
      },
      maxCount: {
        control: 'number',
      },
    },
  });
</script>

<script lang="ts">
  import Avatar from './Avatar.svelte';
  import Heading from '../Typography/Heading/Heading.svelte';

  const names = [
    'Anurag Hazra',
    'Kamlesh Chandnani',
    'Rama Krushna Behera',
    'Nitin Kumar',
    'Chaitanya Vikas Deorukhkar',
  ] as const;
  const avatarColors = ['primary', 'positive', 'negative', 'information', 'notice'] as const;
  const sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;
</script>

<!-- Story 1: Default -->
<Story name="Default" asChild>
  <div style="display: flex; flex-direction: column; gap: 20px;">
    <AvatarGroup>
      {#each names as name, index}
        <Avatar name={name} color={avatarColors[index]} />
      {/each}
    </AvatarGroup>
  </div>
</Story>

<!-- Story 2: Max Count -->
<Story name="Max Count" asChild>
  <div style="display: flex; flex-direction: column; gap: 20px;">
    <AvatarGroup maxCount={3} size="medium">
      {#each names as name, index}
        <Avatar name={name} color={avatarColors[index]} />
      {/each}
    </AvatarGroup>
  </div>
</Story>

<!-- Story 3: All Sizes -->
<Story name="All Sizes" asChild>
  <div style="display: flex; flex-direction: column; gap: 20px;">
    {#each sizes as groupSize}
      <div style="display: flex; flex: 1 1 auto; align-items: center; gap: 20px; flex-wrap: nowrap; width: 250px;">
        <div style="width: 50px;">
          <Heading>{groupSize}</Heading>
        </div>
        <div style="display: flex; flex: 1 1 auto; justify-content: center;">
          <AvatarGroup size={groupSize}>
            {#each names as name, index}
              <Avatar name={name} color={avatarColors[index]} />
            {/each}
          </AvatarGroup>
        </div>
      </div>
    {/each}
  </div>
</Story>

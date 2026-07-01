<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AvatarGroup from './AvatarGroup.svelte';

  const { Story } = defineMeta({
    title: 'Components/Avatar/AvatarGroup',
    component: AvatarGroup,
    tags: ['autodocs'],
    args: {
      size: 'medium',
      density: 'normal',
    },
    argTypes: {
      size: {
        control: 'select',
        options: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
      },
      density: {
        control: 'select',
        options: ['compact', 'normal', 'comfortable'],
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

  const overflowNames = [
    'Anurag Hazra',
    'Kamlesh Chandnani',
    'Rama Krushna Behera',
    'Nitin Kumar',
    'Chaitanya Vikas Deorukhkar',
    'Saurabh Daware',
    'Divya Sharma',
    'Rohan Kokane',
    'Priya Singh',
    'Aditya Kumar',
    'Meera Pillai',
    'Arjun Mehta',
    'Sneha Reddy',
  ] as const;
  const overflowColors = [
    'primary',
    'positive',
    'negative',
    'information',
    'notice',
    'primary',
    'positive',
    'negative',
    'information',
    'notice',
    'primary',
    'positive',
    'negative',
  ] as const;
  const sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;
  const densities = ['compact', 'normal', 'comfortable'] as const;
</script>

<Story name="Playground">
  {#snippet template(args)}
    {@const { children: _, ...rest } = args}
    <AvatarGroup {...rest}>
      {#each names as name, index}
        <Avatar name={name} color={avatarColors[index]} />
      {/each}
    </AvatarGroup>
  {/snippet}
</Story>

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

<!-- Story 4: Density -->
<Story name="Density" asChild>
  <div style="display: flex; flex-direction: column; gap: 32px;">
    {#each densities as density}
      <div style="display: flex; align-items: center; gap: 20px;">
        <div style="width: 100px;">
          <Heading size="small">{density}</Heading>
        </div>
        <AvatarGroup density={density}>
          {#each names as name, index}
            <Avatar name={name} color={avatarColors[index]} />
          {/each}
        </AvatarGroup>
      </div>
    {/each}
  </div>
</Story>

<!-- Story 5: Density with All Sizes -->
<Story name="Density All Sizes" asChild>
  <div style="display: flex; flex-direction: column; gap: 32px;">
    {#each densities as density}
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <Heading size="small">{density}</Heading>
        {#each sizes as groupSize}
          <div style="display: flex; align-items: center; gap: 20px;">
            <div style="width: 60px;">
              <Heading size="small">{groupSize}</Heading>
            </div>
            <AvatarGroup size={groupSize} density={density} maxCount={3}>
              {#each overflowNames as name, index}
                <Avatar name={name} color={overflowColors[index]} />
              {/each}
            </AvatarGroup>
          </div>
        {/each}
      </div>
    {/each}
  </div>
</Story>

<!-- Story 6: Overflow Counter (+N) -->
<Story name="Overflow Counter" asChild>
  <div style="display: flex; flex-direction: column; gap: 20px;">
    {#each sizes as groupSize}
      <div style="display: flex; align-items: center; gap: 20px;">
        <div style="width: 50px;">
          <Heading>{groupSize}</Heading>
        </div>
        <AvatarGroup size={groupSize} maxCount={3}>
          {#each overflowNames as name, index}
            <Avatar name={name} color={overflowColors[index]} />
          {/each}
        </AvatarGroup>
      </div>
    {/each}
  </div>
</Story>

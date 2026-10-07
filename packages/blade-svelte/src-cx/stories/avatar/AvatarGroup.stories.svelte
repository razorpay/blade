<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import GroupStory from './Group.svelte';
  import GroupSource from './Group.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/Avatar/AvatarGroup",
    tags: ['autodocs'],
    argTypes: meta.argTypes,
    parameters: {
      docs: { description: { component: readme } },
    },
  });
</script>
<Story
  name="Basic"
  args={meta.stories.Group.args}
  argTypes={storyArgTypes(meta, 'Group') as never}
  parameters={{ docs: { description: { story: meta.stories.Group.description }, source: exampleSource(GroupSource) }, controls: { disable: hasNoControls(meta, 'Group') } }}
>
  {#snippet template(args)}
    <GroupStory args={args as never} />
  {/snippet}
</Story>

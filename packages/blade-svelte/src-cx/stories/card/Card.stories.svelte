<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import BasicStory from './Basic.svelte';
  import PressableStory from './Pressable.svelte';

  const { Story } = defineMeta({
    title: "Components/Card",
    tags: ['autodocs'],
    argTypes: meta.argTypes,
    parameters: {
      docs: { description: { component: readme } },
    },
  });
</script>

<Story
  name="Basic"
  args={meta.stories.Basic.args}
  argTypes={meta.stories.Basic.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Basic.description } } }}
>
  {#snippet template(args)}
    <BasicStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Pressable"
  args={meta.stories.Pressable.args}
  argTypes={meta.stories.Pressable.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Pressable.description } } }}
>
  {#snippet template(args)}
    <PressableStory args={args as never} />
  {/snippet}
</Story>

<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import BasicStory from './Basic.svelte';
  import EdgesStory from './Edges.svelte';

  const { Story } = defineMeta({
    title: "Components/Tooltip",
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
  name="Edges"
  args={meta.stories.Edges.args}
  argTypes={meta.stories.Edges.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Edges.description } } }}
>
  {#snippet template(args)}
    <EdgesStory args={args as never} />
  {/snippet}
</Story>

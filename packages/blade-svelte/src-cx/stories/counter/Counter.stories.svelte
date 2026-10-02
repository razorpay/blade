<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import BasicStory from './Basic.svelte';
  import MaxStory from './Max.svelte';
  import MatrixStory from './Matrix.svelte';

  const { Story } = defineMeta({
    title: "Components/Counter",
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
  name="Max"
  args={meta.stories.Max.args}
  argTypes={meta.stories.Max.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Max.description } } }}
>
  {#snippet template(args)}
    <MaxStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Matrix"
  args={meta.stories.Matrix.args}
  argTypes={meta.stories.Matrix.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Matrix.description } } }}
>
  {#snippet template(args)}
    <MatrixStory args={args as never} />
  {/snippet}
</Story>

<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import BasicStory from './Basic.svelte';
  import LinkOrButtonStory from './LinkOrButton.svelte';
  import MatrixStory from './Matrix.svelte';

  const { Story } = defineMeta({
    title: "Components/Link",
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
  name="LinkOrButton"
  args={meta.stories.LinkOrButton.args}
  argTypes={meta.stories.LinkOrButton.argTypes}
  parameters={{ docs: { description: { story: meta.stories.LinkOrButton.description } } }}
>
  {#snippet template(args)}
    <LinkOrButtonStory args={args as never} />
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

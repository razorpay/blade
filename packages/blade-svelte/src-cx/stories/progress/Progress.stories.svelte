<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import BasicStory from './Basic.svelte';
  import MatrixStory from './Matrix.svelte';
  import DeterminateStory from './Determinate.svelte';

  const { Story } = defineMeta({
    title: "Components/Progress",
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
  name="Matrix"
  args={meta.stories.Matrix.args}
  argTypes={meta.stories.Matrix.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Matrix.description } } }}
>
  {#snippet template(args)}
    <MatrixStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Determinate"
  args={meta.stories.Determinate.args}
  argTypes={meta.stories.Determinate.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Determinate.description } } }}
>
  {#snippet template(args)}
    <DeterminateStory args={args as never} />
  {/snippet}
</Story>

<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import BasicStory from './Basic.svelte';
  import BasicSource from './Basic.svelte?raw';
  import MatrixStory from './Matrix.svelte';
  import MatrixSource from './Matrix.svelte?raw';
  import AsyncStory from './Async.svelte';
  import AsyncSource from './Async.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/IconButton",
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
  argTypes={storyArgTypes(meta, 'Basic') as never}
  parameters={{ docs: { description: { story: meta.stories.Basic.description }, source: exampleSource(BasicSource) }, controls: { disable: hasNoControls(meta, 'Basic') } }}
>
  {#snippet template(args)}
    <BasicStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Matrix"
  args={meta.stories.Matrix.args}
  argTypes={storyArgTypes(meta, 'Matrix') as never}
  parameters={{ docs: { description: { story: meta.stories.Matrix.description }, source: exampleSource(MatrixSource) }, controls: { disable: hasNoControls(meta, 'Matrix') } }}
>
  {#snippet template(args)}
    <MatrixStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Async"
  args={meta.stories.Async.args}
  argTypes={storyArgTypes(meta, 'Async') as never}
  parameters={{ docs: { description: { story: meta.stories.Async.description }, source: exampleSource(AsyncSource) }, controls: { disable: hasNoControls(meta, 'Async') } }}
>
  {#snippet template(args)}
    <AsyncStory args={args as never} />
  {/snippet}
</Story>

<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import BasicStory from './Basic.svelte';
  import BasicSource from './Basic.svelte?raw';
  import MatrixStory from './Matrix.svelte';
  import MatrixSource from './Matrix.svelte?raw';
  import DeterminateStory from './Determinate.svelte';
  import DeterminateSource from './Determinate.svelte?raw';

  const { Story } = defineMeta({
    title: "Extra Components/Progress",
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
  name="Determinate"
  args={meta.stories.Determinate.args}
  argTypes={storyArgTypes(meta, 'Determinate') as never}
  parameters={{ docs: { description: { story: meta.stories.Determinate.description }, source: exampleSource(DeterminateSource) }, controls: { disable: hasNoControls(meta, 'Determinate') } }}
>
  {#snippet template(args)}
    <DeterminateStory args={args as never} />
  {/snippet}
</Story>

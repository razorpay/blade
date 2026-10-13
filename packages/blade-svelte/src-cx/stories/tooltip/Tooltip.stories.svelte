<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import BasicStory from './Basic.svelte';
  import BasicSource from './Basic.svelte?raw';
  import EdgesStory from './Edges.svelte';
  import EdgesSource from './Edges.svelte?raw';

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
  argTypes={storyArgTypes(meta, 'Basic') as never}
  parameters={{ docs: { description: { story: meta.stories.Basic.description }, source: exampleSource(BasicSource) }, controls: { disable: hasNoControls(meta, 'Basic') } }}
>
  {#snippet template(args)}
    <BasicStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Edges"
  args={meta.stories.Edges.args}
  argTypes={storyArgTypes(meta, 'Edges') as never}
  parameters={{ docs: { description: { story: meta.stories.Edges.description }, source: exampleSource(EdgesSource) }, controls: { disable: hasNoControls(meta, 'Edges') } }}
>
  {#snippet template(args)}
    <EdgesStory args={args as never} />
  {/snippet}
</Story>

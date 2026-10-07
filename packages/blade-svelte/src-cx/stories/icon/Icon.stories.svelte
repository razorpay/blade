<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import BasicStory from './Basic.svelte';
  import BasicSource from './Basic.svelte?raw';
  import GalleryStory from './Gallery.svelte';
  import GallerySource from './Gallery.svelte?raw';
  import MatrixStory from './Matrix.svelte';
  import MatrixSource from './Matrix.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/Icon",
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
  name="Gallery"
  args={meta.stories.Gallery.args}
  argTypes={storyArgTypes(meta, 'Gallery') as never}
  parameters={{ docs: { description: { story: meta.stories.Gallery.description }, source: exampleSource(GallerySource) }, controls: { disable: hasNoControls(meta, 'Gallery') } }}
>
  {#snippet template(args)}
    <GalleryStory args={args as never} />
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

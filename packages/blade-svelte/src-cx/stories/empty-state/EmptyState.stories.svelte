<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import BasicStory from './Basic.svelte';
  import BasicSource from './Basic.svelte?raw';
  import SizesStory from './Sizes.svelte';
  import SizesSource from './Sizes.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/EmptyState",
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
  name="Sizes"
  argTypes={storyArgTypes(meta, 'Sizes') as never}
  parameters={{ docs: { description: { story: meta.stories.Sizes.description }, source: exampleSource(SizesSource) }, controls: { disable: hasNoControls(meta, 'Sizes') } }}
>
  {#snippet template()}
    <SizesStory />
  {/snippet}
</Story>

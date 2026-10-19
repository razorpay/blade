<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes, readmeBody } from '../helpers';
  import BasicStory from './Basic.svelte';
  import BasicSource from './Basic.svelte?raw';
  import PlacedStory from './Placed.svelte';
  import PlacedSource from './Placed.svelte?raw';
  import StackedStory from './Stacked.svelte';
  import StackedSource from './Stacked.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/Modal",
    tags: ['autodocs'],
    argTypes: meta.argTypes,
    parameters: {
      docs: { description: { component: readmeBody(readme) } },
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
  name="Stacked modals"
  args={meta.stories.Stacked.args}
  argTypes={storyArgTypes(meta, 'Stacked') as never}
  parameters={{ docs: { description: { story: meta.stories.Stacked.description }, source: exampleSource(StackedSource) }, controls: { disable: hasNoControls(meta, 'Stacked') } }}
>
  {#snippet template(args)}
    <StackedStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Placed by classes"
  args={meta.stories.Placed.args}
  argTypes={storyArgTypes(meta, 'Placed') as never}
  parameters={{ docs: { description: { story: meta.stories.Placed.description }, source: exampleSource(PlacedSource) }, controls: { disable: hasNoControls(meta, 'Placed') } }}
>
  {#snippet template(args)}
    <PlacedStory args={args as never} />
  {/snippet}
</Story>

<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import SingleStory from './Single.svelte';
  import SingleSource from './Single.svelte?raw';
  import MultipleStory from './Multiple.svelte';
  import MultipleSource from './Multiple.svelte?raw';
  import SizesStory from './Sizes.svelte';
  import SizesSource from './Sizes.svelte?raw';
  import IconsStory from './Icons.svelte';
  import IconsSource from './Icons.svelte?raw';
  import InFormStory from './InForm.svelte';
  import InFormSource from './InForm.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/Chip",
    tags: ['autodocs'],
    argTypes: meta.argTypes,
    parameters: {
      docs: { description: { component: readme } },
    },
  });
</script>

<Story
  name="Single selection"
  args={meta.stories.Single.args}
  argTypes={storyArgTypes(meta, 'Single') as never}
  parameters={{ docs: { description: { story: meta.stories.Single.description }, source: exampleSource(SingleSource) }, controls: { disable: hasNoControls(meta, 'Single') } }}
>
  {#snippet template(args)}
    <SingleStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Multi selection"
  args={meta.stories.Multiple.args}
  argTypes={storyArgTypes(meta, 'Multiple') as never}
  parameters={{ docs: { description: { story: meta.stories.Multiple.description }, source: exampleSource(MultipleSource) }, controls: { disable: hasNoControls(meta, 'Multiple') } }}
>
  {#snippet template(args)}
    <MultipleStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Sizes and colours"
  args={meta.stories.Sizes.args}
  argTypes={storyArgTypes(meta, 'Sizes') as never}
  parameters={{ docs: { description: { story: meta.stories.Sizes.description }, source: exampleSource(SizesSource) }, controls: { disable: hasNoControls(meta, 'Sizes') } }}
>
  {#snippet template(args)}
    <SizesStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="With icons"
  args={meta.stories.Icons.args}
  argTypes={storyArgTypes(meta, 'Icons') as never}
  parameters={{ docs: { description: { story: meta.stories.Icons.description }, source: exampleSource(IconsSource) }, controls: { disable: hasNoControls(meta, 'Icons') } }}
>
  {#snippet template(args)}
    <IconsStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="In a form"
  args={meta.stories.InForm.args}
  argTypes={storyArgTypes(meta, 'InForm') as never}
  parameters={{ docs: { description: { story: meta.stories.InForm.description }, source: exampleSource(InFormSource) }, controls: { disable: hasNoControls(meta, 'InForm') } }}
>
  {#snippet template(args)}
    <InFormStory args={args as never} />
  {/snippet}
</Story>

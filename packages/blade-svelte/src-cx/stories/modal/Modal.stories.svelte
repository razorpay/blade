<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import BasicStory from './Basic.svelte';
  import BasicSource from './Basic.svelte?raw';
  import BottomSheetStory from './BottomSheet.svelte';
  import BottomSheetSource from './BottomSheet.svelte?raw';
  import DrawerStory from './Drawer.svelte';
  import DrawerSource from './Drawer.svelte?raw';
  import StackedStory from './Stacked.svelte';
  import StackedSource from './Stacked.svelte?raw';
  import ImperativeStory from './Imperative.svelte';
  import ImperativeSource from './Imperative.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/Modal",
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
  name="Bottom sheet"
  args={meta.stories.BottomSheet.args}
  argTypes={storyArgTypes(meta, 'BottomSheet') as never}
  parameters={{ docs: { description: { story: meta.stories.BottomSheet.description }, source: exampleSource(BottomSheetSource) }, controls: { disable: hasNoControls(meta, 'BottomSheet') } }}
>
  {#snippet template(args)}
    <BottomSheetStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Drawer"
  args={meta.stories.Drawer.args}
  argTypes={storyArgTypes(meta, 'Drawer') as never}
  parameters={{ docs: { description: { story: meta.stories.Drawer.description }, source: exampleSource(DrawerSource) }, controls: { disable: hasNoControls(meta, 'Drawer') } }}
>
  {#snippet template(args)}
    <DrawerStory args={args as never} />
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
  name="openModal"
  args={meta.stories.Imperative.args}
  argTypes={storyArgTypes(meta, 'Imperative') as never}
  parameters={{ docs: { description: { story: meta.stories.Imperative.description }, source: exampleSource(ImperativeSource) }, controls: { disable: hasNoControls(meta, 'Imperative') } }}
>
  {#snippet template(args)}
    <ImperativeStory args={args as never} />
  {/snippet}
</Story>

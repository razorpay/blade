<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import BasicStory from './Basic.svelte';
  import BottomSheetStory from './BottomSheet.svelte';
  import DrawerStory from './Drawer.svelte';
  import StackedStory from './Stacked.svelte';
  import ImperativeStory from './Imperative.svelte';

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
  argTypes={meta.stories.Basic.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Basic.description } } }}
>
  {#snippet template(args)}
    <BasicStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Bottom sheet"
  args={meta.stories.BottomSheet.args}
  argTypes={meta.stories.BottomSheet.argTypes}
  parameters={{ docs: { description: { story: meta.stories.BottomSheet.description } } }}
>
  {#snippet template(args)}
    <BottomSheetStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Drawer"
  args={meta.stories.Drawer.args}
  argTypes={meta.stories.Drawer.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Drawer.description } } }}
>
  {#snippet template(args)}
    <DrawerStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Stacked modals"
  args={meta.stories.Stacked.args}
  argTypes={meta.stories.Stacked.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Stacked.description } } }}
>
  {#snippet template(args)}
    <StackedStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="openModal"
  args={meta.stories.Imperative.args}
  argTypes={meta.stories.Imperative.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Imperative.description } } }}
>
  {#snippet template(args)}
    <ImperativeStory args={args as never} />
  {/snippet}
</Story>

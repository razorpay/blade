<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import BasicStory from './Basic.svelte';
  import BasicSource from './Basic.svelte?raw';
  import PressableStory from './Pressable.svelte';
  import PressableSource from './Pressable.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/Card",
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
  name="Pressable"
  args={meta.stories.Pressable.args}
  argTypes={storyArgTypes(meta, 'Pressable') as never}
  parameters={{ docs: { description: { story: meta.stories.Pressable.description }, source: exampleSource(PressableSource) }, controls: { disable: hasNoControls(meta, 'Pressable') } }}
>
  {#snippet template(args)}
    <PressableStory args={args as never} />
  {/snippet}
</Story>

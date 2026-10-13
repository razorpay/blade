<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import DisplayStory from './Display.svelte';
  import DisplaySource from './Display.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/Typography/Display",
    tags: ['autodocs'],
    argTypes: meta.argTypes,
    parameters: {
      docs: { description: { component: readme } },
    },
  });
</script>
<Story
  name="Basic"
  args={meta.stories.Display.args}
  argTypes={storyArgTypes(meta, 'Display') as never}
  parameters={{ docs: { description: { story: meta.stories.Display.description }, source: exampleSource(DisplaySource) }, controls: { disable: hasNoControls(meta, 'Display') } }}
>
  {#snippet template(args)}
    <DisplayStory args={args as never} />
  {/snippet}
</Story>

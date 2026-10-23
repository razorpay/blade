<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes, readmeBody } from '../helpers';
  import PopoverStory from './Popover.svelte';
  import PopoverSource from './Popover.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/Popover",
    tags: ['autodocs'],
    argTypes: meta.argTypes,
    parameters: {
      docs: { description: { component: readmeBody(readme) } },
    },
  });
</script>

<Story
  name="Basic"
  args={meta.stories.Popover.args}
  argTypes={storyArgTypes(meta, 'Popover') as never}
  parameters={{ docs: { description: { story: meta.stories.Popover.description }, source: exampleSource(PopoverSource) }, controls: { disable: hasNoControls(meta, 'Popover') } }}
>
  {#snippet template(args)}
    <PopoverStory args={args as never} />
  {/snippet}
</Story>

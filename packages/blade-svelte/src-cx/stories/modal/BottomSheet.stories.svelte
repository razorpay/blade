<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import BottomSheetStory from './BottomSheet.svelte';
  import BottomSheetSource from './BottomSheet.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/BottomSheet",
    tags: ['autodocs'],
    argTypes: meta.argTypes,
    parameters: {
      docs: { description: { component: readme } },
    },
  });
</script>
<Story
  name="Basic"
  args={meta.stories.BottomSheet.args}
  argTypes={storyArgTypes(meta, 'BottomSheet') as never}
  parameters={{ docs: { description: { story: meta.stories.BottomSheet.description }, source: exampleSource(BottomSheetSource) }, controls: { disable: hasNoControls(meta, 'BottomSheet') } }}
>
  {#snippet template(args)}
    <BottomSheetStory args={args as never} />
  {/snippet}
</Story>

<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import TextStory from './Text.svelte';
  import TextSource from './Text.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/Typography/Text",
    tags: ['autodocs'],
    argTypes: meta.argTypes,
    parameters: {
      docs: { description: { component: readme } },
    },
  });
</script>
<Story
  name="Basic"
  args={meta.stories.Text.args}
  argTypes={storyArgTypes(meta, 'Text') as never}
  parameters={{ docs: { description: { story: meta.stories.Text.description }, source: exampleSource(TextSource) }, controls: { disable: hasNoControls(meta, 'Text') } }}
>
  {#snippet template(args)}
    <TextStory args={args as never} />
  {/snippet}
</Story>

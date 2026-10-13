<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import TextareaStory from './Textarea.svelte';
  import TextareaSource from './Textarea.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/Input/TextArea",
    tags: ['autodocs'],
    argTypes: meta.argTypes,
    parameters: {
      docs: { description: { component: readme } },
    },
  });
</script>
<Story
  name="Basic"
  args={meta.stories.Textarea.args}
  argTypes={storyArgTypes(meta, 'Textarea') as never}
  parameters={{ docs: { description: { story: meta.stories.Textarea.description }, source: exampleSource(TextareaSource) }, controls: { disable: hasNoControls(meta, 'Textarea') } }}
>
  {#snippet template(args)}
    <TextareaStory args={args as never} />
  {/snippet}
</Story>

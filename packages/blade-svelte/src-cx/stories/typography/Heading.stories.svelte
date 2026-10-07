<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import HeadingStory from './Heading.svelte';
  import HeadingSource from './Heading.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/Typography/Heading",
    tags: ['autodocs'],
    argTypes: meta.argTypes,
    parameters: {
      docs: { description: { component: readme } },
    },
  });
</script>
<Story
  name="Basic"
  args={meta.stories.Heading.args}
  argTypes={storyArgTypes(meta, 'Heading') as never}
  parameters={{ docs: { description: { story: meta.stories.Heading.description }, source: exampleSource(HeadingSource) }, controls: { disable: hasNoControls(meta, 'Heading') } }}
>
  {#snippet template(args)}
    <HeadingStory args={args as never} />
  {/snippet}
</Story>

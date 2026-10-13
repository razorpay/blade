<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import SeamStory from './Seam.svelte';
  import SeamSource from './Seam.svelte?raw';

  const { Story } = defineMeta({
    title: "Guides/Adapters",
    tags: ['autodocs'],
    argTypes: meta.argTypes,
    parameters: {
      docs: { description: { component: readme } },
    },
  });
</script>

<Story
  name="Every adapter wired"
  args={meta.stories.Seam.args}
  argTypes={storyArgTypes(meta, 'Seam') as never}
  parameters={{ docs: { description: { story: meta.stories.Seam.description }, source: exampleSource(SeamSource) }, controls: { disable: hasNoControls(meta, 'Seam') } }}
>
  {#snippet template(args)}
    <SeamStory args={args as never} />
  {/snippet}
</Story>

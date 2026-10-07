<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import ScaleStory from './Scale.svelte';
  import ScaleSource from './Scale.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/Typography/Scale",
    tags: ['autodocs'],
    argTypes: meta.argTypes,
    parameters: {
      docs: { description: { component: readme } },
    },
  });
</script>
<Story
  name="Scale"
  args={meta.stories.Scale.args}
  argTypes={storyArgTypes(meta, 'Scale') as never}
  parameters={{ docs: { description: { story: meta.stories.Scale.description }, source: exampleSource(ScaleSource) }, controls: { disable: hasNoControls(meta, 'Scale') } }}
>
  {#snippet template(args)}
    <ScaleStory args={args as never} />
  {/snippet}
</Story>

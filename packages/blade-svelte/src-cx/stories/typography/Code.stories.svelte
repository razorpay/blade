<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import CodeStory from './Code.svelte';
  import CodeSource from './Code.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/Typography/Code",
    tags: ['autodocs'],
    argTypes: meta.argTypes,
    parameters: {
      docs: { description: { component: readme } },
    },
  });
</script>
<Story
  name="Basic"
  args={meta.stories.Code.args}
  argTypes={storyArgTypes(meta, 'Code') as never}
  parameters={{ docs: { description: { story: meta.stories.Code.description }, source: exampleSource(CodeSource) }, controls: { disable: hasNoControls(meta, 'Code') } }}
>
  {#snippet template(args)}
    <CodeStory args={args as never} />
  {/snippet}
</Story>

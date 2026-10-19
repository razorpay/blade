<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes, readmeBody } from '../helpers';
  import BasicStory from './Basic.svelte';
  import BasicSource from './Basic.svelte?raw';
  import IconOnlyStory from './IconOnly.svelte';
  import IconOnlySource from './IconOnly.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/SegmentedControl",
    tags: ['autodocs'],
    argTypes: meta.argTypes,
    parameters: {
      docs: { description: { component: readmeBody(readme) } },
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
  name="Icon only"
  args={meta.stories.IconOnly.args}
  argTypes={storyArgTypes(meta, 'IconOnly') as never}
  parameters={{ docs: { description: { story: meta.stories.IconOnly.description }, source: exampleSource(IconOnlySource) }, controls: { disable: hasNoControls(meta, 'IconOnly') } }}
>
  {#snippet template(args)}
    <IconOnlyStory args={args as never} />
  {/snippet}
</Story>


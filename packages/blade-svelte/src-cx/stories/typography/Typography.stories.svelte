<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import TextStory from './Text.svelte';
  import TextSource from './Text.svelte?raw';
  import HeadingStory from './Heading.svelte';
  import HeadingSource from './Heading.svelte?raw';
  import ScaleStory from './Scale.svelte';
  import ScaleSource from './Scale.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/Typography",
    tags: ['autodocs'],
    argTypes: meta.argTypes,
    parameters: {
      docs: { description: { component: readme } },
    },
  });
</script>

<Story
  name="Text"
  args={meta.stories.Text.args}
  argTypes={storyArgTypes(meta, 'Text') as never}
  parameters={{ docs: { description: { story: meta.stories.Text.description }, source: exampleSource(TextSource) }, controls: { disable: hasNoControls(meta, 'Text') } }}
>
  {#snippet template(args)}
    <TextStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Heading"
  args={meta.stories.Heading.args}
  argTypes={storyArgTypes(meta, 'Heading') as never}
  parameters={{ docs: { description: { story: meta.stories.Heading.description }, source: exampleSource(HeadingSource) }, controls: { disable: hasNoControls(meta, 'Heading') } }}
>
  {#snippet template(args)}
    <HeadingStory args={args as never} />
  {/snippet}
</Story>

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

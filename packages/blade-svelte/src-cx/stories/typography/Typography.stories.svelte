<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import TextStory from './Text.svelte';
  import HeadingStory from './Heading.svelte';
  import ScaleStory from './Scale.svelte';

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
  argTypes={meta.stories.Text.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Text.description } } }}
>
  {#snippet template(args)}
    <TextStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Heading"
  args={meta.stories.Heading.args}
  argTypes={meta.stories.Heading.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Heading.description } } }}
>
  {#snippet template(args)}
    <HeadingStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Scale"
  args={meta.stories.Scale.args}
  argTypes={meta.stories.Scale.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Scale.description } } }}
>
  {#snippet template(args)}
    <ScaleStory args={args as never} />
  {/snippet}
</Story>

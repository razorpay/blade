<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import SingleStory from './Single.svelte';
  import MultipleStory from './Multiple.svelte';
  import SizesStory from './Sizes.svelte';
  import IconsStory from './Icons.svelte';
  import InFormStory from './InForm.svelte';

  const { Story } = defineMeta({
    title: "Components/Chip",
    tags: ['autodocs'],
    argTypes: meta.argTypes,
    parameters: {
      docs: { description: { component: readme } },
    },
  });
</script>

<Story
  name="Single selection"
  args={meta.stories.Single.args}
  argTypes={meta.stories.Single.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Single.description } } }}
>
  {#snippet template(args)}
    <SingleStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Multi selection"
  args={meta.stories.Multiple.args}
  argTypes={meta.stories.Multiple.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Multiple.description } } }}
>
  {#snippet template(args)}
    <MultipleStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Sizes and colours"
  args={meta.stories.Sizes.args}
  argTypes={meta.stories.Sizes.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Sizes.description } } }}
>
  {#snippet template(args)}
    <SizesStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="With icons"
  args={meta.stories.Icons.args}
  argTypes={meta.stories.Icons.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Icons.description } } }}
>
  {#snippet template(args)}
    <IconsStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="In a form"
  args={meta.stories.InForm.args}
  argTypes={meta.stories.InForm.argTypes}
  parameters={{ docs: { description: { story: meta.stories.InForm.description } } }}
>
  {#snippet template(args)}
    <InFormStory args={args as never} />
  {/snippet}
</Story>

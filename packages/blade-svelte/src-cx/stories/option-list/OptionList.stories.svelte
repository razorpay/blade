<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import BasicStory from './Basic.svelte';
  import MultipleStory from './Multiple.svelte';
  import FilteredStory from './Filtered.svelte';
  import VirtualisedStory from './Virtualised.svelte';
  import InFormStory from './InForm.svelte';

  const { Story } = defineMeta({
    title: "Components/OptionList",
    tags: ['autodocs'],
    argTypes: meta.argTypes,
    parameters: {
      docs: { description: { component: readme } },
    },
  });
</script>

<Story
  name="Basic"
  args={meta.stories.Basic.args}
  argTypes={meta.stories.Basic.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Basic.description } } }}
>
  {#snippet template(args)}
    <BasicStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Multiple"
  args={meta.stories.Multiple.args}
  argTypes={meta.stories.Multiple.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Multiple.description } } }}
>
  {#snippet template(args)}
    <MultipleStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Filtered"
  args={meta.stories.Filtered.args}
  argTypes={meta.stories.Filtered.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Filtered.description } } }}
>
  {#snippet template(args)}
    <FilteredStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Virtualised"
  args={meta.stories.Virtualised.args}
  argTypes={meta.stories.Virtualised.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Virtualised.description } } }}
>
  {#snippet template(args)}
    <VirtualisedStory args={args as never} />
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

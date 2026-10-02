<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import BasicStory from './Basic.svelte';
  import VariantsStory from './Variants.svelte';
  import InFormStory from './InForm.svelte';

  const { Story } = defineMeta({
    title: "Components/CounterInput",
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
  name="Sizes and emphases"
  args={meta.stories.Variants.args}
  argTypes={meta.stories.Variants.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Variants.description } } }}
>
  {#snippet template(args)}
    <VariantsStory args={args as never} />
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

<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import BasicStory from './Basic.svelte';
  import ValidationStory from './Validation.svelte';
  import AffixesStory from './Affixes.svelte';
  import FormattedStory from './Formatted.svelte';
  import TextareaStory from './Textarea.svelte';

  const { Story } = defineMeta({
    title: "Components/TextInput",
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
  name="Validation"
  args={meta.stories.Validation.args}
  argTypes={meta.stories.Validation.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Validation.description } } }}
>
  {#snippet template(args)}
    <ValidationStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Affixes"
  args={meta.stories.Affixes.args}
  argTypes={meta.stories.Affixes.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Affixes.description } } }}
>
  {#snippet template(args)}
    <AffixesStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Formatted"
  args={meta.stories.Formatted.args}
  argTypes={meta.stories.Formatted.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Formatted.description } } }}
>
  {#snippet template(args)}
    <FormattedStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="TextAreaInput"
  args={meta.stories.Textarea.args}
  argTypes={meta.stories.Textarea.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Textarea.description } } }}
>
  {#snippet template(args)}
    <TextareaStory args={args as never} />
  {/snippet}
</Story>

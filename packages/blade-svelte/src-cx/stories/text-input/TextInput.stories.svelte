<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import BasicStory from './Basic.svelte';
  import ValidationStory from './Validation.svelte';
  import AffixesStory from './Affixes.svelte';
  import LabelAreaStory from './LabelArea.svelte';
  import FormattedStory from './Formatted.svelte';
  import TextareaStory from './Textarea.svelte';
  import PasswordInputStory from './PasswordInput.svelte';
  import SearchInputStory from './SearchInput.svelte';

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
  name="PasswordInput"
  args={meta.stories.PasswordInput.args}
  argTypes={meta.stories.PasswordInput.argTypes}
  parameters={{ docs: { description: { story: meta.stories.PasswordInput.description } } }}
>
  {#snippet template(args)}
    <PasswordInputStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="SearchInput"
  args={meta.stories.SearchInput.args}
  argTypes={meta.stories.SearchInput.argTypes}
  parameters={{ docs: { description: { story: meta.stories.SearchInput.description } } }}
>
  {#snippet template(args)}
    <SearchInputStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="TextArea"
  args={meta.stories.Textarea.args}
  argTypes={meta.stories.Textarea.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Textarea.description } } }}
>
  {#snippet template(args)}
    <TextareaStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Label area"
  parameters={{ docs: { description: { story: meta.stories.LabelArea.description } } }}
>
  {#snippet template()}
    <LabelAreaStory />
  {/snippet}
</Story>

<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import BasicStory from './Basic.svelte';
  import BasicSource from './Basic.svelte?raw';
  import ValidationStory from './Validation.svelte';
  import ValidationSource from './Validation.svelte?raw';
  import AffixesStory from './Affixes.svelte';
  import AffixesSource from './Affixes.svelte?raw';
  import LabelAreaStory from './LabelArea.svelte';
  import LabelAreaSource from './LabelArea.svelte?raw';
  import FormattedStory from './Formatted.svelte';
  import FormattedSource from './Formatted.svelte?raw';
  import TextareaStory from './Textarea.svelte';
  import TextareaSource from './Textarea.svelte?raw';
  import PasswordInputStory from './PasswordInput.svelte';
  import PasswordInputSource from './PasswordInput.svelte?raw';
  import SearchInputStory from './SearchInput.svelte';
  import SearchInputSource from './SearchInput.svelte?raw';

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
  argTypes={storyArgTypes(meta, 'Basic') as never}
  parameters={{ docs: { description: { story: meta.stories.Basic.description }, source: exampleSource(BasicSource) }, controls: { disable: hasNoControls(meta, 'Basic') } }}
>
  {#snippet template(args)}
    <BasicStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Validation"
  args={meta.stories.Validation.args}
  argTypes={storyArgTypes(meta, 'Validation') as never}
  parameters={{ docs: { description: { story: meta.stories.Validation.description }, source: exampleSource(ValidationSource) }, controls: { disable: hasNoControls(meta, 'Validation') } }}
>
  {#snippet template(args)}
    <ValidationStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Affixes"
  args={meta.stories.Affixes.args}
  argTypes={storyArgTypes(meta, 'Affixes') as never}
  parameters={{ docs: { description: { story: meta.stories.Affixes.description }, source: exampleSource(AffixesSource) }, controls: { disable: hasNoControls(meta, 'Affixes') } }}
>
  {#snippet template(args)}
    <AffixesStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Formatted"
  args={meta.stories.Formatted.args}
  argTypes={storyArgTypes(meta, 'Formatted') as never}
  parameters={{ docs: { description: { story: meta.stories.Formatted.description }, source: exampleSource(FormattedSource) }, controls: { disable: hasNoControls(meta, 'Formatted') } }}
>
  {#snippet template(args)}
    <FormattedStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="PasswordInput"
  args={meta.stories.PasswordInput.args}
  argTypes={storyArgTypes(meta, 'PasswordInput') as never}
  parameters={{ docs: { description: { story: meta.stories.PasswordInput.description }, source: exampleSource(PasswordInputSource) }, controls: { disable: hasNoControls(meta, 'PasswordInput') } }}
>
  {#snippet template(args)}
    <PasswordInputStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="SearchInput"
  args={meta.stories.SearchInput.args}
  argTypes={storyArgTypes(meta, 'SearchInput') as never}
  parameters={{ docs: { description: { story: meta.stories.SearchInput.description }, source: exampleSource(SearchInputSource) }, controls: { disable: hasNoControls(meta, 'SearchInput') } }}
>
  {#snippet template(args)}
    <SearchInputStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="TextArea"
  args={meta.stories.Textarea.args}
  argTypes={storyArgTypes(meta, 'Textarea') as never}
  parameters={{ docs: { description: { story: meta.stories.Textarea.description }, source: exampleSource(TextareaSource) }, controls: { disable: hasNoControls(meta, 'Textarea') } }}
>
  {#snippet template(args)}
    <TextareaStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Label area"
  parameters={{ docs: { description: { story: meta.stories.LabelArea.description }, source: exampleSource(LabelAreaSource) }, controls: { disable: hasNoControls(meta, 'LabelArea') } }}
>
  {#snippet template()}
    <LabelAreaStory />
  {/snippet}
</Story>

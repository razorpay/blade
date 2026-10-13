<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import BasicStory from './Basic.svelte';
  import BasicSource from './Basic.svelte?raw';
  import MultipleStory from './Multiple.svelte';
  import MultipleSource from './Multiple.svelte?raw';
  import WithSearchStory from './WithSearch.svelte';
  import WithSearchSource from './WithSearch.svelte?raw';
  import WithButtonStory from './WithButton.svelte';
  import WithButtonSource from './WithButton.svelte?raw';
  import StatesStory from './States.svelte';
  import StatesSource from './States.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/Dropdown/Dropdown",
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
  name="Multiple"
  args={meta.stories.Multiple.args}
  argTypes={storyArgTypes(meta, 'Multiple') as never}
  parameters={{ docs: { description: { story: meta.stories.Multiple.description }, source: exampleSource(MultipleSource) }, controls: { disable: hasNoControls(meta, 'Multiple') } }}
>
  {#snippet template()}
    <MultipleStory />
  {/snippet}
</Story>

<Story
  name="WithSearch"
  args={meta.stories.WithSearch.args}
  argTypes={storyArgTypes(meta, 'WithSearch') as never}
  parameters={{ docs: { description: { story: meta.stories.WithSearch.description }, source: exampleSource(WithSearchSource) }, controls: { disable: hasNoControls(meta, 'WithSearch') } }}
>
  {#snippet template()}
    <WithSearchStory />
  {/snippet}
</Story>

<Story
  name="WithButton"
  args={meta.stories.WithButton.args}
  argTypes={storyArgTypes(meta, 'WithButton') as never}
  parameters={{ docs: { description: { story: meta.stories.WithButton.description }, source: exampleSource(WithButtonSource) }, controls: { disable: hasNoControls(meta, 'WithButton') } }}
>
  {#snippet template()}
    <WithButtonStory />
  {/snippet}
</Story>

<Story
  name="States"
  args={meta.stories.States.args}
  argTypes={storyArgTypes(meta, 'States') as never}
  parameters={{ docs: { description: { story: meta.stories.States.description }, source: exampleSource(StatesSource) }, controls: { disable: hasNoControls(meta, 'States') } }}
>
  {#snippet template()}
    <StatesStory />
  {/snippet}
</Story>

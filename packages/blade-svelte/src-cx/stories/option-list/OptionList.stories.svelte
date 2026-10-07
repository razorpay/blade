<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import BasicStory from './Basic.svelte';
  import BasicSource from './Basic.svelte?raw';
  import MultipleStory from './Multiple.svelte';
  import MultipleSource from './Multiple.svelte?raw';
  import FilteredStory from './Filtered.svelte';
  import FilteredSource from './Filtered.svelte?raw';
  import WithOtherChildrenStory from './WithOtherChildren.svelte';
  import WithOtherChildrenSource from './WithOtherChildren.svelte?raw';
  import VirtualisedStory from './Virtualised.svelte';
  import VirtualisedSource from './Virtualised.svelte?raw';
  import InFormStory from './InForm.svelte';
  import InFormSource from './InForm.svelte?raw';

  const { Story } = defineMeta({
    title: "Extra Components/OptionList",
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
  {#snippet template(args)}
    <MultipleStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Filtered"
  args={meta.stories.Filtered.args}
  argTypes={storyArgTypes(meta, 'Filtered') as never}
  parameters={{ docs: { description: { story: meta.stories.Filtered.description }, source: exampleSource(FilteredSource) }, controls: { disable: hasNoControls(meta, 'Filtered') } }}
>
  {#snippet template(args)}
    <FilteredStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Headings and a button"
  args={meta.stories.WithOtherChildren.args}
  argTypes={storyArgTypes(meta, 'WithOtherChildren') as never}
  parameters={{ docs: { description: { story: meta.stories.WithOtherChildren.description }, source: exampleSource(WithOtherChildrenSource) }, controls: { disable: hasNoControls(meta, 'WithOtherChildren') } }}
>
  {#snippet template(args)}
    <WithOtherChildrenStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Virtualised"
  args={meta.stories.Virtualised.args}
  argTypes={storyArgTypes(meta, 'Virtualised') as never}
  parameters={{ docs: { description: { story: meta.stories.Virtualised.description }, source: exampleSource(VirtualisedSource) }, controls: { disable: hasNoControls(meta, 'Virtualised') } }}
>
  {#snippet template(args)}
    <VirtualisedStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="In a form"
  args={meta.stories.InForm.args}
  argTypes={storyArgTypes(meta, 'InForm') as never}
  parameters={{ docs: { description: { story: meta.stories.InForm.description }, source: exampleSource(InFormSource) }, controls: { disable: hasNoControls(meta, 'InForm') } }}
>
  {#snippet template(args)}
    <InFormStory args={args as never} />
  {/snippet}
</Story>

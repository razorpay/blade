<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import BasicStory from './Basic.svelte';
  import BasicSource from './Basic.svelte?raw';
  import AllowedStory from './Allowed.svelte';
  import AllowedSource from './Allowed.svelte?raw';
  import InFormStory from './InForm.svelte';
  import InFormSource from './InForm.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/PhoneNumberInput",
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
  name="Allowed"
  args={meta.stories.Allowed.args}
  argTypes={storyArgTypes(meta, 'Allowed') as never}
  parameters={{ docs: { description: { story: meta.stories.Allowed.description }, source: exampleSource(AllowedSource) }, controls: { disable: hasNoControls(meta, 'Allowed') } }}
>
  {#snippet template(args)}
    <AllowedStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="InForm"
  args={meta.stories.InForm.args}
  argTypes={storyArgTypes(meta, 'InForm') as never}
  parameters={{ docs: { description: { story: meta.stories.InForm.description }, source: exampleSource(InFormSource) }, controls: { disable: hasNoControls(meta, 'InForm') } }}
>
  {#snippet template(args)}
    <InFormStory args={args as never} />
  {/snippet}
</Story>

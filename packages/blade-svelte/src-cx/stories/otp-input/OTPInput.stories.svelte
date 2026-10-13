<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import BasicStory from './Basic.svelte';
  import BasicSource from './Basic.svelte?raw';
  import ValidationStory from './Validation.svelte';
  import ValidationSource from './Validation.svelte?raw';
  import OutsideValueStory from './OutsideValue.svelte';
  import OutsideValueSource from './OutsideValue.svelte?raw';
  import InFormStory from './InForm.svelte';
  import InFormSource from './InForm.svelte?raw';
  import LengthsStory from './Lengths.svelte';
  import LengthsSource from './Lengths.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/Input/OTPInput",
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
  name="Outside value"
  args={meta.stories.OutsideValue.args}
  argTypes={storyArgTypes(meta, 'OutsideValue') as never}
  parameters={{ docs: { description: { story: meta.stories.OutsideValue.description }, source: exampleSource(OutsideValueSource) }, controls: { disable: hasNoControls(meta, 'OutsideValue') } }}
>
  {#snippet template(args)}
    <OutsideValueStory args={args as never} />
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

<Story
  name="Lengths"
  args={meta.stories.Lengths.args}
  argTypes={storyArgTypes(meta, 'Lengths') as never}
  parameters={{ docs: { description: { story: meta.stories.Lengths.description }, source: exampleSource(LengthsSource) }, controls: { disable: hasNoControls(meta, 'Lengths') } }}
>
  {#snippet template(args)}
    <LengthsStory args={args as never} />
  {/snippet}
</Story>

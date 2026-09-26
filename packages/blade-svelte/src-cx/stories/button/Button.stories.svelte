<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import BasicStory from './Basic.svelte';
  import BusyCausesStory from './BusyCauses.svelte';
  import ValidateStory from './Validate.svelte';
  import AutoPressStory from './AutoPress.svelte';
  import MatrixStory from './Matrix.svelte';

  const { Story } = defineMeta({
    title: "Components/Button",
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
  name="Busy causes"
  args={meta.stories.BusyCauses.args}
  argTypes={meta.stories.BusyCauses.argTypes}
  parameters={{ docs: { description: { story: meta.stories.BusyCauses.description } } }}
>
  {#snippet template(args)}
    <BusyCausesStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Validate before press"
  args={meta.stories.Validate.args}
  argTypes={meta.stories.Validate.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Validate.description } } }}
>
  {#snippet template(args)}
    <ValidateStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Auto press"
  args={meta.stories.AutoPress.args}
  argTypes={meta.stories.AutoPress.argTypes}
  parameters={{ docs: { description: { story: meta.stories.AutoPress.description } } }}
>
  {#snippet template(args)}
    <AutoPressStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Variant matrix"
  args={meta.stories.Matrix.args}
  argTypes={meta.stories.Matrix.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Matrix.description } } }}
>
  {#snippet template(args)}
    <MatrixStory args={args as never} />
  {/snippet}
</Story>

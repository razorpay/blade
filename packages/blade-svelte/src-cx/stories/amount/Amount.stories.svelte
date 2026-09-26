<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import BasicStory from './Basic.svelte';
  import CurrenciesStory from './Currencies.svelte';
  import MatrixStory from './Matrix.svelte';

  const { Story } = defineMeta({
    title: "Components/Amount",
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
  name="Currencies"
  args={meta.stories.Currencies.args}
  argTypes={meta.stories.Currencies.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Currencies.description } } }}
>
  {#snippet template(args)}
    <CurrenciesStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Matrix"
  args={meta.stories.Matrix.args}
  argTypes={meta.stories.Matrix.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Matrix.description } } }}
>
  {#snippet template(args)}
    <MatrixStory args={args as never} />
  {/snippet}
</Story>

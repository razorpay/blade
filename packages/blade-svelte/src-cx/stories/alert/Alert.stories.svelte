<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import BasicStory from './Basic.svelte';
  import ColorsStory from './Colors.svelte';

  const { Story } = defineMeta({
    title: "Components/Alert",
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
  name="Colors"
  args={meta.stories.Colors.args}
  argTypes={meta.stories.Colors.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Colors.description } } }}
>
  {#snippet template(args)}
    <ColorsStory args={args as never} />
  {/snippet}
</Story>

<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import SeamStory from './Seam.svelte';

  const { Story } = defineMeta({
    title: "Guides/Adapters",
    tags: ['autodocs'],
    argTypes: meta.argTypes,
    parameters: {
      docs: { description: { component: readme } },
    },
  });
</script>

<Story
  name="Every adapter wired"
  args={meta.stories.Seam.args}
  argTypes={meta.stories.Seam.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Seam.description } } }}
>
  {#snippet template(args)}
    <SeamStory args={args as never} />
  {/snippet}
</Story>

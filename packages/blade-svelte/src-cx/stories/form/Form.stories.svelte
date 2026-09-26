<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import SubmitStory from './Submit.svelte';
  import EnterKeyStory from './EnterKey.svelte';

  const { Story } = defineMeta({
    title: "Components/Form",
    tags: ['autodocs'],
    argTypes: meta.argTypes,
    parameters: {
      docs: { description: { component: readme } },
    },
  });
</script>

<Story
  name="Submit"
  args={meta.stories.Submit.args}
  argTypes={meta.stories.Submit.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Submit.description } } }}
>
  {#snippet template(args)}
    <SubmitStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Enter-key submission"
  args={meta.stories.EnterKey.args}
  argTypes={meta.stories.EnterKey.argTypes}
  parameters={{ docs: { description: { story: meta.stories.EnterKey.description } } }}
>
  {#snippet template(args)}
    <EnterKeyStory args={args as never} />
  {/snippet}
</Story>

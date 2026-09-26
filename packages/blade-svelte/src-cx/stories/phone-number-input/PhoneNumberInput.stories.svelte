<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import BasicStory from './Basic.svelte';
  import AllowedStory from './Allowed.svelte';
  import InFormStory from './InForm.svelte';

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
  argTypes={meta.stories.Basic.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Basic.description } } }}
>
  {#snippet template(args)}
    <BasicStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Allowed"
  args={meta.stories.Allowed.args}
  argTypes={meta.stories.Allowed.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Allowed.description } } }}
>
  {#snippet template(args)}
    <AllowedStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="InForm"
  args={meta.stories.InForm.args}
  argTypes={meta.stories.InForm.argTypes}
  parameters={{ docs: { description: { story: meta.stories.InForm.description } } }}
>
  {#snippet template(args)}
    <InFormStory args={args as never} />
  {/snippet}
</Story>

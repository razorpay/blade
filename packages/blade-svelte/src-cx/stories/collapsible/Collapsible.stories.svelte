<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import WithButtonStory from './WithButton.svelte';
  import WithLinkStory from './WithLink.svelte';
  import ControlledStory from './Controlled.svelte';

  const { Story } = defineMeta({
    title: "Components/Collapsible",
    tags: ['autodocs'],
    argTypes: meta.argTypes,
    parameters: {
      docs: { description: { component: readme } },
    },
  });
</script>

<Story
  name="With a Button"
  args={meta.stories.WithButton.args}
  argTypes={meta.stories.WithButton.argTypes}
  parameters={{ docs: { description: { story: meta.stories.WithButton.description } } }}
>
  {#snippet template(args)}
    <WithButtonStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="With a link"
  args={meta.stories.WithLink.args}
  argTypes={meta.stories.WithLink.argTypes}
  parameters={{ docs: { description: { story: meta.stories.WithLink.description } } }}
>
  {#snippet template(args)}
    <WithLinkStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Controlled"
  args={meta.stories.Controlled.args}
  argTypes={meta.stories.Controlled.argTypes}
  parameters={{ docs: { description: { story: meta.stories.Controlled.description } } }}
>
  {#snippet template(args)}
    <ControlledStory args={args as never} />
  {/snippet}
</Story>

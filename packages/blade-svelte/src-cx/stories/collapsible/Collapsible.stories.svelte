<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import WithButtonStory from './WithButton.svelte';
  import WithButtonSource from './WithButton.svelte?raw';
  import WithLinkStory from './WithLink.svelte';
  import WithLinkSource from './WithLink.svelte?raw';
  import ControlledStory from './Controlled.svelte';
  import ControlledSource from './Controlled.svelte?raw';

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
  argTypes={storyArgTypes(meta, 'WithButton') as never}
  parameters={{ docs: { description: { story: meta.stories.WithButton.description }, source: exampleSource(WithButtonSource) }, controls: { disable: hasNoControls(meta, 'WithButton') } }}
>
  {#snippet template(args)}
    <WithButtonStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="With a link"
  args={meta.stories.WithLink.args}
  argTypes={storyArgTypes(meta, 'WithLink') as never}
  parameters={{ docs: { description: { story: meta.stories.WithLink.description }, source: exampleSource(WithLinkSource) }, controls: { disable: hasNoControls(meta, 'WithLink') } }}
>
  {#snippet template(args)}
    <WithLinkStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Controlled"
  args={meta.stories.Controlled.args}
  argTypes={storyArgTypes(meta, 'Controlled') as never}
  parameters={{ docs: { description: { story: meta.stories.Controlled.description }, source: exampleSource(ControlledSource) }, controls: { disable: hasNoControls(meta, 'Controlled') } }}
>
  {#snippet template(args)}
    <ControlledStory args={args as never} />
  {/snippet}
</Story>

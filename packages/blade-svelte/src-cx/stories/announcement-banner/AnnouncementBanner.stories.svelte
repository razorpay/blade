<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import BasicStory from './Basic.svelte';
  import BasicSource from './Basic.svelte?raw';
  import WithLinkStory from './WithLink.svelte';
  import WithLinkSource from './WithLink.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/AnnouncementBanner",
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
  name="WithLink"
  args={meta.stories.WithLink.args}
  argTypes={storyArgTypes(meta, 'WithLink') as never}
  parameters={{ docs: { description: { story: meta.stories.WithLink.description }, source: exampleSource(WithLinkSource) }, controls: { disable: hasNoControls(meta, 'WithLink') } }}
>
  {#snippet template()}
    <WithLinkStory />
  {/snippet}
</Story>

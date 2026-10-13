<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import DrawerStory from './Drawer.svelte';
  import DrawerSource from './Drawer.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/Drawer",
    tags: ['autodocs'],
    argTypes: meta.argTypes,
    parameters: {
      docs: { description: { component: readme } },
    },
  });
</script>
<Story
  name="Basic"
  args={meta.stories.Drawer.args}
  argTypes={storyArgTypes(meta, 'Drawer') as never}
  parameters={{ docs: { description: { story: meta.stories.Drawer.description }, source: exampleSource(DrawerSource) }, controls: { disable: hasNoControls(meta, 'Drawer') } }}
>
  {#snippet template(args)}
    <DrawerStory args={args as never} />
  {/snippet}
</Story>

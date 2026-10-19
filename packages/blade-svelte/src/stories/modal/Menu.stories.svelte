<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes, readmeBody } from '../helpers';
  import MenuStory from './Menu.svelte';
  import MenuSource from './Menu.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/Menu",
    tags: ['autodocs'],
    argTypes: meta.argTypes,
    parameters: {
      docs: { description: { component: readmeBody(readme) } },
    },
  });
</script>

<Story
  name="Basic"
  args={meta.stories.Menu.args}
  argTypes={storyArgTypes(meta, 'Menu') as never}
  parameters={{ docs: { description: { story: meta.stories.Menu.description }, source: exampleSource(MenuSource) }, controls: { disable: hasNoControls(meta, 'Menu') } }}
>
  {#snippet template(args)}
    <MenuStory args={args as never} />
  {/snippet}
</Story>

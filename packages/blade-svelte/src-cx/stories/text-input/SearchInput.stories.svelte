<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import SearchInputStory from './SearchInput.svelte';
  import SearchInputSource from './SearchInput.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/Input/SearchInput",
    tags: ['autodocs'],
    argTypes: meta.argTypes,
    parameters: {
      docs: { description: { component: readme } },
    },
  });
</script>
<Story
  name="Basic"
  args={meta.stories.SearchInput.args}
  argTypes={storyArgTypes(meta, 'SearchInput') as never}
  parameters={{ docs: { description: { story: meta.stories.SearchInput.description }, source: exampleSource(SearchInputSource) }, controls: { disable: hasNoControls(meta, 'SearchInput') } }}
>
  {#snippet template(args)}
    <SearchInputStory args={args as never} />
  {/snippet}
</Story>

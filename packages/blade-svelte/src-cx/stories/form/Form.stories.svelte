<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import SubmitStory from './Submit.svelte';
  import SubmitSource from './Submit.svelte?raw';
  import EnterKeyStory from './EnterKey.svelte';
  import EnterKeySource from './EnterKey.svelte?raw';

  const { Story } = defineMeta({
    title: "Extra Components/Form",
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
  argTypes={storyArgTypes(meta, 'Submit') as never}
  parameters={{ docs: { description: { story: meta.stories.Submit.description }, source: exampleSource(SubmitSource) }, controls: { disable: hasNoControls(meta, 'Submit') } }}
>
  {#snippet template(args)}
    <SubmitStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Enter-key submission"
  args={meta.stories.EnterKey.args}
  argTypes={storyArgTypes(meta, 'EnterKey') as never}
  parameters={{ docs: { description: { story: meta.stories.EnterKey.description }, source: exampleSource(EnterKeySource) }, controls: { disable: hasNoControls(meta, 'EnterKey') } }}
>
  {#snippet template(args)}
    <EnterKeyStory args={args as never} />
  {/snippet}
</Story>

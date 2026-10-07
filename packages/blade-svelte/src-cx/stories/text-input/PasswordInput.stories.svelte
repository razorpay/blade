<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import PasswordInputStory from './PasswordInput.svelte';
  import PasswordInputSource from './PasswordInput.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/Input/PasswordInput",
    tags: ['autodocs'],
    argTypes: meta.argTypes,
    parameters: {
      docs: { description: { component: readme } },
    },
  });
</script>
<Story
  name="Basic"
  args={meta.stories.PasswordInput.args}
  argTypes={storyArgTypes(meta, 'PasswordInput') as never}
  parameters={{ docs: { description: { story: meta.stories.PasswordInput.description }, source: exampleSource(PasswordInputSource) }, controls: { disable: hasNoControls(meta, 'PasswordInput') } }}
>
  {#snippet template(args)}
    <PasswordInputStory args={args as never} />
  {/snippet}
</Story>

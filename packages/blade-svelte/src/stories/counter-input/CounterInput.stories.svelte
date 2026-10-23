<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes, readmeBody } from '../helpers';
  import BasicStory from './Basic.svelte';
  import BasicSource from './Basic.svelte?raw';
  import VariantsStory from './Variants.svelte';
  import VariantsSource from './Variants.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/Input/CounterInput",
    tags: ['autodocs'],
    argTypes: meta.argTypes,
    parameters: {
      docs: { description: { component: readmeBody(readme) } },
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
  name="Sizes and emphases"
  args={meta.stories.Variants.args}
  argTypes={storyArgTypes(meta, 'Variants') as never}
  parameters={{ docs: { description: { story: meta.stories.Variants.description }, source: exampleSource(VariantsSource) }, controls: { disable: hasNoControls(meta, 'Variants') } }}
>
  {#snippet template(args)}
    <VariantsStory args={args as never} />
  {/snippet}
</Story>


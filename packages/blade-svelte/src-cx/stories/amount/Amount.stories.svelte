<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import BasicStory from './Basic.svelte';
  import BasicSource from './Basic.svelte?raw';
  import CurrenciesStory from './Currencies.svelte';
  import CurrenciesSource from './Currencies.svelte?raw';
  import MatrixStory from './Matrix.svelte';
  import MatrixSource from './Matrix.svelte?raw';
  import VariantsStory from './Variants.svelte';
  import VariantsSource from './Variants.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/Amount",
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
  name="Currencies"
  args={meta.stories.Currencies.args}
  argTypes={storyArgTypes(meta, 'Currencies') as never}
  parameters={{ docs: { description: { story: meta.stories.Currencies.description }, source: exampleSource(CurrenciesSource) }, controls: { disable: hasNoControls(meta, 'Currencies') } }}
>
  {#snippet template(args)}
    <CurrenciesStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Matrix"
  args={meta.stories.Matrix.args}
  argTypes={storyArgTypes(meta, 'Matrix') as never}
  parameters={{ docs: { description: { story: meta.stories.Matrix.description }, source: exampleSource(MatrixSource) }, controls: { disable: hasNoControls(meta, 'Matrix') } }}
>
  {#snippet template(args)}
    <MatrixStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Variants"
  args={meta.stories.Variants.args}
  argTypes={storyArgTypes(meta, 'Variants') as never}
  parameters={{ docs: { description: { story: meta.stories.Variants.description }, source: exampleSource(VariantsSource) }, controls: { disable: hasNoControls(meta, 'Variants') } }}
>
  {#snippet template()}
    <VariantsStory />
  {/snippet}
</Story>

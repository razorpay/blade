<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import BasicStory from './Basic.svelte';
  import BasicSource from './Basic.svelte?raw';
  import BusyCausesStory from './BusyCauses.svelte';
  import BusyCausesSource from './BusyCauses.svelte?raw';
  import ValidateStory from './Validate.svelte';
  import ValidateSource from './Validate.svelte?raw';
  import AutoPressStory from './AutoPress.svelte';
  import AutoPressSource from './AutoPress.svelte?raw';
  import MatrixStory from './Matrix.svelte';
  import MatrixSource from './Matrix.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/Button",
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
  name="Busy causes"
  args={meta.stories.BusyCauses.args}
  argTypes={storyArgTypes(meta, 'BusyCauses') as never}
  parameters={{ docs: { description: { story: meta.stories.BusyCauses.description }, source: exampleSource(BusyCausesSource) }, controls: { disable: hasNoControls(meta, 'BusyCauses') } }}
>
  {#snippet template(args)}
    <BusyCausesStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Validate before press"
  args={meta.stories.Validate.args}
  argTypes={storyArgTypes(meta, 'Validate') as never}
  parameters={{ docs: { description: { story: meta.stories.Validate.description }, source: exampleSource(ValidateSource) }, controls: { disable: hasNoControls(meta, 'Validate') } }}
>
  {#snippet template(args)}
    <ValidateStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Auto press"
  args={meta.stories.AutoPress.args}
  argTypes={storyArgTypes(meta, 'AutoPress') as never}
  parameters={{ docs: { description: { story: meta.stories.AutoPress.description }, source: exampleSource(AutoPressSource) }, controls: { disable: hasNoControls(meta, 'AutoPress') } }}
>
  {#snippet template(args)}
    <AutoPressStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Variant matrix"
  args={meta.stories.Matrix.args}
  argTypes={storyArgTypes(meta, 'Matrix') as never}
  parameters={{ docs: { description: { story: meta.stories.Matrix.description }, source: exampleSource(MatrixSource) }, controls: { disable: hasNoControls(meta, 'Matrix') } }}
>
  {#snippet template(args)}
    <MatrixStory args={args as never} />
  {/snippet}
</Story>

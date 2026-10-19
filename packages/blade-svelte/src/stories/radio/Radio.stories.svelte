<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes, readmeBody } from '../helpers';
  import BasicStory from './Basic.svelte';
  import BasicSource from './Basic.svelte?raw';
  import ValidationStory from './Validation.svelte';
  import ValidationSource from './Validation.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/Radio & RadioGroup",
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
  name="Validation"
  args={meta.stories.Validation.args}
  argTypes={storyArgTypes(meta, 'Validation') as never}
  parameters={{ docs: { description: { story: meta.stories.Validation.description }, source: exampleSource(ValidationSource) }, controls: { disable: hasNoControls(meta, 'Validation') } }}
>
  {#snippet template(args)}
    <ValidationStory args={args as never} />
  {/snippet}
</Story>


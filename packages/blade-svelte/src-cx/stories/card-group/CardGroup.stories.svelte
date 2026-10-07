<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes } from '../helpers';
  import BasicStory from './Basic.svelte';
  import BasicSource from './Basic.svelte?raw';
  import PaymentMethodsStory from './PaymentMethods.svelte';
  import PaymentMethodsSource from './PaymentMethods.svelte?raw';
  import InFormStory from './InForm.svelte';
  import InFormSource from './InForm.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/CardGroup",
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
  name="PaymentMethods"
  args={meta.stories.PaymentMethods.args}
  argTypes={storyArgTypes(meta, 'PaymentMethods') as never}
  parameters={{ docs: { description: { story: meta.stories.PaymentMethods.description }, source: exampleSource(PaymentMethodsSource) }, controls: { disable: hasNoControls(meta, 'PaymentMethods') } }}
>
  {#snippet template(args)}
    <PaymentMethodsStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="InForm"
  args={meta.stories.InForm.args}
  argTypes={storyArgTypes(meta, 'InForm') as never}
  parameters={{ docs: { description: { story: meta.stories.InForm.description }, source: exampleSource(InFormSource) }, controls: { disable: hasNoControls(meta, 'InForm') } }}
>
  {#snippet template(args)}
    <InFormStory args={args as never} />
  {/snippet}
</Story>

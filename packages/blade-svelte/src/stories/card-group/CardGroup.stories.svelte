<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import readme from './README.md?raw';
  import meta from './index';
  import { exampleSource, hasNoControls, storyArgTypes, readmeBody } from '../helpers';
  import PaymentMethodsStory from './PaymentMethods.svelte';
  import PaymentMethodsSource from './PaymentMethods.svelte?raw';
  import NavigationStory from './Navigation.svelte';
  import NavigationSource from './Navigation.svelte?raw';
  import PickWithDetailsStory from './PickWithDetails.svelte';
  import PickWithDetailsSource from './PickWithDetails.svelte?raw';
  import BasicStory from './Basic.svelte';
  import BasicSource from './Basic.svelte?raw';
  import MultipleStory from './Multiple.svelte';
  import MultipleSource from './Multiple.svelte?raw';
  import WithOtherChildrenStory from './WithOtherChildren.svelte';
  import WithOtherChildrenSource from './WithOtherChildren.svelte?raw';

  const { Story } = defineMeta({
    title: "Components/CardGroup",
    tags: ['autodocs'],
    argTypes: meta.argTypes,
    parameters: {
      docs: { description: { component: readmeBody(readme) } },
    },
  });
</script>

<Story
  name="Payment methods"
  args={meta.stories.PaymentMethods.args}
  argTypes={storyArgTypes(meta, 'PaymentMethods') as never}
  parameters={{ docs: { description: { story: meta.stories.PaymentMethods.description }, source: exampleSource(PaymentMethodsSource) }, controls: { disable: hasNoControls(meta, 'PaymentMethods') } }}
>
  {#snippet template(args)}
    <PaymentMethodsStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Navigation"
  args={meta.stories.Navigation.args}
  argTypes={storyArgTypes(meta, 'Navigation') as never}
  parameters={{ docs: { description: { story: meta.stories.Navigation.description }, source: exampleSource(NavigationSource) }, controls: { disable: hasNoControls(meta, 'Navigation') } }}
>
  {#snippet template(args)}
    <NavigationStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="A pick that reveals details"
  args={meta.stories.PickWithDetails.args}
  argTypes={storyArgTypes(meta, 'PickWithDetails') as never}
  parameters={{ docs: { description: { story: meta.stories.PickWithDetails.description }, source: exampleSource(PickWithDetailsSource) }, controls: { disable: hasNoControls(meta, 'PickWithDetails') } }}
>
  {#snippet template(args)}
    <PickWithDetailsStory args={args as never} />
  {/snippet}
</Story>

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
  name="Multiple"
  args={meta.stories.Multiple.args}
  argTypes={storyArgTypes(meta, 'Multiple') as never}
  parameters={{ docs: { description: { story: meta.stories.Multiple.description }, source: exampleSource(MultipleSource) }, controls: { disable: hasNoControls(meta, 'Multiple') } }}
>
  {#snippet template(args)}
    <MultipleStory args={args as never} />
  {/snippet}
</Story>

<Story
  name="Headings and a button"
  args={meta.stories.WithOtherChildren.args}
  argTypes={storyArgTypes(meta, 'WithOtherChildren') as never}
  parameters={{ docs: { description: { story: meta.stories.WithOtherChildren.description }, source: exampleSource(WithOtherChildrenSource) }, controls: { disable: hasNoControls(meta, 'WithOtherChildren') } }}
>
  {#snippet template(args)}
    <WithOtherChildrenStory args={args as never} />
  {/snippet}
</Story>


<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Collapsible from './Collapsible.svelte';

  const { Story } = defineMeta({
    title: 'Components/Collapsible',
    component: Collapsible,
    tags: ['autodocs'],
    args: {},
    argTypes: {
      direction: {
        control: 'select',
        options: ['bottom', 'top'],
        description: 'Direction in which the content expands',
        table: { defaultValue: { summary: 'bottom' } },
      },
      defaultIsExpanded: {
        control: 'boolean',
        description: 'Expands the collapsible content by default (uncontrolled)',
        table: { defaultValue: { summary: 'false' } },
      },
    },
  });
</script>

<script lang="ts">
  import CollapsibleButton from './CollapsibleButton.svelte';
  import CollapsibleLink from './CollapsibleLink.svelte';
  import CollapsibleText from './CollapsibleText.svelte';
  import CollapsibleBody from './CollapsibleBody.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import Amount from '../Amount/Amount.svelte';
  import type { CollapsibleProps } from './types';

  type CollapsibleStoryArgs = Omit<CollapsibleProps, 'children'> & { children?: unknown };

  let isExpanded = $state(true);

  const getCollapsibleArgs = (
    args: CollapsibleStoryArgs,
  ): Omit<CollapsibleProps, 'children'> => {
    const { children: _children, ...collapsibleArgs } = args;
    return collapsibleArgs;
  };
</script>

{#snippet priceBreakdown()}
  <div style="display: flex; flex-direction: column; min-width: 200px;">
    <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: baseline;">
      <Text>Actual amount</Text>
      <Amount value={1000} color="feedback.text.positive.intense" />
    </div>
    <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: baseline;">
      <Text marginTop="spacing.2">Razorpay Platform Fees</Text>
      <Text>2%</Text>
    </div>
    <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: baseline;">
      <Text marginTop="spacing.2">GST</Text>
      <Text>18%</Text>
    </div>
  </div>
{/snippet}

<!-- Compose Collapsible with CollapsibleButton and CollapsibleBody -->
<Story name="With Collapsible Button">
  {#snippet template(args)}
    <Collapsible {...getCollapsibleArgs(args)}>
      <CollapsibleButton>View Price Breakdown</CollapsibleButton>
      <CollapsibleBody>
        {@render priceBreakdown()}
      </CollapsibleBody>
    </Collapsible>
  {/snippet}
</Story>

<!-- Compose Collapsible with CollapsibleLink and CollapsibleBody -->
<Story name="With Collapsible Link">
  {#snippet template(args)}
    <Collapsible {...getCollapsibleArgs(args)}>
      <CollapsibleLink>View Price Breakdown</CollapsibleLink>
      <CollapsibleBody>
        {@render priceBreakdown()}
      </CollapsibleBody>
    </Collapsible>
  {/snippet}
</Story>

<!-- Compose Collapsible with CollapsibleText (text + chevron trigger) and CollapsibleBody -->
<Story name="With Collapsible Text">
  {#snippet template(args)}
    <Collapsible {...getCollapsibleArgs(args)}>
      <CollapsibleText>View Price Breakdown</CollapsibleText>
      <CollapsibleBody>
        {@render priceBreakdown()}
      </CollapsibleBody>
    </Collapsible>
  {/snippet}
</Story>

<!-- A disabled CollapsibleText trigger cannot be toggled -->
<Story name="With Disabled Collapsible Text">
  {#snippet template(args)}
    <Collapsible {...getCollapsibleArgs(args)}>
      <CollapsibleText isDisabled>View Price Breakdown</CollapsibleText>
      <CollapsibleBody>
        {@render priceBreakdown()}
      </CollapsibleBody>
    </Collapsible>
  {/snippet}
</Story>

<!-- Use `direction` prop to control in which direction the Collapsible expands -->
<Story name="With Direction" args={{ direction: 'top' }}>
  {#snippet template(args)}
    <Collapsible {...getCollapsibleArgs(args)}>
      <CollapsibleLink>View Price Breakdown</CollapsibleLink>
      <CollapsibleBody>
        {@render priceBreakdown()}
      </CollapsibleBody>
    </Collapsible>
  {/snippet}
</Story>

<!-- Controlled: use `isExpanded` and `onExpandChange` -->
<Story name="Controlled Example" asChild>
  <Collapsible
    isExpanded={isExpanded}
    onExpandChange={(args) => { isExpanded = args.isExpanded; }}
  >
    <CollapsibleButton>{isExpanded ? 'Hide' : 'Show'} Price Breakdown</CollapsibleButton>
    <CollapsibleBody>
      {@render priceBreakdown()}
    </CollapsibleBody>
  </Collapsible>
</Story>

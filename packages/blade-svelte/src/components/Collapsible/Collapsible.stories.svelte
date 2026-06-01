<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Collapsible from './Collapsible.svelte';

  const { Story } = defineMeta({
    title: 'Components/Collapsible',
    component: Collapsible,
    tags: ['autodocs'],
    args: {},
    argTypes: {
      size: {
        control: 'select',
        options: ['large', 'medium'],
        description: 'Size of the Collapsible',
        table: { defaultValue: { summary: 'large' } },
      },
      isDisabled: {
        control: 'boolean',
        description: 'Disables the trigger button',
        table: { defaultValue: { summary: 'false' } },
      },
      defaultIsExpanded: {
        control: 'boolean',
        description: 'Whether the panel is open on first render (uncontrolled)',
        table: { defaultValue: { summary: 'false' } },
      },
    },
  });
</script>

<script lang="ts">
  import CollapsibleTrigger from './CollapsibleTrigger.svelte';
  import CollapsibleBody from './CollapsibleBody.svelte';
  import { InfoIcon } from '../Icons/InfoIcon';
  import { CheckIcon } from '../Icons/CheckIcon';
  import { CreditCardIcon } from '../Icons/CreditCardIcon';
  import { SearchIcon } from '../Icons/SearchIcon';
  import Text from '../Typography/Text/Text.svelte';

  let controlledIsExpanded = $state(false);
</script>

<!-- Basic: text-only trigger -->
<Story name="Text Only Trigger" asChild>
  <Collapsible>
    {#snippet children()}
      <CollapsibleTrigger label="What is Razorpay Route?" />
      <CollapsibleBody>
        You can use Razorpay Route from the Dashboard or using APIs to transfer money to customers.
        Check our docs for detailed instructions.
      </CollapsibleBody>
    {/snippet}
  </Collapsible>
</Story>

<!-- Icon + Text trigger -->
<Story name="Icon and Text Trigger" asChild>
  <Collapsible>
    {#snippet children()}
      <CollapsibleTrigger label="What is Razorpay Route?" icon={InfoIcon} />
      <CollapsibleBody>
        You can use Razorpay Route from the Dashboard or using APIs to transfer money to customers.
        Check our docs for detailed instructions.
      </CollapsibleBody>
    {/snippet}
  </Collapsible>
</Story>

<!-- Multiple Collapsibles with different icons -->
<Story name="Multiple With Icons" asChild>
  <div style="display: flex; flex-direction: column; gap: 8px; max-width: 640px;">
    <Collapsible>
      {#snippet children()}
        <CollapsibleTrigger label="What is Razorpay Route?" icon={InfoIcon} />
        <CollapsibleBody>
          You can use Razorpay Route from the Dashboard or using APIs to transfer money to customers.
        </CollapsibleBody>
      {/snippet}
    </Collapsible>

    <Collapsible>
      {#snippet children()}
        <CollapsibleTrigger label="How do I set up QR Codes?" icon={CreditCardIcon} />
        <CollapsibleBody>
          Just use Razorpay. You may also check our docs for detailed instructions.
        </CollapsibleBody>
      {/snippet}
    </Collapsible>

    <Collapsible>
      {#snippet children()}
        <CollapsibleTrigger label="How do Subscriptions work?" icon={CheckIcon} />
        <CollapsibleBody>
          Please use the search functionality to ask your queries.
        </CollapsibleBody>
      {/snippet}
    </Collapsible>
  </div>
</Story>

<!-- Medium size -->
<Story name="Medium Size With Icon" asChild>
  <Collapsible size="medium">
    {#snippet children()}
      <CollapsibleTrigger label="Subscription details" icon={SearchIcon} />
      <CollapsibleBody>
        Medium-size collapsible with icon. Font sizes and spacing are more compact.
      </CollapsibleBody>
    {/snippet}
  </Collapsible>
</Story>

<!-- Open by default (uncontrolled) -->
<Story name="Default Expanded" asChild>
  <Collapsible defaultIsExpanded={true}>
    {#snippet children()}
      <CollapsibleTrigger label="This panel is open on load" icon={InfoIcon} />
      <CollapsibleBody>
        The `defaultIsExpanded` prop opens the panel on first render without requiring controlled
        state management.
      </CollapsibleBody>
    {/snippet}
  </Collapsible>
</Story>

<!-- Disabled -->
<Story name="Disabled" asChild>
  <Collapsible isDisabled={true}>
    {#snippet children()}
      <CollapsibleTrigger label="This trigger is disabled" icon={InfoIcon} />
      <CollapsibleBody>
        This content is inaccessible when the collapsible is disabled.
      </CollapsibleBody>
    {/snippet}
  </Collapsible>
</Story>

<!-- Controlled -->
<Story name="Controlled" asChild>
  <div>
    <div style="display: flex; gap: 12px; margin-bottom: 16px;">
      <button onclick={() => { controlledIsExpanded = true; }}>Expand</button>
      <button onclick={() => { controlledIsExpanded = false; }}>Collapse</button>
    </div>
    <Collapsible
      isExpanded={controlledIsExpanded}
      onExpandChange={(expanded) => { controlledIsExpanded = expanded; }}
    >
      {#snippet children()}
        <CollapsibleTrigger label="Controlled collapsible" icon={InfoIcon} />
        <CollapsibleBody>
          The expanded state is driven externally — use the buttons above to toggle.
        </CollapsibleBody>
      {/snippet}
    </Collapsible>
  </div>
</Story>

<!-- Custom trigger content (via children slot) -->
<Story name="Custom Trigger Content" asChild>
  <Collapsible>
    {#snippet children()}
      <CollapsibleTrigger>
        {#snippet children()}
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <Text size="medium" weight="semibold">Custom Trigger Layout</Text>
            <Text size="small" color="surface.text.gray.subtle">Click to expand details</Text>
          </div>
        {/snippet}
      </CollapsibleTrigger>
      <CollapsibleBody>
        You can pass any Svelte markup as the trigger's `children` snippet to override the
        default icon + label layout. The chevron is always rendered.
      </CollapsibleBody>
    {/snippet}
  </Collapsible>
</Story>

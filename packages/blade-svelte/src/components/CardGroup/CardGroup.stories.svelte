<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CardGroup from './CardGroup.svelte';

  const { Story } = defineMeta({
    title: 'Components/CardGroup',
    component: CardGroup,
    tags: ['autodocs'],
    args: {
      accessibilityLabel: 'Payment methods',
    },
    argTypes: {
      accessibilityLabel: {
        description: 'Accessible label for the group.',
        control: { type: 'text' },
        table: { category: 'CardGroup Props', type: { summary: 'string' } },
      },
    },
  });
</script>

<script lang="ts">
  import CardGroupItem from './CardGroupItem.svelte';
  import CardGroupCollapsibleItem from './CardGroupCollapsibleItem.svelte';
  import CardGroupCollapsibleItemBody from './CardGroupCollapsibleItemBody.svelte';
  import { CreditCardIcon } from '../Icons/CreditCardIcon';
  import { PhoneIcon } from '../Icons/PhoneIcon';
  import { BankIcon } from '../Icons/BankIcon';

  let selected = $state('cards');
</script>

<!-- Mirrors the Figma anatomy: navigating rows, a selecting row, and a
     disclosing row with a body of nested options. -->
<Story name="Playground">
  {#snippet template({ children: _children, ...args })}
    <div style="max-width:400px">
      <CardGroup {...args}>
        <CardGroupItem href="/cards">
          {#snippet leading()}<CreditCardIcon size="medium" color="surface.icon.gray.subtle" />{/snippet}
          {#snippet children()}Cards{/snippet}
        </CardGroupItem>

        <CardGroupCollapsibleItem defaultIsExpanded>
          <CardGroupItem>
            {#snippet leading()}<PhoneIcon size="medium" color="surface.icon.gray.subtle" />{/snippet}
            {#snippet children()}UPI{/snippet}
          </CardGroupItem>
          <CardGroupCollapsibleItemBody>
            {#snippet children()}
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
                <span>Google Pay</span>
                <span>PhonePe</span>
                <span>PayTM</span>
                <span>CRED UPI</span>
              </div>
            {/snippet}
          </CardGroupCollapsibleItemBody>
        </CardGroupCollapsibleItem>

        <CardGroupCollapsibleItem>
          <CardGroupItem>
            {#snippet children()}Pay Later{/snippet}
          </CardGroupItem>
          <CardGroupCollapsibleItemBody>
            {#snippet children()}Simpl, LazyPay, ICICI PayLater{/snippet}
          </CardGroupCollapsibleItemBody>
        </CardGroupCollapsibleItem>

        <CardGroupItem href="/wallet">
          {#snippet leading()}<BankIcon size="medium" color="surface.icon.gray.subtle" />{/snippet}
          {#snippet children()}Wallet{/snippet}
        </CardGroupItem>
      </CardGroup>
    </div>
  {/snippet}
</Story>

<!-- Navigating rows only. -->
<Story name="Navigation" asChild>
  <div style="max-width:400px">
    <CardGroup accessibilityLabel="Settings">
      <CardGroupItem href="/profile">{#snippet children()}Profile{/snippet}</CardGroupItem>
      <CardGroupItem href="/security">{#snippet children()}Security{/snippet}</CardGroupItem>
      <CardGroupItem href="/notifications">{#snippet children()}Notifications{/snippet}</CardGroupItem>
    </CardGroup>
  </div>
</Story>

<!-- Selecting rows — selection is consumer-driven. -->
<Story name="Selection" asChild>
  <div style="max-width:400px">
    <CardGroup accessibilityLabel="Choose a plan">
      <CardGroupItem isSelected={selected === 'cards'} onClick={() => (selected = 'cards')}>
        {#snippet children()}Cards{/snippet}
      </CardGroupItem>
      <CardGroupItem isSelected={selected === 'upi'} onClick={() => (selected = 'upi')}>
        {#snippet children()}UPI{/snippet}
      </CardGroupItem>
      <CardGroupItem isSelected={selected === 'wallet'} onClick={() => (selected = 'wallet')}>
        {#snippet children()}Wallet{/snippet}
      </CardGroupItem>
    </CardGroup>
  </div>
</Story>

<!-- Disabled row. -->
<Story name="Disabled Row" asChild>
  <div style="max-width:400px">
    <CardGroup accessibilityLabel="Payment methods">
      <CardGroupItem href="/cards">{#snippet children()}Cards{/snippet}</CardGroupItem>
      <CardGroupItem isDisabled onClick={() => {}}>{#snippet children()}Net Banking (unavailable){/snippet}</CardGroupItem>
    </CardGroup>
  </div>
</Story>

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
  import Card from '../Card/Card.svelte';
  import CardBody from '../Card/CardBody.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import { CreditCardIcon } from '../Icons/CreditCardIcon';
  import { UpiIcon } from '../Icons/UpiIcon';
  import { ClockIcon } from '../Icons/ClockIcon';
  import { WalletIcon } from '../Icons/WalletIcon';
  import { MoreHorizontalIcon } from '../Icons/MoreHorizontalIcon';

  let selected = $state('cards');

  type PaymentApp = { name: string; logo?: string };

  // Brand logos from the checkout CDN (same source as the BladeProvider checkout demo).
  const upiApps: PaymentApp[] = [
    { name: 'Google Pay', logo: 'https://cdn.razorpay.com/app/googlepay.svg' },
    { name: 'PhonePe', logo: 'https://cdn.razorpay.com/app/phonepe.svg' },
    { name: 'Paytm', logo: 'https://cdn.razorpay.com/app/paytm.svg' },
    { name: 'Apps & UPI ID' },
  ];

  const payLaterApps: PaymentApp[] = [
    { name: 'LazyPay', logo: 'https://cdn.razorpay.com/paylater/lazypay.svg' },
    { name: 'ICICI PayLater', logo: 'https://cdn.razorpay.com/paylater/icic.svg' },
    { name: 'Amazon Pay', logo: 'https://cdn.razorpay.com/app/amazonpay.svg' },
  ];

  const noop = (): void => {};
</script>

{#snippet appGrid(apps: PaymentApp[])}
  <div class="app-grid">
    {#each apps as app (app.name)}
      <Card
        variant="primary"
        padding="spacing.0"
        size="medium"
        height="100%"
        accessibilityLabel={app.name}
        onClick={noop}
      >
        <CardBody>
          <div class="app-tile">
            {#if app.logo}
              <img class="app-logo" src={app.logo} alt="" />
            {:else}
              <span class="app-logo">
                <MoreHorizontalIcon size="medium" color="surface.icon.gray.normal" />
              </span>
            {/if}
            <Text size="medium" weight="medium" truncateAfterLines={1}>{app.name}</Text>
          </div>
        </CardBody>
      </Card>
    {/each}
  </div>
{/snippet}

<!-- Mirrors the Figma anatomy: navigating rows, a selecting row, and a
     disclosing row with a body of nested options. -->
<Story name="Playground">
  {#snippet template({ children: _children, ...args })}
    <div style="max-width:400px">
      <CardGroup {...args}>
        <CardGroupItem href="https://razorpay.com/payments/" target="_blank" rel="noopener noreferrer">
          {#snippet leading()}<CreditCardIcon size="medium" color="surface.icon.gray.subtle" />{/snippet}
          {#snippet children()}Cards{/snippet}
        </CardGroupItem>

        <CardGroupCollapsibleItem defaultIsExpanded>
          <CardGroupItem>
            {#snippet leading()}<UpiIcon size="medium" color="surface.icon.gray.subtle" />{/snippet}
            {#snippet children()}UPI{/snippet}
          </CardGroupItem>
          <CardGroupCollapsibleItemBody>
            {#snippet children()}
              {@render appGrid(upiApps)}
            {/snippet}
          </CardGroupCollapsibleItemBody>
        </CardGroupCollapsibleItem>

        <CardGroupCollapsibleItem>
          <CardGroupItem>
            {#snippet leading()}<ClockIcon size="medium" color="surface.icon.gray.subtle" />{/snippet}
            {#snippet children()}Pay Later{/snippet}
          </CardGroupItem>
          <CardGroupCollapsibleItemBody>
            {#snippet children()}
              {@render appGrid(payLaterApps)}
            {/snippet}
          </CardGroupCollapsibleItemBody>
        </CardGroupCollapsibleItem>

        <CardGroupItem href="https://razorpay.com/payment-gateway/" target="_blank" rel="noopener noreferrer">
          {#snippet leading()}<WalletIcon size="medium" color="surface.icon.gray.subtle" />{/snippet}
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
      <CardGroupItem href="https://razorpay.com/about/" target="_blank" rel="noopener noreferrer">{#snippet children()}Profile{/snippet}</CardGroupItem>
      <CardGroupItem href="https://razorpay.com/security/" target="_blank" rel="noopener noreferrer">{#snippet children()}Security{/snippet}</CardGroupItem>
      <CardGroupItem href="https://razorpay.com/docs/" target="_blank" rel="noopener noreferrer">{#snippet children()}Notifications{/snippet}</CardGroupItem>
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
      <CardGroupItem href="https://razorpay.com/payments/" target="_blank" rel="noopener noreferrer">{#snippet children()}Cards{/snippet}</CardGroupItem>
      <CardGroupItem isDisabled onClick={() => {}}>{#snippet children()}Net Banking (unavailable){/snippet}</CardGroupItem>
    </CardGroup>
  </div>
</Story>

<style>
  .app-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--spacing-3);
  }

  .app-tile {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    padding: var(--spacing-4);
  }

  .app-logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    object-fit: contain;
    flex-shrink: 0;
  }
</style>

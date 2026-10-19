<script lang="ts">
  import {
    CardGroup,
    CardGroupItem,
    Icon,
    Text,
  } from '../../index';
  import {
    ClockIcon,
    CreditCardIcon,
    MoreHorizontalIcon,
    UpiIcon,
    WalletIcon,
  } from '../../icons';
  import type { IconSource } from '../../index';

  type PaymentApp = { name: string; logo?: string };

  // Brand logos from the checkout CDN.
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
</script>

{#snippet glyph(source: IconSource)}
  <Icon {source} color="subtle" />
{/snippet}

{#snippet appGrid(apps: PaymentApp[])}
  <div class="grid grid-cols-2 gap-2">
    {#each apps as app (app.name)}
      <button
        type="button"
        class="flex min-w-0 items-center gap-2 rounded-medium bg-surface-gray-intense surface-raised p-3 text-start"
      >
        {#if app.logo}
          <img class="h-6 w-6 shrink-0 object-contain" src={app.logo} alt="" />
        {:else}
          <span class="flex h-6 w-6 shrink-0 items-center justify-center">
            <Icon source={MoreHorizontalIcon} color="default" />
          </span>
        {/if}
        <Text as="span" size="medium" weight="medium" class="clamp-1">{app.name}</Text>
      </button>
    {/each}
  </div>
{/snippet}

<!-- Figma's anatomy: navigating rows, and rows that disclose a body. -->
<div class="max-w-[400px]">
  <CardGroup accessibilityLabel="Payment methods">
    <CardGroupItem href="https://razorpay.com/payments/" target="_blank" rel="noopener noreferrer" title="Cards">
      {#snippet leading()}{@render glyph(CreditCardIcon)}{/snippet}
    </CardGroupItem>
    <CardGroupItem title="UPI" isExpanded>
      {#snippet leading()}{@render glyph(UpiIcon)}{/snippet}
      {#snippet content()}{@render appGrid(upiApps)}{/snippet}
    </CardGroupItem>
    <CardGroupItem title="Pay Later">
      {#snippet leading()}{@render glyph(ClockIcon)}{/snippet}
      {#snippet content()}{@render appGrid(payLaterApps)}{/snippet}
    </CardGroupItem>
    <CardGroupItem href="https://razorpay.com/payment-gateway/" target="_blank" rel="noopener noreferrer" title="Wallet">
      {#snippet leading()}{@render glyph(WalletIcon)}{/snippet}
    </CardGroupItem>
  </CardGroup>
</div>

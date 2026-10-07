<script lang="ts">
  import {
    CardGroup,
    CardGroupItem,
    Badge,
    Icon,
    Skeleton,
    Text,
    type CardGroupStyleProps,
  } from '../../index';
  import {
    BankIcon,
    CreditCardIcon,
    InfoIcon,
    PhoneIcon,
    WalletIcon,
    type IconSource,
  } from '../../icons';

  // The meta's controls: variant and size restyle the list.
  let { args = {} }: { args?: CardGroupStyleProps } = $props();

  interface Method {
    name: string;
    title: string;
    subtitle?: string;
    glyph: IconSource;
    inline?: boolean;
    critical?: boolean;
    offer?: string;
  }

  const methods: Method[] = [
    {
      name: 'upi',
      title: 'UPI',
      subtitle: 'Pay with any UPI app',
      glyph: PhoneIcon,
      inline: true,
      offer: 'Offers',
    },
    { name: 'card', title: 'Cards', glyph: CreditCardIcon },
    {
      name: 'netbanking',
      title: 'Netbanking',
      glyph: BankIcon,
      critical: true,
    },
    { name: 'wallet', title: 'Wallets', glyph: WalletIcon, inline: true },
  ];

  let open = $state<string | number | null>(methods[0]?.name ?? null);
  let detailsLoading = $state(true);
  let log = $state('');

  setTimeout(() => {
    detailsLoading = false;
  }, 2500);

  // Stands in for v2's `module.contentPromise()`.
  function loadContent(method: Method): Promise<string[]> {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve(
            method.name === 'upi'
              ? ['Google Pay', 'PhonePe', 'Enter UPI ID']
              : ['Amazon Pay', 'Mobikwik']
          ),
        600
      );
    });
  }

  function handleClick(method: Method) {
    if (method.critical) {
      log = `${method.title}: facing issues — the host opens its downtime sheet`;
      return false;
    }
    if (!method.inline) {
      log = `${method.title}: go to the ${method.name} screen`;
    }
    return undefined;
  }
</script>

<div class="flex max-w-96 flex-col gap-3">
  <CardGroup bind:value={open} label="All payment options" variant={args.variant} size={args.size}>
    {#each methods as method (method.name)}
      {#snippet glyph()}
        <span class={method.critical ? 'opacity-blade-700 grayscale' : ''}>
          <Icon source={method.glyph} size="large" />
        </span>
      {/snippet}
      {#snippet title()}
        <span class="flex items-center gap-2">
          <Text as="span" weight="semibold" size="large">{method.title}</Text>
          {#if method.offer}
            <Badge color="positive" size="small">{method.offer}</Badge>
          {/if}
        </span>
      {/snippet}
      <!-- Trailing replaces the chevron while there is something to say. -->
      {#snippet status()}
        {#if method.critical}
          <Icon source={InfoIcon} size="large" />
        {:else}
          <Skeleton class="w-5 h-5 rounded-2xsmall" />
        {/if}
      {/snippet}
      {#snippet apps()}
        <div class="flex flex-col gap-2">
          {#await loadContent(method)}
            <Skeleton class="h-4 w-40 rounded-xsmall" />
            <Skeleton class="h-4 w-32 rounded-xsmall" />
          {:then names}
            {#each names as name (name)}
              <Text size="small">{name}</Text>
            {/each}
          {:catch}
            <Text size="small" color="danger">Could not load</Text>
          {/await}
        </div>
      {/snippet}
      <CardGroupItem
        value={method.name}
        {title}
        subtitle={method.critical ? 'Facing issues' : method.subtitle}
        leading={glyph}
        trailing={method.critical || (method.name === 'card' && detailsLoading)
          ? status
          : undefined}
        body={method.inline ? apps : undefined}
        onClick={() => handleClick(method)}
      />
    {/each}
  </CardGroup>
  <Text size="small" color="muted">
    open: {open ?? '—'}{log ? ` · ${log}` : ''}
  </Text>
</div>

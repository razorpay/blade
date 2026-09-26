<script lang="ts">
  import { Amount, Text } from '../../index';

  /* oxlint-disable checkout/no-hardcoding-currency -- a currency demo needs codes */
  const rows = [
    { currency: 'INR', locale: 'en-IN' },
    { currency: 'USD', locale: 'en-US' },
    { currency: 'EUR', locale: 'de-DE' },
    { currency: 'JPY', locale: 'ja-JP' },
    { currency: 'KWD', locale: 'en-KW' },
    { currency: 'AED', locale: 'ar-AE' },
  ];
  /* oxlint-enable checkout/no-hardcoding-currency */
</script>

<div class="flex flex-col gap-2">
  {#each rows as row (row.currency)}
    <div class="flex items-baseline gap-4">
      <Text size="xsmall" color="muted" class="w-20">
        {row.currency} · {row.locale}
      </Text>
      <Amount
        value={1234567.891}
        currency={row.currency}
        locale={row.locale}
        size="large"
      />
    </div>
  {/each}
  <div class="flex items-baseline gap-2 pt-2">
    <Amount
      value={129900}
      currency="INR"
      unit="minor"
      locale="en-IN"
      color="muted"
      isStrikethrough
    />
    <Amount
      value={99900}
      currency="INR"
      unit="minor"
      locale="en-IN"
      size="large"
      weight="semibold"
    />
  </div>
</div>

<script lang="ts">
  import { Amount, Text } from '../../index';

  /* oxlint-disable checkout/no-hardcoding-currency -- a currency demo needs codes */
  const rows = [
    { currency: 'INR', locale: 'en-IN' },
    { currency: 'USD', locale: 'en-US' },
    { currency: 'SGD', locale: 'en-SG' },
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
      <Text size="large">
        <Amount
          value={1234567.891}
          currency={row.currency}
          locale={row.locale}
          fractionDigits="auto"
        />
      </Text>
    </div>
  {/each}
  <div class="flex items-baseline gap-2 pt-2">
    <Text color="muted">
      <Amount
        value={129900}
        currency="INR"
        unit="minor"
        locale="en-IN"
        isStrikethrough
      />
    </Text>
    <Text size="large" weight="semibold">
      <Amount value={99900} currency="INR" unit="minor" locale="en-IN" />
    </Text>
  </div>
</div>

<script lang="ts">
  import { TextInput } from '../../index';
  import type { FormatSpec } from '../../runes';
  import { digitsOnly, groupInFours } from '../helpers';

  interface Props {
    args: { maxCharacters?: number };
  }

  let { args }: Props = $props();

  const EXPIRY: FormatSpec = {
    parse: [
      ['\\D', 'g', ''],
      ['^(.{4}).*$', '', '$1'],
    ],
    format: [
      ['^([2-9])$', '', '0$1'],
      ['^(.{2})(.+)$', '', '$1 / $2'],
    ],
  };

  let value = $state<string | number | null | undefined>('');
  let expiry = $state<string | number | null | undefined>('');
</script>

<div class="grid max-w-96 gap-4">
  <TextInput
    bind:value
    label="Card number"
    inputMode="numeric"
    placeholder="0000 0000 0000 0000"
    format={{ parse: digitsOnly, format: groupInFours }}
    testID="card-number"
    maxCharacters={args.maxCharacters}
  />
  <p class="text-75 leading-50 text-surface-gray-subtle">
    parsed value: <span data-testid="card-value">{JSON.stringify(value)}</span>
  </p>
  <TextInput
    bind:value={expiry}
    label="Expiry"
    inputMode="numeric"
    placeholder="MM / YY"
    format={EXPIRY}
    testID="expiry"
  />
  <p class="text-75 leading-50 text-surface-gray-subtle">
    parsed value: <span data-testid="expiry-value">{JSON.stringify(expiry)}</span>
  </p>
</div>

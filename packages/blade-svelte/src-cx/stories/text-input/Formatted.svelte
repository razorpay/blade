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
    type="tel"
    placeholder="0000 0000 0000 0000"
    format={{ parse: digitsOnly, format: groupInFours }}
    maxCharacters={args.maxCharacters}
  />
  <p class="text-75 leading-50 text-surface-gray-subtle">
    parsed value: {JSON.stringify(value)}
  </p>
  <TextInput
    bind:value={expiry}
    label="Expiry"
    type="tel"
    placeholder="MM / YY"
    format={EXPIRY}
  />
  <p class="text-75 leading-50 text-surface-gray-subtle">
    parsed value: {JSON.stringify(expiry)}
  </p>
</div>

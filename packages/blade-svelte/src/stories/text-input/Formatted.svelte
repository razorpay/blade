<script lang="ts">
  import { TextInput } from '../../index';

  interface Props {
    args: { maxCharacters?: number };
  }

  let { args }: Props = $props();

  let value = $state<string | number | null | undefined>('');
  let expiry = $state<string | number | null | undefined>('');
</script>

<div class="grid max-w-96 gap-4">
  <TextInput
    bind:value
    label="Card number"
    inputMode="numeric"
    placeholder="0000 0000 0000 0000"
    format="#### #### #### ####"
    testID="card-number"
    maxCharacters={args.maxCharacters}
  />
  <p class="text-75 leading-50 text-surface-gray-subtle">
    value: <span data-testid="card-value">{JSON.stringify(value)}</span>
  </p>
  <TextInput
    bind:value={expiry}
    label="Expiry"
    inputMode="numeric"
    placeholder="MM/YY"
    format="##/##"
    testID="expiry"
  />
  <p class="text-75 leading-50 text-surface-gray-subtle">
    value: <span data-testid="expiry-value">{JSON.stringify(expiry)}</span>
  </p>
</div>

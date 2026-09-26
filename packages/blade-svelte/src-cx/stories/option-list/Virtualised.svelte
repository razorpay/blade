<script lang="ts">
  import { OptionList, OptionListItem } from '../../index';
  import type { Bank } from './banks';

  // Every third bank has a note, so row heights differ.
  const banks: Bank[] = Array.from({ length: 2000 }, (_, i) => ({
    code: `bank-${i}`,
    name: `Bank number ${i + 1}`,
    note: i % 3 === 0 ? 'Usually confirms within a minute' : undefined,
  }));

  let value = $state<Bank | readonly Bank[] | null>(null);
</script>

<div class="grid max-w-96 gap-3">
  <OptionList
    virtualize
    class="h-80"
    label="Bank"
    options={banks}
    optionKey={(bank) => bank.code}
    bind:value
    indicator="trailing"
  >
    {#snippet item(bank)}
      <OptionListItem title={bank.name} description={bank.note} />
    {/snippet}
  </OptionList>
  <p class="text-75 leading-50 text-surface-gray-subtle">
    value: {JSON.stringify((value as Bank | null)?.code ?? null)}
  </p>
</div>

<script lang="ts">
  import { OptionItem, OptionList, TextInput } from '../../index';
  import { BANKS, type Bank } from './banks';

  let query = $state<string | number | null | undefined>('');
  let value = $state<Bank | readonly Bank[] | null>(null);

  const filtered = $derived(
    BANKS.filter((bank) =>
      bank.name.toLowerCase().includes(String(query ?? '').toLowerCase())
    )
  );
</script>

<div class="grid max-w-96 gap-3">
  <TextInput
    bind:value={query}
    placeholder="Search banks"
    accessibilityLabel="Search banks"
  />
  <OptionList
    accessibilityLabel="Bank"
    bind:value
    indicator="trailing"
  >
    {#each filtered as bank (bank.code)}
      <OptionItem value={bank} title={bank.name}>
        {#snippet children(state)}
          <span class="flex w-full items-center justify-between gap-3">
            <span>{bank.name}</span>
            {#if state.isSelected}
              <span class="text-75 leading-50 text-interactive-gray-muted">Selected</span>
            {/if}
          </span>
        {/snippet}
      </OptionItem>
    {/each}
  </OptionList>
</div>

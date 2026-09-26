<script lang="ts">
  import { OptionList, OptionListItem, TextInput } from '../../index';
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
    options={filtered}
    optionKey={(bank) => bank.code}
    bind:value
    indicator="trailing"
  >
    {#snippet item(bank, state)}
      <OptionListItem
        title={bank.name}
        trailing={state.isSelected ? 'Selected' : undefined}
      />
    {/snippet}
  </OptionList>
</div>

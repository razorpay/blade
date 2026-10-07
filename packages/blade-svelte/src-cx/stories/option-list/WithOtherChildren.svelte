<script lang="ts">
  import { OptionItem, OptionList, type OptionListStyleProps } from '../../index';
  import { BANKS, type Bank } from './banks';

  interface Props {
    args: OptionListStyleProps;
  }

  let { args }: Props = $props();

  // v2's SavedCards: the first two up front, the rest behind "All N options".
  const [popular, rest] = [BANKS.slice(0, 2), BANKS.slice(2)];
  let showAll = $state(false);
  let value = $state<Bank | readonly Bank[] | null>(null);
</script>

<div class="grid max-w-96 gap-4">
  <OptionList label="Bank" bind:value>
    <p class="m-0 px-4 py-2 text-75 leading-50 font-blade-medium text-surface-gray-muted">
      Popular
    </p>
    {#each popular as bank (bank.code)}
      <OptionItem value={bank} title={bank.name} description={bank.note} />
    {/each}
    {#if showAll}
      <p class="m-0 px-4 py-2 text-75 leading-50 font-blade-medium text-surface-gray-muted">
        All banks
      </p>
      {#each rest as bank (bank.code)}
        <OptionItem
          value={bank}
          isDisabled={Boolean(bank.isDown)}
          title={bank.name}
          description={bank.note}
        />
      {/each}
    {:else}
      <button
        type="button"
        class="border-none bg-transparent px-4 py-3 text-left text-100 leading-100 text-interactive-primary-normal hover:underline"
        onclick={() => (showAll = true)}
      >
        All {rest.length} options
      </button>
    {/if}
  </OptionList>
  <p class="text-75 leading-50 text-surface-gray-subtle">
    value: {JSON.stringify((value as Bank | null)?.code ?? null)}
  </p>
</div>

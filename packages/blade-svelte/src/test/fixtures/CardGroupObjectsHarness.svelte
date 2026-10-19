<script lang="ts">
  import CardGroup from '../../components/card-group/CardGroup.svelte';
  import CardGroupItem from '../../components/card-group/CardGroupItem.svelte';

  interface Props {
    isMultiple?: boolean;
  }

  let { isMultiple = false }: Props = $props();

  const BANKS = [
    { code: 'hdfc', name: 'HDFC Bank' },
    { code: 'sbi', name: 'State Bank of India' },
  ];
  // A plain `$state`: Svelte keeps proxies of the banks, not the banks.
  // svelte-ignore state_referenced_locally
  let value = $state<(typeof BANKS)[number] | readonly (typeof BANKS)[number][] | null>(
    isMultiple ? [] : null
  );
</script>

<CardGroup label="Banks" selectionType={isMultiple ? 'multiple' : 'single'} bind:value>
  {#each BANKS as bank (bank.code)}
    <CardGroupItem value={bank} title={bank.name} testID="opt-{bank.code}" />
  {/each}
</CardGroup>

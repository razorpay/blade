<script lang="ts">
  import type { CardGroupChange } from '../../components/card-group/styles';
  import CardGroupItem from '../../components/card-group/CardGroupItem.svelte';
  import CardGroup from '../../components/card-group/CardGroup.svelte';

  interface Bank {
    code: string;
    name: string;
  }

  interface Props {
    banks?: Bank[];
    value?: Bank | readonly Bank[] | null;
    isMultiple?: boolean;
    isDeselectable?: boolean;
    isDisabled?: boolean;
    name?: string;
    /** A heading first and a button between the first two items. */
    extras?: boolean;
    onChange?: (change: CardGroupChange<Bank>) => void;
  }

  let {
    banks = [
      { code: 'hdfc', name: 'HDFC Bank' },
      { code: 'icici', name: 'ICICI Bank' },
      { code: 'down', name: 'Down Bank' },
    ],
    value: initialValue,
    isMultiple,
    isDeselectable,
    isDisabled,
    name,
    extras = false,
    onChange,
  }: Props = $props();

  // The pick lives here, not in an unpassed `$bindable` prop: `rerender`
  // swaps the props object, which would drop that prop's local override.
  // svelte-ignore state_referenced_locally
  let value = $state(initialValue);

  const picked = $derived(
    Array.isArray(value)
      ? value.map((bank: Bank) => bank.code).join(',')
      : ((value as Bank | null | undefined)?.code ?? 'none')
  );
</script>

<CardGroup
  label="Bank"
  compare={(a, b) => a?.code === b?.code}
  bind:value
  selectionType={isMultiple ? 'multiple' : 'single'}
  {isDeselectable}
  {isDisabled}
  {name}
  {onChange}
  testID="banks"
  class="mt-2"
>
  {#if extras}
    <p>Popular</p>
  {/if}
  {#each banks as bank, index (bank.code)}
    {#if extras && index === 1}
      <button type="button">All options</button>
    {/if}
    <CardGroupItem value={bank} isDisabled={bank.code === 'down'} title={bank.name}>
      {#snippet children(state)}
        <span>{bank.name}</span>
        <span>{`${state.index}:${state.isSelected ? 'on' : 'off'}:${state.isDisabled ? 'disabled' : 'enabled'}`}</span>
      {/snippet}
    </CardGroupItem>
  {/each}
</CardGroup>
<p data-testid="bound">{picked}</p>

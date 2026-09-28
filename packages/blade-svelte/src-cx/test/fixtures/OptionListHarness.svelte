<script lang="ts">
  import type { FormData } from '../../runes';
  import Button from '../../components/button/Button.svelte';
  import Form from '../../components/form/Form.svelte';
  import OptionItem from '../../components/option-list/OptionItem.svelte';
  import OptionList from '../../components/option-list/OptionList.svelte';
  import VirtualOptionList from '../../components/option-list/VirtualOptionList.svelte';

  interface Bank {
    code: string;
    name: string;
  }

  interface Props {
    inForm?: boolean;
    banks?: Bank[];
    value?: Bank | readonly Bank[] | null;
    isMultiple?: boolean;
    isDeselectable?: boolean;
    isDisabled?: boolean;
    name?: string;
    indicator?: 'none' | 'leading' | 'trailing';
    virtualize?: boolean;
    /** A heading first and a button between the first two items. */
    extras?: boolean;
    onChange?: (value: Bank | readonly Bank[] | null) => void;
    onSubmit?: (data: FormData) => void;
  }

  let {
    inForm = false,
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
    indicator,
    virtualize,
    extras = false,
    onChange,
    onSubmit,
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

{#snippet bankItem(bank: Bank)}
  <OptionItem value={bank} isDisabled={bank.code === 'down'} title={bank.name}>
    {#snippet children(state)}
      <span>{bank.name}</span>
      <span>{`${state.index}:${state.isSelected ? 'on' : 'off'}:${state.isDisabled ? 'disabled' : 'enabled'}`}</span>
    {/snippet}
  </OptionItem>
{/snippet}

{#snippet list(required: boolean)}
  {#if virtualize}
    <VirtualOptionList
      label="Bank"
      options={banks}
      optionKey={(bank) => bank.code}
      isOptionDisabled={(bank) => bank.code === 'down'}
      compare={(a, b) => a?.code === b?.code}
      bind:value
      {isMultiple}
      {isDeselectable}
      {isDisabled}
      isRequired={required}
      {name}
      {indicator}
      {onChange}
      testID="banks"
      class="mt-2"
    >
      {#snippet children(bank)}
        {@render bankItem(bank)}
      {/snippet}
    </VirtualOptionList>
  {:else}
    <OptionList
      label="Bank"
      compare={(a, b) => a?.code === b?.code}
      bind:value
      {isMultiple}
      {isDeselectable}
      {isDisabled}
      isRequired={required}
      {name}
      {indicator}
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
        {@render bankItem(bank)}
      {/each}
    </OptionList>
  {/if}
{/snippet}

{#if inForm}
  <Form name="nb" {onSubmit} formatConstraintError={(code) => `msg:${code}`}>
    {@render list(true)}
    <Button type="submit" testID="continue">Continue</Button>
  </Form>
{:else}
  {@render list(false)}
{/if}
<p data-testid="bound">{picked}</p>

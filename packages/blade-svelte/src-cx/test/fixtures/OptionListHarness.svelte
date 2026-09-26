<script lang="ts">
  import type { FormData } from '../../runes';
  import Button from '../../components/button/Button.svelte';
  import Form from '../../components/form/Form.svelte';
  import OptionList from '../../components/option-list/OptionList.svelte';
  import { OptionListItem } from '../../components/option-list';

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

{#snippet list(required: boolean)}
  <OptionList
    label="Bank"
    options={banks}
    optionKey={(bank) => bank.code}
    compare={(a, b) => a?.code === b?.code}
    isOptionDisabled={(bank) => bank.code === 'down'}
    bind:value
    {isMultiple}
    {isDeselectable}
    {isDisabled}
    isRequired={required}
    {name}
    {indicator}
    {virtualize}
    {onChange}
    testID="banks"
    class="mt-2"
  >
    {#snippet item(bank, state)}
      <OptionListItem
        title={bank.name}
        trailing={`${state.index}:${state.isSelected ? 'on' : 'off'}:${state.isDisabled ? 'disabled' : 'enabled'}`}
      />
    {/snippet}
  </OptionList>
{/snippet}

{#if inForm}
  <Form name="nb" {onSubmit} formatConstraintError={(code) => `msg:${code}`}>
    {@render list(true)}
    <Button testID="continue">Continue</Button>
  </Form>
{:else}
  {@render list(false)}
{/if}
<p data-testid="bound">{picked}</p>

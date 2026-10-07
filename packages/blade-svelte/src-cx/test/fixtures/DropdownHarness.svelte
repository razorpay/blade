<script lang="ts">
  import Dropdown from '../../components/dropdown/Dropdown.svelte';
  import ActionList from '../../components/action-list/ActionList.svelte';
  import ActionListItem from '../../components/action-list/ActionListItem.svelte';
  import DropdownHeader from '../../components/dropdown/DropdownHeader.svelte';
  import DropdownFooter from '../../components/dropdown/DropdownFooter.svelte';
  import Form from '../../components/form/Form.svelte';

  interface Props {
    isMultiple?: boolean;
    hasSearch?: boolean;
    hasFooter?: boolean;
    inForm?: boolean;
    isLoading?: boolean;
    hasLink?: boolean;
    onChange?: (change: { value: unknown }) => void;
    onSubmit?: (data: unknown) => void;
  }

  let {
    isMultiple = false,
    hasSearch = false,
    hasFooter = false,
    inForm = false,
    isLoading = false,
    hasLink = false,
    onChange,
    onSubmit,
  }: Props = $props();

  let value = $state<string | readonly string[] | null>(null);
  let isOpen = $state(false);
  const methods = ['UPI', 'Cards', 'Netbanking', 'Wallet'];
</script>

{#snippet dropdown()}
  <Dropdown
    bind:value
    bind:isOpen
    {isMultiple}
    {isLoading}
    {onChange}
    name="method"
    label="Payment method"
    placeholder="Select a method"
    isRequired={inForm}
    testID="dd"
  >
    {#snippet header()}
      {#if hasSearch}<DropdownHeader title="Methods" hasSearch />{/if}
    {/snippet}
    <ActionList>
      {#each methods as method (method)}
        <ActionListItem value={method.toLowerCase()} title={method} isDisabled={method === 'Wallet'} testID="opt-{method.toLowerCase()}" />
      {/each}
      {#if hasLink}
        <ActionListItem value="help" title="Payment help" href="#help" testID="opt-help" />
      {/if}
    </ActionList>
    {#snippet footer({ close })}
      {#if hasFooter}
        <DropdownFooter><button type="button" data-testid="apply" onclick={close}>Apply</button></DropdownFooter>
      {/if}
    {/snippet}
  </Dropdown>
{/snippet}

{#if inForm}
  <Form {onSubmit}>
    {@render dropdown()}
    <button type="submit" data-testid="submit">Pay</button>
  </Form>
{:else}
  {@render dropdown()}
{/if}
<span data-testid="bound">{JSON.stringify(value)}</span>
<span data-testid="open">{isOpen}</span>

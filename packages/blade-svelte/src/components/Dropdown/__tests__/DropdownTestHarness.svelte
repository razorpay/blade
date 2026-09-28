<script lang="ts">
  import Dropdown from '../Dropdown.svelte';
  import DropdownOverlay from '../DropdownOverlay.svelte';
  import InputDropdownButton from '../InputDropdownButton.svelte';
  import ActionList from '../../ActionList/ActionList.svelte';
  import ActionListItem from '../../ActionList/ActionListItem.svelte';
  import type { InputDropdownButtonProps } from '../types';

  let {
    onChange,
    value,
    defaultValue,
    firstTitle = 'Rupee',
  }: {
    onChange?: InputDropdownButtonProps['onChange'];
    value?: string;
    defaultValue?: string;
    /** Mutable so tests can assert an option keeps its registry index across prop changes. */
    firstTitle?: string;
  } = $props();
</script>

<Dropdown selectionType="single">
  {#snippet children()}
    <InputDropdownButton
      name="currency"
      {onChange}
      {...value !== undefined
        ? { value }
        : { defaultValue: defaultValue as string }}
    />
    <DropdownOverlay>
      {#snippet children()}
        <ActionList>
          {#snippet children()}
            <ActionListItem title={firstTitle} value="inr" />
            <ActionListItem title="Dollar" value="usd" />
          {/snippet}
        </ActionList>
      {/snippet}
    </DropdownOverlay>
  {/snippet}
</Dropdown>

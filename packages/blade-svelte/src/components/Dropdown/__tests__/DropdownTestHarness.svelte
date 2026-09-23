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
  }: {
    onChange?: InputDropdownButtonProps['onChange'];
    value?: string;
    defaultValue?: string;
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
            <ActionListItem title="Rupee" value="inr" />
            <ActionListItem title="Dollar" value="usd" />
          {/snippet}
        </ActionList>
      {/snippet}
    </DropdownOverlay>
  {/snippet}
</Dropdown>

<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Dropdown from './Dropdown.svelte';
  import type { DropdownProps } from './types';

  /* Partial-scope deviation from strict story parity (migration-plan Decision 3):
   * React stories depend on out-of-scope SelectInput/AutoComplete/DropdownButton/
   * FilterChip triggers, so in-scope surfaces are demonstrated with migrated
   * Button / Link / IconButton triggers + InputDropdownButton instead. Menu
   * triggers have no DropdownButton wrapper in scope, so the trigger toggles the
   * controllable `isOpen` locally. */
  const { Story } = defineMeta({
    title: 'Components/Dropdown/With Button and Link',
    component: Dropdown,
    tags: ['autodocs'],
    args: {
      selectionType: 'single',
    },
    argTypes: {
      children: { table: { disable: true } },
      onOpenChange: { table: { disable: true } },
      selectionType: { control: 'select', options: ['single', 'multiple'] },
      isOpen: { control: 'boolean' },
    } as Record<string, unknown>,
  } as Parameters<typeof defineMeta>[0] & { argTypes: Record<string, unknown> });
</script>

<script lang="ts">
  import DropdownOverlay from './DropdownOverlay.svelte';
  import DropdownHeader from './DropdownHeader.svelte';
  import DropdownFooter from './DropdownFooter.svelte';
  import InputDropdownButton from './InputDropdownButton.svelte';
  import ActionList from '../ActionList/ActionList.svelte';
  import ActionListItem from '../ActionList/ActionListItem.svelte';
  import Button from '../Button/Button.svelte';
  import Checkbox from '../Checkbox/Checkbox.svelte';

  let defaultOpen = $state(false);
  let controlledOpen = $state(false);
  let headerFooterOpen = $state(false);
  let multiOpen = $state(false);
  let inputOpen = $state(false);
  const cornerOpen = $state([false, false, false, false]);
  const corners: Array<{ top?: string; bottom?: string; left?: string; right?: string }> = [
    { top: '0', left: '0' },
    { top: '0', right: '0' },
    { bottom: '0', left: '0' },
    { bottom: '0', right: '0' },
  ];
</script>

<!-- 1. Default — single-select menu with a Button trigger, arrow-key nav. -->
<Story name="Default">
  {#snippet template(args: DropdownProps)}
    <Dropdown {...args} isOpen={defaultOpen} onOpenChange={(o) => (defaultOpen = o)}>
      {#snippet children()}
        <Button onClick={() => (defaultOpen = !defaultOpen)}>Select Action</Button>
        <DropdownOverlay>
          {#snippet children()}
            <ActionList>
              {#snippet children()}
                <ActionListItem title="Profile" value="profile" />
                <ActionListItem title="Settings" value="settings" />
                <ActionListItem title="Billing" value="billing" />
                <ActionListItem title="Logout" value="logout" intent="negative" />
              {/snippet}
            </ActionList>
          {/snippet}
        </DropdownOverlay>
      {/snippet}
    </Dropdown>
  {/snippet}
</Story>

<!-- 2. With Controlled Menu — external open control via bound state. -->
<Story name="With Controlled Menu">
  {#snippet template()}
    <div>
      <Button marginBottom="spacing.3" onClick={() => (controlledOpen = !controlledOpen)}>
        Toggle menu ({controlledOpen ? 'open' : 'closed'})
      </Button>
      <Dropdown isOpen={controlledOpen} onOpenChange={(o) => (controlledOpen = o)}>
        {#snippet children()}
          <Button onClick={() => (controlledOpen = !controlledOpen)}>Menu</Button>
          <DropdownOverlay>
            {#snippet children()}
              <ActionList>
                {#snippet children()}
                  <ActionListItem title="Overview" value="overview" />
                  <ActionListItem title="Transactions" value="transactions" />
                  <ActionListItem title="Reports" value="reports" />
                {/snippet}
              </ActionList>
            {/snippet}
          </DropdownOverlay>
        {/snippet}
      </Dropdown>
    </div>
  {/snippet}
</Story>

<!-- 3. With Header And Footer — hasFooterAction switches the container role to
     `dialog`; footer Button closes via the controllable `isOpen`. -->
<Story name="With Header And Footer">
  {#snippet template()}
    <Dropdown isOpen={headerFooterOpen} onOpenChange={(o) => (headerFooterOpen = o)}>
      {#snippet children()}
        <Button onClick={() => (headerFooterOpen = !headerFooterOpen)}>Filters</Button>
        <DropdownOverlay>
          {#snippet children()}
            <DropdownHeader title="Filter by" subtitle="Choose one or more" />
            <ActionList selectionType="multiple">
              {#snippet children()}
                <ActionListItem title="Success" value="success" />
                <ActionListItem title="Pending" value="pending" />
                <ActionListItem title="Failed" value="failed" />
              {/snippet}
            </ActionList>
            <DropdownFooter>
              {#snippet children()}
                <Checkbox>Save this filter</Checkbox>
                <Button marginTop="spacing.3" isFullWidth onClick={() => (headerFooterOpen = false)}>
                  Apply
                </Button>
              {/snippet}
            </DropdownFooter>
          {/snippet}
        </DropdownOverlay>
      {/snippet}
    </Dropdown>
  {/snippet}
</Story>

<!-- 4. With Auto Positioning — triggers pinned to the viewport corners exercise
     flip/offset placement. -->
<Story name="With Auto Positioning">
  {#snippet template()}
    <div style="position:relative;height:80vh;width:100%">
      {#each corners as pos, i (i)}
        <div
          style="position:absolute;top:{pos.top ?? 'auto'};bottom:{pos.bottom ?? 'auto'};left:{pos.left ?? 'auto'};right:{pos.right ?? 'auto'}"
        >
          <Dropdown isOpen={cornerOpen[i]} onOpenChange={(o) => (cornerOpen[i] = o)}>
            {#snippet children()}
              <Button onClick={() => (cornerOpen[i] = !cornerOpen[i])}>Menu {i + 1}</Button>
              <DropdownOverlay>
                {#snippet children()}
                  <ActionList>
                    {#snippet children()}
                      <ActionListItem title="Edit" value="edit" />
                      <ActionListItem title="Duplicate" value="duplicate" />
                      <ActionListItem title="Delete" value="delete" intent="negative" />
                    {/snippet}
                  </ActionList>
                {/snippet}
              </DropdownOverlay>
            {/snippet}
          </Dropdown>
        </div>
      {/each}
    </div>
  {/snippet}
</Story>

<!-- 5. Multi Select — selection stays open; selected rows keep their highlight. -->
<Story name="Multi Select">
  {#snippet template()}
    <Dropdown selectionType="multiple" isOpen={multiOpen} onOpenChange={(o) => (multiOpen = o)}>
      {#snippet children()}
        <Button onClick={() => (multiOpen = !multiOpen)}>Select products</Button>
        <DropdownOverlay>
          {#snippet children()}
            <ActionList selectionType="multiple">
              {#snippet children()}
                <ActionListItem title="Payments" value="payments" />
                <ActionListItem title="Payouts" value="payouts" />
                <ActionListItem title="Payment Links" value="payment_links" />
                <ActionListItem title="Smart Collect" value="smart_collect" />
              {/snippet}
            </ActionList>
          {/snippet}
        </DropdownOverlay>
      {/snippet}
    </Dropdown>
  {/snippet}
</Story>

<!-- 6. With Input Dropdown Button — displayValue is derived from the selected
     registered option; typeahead works when the overlay is open. -->
<Story name="With Input Dropdown Button">
  {#snippet template()}
    <Dropdown isOpen={inputOpen} onOpenChange={(o) => (inputOpen = o)}>
      {#snippet children()}
        <InputDropdownButton defaultValue="INR" />
        <DropdownOverlay>
          {#snippet children()}
            <ActionList>
              {#snippet children()}
                <ActionListItem title="INR" value="INR" />
                <ActionListItem title="USD" value="USD" />
                <ActionListItem title="EUR" value="EUR" />
                <ActionListItem title="GBP" value="GBP" />
              {/snippet}
            </ActionList>
          {/snippet}
        </DropdownOverlay>
      {/snippet}
    </Dropdown>
  {/snippet}
</Story>

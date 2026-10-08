<script lang="ts">
  import { ActionList, ActionListItem, Button, Dropdown, LayerHost, Text } from '../../index';
  import { ChevronDownIcon, ExternalLinkIcon } from '../../icons';

  let value = $state<string | readonly string[] | null>('active');
</script>

<div class="relative flex h-72 flex-col items-start gap-3 p-2">
  <Dropdown bind:value accessibilityLabel="Account status">
    {#snippet children({ selected })}
      <Button variant="secondary" trailingIcon={ChevronDownIcon}>{selected[0] ?? 'Status'}</Button>
    {/snippet}
    {#snippet content()}
      <ActionList>
        <ActionListItem value="active" title="Active" />
        <ActionListItem value="paused" title="Paused" />
        <!-- A destructive choice: red. Not allowed in the select field. -->
        <ActionListItem value="blocked" title="Blocked" intent="negative" />
        <!-- A link row: navigates, holds no value. -->
        <ActionListItem value="help" title="What do these mean?" href="#status-help" leading={ExternalLinkIcon} />
      </ActionList>
    {/snippet}
  </Dropdown>
  <Text size="small" color="muted">value: {JSON.stringify(value)}</Text>
  <LayerHost class="pointer-events-none absolute inset-0" />
</div>

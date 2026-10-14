<script lang="ts">
  import { ActionList, ActionListItem, Button, OverlayStack, Text } from '../../index';
  import { Modal } from '../../components/modal';
  import { ChevronDownIcon, ExternalLinkIcon } from '../../icons';

  let last = $state('—');
</script>

<div class="relative flex h-72 flex-col items-start gap-3 p-2">
  <!-- Inside a Modal `variant="menu"` every row acts and closes the menu. -->
  <Modal variant="menu" accessibilityLabel="Account status">
    {#snippet trigger({ isOpen })}
      <Button variant="secondary" trailingIcon={ChevronDownIcon}>{isOpen ? 'Choose…' : 'Status'}</Button>
    {/snippet}
    {#snippet body()}
      <ActionList onChange={({ value }) => (last = String(value))}>
        <ActionListItem value="active" title="Active" />
        <ActionListItem value="paused" title="Paused" />
        <!-- A destructive choice: red. -->
        <ActionListItem value="blocked" title="Blocked" intent="negative" />
        <!-- A link row: navigates and closes the menu, holds no value. -->
        <ActionListItem value="help" title="What do these mean?" href="#status-help" leading={ExternalLinkIcon} />
      </ActionList>
    {/snippet}
  </Modal>
  <Text size="small" color="muted">chose: {last}</Text>
  <OverlayStack class="pointer-events-none absolute inset-0" />
</div>

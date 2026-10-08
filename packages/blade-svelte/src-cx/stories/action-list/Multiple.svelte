<script lang="ts">
  import { ActionList, ActionListItem, Badge, Text } from '../../index';

  let value = $state<string | readonly string[] | null>(['email']);
</script>

<div class="grid max-w-80 gap-3">
  <ActionList bind:value selectionType="multiple" label="Notify me by">
    <ActionListItem value="email" title="Email" />
    <ActionListItem value="sms" title="SMS" />
    <ActionListItem value="whatsapp" title="WhatsApp">
      {#snippet titleSuffix()}<Badge size="small" color="positive">New</Badge>{/snippet}
    </ActionListItem>
  </ActionList>
  <Text size="small" color="muted">value: {JSON.stringify(value)}</Text>
</div>

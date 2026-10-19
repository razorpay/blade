<script lang="ts">
  import { ActionList, ActionListItem, ActionListSection } from '../../index';
  import { ExternalLinkIcon, TrashIcon } from '../../icons';

  let value = $state<string | readonly string[] | null>(null);
</script>

<div class="max-w-80">
  <ActionList bind:value accessibilityLabel="Account">
    <ActionListSection title="Plan">
      <ActionListItem value="basic" title="Basic" />
      <ActionListItem value="pro" title="Pro" />
    </ActionListSection>
    <ActionListSection title="More">
      <ActionListItem value="pricing" title="Compare plans" href="#pricing" leading={ExternalLinkIcon} />
      <ActionListItem value="close" title="Close account" intent="negative" leading={TrashIcon} />
    </ActionListSection>
  </ActionList>
</div>

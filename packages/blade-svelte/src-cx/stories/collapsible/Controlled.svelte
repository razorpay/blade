<script lang="ts">
  import { Button, Collapsible, CollapsibleChevron, Link, Text } from '../../index';
  import Breakdown from './Breakdown.svelte';

  let isExpanded = $state(false);
</script>

<div class="flex flex-col items-start gap-3">
  <Button variant="secondary" onClick={() => (isExpanded = !isExpanded)}>
    {isExpanded ? 'Collapse' : 'Expand'} from outside
  </Button>
  <Collapsible bind:isExpanded>
    <Link variant="button">
      View Price Breakdown<CollapsibleChevron />
    </Link>
    {#snippet content()}
      <Breakdown />
    {/snippet}
  </Collapsible>
  <Text size="small" color="muted">isExpanded: {isExpanded}</Text>
</div>

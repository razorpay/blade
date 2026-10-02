<script lang="ts">
  import Collapsible from '../../components/collapsible/Collapsible.svelte';
  import CollapsibleChevron from '../../components/collapsible/CollapsibleChevron.svelte';
  import Link from '../../components/link/Link.svelte';

  interface Props {
    isExpanded?: boolean;
    direction?: 'bottom' | 'top';
    onExpandChange?: (change: { isExpanded: boolean }) => void;
  }

  let { isExpanded: initial = false, direction, onExpandChange }: Props = $props();

  // svelte-ignore state_referenced_locally
  let isExpanded = $state(initial);
</script>

<Collapsible bind:isExpanded {direction} {onExpandChange} testID="collapsible">
  {#snippet trigger({ isExpanded })}
    <Link variant="button" testID="trigger">
      View Price Breakdown<CollapsibleChevron />
    </Link>
    <output data-testid="trigger-state">{isExpanded}</output>
  {/snippet}
  <p>Actual amount</p>
</Collapsible>
<p data-testid="bound">{isExpanded}</p>

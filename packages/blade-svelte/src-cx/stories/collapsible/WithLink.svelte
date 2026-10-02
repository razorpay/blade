<script lang="ts">
  import { Collapsible, CollapsibleChevron, Link } from '../../index';
  import Breakdown from './Breakdown.svelte';

  interface Props {
    args: { direction?: 'bottom' | 'top' };
  }

  let { args }: Props = $props();
</script>

<!-- Blade's CollapsibleLink: a Link variant="button", with the chevron
     turning after the label. -->
<Collapsible direction={args.direction}>
  {#snippet trigger()}
    <Link variant="button">
      View Price Breakdown<CollapsibleChevron />
    </Link>
  {/snippet}
  <Breakdown />
</Collapsible>

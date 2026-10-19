<script lang="ts">
  import { Link } from '../../index';
  import { Collapsible, CollapsibleChevron } from '../../components/collapsible';
  import Breakdown from './Breakdown.svelte';

  interface Props {
    args: { direction?: 'bottom' | 'top' };
  }

  let { args }: Props = $props();
</script>

<!-- Blade's CollapsibleLink: a Link variant="button", with the chevron
     turning after the label. -->
<Collapsible direction={args.direction}>
  <Link variant="button">
    View Price Breakdown<CollapsibleChevron />
  </Link>
  {#snippet content()}
    <Breakdown />
  {/snippet}
</Collapsible>

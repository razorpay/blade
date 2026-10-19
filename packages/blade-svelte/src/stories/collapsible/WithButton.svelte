<script lang="ts">
  import { Button } from '../../index';
  import { Collapsible } from '../../components/collapsible';
  import Breakdown from './Breakdown.svelte';

  interface Props {
    args: { direction?: 'bottom' | 'top' };
  }

  let { args }: Props = $props();
</script>

<!-- Blade's CollapsibleButton: a Button (Blade's default primary) that toggles. -->
<Collapsible direction={args.direction}>
  <Button color="primary">View Price Breakdown</Button>
  {#snippet content()}
    <Breakdown />
  {/snippet}
</Collapsible>

<script lang="ts">
  import { Button, Collapsible } from '../../index';
  import Breakdown from './Breakdown.svelte';

  interface Props {
    args: { direction?: 'bottom' | 'top' };
  }

  let { args }: Props = $props();
</script>

<!-- Blade's CollapsibleButton: a Button (Blade's default primary) that toggles. -->
<Collapsible direction={args.direction}>
  {#snippet trigger()}
    <Button color="primary">View Price Breakdown</Button>
  {/snippet}
  <Breakdown />
</Collapsible>

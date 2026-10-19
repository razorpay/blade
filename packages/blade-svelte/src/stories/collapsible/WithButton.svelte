<script lang="ts">
  import { Button, Collapsible } from '../../index';
  import Breakdown from './Breakdown.svelte';

  interface Props {
    args: { direction?: 'bottom' | 'top' };
  }

  let { args }: Props = $props();
</script>

<!-- Blade's CollapsibleButton: a Button (Blade's default primary) that toggles. -->
<Collapsible direction={args.direction} testID="collapsible">
  <Button color="primary" testID="trigger">View Price Breakdown</Button>
  {#snippet content()}
    <div data-testid="body"><Breakdown /></div>
  {/snippet}
</Collapsible>

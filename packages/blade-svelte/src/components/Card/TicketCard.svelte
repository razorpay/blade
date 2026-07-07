<script lang="ts">
  import Card from './Card.svelte';
  import CardBody from './CardBody.svelte';
  import type { TicketCardProps } from './types';

  let { topSection: topContent, bottomSection: bottomContent, ...rest }: TicketCardProps =
    $props();
</script>

<Card variant="ticket" {...rest}>
  {#snippet topSection()}
    <CardBody>
      {@render topContent()}
    </CardBody>
  {/snippet}
  {#snippet bottomSection()}
    <CardBody>
      {@render bottomContent()}
    </CardBody>
  {/snippet}
</Card>

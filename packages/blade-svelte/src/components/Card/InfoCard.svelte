<script lang="ts">
  import Card from './Card.svelte';
  import CardBody from './CardBody.svelte';
  import type { InfoCardProps } from './types';

  let { topSection: topContent, bottomSection: bottomContent, ...rest }: InfoCardProps = $props();
</script>

<Card variant="info" {...rest}>
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

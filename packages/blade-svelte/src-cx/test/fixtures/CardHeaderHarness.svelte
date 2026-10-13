<script lang="ts">
  import Card from '../../components/card/Card.svelte';
</script>

<Card title="Order summary" subtitle="2 items">
  {#snippet header({ title, subtitle })}
    <div data-testid="head">
      {@render title()}
      {@render subtitle()}
    </div>
    <span data-testid="extra">2</span>
  {/snippet}
  Body
</Card>

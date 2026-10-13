<script lang="ts">
  import CardGroup from '../../components/card-group/CardGroup.svelte';
  import CardGroupItem from '../../components/card-group/CardGroupItem.svelte';

  interface Props {
    onChange?: (change: { name: string | undefined; value: unknown }) => void;
    /** A leading and a header snippet beside the title. */
    withHeader?: boolean;
  }

  let { onChange, withHeader = false }: Props = $props();

  const questions = [
    { id: 'refund', title: 'Refunds' },
    { id: 'saved', title: 'Saved cards' },
  ];
</script>

<!-- No `value` on the items: each is known by its index. -->
<CardGroup accessibilityLabel="Questions" testID="faq" {onChange}>
  {#each questions as question (question.id)}
    <CardGroupItem title={question.title}>
      {#snippet leading()}{#if withHeader}<span data-testid={`leading-${question.id}`}>*</span>{/if}{/snippet}
      {#snippet header({ title, subtitle, isExpanded })}
        {#if withHeader}
          <span data-testid={`title-row-${question.id}`}>{@render title()} <span data-testid={`header-${question.id}`}>{isExpanded ? 'Open' : 'Updated today'}</span></span>
          {@render subtitle()}
        {:else}
          {@render title()}
          {@render subtitle()}
        {/if}
      {/snippet}
      {#snippet body()}
        <div data-testid={`content-${question.id}`}>{question.title} body</div>
      {/snippet}
    </CardGroupItem>
  {/each}
</CardGroup>

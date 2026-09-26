<script lang="ts">
  import Accordion from '../../components/accordion/Accordion.svelte';
  import AccordionItem from '../../components/accordion/AccordionItem.svelte';

  interface Props {
    onChange?: (value: unknown) => void;
  }

  let { onChange }: Props = $props();

  const questions = [
    { id: 'refund', title: 'Refunds' },
    { id: 'saved', title: 'Saved cards' },
  ];
</script>

<!-- No `value` on the items: each is known by its index. -->
<Accordion accessibilityLabel="Questions" testID="faq" {onChange}>
  {#each questions as question (question.id)}
    <AccordionItem title={question.title}>
      {#snippet content()}
        <div data-testid={`content-${question.id}`}>{question.title} body</div>
      {/snippet}
    </AccordionItem>
  {/each}
</Accordion>

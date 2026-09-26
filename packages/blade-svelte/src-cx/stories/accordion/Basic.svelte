<script lang="ts">
  import { Accordion, AccordionItem, Text, type AccordionStyleProps } from '../../index';

  interface Props {
    args: AccordionStyleProps & {
      isDisabled?: boolean;
      showNumberPrefix?: boolean;
    };
  }

  let { args }: Props = $props();

  const questions = [
    {
      id: 'refund',
      title: 'When do refunds arrive?',
      subtitle: 'Refunds and reversals',
      body: 'Within five to seven working days, to the source of the payment.',
    },
    {
      id: 'saved',
      title: 'Are my saved cards safe?',
      subtitle: 'Card tokenisation',
      body: 'Cards are tokenised with the network; the number is never stored.',
    },
    {
      id: 'emi',
      title: 'Can I convert this payment to EMI?',
      subtitle: 'EMI on cards',
      body: 'Yes, on eligible cards, from the EMI method before paying.',
    },
  ];
</script>

<div class="max-w-160">
  <Accordion
    variant={args.variant}
    size={args.size}
    showNumberPrefix={args.showNumberPrefix}
    isDisabled={args.isDisabled}
    accessibilityLabel="Questions"
  >
    {#each questions as question (question.id)}
      <AccordionItem
        value={question.id}
        title={question.title}
        subtitle={question.subtitle}
      >
        {#snippet content(state)}
          <Text size={state.size === 'large' ? 'medium' : 'small'} color="subtle">
            {question.body}
          </Text>
        {/snippet}
      </AccordionItem>
    {/each}
  </Accordion>
</div>

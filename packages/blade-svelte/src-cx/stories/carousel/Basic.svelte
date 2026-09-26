<script lang="ts">
  import { Card, Carousel, Text } from '../../index';

  interface Props {
    args: { autoAdvance?: number };
  }

  let { args }: Props = $props();

  const OFFERS = [
    { id: 'hdfc', title: '10% off with HDFC cards', note: 'Up to 500 off.' },
    { id: 'emi', title: 'No-cost EMI', note: 'On 3 and 6 month plans.' },
    { id: 'upi', title: 'Cashback on UPI', note: 'Credited in 48 hours.' },
  ];

  let index = $state(0);
</script>

<div class="w-80 max-w-full">
  {#key args.autoAdvance}
    <Carousel
      items={OFFERS}
      itemKey={(offer) => offer.id}
      bind:index
      autoAdvance={args.autoAdvance}
      accessibilityLabel="Offers"
      slideLabel={(n, count) => `Offer ${n} of ${count}`}
    >
      {#snippet children(offer)}
        <div class="p-1">
          <Card variant="secondary">
            {#snippet body()}
              <Text weight="semibold">{offer.title}</Text>
              <Text size="small" color="muted">{offer.note}</Text>
            {/snippet}
          </Card>
        </div>
      {/snippet}
    </Carousel>
  {/key}
  <Text size="small" color="muted" class="mt-2">index: {index}</Text>
</div>

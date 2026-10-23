<script lang="ts">
  import { Carousel, Text } from '../../index';
  import { Card } from '../../components/card';
  import type { CarouselStyleProps } from '../../components/carousel';

  interface Props {
    args: CarouselStyleProps & {
      autoPlay?: boolean;
      showIndicators?: boolean;
      showNavigationButtons?: boolean;
    };
  }

  let { args }: Props = $props();

  const OFFERS = [
    { id: 'hdfc', title: '10% off with HDFC cards', note: 'Up to 500 off.' },
    { id: 'emi', title: 'No-cost EMI', note: 'On 3 and 6 month plans.' },
    { id: 'upi', title: 'Cashback on UPI', note: 'Credited in 48 hours.' },
  ];

  let activeSlide = $state(0);
</script>

<div class="w-80 max-w-full">
  <Carousel
    items={OFFERS}
    itemKey={(offer) => offer.id}
    bind:activeSlide
    autoPlay={args.autoPlay}
    showIndicators={args.showIndicators}
    showNavigationButtons={args.showNavigationButtons}
    navigationButtonPosition={args.navigationButtonPosition}
    navigationButtonVariant={args.navigationButtonVariant}
    accessibilityLabel="Offers"
  >
    {#snippet children(offer)}
      <div class="p-1">
        <Card variant="secondary">
          <Text weight="semibold">{offer.title}</Text>
          <Text size="small" color="muted">{offer.note}</Text>
        </Card>
      </div>
    {/snippet}
  </Carousel>
  <Text size="small" color="muted" class="mt-2">activeSlide: {activeSlide}</Text>
</div>

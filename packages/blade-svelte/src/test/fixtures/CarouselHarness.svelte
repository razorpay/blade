<script lang="ts">
  import Carousel from '../../components/carousel/Carousel.svelte';

  interface Props {
    autoPlay?: boolean;
    showIndicators?: boolean;
    withLabels?: boolean;
    onChange?: (index: number) => void;
  }

  let { autoPlay, showIndicators, withLabels = true, onChange }: Props = $props();

  const OFFERS = ['10% off', 'No-cost EMI', 'Cashback'];
</script>

<Carousel
  items={OFFERS}
  itemKey={(offer) => offer}
  {autoPlay}
  {showIndicators}
  {onChange}
  accessibilityLabel="Offers"
  slideLabel={withLabels ? (n, count) => `Offer ${n} of ${count}` : undefined}
  indicatorLabel={withLabels ? (n) => `Go to offer ${n}` : undefined}
  data-analytics-section="offers"
  testID="offers"
>
  {#snippet children(offer)}
    <p>{offer}</p>
  {/snippet}
</Carousel>

<script lang="ts">
  import Carousel from '../../components/carousel/Carousel.svelte';

  interface Props {
    autoAdvance?: number;
    withLabels?: boolean;
    onChange?: (index: number) => void;
  }

  let { autoAdvance, withLabels = true, onChange }: Props = $props();

  const OFFERS = ['10% off', 'No-cost EMI', 'Cashback'];
</script>

<Carousel
  items={OFFERS}
  itemKey={(offer) => offer}
  {autoAdvance}
  {onChange}
  accessibilityLabel="Offers"
  slideLabel={withLabels ? (n, count) => `Offer ${n} of ${count}` : undefined}
  testID="offers"
>
  {#snippet children(offer)}
    <p>{offer}</p>
  {/snippet}
</Carousel>

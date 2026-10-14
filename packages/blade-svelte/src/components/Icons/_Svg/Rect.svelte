<script lang="ts">
  import { metaAttribute } from '@razorpay/blade-core/utils';

  type RectProps = {
    width: string | number;
    height: string | number;
    fill?: string;
    rx?: string | number;
    ry?: string | number;
    x?: string | number;
    y?: string | number;
    fillOpacity?: number;
    transform?: string;
  };

  let { width, height, fill, rx, ry, x, y, fillOpacity, transform }: RectProps = $props();

  const metaAttrs = metaAttribute({ name: 'svg-rect' });
</script>

<rect
  {...metaAttrs}
  {width}
  {height}
  {rx}
  {ry}
  {x}
  {y}
  {fill}
  fill-opacity={fillOpacity}
  {transform}
/>

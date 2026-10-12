<script lang="ts">
  import { metaAttribute } from '@razorpay/blade-core/utils';

  type CircleProps = {
    cx: string | number;
    cy: string | number;
    r: string | number;
    x?: string | number;
    y?: string | number;
    fill?: string;
    stroke?: string;
    strokeWidth?: string | number;
    fillOpacity?: number;
  };

  let { cx, cy, r, x, y, fill, stroke, strokeWidth, fillOpacity }: CircleProps = $props();

  const metaAttrs = metaAttribute({ name: 'svg-circle' });
</script>

<circle
  {cx}
  {cy}
  {r}
  {x}
  {y}
  {fill}
  {stroke}
  stroke-width={strokeWidth}
  fill-opacity={fillOpacity}
  {...metaAttrs}
/>

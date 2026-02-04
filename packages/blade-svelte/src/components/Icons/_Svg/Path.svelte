<script lang="ts">
  import { metaAttribute } from '@razorpay/blade-core/utils';

  type PathProps = {
    /**
     * SVG path data (the d attribute)
     */
    d: string;
    /**
     * Fill color
     */
    fill?: string;
    /**
     * Fill opacity
     */
    fillOpacity?: number;
    /**
     * Fill rule
     */
    fillRule?: 'nonzero' | 'evenodd';
    /**
     * Clip rule
     */
    clipRule?: 'nonzero' | 'evenodd';
    /**
     * Clip path
     */
    clipPath?: string;
    /**
     * Stroke color
     */
    stroke?: string;
    /**
     * Stroke width
     */
    strokeWidth?: number;
    /**
     * Stroke linecap
     */
    strokeLinecap?: 'butt' | 'round' | 'square';
    /**
     * Stroke linejoin
     */
    strokeLinejoin?: 'miter' | 'round' | 'bevel';
  };

  let {
    d,
    fill,
    fillOpacity,
    fillRule,
    clipRule,
    clipPath,
    stroke,
    strokeWidth,
    strokeLinecap,
    strokeLinejoin,
  }: PathProps = $props();

  // Meta attributes for testing
  const metaAttrs = metaAttribute({ name: 'svg-path' });
</script>

<path
  {d}
  {fill}
  fill-opacity={fillOpacity}
  fill-rule={fillRule}
  clip-rule={clipRule}
  clip-path={clipPath}
  {stroke}
  stroke-width={strokeWidth}
  stroke-linecap={strokeLinecap}
  stroke-linejoin={strokeLinejoin}
  {...metaAttrs}
/>


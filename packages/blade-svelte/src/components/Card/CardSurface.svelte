<script lang="ts">
  import type { CardSurfaceProps } from './types';
  import { cardSurfaceStyles } from '@razorpay/blade-core/styles';

  let {
    children,
    backgroundColor = 'surface.background.gray.intense',
    borderRadius = 'medium',
    elevation = 'lowRaised',
    padding = 'spacing.7',
    height,
    minHeight,
  }: CardSurfaceProps = $props();

  const classes = $derived(
    cardSurfaceStyles({
      backgroundColor,
      borderRadius,
      elevation,
      padding,
    }),
  );

  const styles = $derived(() => {
    const styleObj: Record<string, string> = {};
    if (height) styleObj.height = height;
    if (minHeight) styleObj['min-height'] = minHeight;
    return styleObj;
  });
</script>

<div class={classes} style={Object.entries(styles()).map(([k, v]) => `${k}: ${v}`).join('; ')}>
  {@render children()}
</div>

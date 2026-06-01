<script lang="ts">
  import { indicatorBackgroundStyles } from '@razorpay/blade-core/styles';
  import { getStepRootContext } from './context';
  import type { StepItemIconProps } from './types';

  let { icon: Icon, color = 'neutral', isDisabled = false }: StepItemIconProps = $props();

  const getRootCtx = getStepRootContext();
  const size = $derived(getRootCtx ? getRootCtx().size : 'medium');

  const bgClass = $derived(indicatorBackgroundStyles({ color }));

  // Map size to icon size token
  const iconSize = $derived(size === 'large' ? 'medium' : 'small');

  // Map color + disabled state to icon color token
  const iconColor = $derived(
    isDisabled
      ? 'surface.icon.gray.disabled'
      : color === 'primary'
        ? 'surface.icon.primary.normal'
        : `feedback.icon.${color}.intense`,
  );
</script>

<div class={bgClass}>
  <Icon size={iconSize} color={iconColor} />
</div>

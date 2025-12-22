<script lang="ts">
  import BaseText from '../BaseText/BaseText.svelte';
  import type { CodeProps } from './types';
  import { metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';
  import { getStyledPropsClasses } from '@razorpay/blade-core/utils';
  import { getCodeClasses, getCodeFontSizeAndLineHeight, getCodeColor } from '@razorpay/blade-core/styles';

  let {
    children,
    size,
    weight,
    isHighlighted,
    color,
    testID,
    textTransform,
    ...styledProps
  }: CodeProps = $props();

  // Set defaults - use $derived for reactivity when props change
  const finalSize = $derived(size ?? 'small');
  const finalWeight = $derived(weight ?? 'regular');
  const finalIsHighlighted = $derived(isHighlighted ?? true);

  // Validate color prop when isHighlighted is true
  $effect(() => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      if (finalIsHighlighted && color) {
        console.error(
          '[Blade: Code]: `color` prop cannot be used without `isHighlighted={false}`',
        );
      }
    }
  });

  const { fontSize, lineHeight } = $derived(getCodeFontSizeAndLineHeight(finalSize));
  const codeTextColor = $derived(getCodeColor({ isHighlighted: finalIsHighlighted, color }));

  // Extract styled props and convert to classes
  // This ensures everything is class-based with no inline styles
  const styledPropsClasses = $derived(getStyledPropsClasses(styledProps));

  // Meta attributes
  const metaAttrs = metaAttribute({
    name: MetaConstants.Code,
    testID,
  });

  // Generate Code classes from blade-core (single source of truth)
  // Everything is class-based - no inline styles or data attributes
  const codeClasses = $derived(
    getCodeClasses({
      isHighlighted: finalIsHighlighted,
    }),
  );

  // Combine classes - everything is class-based, no inline styles
  // styledPropsClasses.inlineStyles is intentionally ignored to maintain pure class-based styling
  const containerClasses = $derived(() => {
    const classes = [codeClasses];
    if (styledPropsClasses.classes) {
      classes.push(...styledPropsClasses.classes);
    }
    return classes.filter(Boolean).join(' ');
  });
</script>

<span
  class={containerClasses()}
  {...metaAttrs}
>
  <BaseText
    color={codeTextColor}
    fontFamily="code"
    fontSize={fontSize}
    fontWeight={finalWeight}
    as="code"
    lineHeight={lineHeight}
    textTransform={textTransform}
  >
    {#if typeof children === 'string'}
      {children}
    {:else}
      {@render children()}
    {/if}
  </BaseText>
</span>


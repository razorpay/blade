<script lang="ts">
  import './code.css';
  import BaseText from '../BaseText/BaseText.svelte';
  import type { CodeProps } from './types';
  import { getCodeFontSizeAndLineHeight, getCodeColor } from './utils';
  import { metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';
  import { getStyledPropsClasses } from '@razorpay/blade-core/utils';

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

  // Set defaults
  const finalSize = size ?? 'small';
  const finalWeight = weight ?? 'regular';
  const finalIsHighlighted = isHighlighted ?? true;

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

  // Combine classes - everything is class-based, no inline styles
  // styledPropsClasses.inlineStyles is intentionally ignored to maintain pure class-based styling
  const containerClasses = $derived(() => {
    const classes = ['code-container'];
    if (finalIsHighlighted) {
      classes.push('code-container--highlighted');
    }
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
    {@render children()}
  </BaseText>
</span>


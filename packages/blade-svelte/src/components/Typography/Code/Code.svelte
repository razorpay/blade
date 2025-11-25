<script lang="ts">
  import './code.css';
  import BaseText from '../BaseText/BaseText.svelte';
  import type { CodeProps } from './types';
  import { getCodeFontSizeAndLineHeight, getCodeColor } from './utils';
  import { metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';
  import { getStyledProps } from '../../../utils/styledProps';
  import { getStyledPropsClasses, combineStyleStrings } from '../../../utils/styledProps';

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

  // Extract styled props
  const extractedStyledProps = $derived(getStyledProps(styledProps));
  const styledPropsClasses = $derived(getStyledPropsClasses(extractedStyledProps));

  // Meta attributes
  const metaAttrs = metaAttribute({
    name: MetaConstants.Code,
    testID,
  });

  // Combine classes
  const containerClasses = $derived(() => {
    const classes = ['code-container'];
    if (finalIsHighlighted) {
      classes.push('code-container--highlighted');
    }
    if (styledPropsClasses.classes) {
      classes.push(styledPropsClasses.classes);
    }
    return classes.filter(Boolean).join(' ');
  });

  // Combine inline styles
  const containerStyles = $derived(() => {
    return combineStyleStrings(styledPropsClasses.inlineStyles);
  });
</script>

<span
  class={containerClasses()}
  style={containerStyles()}
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


<script lang="ts">
  import BaseText from '../BaseText/BaseText.svelte';
  import type { TextBodyVariant, TextCaptionVariant } from './types';
  import { getTextProps, validAsValues } from './utils';
  import { getStyledProps } from '../../../utils/styledProps';

  type TextComponentProps = (TextBodyVariant | TextCaptionVariant) & {
    weight?: 'regular' | 'medium' | 'semibold';
    variant?: 'body' | 'caption';
  };

  let {
    as = 'p',
    variant = 'body',
    weight,
    size,
    truncateAfterLines,
    children,
    color,
    testID,
    textAlign,
    textDecorationLine,
    wordBreak,
    textTransform,
    ...styledProps
  }: TextComponentProps = $props();

  // Set defaults
  const finalVariant = (variant ?? 'body') as 'body' | 'caption';
  const finalWeight = weight ?? 'regular';

  // Validate as prop in development
  $effect(() => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      if (as && !validAsValues.includes(as)) {
        console.error(
          `[Blade: Text]: Invalid \`as\` prop value - ${as}. Only ${validAsValues.join(', ')} are accepted`,
        );
      }
    }
  });

  // Get BaseText props from Text props
  const baseTextProps = $derived(
    getTextProps({
      variant: finalVariant,
      weight: finalWeight,
      color,
      size,
      testID,
      textAlign,
      textDecorationLine,
    }),
  );

  // Extract styled props
  const extractedStyledProps = $derived(getStyledProps(styledProps));

  // Merge props: baseTextProps first, then direct props, then styled props (matching React implementation)
  const mergedProps = $derived({
    ...baseTextProps,
    as,
    truncateAfterLines,
    wordBreak,
    textTransform,
    ...extractedStyledProps,
  });
</script>

<BaseText {...mergedProps}>
  {@render children()}
</BaseText>


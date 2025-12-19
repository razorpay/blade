<script lang="ts">
  import BaseText from '../BaseText/BaseText.svelte';
  import type { TextBodyVariant, TextCaptionVariant } from './types';
  import { getTextProps, validTextAsValues } from '@razorpay/blade-core/styles';

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
    ...rest
  }: TextComponentProps = $props();

  // Set defaults
  const finalVariant = (variant ?? 'body') as 'body' | 'caption';
  const finalWeight = weight ?? 'regular';

  // Validate as prop in development
  $effect(() => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      if (as && !validTextAsValues.includes(as)) {
        console.error(
          `[Blade: Text]: Invalid \`as\` prop value - ${as}. Only ${validTextAsValues.join(', ')} are accepted`,
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

  // Merge props: baseTextProps first, then direct props, then rest (styled props)
  // BaseText will handle styled props extraction via getStyledPropsClasses(rest)
  const mergedProps = $derived({
    ...baseTextProps,
    as,
    truncateAfterLines,
    wordBreak,
    textTransform,
    ...rest,
  });
</script>

<BaseText {...mergedProps}>
  {@render children()}
</BaseText>


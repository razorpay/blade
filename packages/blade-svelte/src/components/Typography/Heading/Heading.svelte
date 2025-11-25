<script lang="ts">
  import BaseText from '../BaseText/BaseText.svelte';
  import type { HeadingProps } from './types';
  import { getHeadingProps, validAsValues } from './utils';
  import { getStyledProps } from '../../../utils/styledProps';

  let {
    as,
    size,
    weight,
    color,
    children,
    testID,
    textAlign,
    textDecorationLine,
    wordBreak,
    textTransform,
    ...styledProps
  }: HeadingProps = $props();

  // Set defaults
  const finalSize = (size ?? 'small') as 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
  const finalWeight = (weight ?? 'semibold') as 'regular' | 'medium' | 'semibold';
  const finalColor = color ?? 'surface.text.gray.normal';

  // Validate as prop in development
  $effect(() => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      if (as && !validAsValues.includes(as)) {
        console.error(
          `[Blade: Heading]: Invalid \`as\` prop value - ${as}. Only ${validAsValues.join(', ')} are accepted`,
        );
      }
    }
  });

  // Get BaseText props from Heading props
  const baseTextProps = $derived(
    getHeadingProps({
      as,
      size: finalSize,
      weight: finalWeight,
      color: finalColor,
      testID,
    }),
  );

  // Extract styled props
  const extractedStyledProps = $derived(getStyledProps(styledProps));

  // Merge props: baseTextProps first, then direct props, then styled props (matching React implementation)
  const mergedProps = $derived({
    ...baseTextProps,
    textAlign,
    textDecorationLine,
    textTransform,
    wordBreak,
    ...extractedStyledProps,
  });
</script>

<BaseText {...mergedProps}>
  {@render children()}
</BaseText>

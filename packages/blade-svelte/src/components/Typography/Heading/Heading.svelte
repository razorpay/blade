<script lang="ts">
  import BaseText from '../BaseText/BaseText.svelte';
  import type { HeadingProps } from './types';
  import type { TextColors, BaseTextProps } from '../BaseText/types';
  import { getHeadingProps, validHeadingAsValues } from '@razorpay/blade-core/styles';

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
    ...rest
  }: HeadingProps = $props();

  // Set defaults - use $derived for reactivity when props change
  const finalSize = $derived((size ?? 'small') as 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge');
  const finalWeight = $derived((weight ?? 'semibold') as 'regular' | 'medium' | 'semibold');
  const finalColor = $derived((color ?? 'surface.text.gray.normal') as TextColors);

  // Validate as prop in development
  $effect(() => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      if (as && !validHeadingAsValues.includes(as)) {
        console.error(
          `[Blade: Heading]: Invalid \`as\` prop value - ${as}. Only ${validHeadingAsValues.join(', ')} are accepted`,
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

  // Merge props: baseTextProps first, then direct props, then rest (styled props)
  // BaseText will handle styled props extraction via getStyledPropsClasses(rest)
  const mergedProps = $derived({
    ...baseTextProps,
    textAlign,
    textDecorationLine,
    textTransform,
    wordBreak,
    ...rest,
  });
</script>

<BaseText {...(mergedProps as unknown as Omit<BaseTextProps, 'children'>)}>
  {#if typeof children === 'string'}
    {children}
  {:else}
    {@render children()}
  {/if}
</BaseText>

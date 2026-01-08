<script lang="ts">
  import BaseText from '../BaseText/BaseText.svelte';
  import type { TextBodyVariant, TextCaptionVariant } from './types';
  import type { BaseTextProps } from '../BaseText/types';
  import type { TextAs } from '@razorpay/blade-core/styles';
  import { getTextProps, validTextAsValues } from '@razorpay/blade-core/styles';

  type TextComponentProps = (TextBodyVariant | TextCaptionVariant) & {
    weight?: 'regular' | 'medium' | 'semibold';
    variant?: 'body' | 'caption';
  };

  let {
    as = 'p' as TextAs,
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

  // Set defaults - use $derived for reactivity when props change
  const finalVariant = $derived((variant ?? 'body') as 'body' | 'caption');
  const finalWeight = $derived(weight ?? 'regular');

  // Validate as prop in development
  $effect(() => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      if (as && !validTextAsValues.includes(as as TextAs)) {
        console.error(
          `[Blade: Text]: Invalid \`as\` prop value - ${String(as)}. Only ${validTextAsValues.join(', ')} are accepted`,
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

<BaseText {...(mergedProps as unknown as Omit<BaseTextProps, 'children'>)}>
  {#if typeof children === 'string'}
    {children}
  {:else}
    {@render children()}
  {/if}
</BaseText>


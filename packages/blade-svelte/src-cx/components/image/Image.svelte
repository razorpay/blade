<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import {
    createImage,
    type ImageSource,
  } from '../../runes/image/image.svelte';
  import { resolveImage, type ImageStyleProps } from './styles';

  type Props = ImageStyleProps & {
    /** A URL, SVG markup, or the promise of either (a lazy asset chunk). */
    src: ImageSource;
    /** Empty for decoration. Its first character is the default stand-in. */
    alt: string;
    /** Stands in when there is no source or it fails; else the initial of `alt`. */
    fallback?: Snippet;
    isPendingShown?: boolean;
    onLoad?: () => void;
    onError?: (error: unknown) => void;
    testID?: string;
    class?: string;
  };

  let {
    src,
    alt,
    fallback,
    isPendingShown = false,
    onLoad,
    onError,
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();

  const classes = $derived(resolveImage(styleProps));
  const image = createImage({
    src: () => src,
    onError: (error) => onError?.(error),
  });

  const initial = $derived(alt.trim().charAt(0).toUpperCase());
</script>

<span class={cx(classes.root, className)} data-testid={testID}>
  {#if image.status === 'ready'}
    <img
      class={classes.img}
      src={image.url}
      {alt}
      onload={() => onLoad?.()}
      onerror={() => image.fail(new Error(`Image failed to load: ${alt}`))}
    />
  {:else if image.status === 'pending'}
    {#if isPendingShown}
      <span class={classes.pending} aria-hidden="true"></span>
    {/if}
  {:else if fallback}
    <span class={classes.fallback}>{@render fallback()}</span>
  {:else if initial}
    <span class={classes.fallback} role="img" aria-label={alt}>{initial}</span>
  {/if}
</span>

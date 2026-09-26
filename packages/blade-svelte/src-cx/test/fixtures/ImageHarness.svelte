<script lang="ts">
  import Image from '../../components/image/Image.svelte';

  interface Props {
    src: string | Promise<string | { default: string }> | undefined;
    alt?: string;
    isPendingShown?: boolean;
    withFallback?: boolean;
    onLoad?: () => void;
    onError?: (error: unknown) => void;
  }

  let {
    src,
    alt = 'HDFC Bank',
    isPendingShown,
    withFallback = false,
    onLoad,
    onError,
  }: Props = $props();
</script>

{#snippet own()}<span data-testid="own">?</span>{/snippet}

<Image
  {src}
  {alt}
  {isPendingShown}
  {onLoad}
  {onError}
  fallback={withFallback ? own : undefined}
  testID="logo"
  class="w-8 h-8"
/>

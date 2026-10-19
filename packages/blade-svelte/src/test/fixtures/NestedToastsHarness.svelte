<script lang="ts">
  import BladeProvider from '../../components/blade-provider/BladeProvider.svelte';
  import type { Toasts } from '../../components/toast/toasts';

  interface Props {
    outerToasts: Toasts;
    /** The inner provider's own queue. */
    innerToasts?: Toasts;
    showInner?: boolean;
  }

  let { outerToasts, innerToasts, showInner = true }: Props = $props();
</script>

<BladeProvider adapters={{ toasts: outerToasts }} testID="outer">
  <div class="relative">
    {#if showInner}
      <BladeProvider
        testID="inner"
        adapters={{ toasts: innerToasts }}
      >
        <p>Embedded</p>
      </BladeProvider>
    {/if}
  </div>
</BladeProvider>

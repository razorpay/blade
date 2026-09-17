<script lang="ts">
  import { onMount } from 'svelte';
  import BottomSheet from '../BottomSheet.svelte';
  import BottomSheetBody from '../BottomSheetBody.svelte';

  let {
    isOpen = false,
  }: {
    isOpen?: boolean;
  } = $props();

  let backdropHost = $state<HTMLDivElement | null>(null);
  let surfaceHost = $state<HTMLDivElement | null>(null);
  let portalTarget = $state<HTMLElement | null>(null);
  let backdropPortalTarget = $state<HTMLElement | null>(null);

  onMount(() => {
    portalTarget = surfaceHost;
    backdropPortalTarget = backdropHost;
  });
</script>

<div
  bind:this={backdropHost}
  data-testid="backdrop-host"
  style="position: relative; width: 400px; height: 400px;"
>
  <div
    bind:this={surfaceHost}
    data-testid="surface-host"
    style="position: relative; z-index: 1; width: 200px; height: 200px; margin-left: auto;"
  >
    {#if portalTarget && backdropPortalTarget}
      <BottomSheet {isOpen} {portalTarget} {backdropPortalTarget}>
        <BottomSheetBody>
          <div data-testid="sheet-content">Sheet content</div>
        </BottomSheetBody>
      </BottomSheet>
    {/if}
  </div>
</div>

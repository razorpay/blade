<script lang="ts">
  import { metaAttribute } from '@razorpay/blade-core/utils';
  import { bottomSheetBackdropClass } from '@razorpay/blade-core/styles';

  let {
    isOpen,
    zIndex,
    isDismissible,
    onClose,
  }: {
    isOpen: boolean;
    zIndex: number;
    isDismissible: boolean;
    onClose: () => void;
  } = $props();

  function handleClick(): void {
    if (isDismissible) {
      onClose();
    }
  }

  const metaAttrs = metaAttribute({ testID: 'bottomsheet-backdrop' });
  const dataState = $derived(isOpen ? 'open' : 'closed');
  const styleVar = $derived(`--bs-z-index:${zIndex}`);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class={bottomSheetBackdropClass}
  style={styleVar}
  data-state={dataState}
  onclick={handleClick}
  {...metaAttrs}
></div>

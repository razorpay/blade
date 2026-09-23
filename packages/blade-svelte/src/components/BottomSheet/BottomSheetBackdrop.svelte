<script lang="ts">
  import { metaAttribute } from '@razorpay/blade-core/utils';
  import { bottomSheetBackdropClass } from '@razorpay/blade-core/styles';
  import { getStyledProps } from '../../utils/getStyledProps';

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
  /* z-index is fed as a --bottom-sheet-backdrop-z-index custom property
   * consumed by the backdrop class in bottomSheet.module.css. */
  const { bottomSheetBackdropStyles } = $derived(
    getStyledProps('bottomSheetBackdrop', { zIndex }),
  );
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class={bottomSheetBackdropClass}
  style={bottomSheetBackdropStyles}
  data-state={dataState}
  onclick={handleClick}
  {...metaAttrs}
></div>

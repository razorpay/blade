<script lang="ts">
  import { metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';
  import { modalBackdropClass } from '@razorpay/blade-core/styles';
  import { getModalContext } from './modalContext';

  const ctx = getModalContext();

  function handleClick(): void {
    if (ctx?.isDismissible) {
      ctx.close();
    }
  }

  const metaAttrs = metaAttribute({
    name: MetaConstants.ModalBackdrop,
    testID: MetaConstants.ModalBackdrop,
  });
  const dataState = $derived(ctx?.isOpen ? 'open' : 'closed');
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class={modalBackdropClass}
  data-state={dataState}
  onclick={handleClick}
  {...metaAttrs}
></div>

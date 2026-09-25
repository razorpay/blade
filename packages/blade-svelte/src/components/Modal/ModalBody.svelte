<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import { getModalBodyClasses } from '@razorpay/blade-core/styles';
  import { getStyledProps } from '../../utils/getStyledProps';
  import type { ModalBodyProps } from './types';

  let {
    children,
    padding = 'spacing.6',
    height,
    testID,
    ...rest
  }: ModalBodyProps = $props();

  const bodyClasses = $derived(getModalBodyClasses({ padding, hasHeight: Boolean(height) }));

  const metaAttrs = metaAttribute({ name: MetaConstants.ModalBody, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  /* Explicit height is fed through a --modal-body-height custom property
   * consumed by the `bodyHasHeight` class — keeps the free-form length string
   * out of a CVA variant while keeping the style attribute vars-only. */
  const { modalBodyStyles } = $derived(getStyledProps('modalBody', { height }));
</script>

<div class={bodyClasses} style={modalBodyStyles} {...metaAttrs} {...analyticsAttrs}>
  {@render children()}
</div>

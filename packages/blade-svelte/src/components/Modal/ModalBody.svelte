<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import { getModalBodyClasses } from '@razorpay/blade-core/styles';
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

  /* Explicit height is fed through a CSS custom property consumed by the
   * `bodyHasHeight` class — keeps the free-form length string out of a CVA
   * variant while avoiding a bare inline style declaration. */
  const bodyStyle = $derived(height ? `--modal-body-height:${height}` : undefined);
</script>

<div class={bodyClasses} style={bodyStyle} {...metaAttrs} {...analyticsAttrs}>
  {@render children()}
</div>

<script lang="ts">
  import { metaAttribute, MetaConstants, makeAccessible } from '@razorpay/blade-core/utils';
  import { dropdownFooterClass, getDropdownTemplateClasses } from '@razorpay/blade-core/styles';
  import { getDropdownContext } from './dropdownContext';
  import type { DropdownFooterProps } from './types';

  // Reference template classes so the build doesn't tree-shake them.
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  void getDropdownTemplateClasses();

  let {
    children,
    testID,
  }: DropdownFooterProps = $props();

  const getCtx = getDropdownContext();
  const ctx = $derived(getCtx());

  // Notify parent dropdown that a footer action exists
  $effect(() => {
    ctx.setHasFooterAction(true);
  });

  const a11y = makeAccessible({ role: 'group' });

  const metaAttrs = metaAttribute({ name: MetaConstants.DropdownFooter, testID });
</script>

<div
  {...a11y}
  {...metaAttrs}
>
  {#if ctx.isOpen}
    <div class={dropdownFooterClass}>
      {@render children()}
    </div>
  {/if}
</div>

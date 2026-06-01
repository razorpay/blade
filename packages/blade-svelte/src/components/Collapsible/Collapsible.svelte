<script lang="ts">
  import { metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';
  import { setCollapsibleContext } from './context';
  import type { CollapsibleProps } from './types';

  // Module-level uid counter — deterministic across SSR + CSR
  let nextCollapsibleUid = 0;

  let {
    children,
    defaultIsExpanded = false,
    isExpanded: controlledIsExpanded,
    onExpandChange,
    isDisabled = false,
    size = 'large',
    testID,
  }: CollapsibleProps = $props();

  nextCollapsibleUid += 1;
  const collapsibleBodyId = `collapsible-body-${nextCollapsibleUid}`;

  let internalIsExpanded = $state<boolean>(defaultIsExpanded);

  const currentIsExpanded = $derived(
    controlledIsExpanded !== undefined ? controlledIsExpanded : internalIsExpanded,
  );

  const toggle = () => {
    if (isDisabled) return;
    const next = !currentIsExpanded;
    if (controlledIsExpanded !== undefined) {
      onExpandChange?.(next);
    } else {
      internalIsExpanded = next;
      onExpandChange?.(next);
    }
  };

  setCollapsibleContext(() => ({
    isExpanded: currentIsExpanded,
    toggle,
    collapsibleBodyId,
    isDisabled,
    size,
  }));

  const metaAttrs = metaAttribute({ name: MetaConstants.Collapsible, testID });
</script>

<div {...metaAttrs}>
  {@render children()}
</div>

<script lang="ts">
  import { cx } from '../../cx';
  import { analyticsAttributes } from '../../runes/dom/analytics';
  import type { OverlayLayout } from '../../runes/layer/overlay';
  import { createOverlay } from '../../runes/modal/overlay.svelte';
  import type { ModalBehaviourProps, ModalClasses } from '../modal/styles';
  import { OVERLAY_GUTTER } from './styles';
  import Surface from './Surface.svelte';

  // What Modal, BottomSheet and Drawer share: the overlay on the layer
  // stack and the surface with its close button. They open from code
  // (`isOpen`), with no trigger: focus returns to what had it. Each
  // resolves its own classes and layout; internal, not exported.
  interface Props extends Omit<ModalBehaviourProps, 'classes'> {
    layout: Exclude<OverlayLayout, 'popover' | 'menu'>;
    classes: ModalClasses;
  }

  let {
    isOpen = $bindable(false),
    layout,
    classes,
    onOpenChange,
    onDismiss,
    onClosed,
    isDismissible = true,
    role = 'dialog',
    children,
    chrome,
    closeLabel = 'Close',
    accessibilityLabel,
    initialFocusRef,
    testID,
    class: className = '',
    ...rest
  }: Props = $props();

  const uid = $props.id();
  const overlay = createOverlay({
    id: uid,
    layout: () => layout,
    isOpen: () => isOpen,
    onValue: (next) => {
      if (next !== isOpen) {
        isOpen = next;
        onOpenChange?.({ isOpen: next });
      }
    },
    onDismiss: (event) => onDismiss?.(event),
    isDismissible: () => isDismissible,
    hasClose: () => isDismissible,
  });
</script>

{#snippet chromeSlot()}
  {@render chrome?.({ close: overlay.close })}
{/snippet}

<Surface
  id={overlay.panelId}
  {isOpen}
  isTop={overlay.dialog.isTop}
  {role}
  labelledBy={overlay.labelledBy}
  describedBy={overlay.describedBy}
  {accessibilityLabel}
  {classes}
  {isDismissible}
  onDismissRequest={overlay.dialog.dismiss}
  {onClosed}
  {initialFocusRef}
  {testID}
  analytics={analyticsAttributes(rest)}
  class={cx(OVERLAY_GUTTER[layout], className)}
  emptyHeader={overlay.hasHeader ? undefined : classes.emptyHeader}
  closeButton={overlay.hasClose
    ? {
        label: closeLabel,
        class: overlay.hasHeader ? classes.close : classes.floatingClose,
        onclick: () => overlay.dialog.dismiss('cross'),
      }
    : undefined}
  chrome={chromeSlot}
>
  {@render children?.({ close: overlay.close })}
</Surface>

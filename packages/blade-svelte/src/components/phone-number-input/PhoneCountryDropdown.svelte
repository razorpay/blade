<script lang="ts">
  import type { Snippet } from 'svelte';
  import { createDialog } from '../../runes/modal/dialog.svelte';
  import FloatingPanel from '../layer/FloatingPanel.svelte';
  import type { FloatingClasses } from '../modal/styles';

  // Blade's dropdown under the phone field (React's DropdownOverlay with the
  // field's frame as its reference): a non-modal panel as wide as the
  // frame, below it. Escape and a press outside the field and the panel
  // dismiss it; focus moves in and returns to the country button.
  interface Props {
    isOpen: boolean;
    id: string;
    /** The field's frame. */
    anchor: HTMLElement;
    classes: FloatingClasses;
    accessibilityLabel: string;
    /** The user dismissed it (Escape, a press outside). */
    onDismiss: () => void;
    testID?: string;
    children: Snippet;
  }

  let { isOpen, id, anchor, classes, accessibilityLabel, onDismiss, testID, children }: Props =
    $props();

  const dialog = createDialog({
    isOpen: () => isOpen,
    onValue: (next) => {
      if (!next) {
        onDismiss();
      }
    },
    isDismissible: () => true,
    isModal: () => false,
  });
</script>

{#if isOpen}
  <FloatingPanel
    {id}
    {anchor}
    matchesAnchorWidth
    placement="bottom-start"
    {classes}
    role="dialog"
    {accessibilityLabel}
    isFocusMoved
    onOutside={() => dialog.dismiss('blur')}
    {testID}
  >
    {@render children()}
  </FloatingPanel>
{/if}

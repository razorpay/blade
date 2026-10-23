import { createDialog } from './dialog.svelte';
import type { Dialog, DialogDismissEvent } from './dialog.svelte';
import { createHeaderRegistry } from '../base/header-registry.svelte';
import { createTrigger } from '../dom/trigger.svelte';
import type { Trigger } from '../dom/trigger.svelte';
import { provideOverlay } from '../layer/overlay';
import type { OverlayLayout } from '../layer/overlay';

export interface OverlayOptions {
  /** A unique id (`$props.id()`): the panel's and the header's ids derive from it. */
  id: string;
  /** Which overlay this is, for the content inside it (`getOverlay().layout`). */
  layout: () => OverlayLayout;
  isOpen: () => boolean;
  /** The bindable write. */
  onValue: (isOpen: boolean) => void;
  onDismiss?: (event: DialogDismissEvent) => void;
  isDismissible: () => boolean;
  /** The trigger does not open it. */
  isDisabled?: () => boolean;
  /** Whether the overlay shows a close button (a header leaves room for it). */
  hasClose: () => boolean;
}

export interface Overlay {
  readonly dialog: Dialog;
  readonly panelId: string;
  /** A floating panel by its trigger (popover, menu), not a surface on the layer stack. */
  readonly isAnchored: boolean;
  /** A header is composed into the content. */
  readonly hasHeader: boolean;
  /** The composed header's title id, which names the panel. */
  readonly labelledBy: string | undefined;
  /** The composed header's subtitle id, which describes the panel. */
  readonly describedBy: string | undefined;
  readonly hasClose: boolean;
  /** The trigger's wrapper and the aria state stamped on its control. */
  readonly trigger: Trigger;
  /** Closes without a dismissal. */
  close(): void;
  /** On the trigger's wrapper: toggles the overlay. */
  handleTriggerClick(event: MouseEvent): void;
  /** On the trigger's wrapper: the arrows open a closed menu, as Blade. */
  handleTriggerKeyDown(event: KeyboardEvent): void;
}

/**
 * What every overlay (Modal, BottomSheet, Drawer, Popover, Menu) shares: the
 * dialog model on the layer stack, the registry its composed header joins,
 * the trigger's wiring, and the overlay context its content reads. Each
 * component renders its own panel over it. Call during component
 * initialisation.
 */
export function createOverlay(options: OverlayOptions): Overlay {
  const headers = createHeaderRegistry(options.id);
  const panelId = `${options.id}-panel`;
  const isAnchored = $derived(options.layout() === 'popover' || options.layout() === 'menu');
  const isMenu = $derived(options.layout() === 'menu');

  const dialog = createDialog({
    isOpen: options.isOpen,
    onValue: options.onValue,
    onDismiss: (event) => options.onDismiss?.(event),
    isDismissible: options.isDismissible,
    isModal: () => !isAnchored,
  });

  const trigger = createTrigger({
    controls: panelId,
    popup: panelId,
    isExpanded: options.isOpen,
    haspopup: 'dialog',
  });

  const close = (): void => dialog.close();

  provideOverlay({
    get layout() {
      return options.layout();
    },
    get isAnchored() {
      return isAnchored;
    },
    panelId,
    close,
    get hasClose() {
      return options.hasClose();
    },
    header: headers,
  });

  return {
    dialog,
    panelId,
    get isAnchored() {
      return isAnchored;
    },
    get hasHeader() {
      return headers.hasHeader;
    },
    get labelledBy() {
      return headers.hasTitle ? headers.titleId : undefined;
    },
    get describedBy() {
      return headers.hasSubtitle ? headers.subtitleId : undefined;
    },
    get hasClose() {
      return options.hasClose();
    },
    trigger,
    close,
    handleTriggerClick(event) {
      // A press inside the panel is not the trigger's.
      if (options.isDisabled?.() || trigger.isInside(event)) {
        return;
      }
      if (options.isOpen()) {
        close();
      } else {
        options.onValue(true);
      }
    },
    handleTriggerKeyDown(event) {
      if (
        !options.isOpen() &&
        !options.isDisabled?.() &&
        isMenu &&
        event.target === trigger.control() &&
        (event.key === 'ArrowDown' || event.key === 'ArrowUp')
      ) {
        event.preventDefault();
        options.onValue(true);
      }
    },
  };
}

import { untrack } from 'svelte';
import { getAdapters } from '../../adapters';
import type { BackAnswer } from '../base/back';
import { createDisclosure } from '../base/disclosure';
import { getLayers } from '../layer/layers';
import type { LayerEntry } from '../layer/layers';

/** What asked the dialog to go: the user, through one of its surfaces. */
export type DialogDismissSource = 'cross' | 'blur' | 'escape' | 'drag' | 'back';

/** What closed it: a dismissal, or the owner's own `close()`. */
export type DialogCloseSource = DialogDismissSource | 'programmatic';

/**
 * A dismissal, as the owner hears it. `close` ends it — needed only when
 * the dialog is not dismissible; a dismissible one closes on its own once
 * the handler returns.
 */
export interface DialogDismissEvent {
  source: DialogDismissSource;
  close: () => void;
}

export interface DialogModelOptions {
  /**
   * Whether a dismissal closes it once `onDismiss` has run. When not, it
   * stays open until `close` is called. Default true.
   */
  isDismissible?: () => boolean;
  /** Fires on every dismissal, whether or not it will close. */
  onDismiss?: (event: DialogDismissEvent) => void;
  /** Fires once per close, with what closed it. */
  onClose?: (source: DialogCloseSource) => void;
  hooks?: {
    onCloseLogged?: (source: DialogCloseSource) => void;
  };
}

export interface DialogModel {
  /** Tracked by whatever reads it. */
  isOpen(): boolean;
  /** The owner closes it: always closes, no `onDismiss`. */
  close(source?: DialogCloseSource): void;
  /**
   * The user asks it to go (the close button, backdrop, Escape, a drag,
   * back): `onDismiss` runs, then a dismissible dialog closes. Returns
   * whether it closed.
   */
  dismiss(source: DialogDismissSource): boolean;
  /**
   * Back pressed while this dialog is on top: a dismissal. Always decides
   * while open (true = handled here, nothing beneath may pop); a closed
   * dialog defers. See `BackAnswer` for how this composes with a layer stack.
   */
  back(): BackAnswer;
}

/**
 * The dialog decision core: a disclosure born open, over the dialog's
 * close-source vocabulary — its dismissal contract with the owner is the
 * disclosure's. Everything platform-bound — the backdrop, Escape listening,
 * focus, transitions, the stack entry it lives in — belongs to the rune
 * below, which drops the layer when `isOpen()` goes false.
 */
export function createDialogModel(options: DialogModelOptions = {}): DialogModel {
  const disclosure = createDisclosure<DialogCloseSource>({
    defaultOpen: true,
    dismissible: options.isDismissible,
    // Only dismissals reach here, and the event carries their source.
    onDismiss: (event) => options.onDismiss?.(event as DialogDismissEvent),
    onOpenChange: (open, source) => {
      if (!open) {
        options.hooks?.onCloseLogged?.(source);
        options.onClose?.(source);
      }
    },
  });

  return {
    isOpen: disclosure.isOpen,
    close: (from = 'programmatic') => disclosure.close(from),
    dismiss: disclosure.dismiss,
    back: disclosure.back,
  };
}

export interface DialogOptions {
  isOpen: () => boolean;
  /** The bindable write: the model closed itself. */
  onValue: (isOpen: boolean) => void;
  /** Fires on every dismissal; see `DialogDismissEvent`. */
  onDismiss?: (event: DialogDismissEvent) => void;
  isDismissible: () => boolean;
}

export interface Dialog {
  /** Lower layers go inert so only the top surface takes focus and input. */
  readonly isTop: boolean;
  /** A dismissal from the surface or its close button; the model decides. */
  dismiss(source: DialogDismissSource): void;
  /** The owner's own close: no `onDismiss`. */
  close(): void;
}

/**
 * A modal's life on the layer stack: one dialog model per open cycle, the
 * layer it occupies while open, and whether it is the top one. Call during
 * component initialisation.
 */
export function createDialog(options: DialogOptions): Dialog {
  const adapters = getAdapters();
  const layers = getLayers();

  let model: DialogModel | undefined;

  // The layer this modal occupies while open.
  const entry: LayerEntry = {
    dismiss: (source) => model?.dismiss(source) ?? false,
    back: () => model?.back(),
  };
  const isTop = $derived(layers.isTop(entry));

  // One model per open cycle — the modal model is born open. A close the
  // host makes (`isOpen = false`) just drops it: `onDismiss` reports only
  // what the user asked for.
  function open(): () => void {
    model = createDialogModel({
      isDismissible: options.isDismissible,
      onDismiss: (event) => options.onDismiss?.(event),
      onClose: () => options.onValue(false),
      hooks: {
        onCloseLogged: (source) => adapters.track?.('modal_close', { source }),
      },
    });
    const remove = layers.push(entry);
    return () => {
      remove();
      model = undefined;
    };
  }

  $effect(() => {
    if (!options.isOpen()) {
      return undefined;
    }
    return untrack(open);
  });

  return {
    get isTop() {
      return isTop;
    },
    dismiss(source) {
      model?.dismiss(source);
    },
    close() {
      model?.close();
    },
  };
}

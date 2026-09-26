import { untrack } from 'svelte';
import { getAdapters } from '../../adapters';
import type { BackAnswer } from '../base/back';
import { createDisclosure } from '../base/disclosure';
import { getLayers, type LayerEntry } from '../layer/layers';

export type DialogCloseSource =
  | 'cross'
  | 'blur'
  | 'escape'
  | 'drag'
  | 'back'
  | 'programmatic';

export interface DialogModelOptions {
  /** Whether backdrop, Escape and back may close it. Default true. */
  allowDismiss?: () => boolean;
  /**
   * The wrapped content may own back itself. `true` = it handled back,
   * nothing closes; `false` = it explicitly cedes, the dialog closes even
   * when non-dismissable (a non-dismissable flow must still be exitable
   * once its content says so); `undefined` = no opinion, `allowDismiss`
   * rules.
   */
  preventBack?: () => BackAnswer;
  /** Fires once per close, with what closed it. */
  onClose?: (source: DialogCloseSource) => void;
  hooks?: {
    onCloseLogged?: (source: DialogCloseSource) => void;
  };
}

export interface DialogModel {
  /** Tracked by whatever reads it. */
  isOpen(): boolean;
  /** Cross button / programmatic: always closes. */
  close(source?: 'cross' | 'programmatic'): void;
  /** A dismiss request (backdrop, Escape, a sheet dragged down): closes only when dismissable. Returns whether it closed. */
  dismiss(source?: 'blur' | 'escape' | 'drag'): boolean;
  /**
   * Back pressed while this dialog is on top. Always decides while open
   * (true = handled here, nothing beneath may pop); a closed dialog defers.
   * See `BackAnswer` for how this composes with a layer stack.
   */
  back(): BackAnswer;
}

/**
 * The dialog decision core: a disclosure born open, a close-source
 * vocabulary, and the back contract with its own content. Everything
 * platform-bound — the backdrop, Escape listening, focus, transitions, the
 * stack entry it lives in — belongs to the rune below, which drops the
 * layer when `isOpen()` goes false.
 */
export function createDialogModel(
  options: DialogModelOptions = {}
): DialogModel {
  const allowDismiss = (): boolean => options.allowDismiss?.() ?? true;
  let source: DialogCloseSource = 'programmatic';
  const disclosure = createDisclosure({
    defaultOpen: true,
    dismissible: options.allowDismiss,
    onOpenChange: (open) => {
      if (!open) {
        options.hooks?.onCloseLogged?.(source);
        options.onClose?.(source);
      }
    },
  });

  function shut(from: DialogCloseSource): void {
    source = from;
    disclosure.close();
  }

  return {
    isOpen: disclosure.isOpen,
    close(from = 'programmatic') {
      shut(from);
    },
    dismiss(from = 'blur') {
      if (!disclosure.isOpen() || !allowDismiss()) {
        return false;
      }
      shut(from);
      return true;
    },
    back() {
      if (!disclosure.isOpen()) {
        return undefined;
      }
      const owned = options.preventBack?.();
      if (owned === true) {
        return true;
      }
      if (owned === false || allowDismiss()) {
        shut('back');
        return true;
      }
      // Non-dismissable and unowned: an open surface still swallows back.
      return true;
    },
  };
}

export interface DialogOptions {
  isOpen: () => boolean;
  /** The bindable write: the model closed itself. */
  onValue: (isOpen: boolean) => void;
  /** Fires once per close the modal decided itself, with what closed it. */
  onDismiss?: (source: DialogCloseSource) => void;
  isDismissible: () => boolean;
  onBack?: () => BackAnswer;
}

export interface Dialog {
  /** Lower layers go inert so only the top surface takes focus and input. */
  readonly isTop: boolean;
  /** A dismiss request from the surface; the model decides. */
  dismiss(source: 'blur' | 'drag' | 'escape'): void;
  close(source?: 'cross' | 'programmatic'): void;
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
  // closes the modal decided.
  function open(): () => void {
    model = createDialogModel({
      allowDismiss: options.isDismissible,
      preventBack: () => options.onBack?.(),
      onClose: (source) => {
        options.onValue(false);
        options.onDismiss?.(source);
      },
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
    close(source = 'programmatic') {
      model?.close(source);
    },
  };
}

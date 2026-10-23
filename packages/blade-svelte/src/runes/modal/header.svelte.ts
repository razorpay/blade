import type { Attachment } from 'svelte/attachments';
import { getDragZone } from '../layer/drag-zone';
import { getOverlay } from '../layer/overlay';

export interface ModalHeaderOptions {
  /** The header draws anything: else it is no header, and registers nothing. */
  hasContent: () => boolean;
  hasTitle: () => boolean;
  hasSubtitle: () => boolean;
}

export interface ModalHeaderWiring {
  /** The id the title takes, so the overlay is named by it. */
  readonly titleId: string | undefined;
  /** The id the subtitle takes, so the overlay is described by it. */
  readonly subtitleId: string | undefined;
  /** The overlay's close button shows: the row leaves room for it. */
  readonly hasClose: boolean;
  /**
   * The surface drags by its header (a sheet, a draggable drawer): put
   * `className` on the header's root and attach `attach` to it.
   */
  readonly dragZone: { className: string; attach: Attachment<HTMLElement> } | undefined;
  /**
   * The sheet draws its handle strip above the header. Undefined outside an
   * overlay.
   */
  readonly hasHandle: boolean | undefined;
  /** Closes the overlay without a dismissal. */
  close(): void;
}

/**
 * What a header composed into an overlay needs from it — ModalHeader,
 * BottomSheetHeader and DrawerHeader use it, and so does a header a
 * consumer builds from their classes. It registers the header, so the
 * overlay is labelled by its title and drops its empty header. Outside an
 * overlay it wires nothing. Call during component initialisation.
 */
export function useModalHeader(options: ModalHeaderOptions): ModalHeaderWiring {
  const overlay = getOverlay();
  const zone = getDragZone();
  $effect.pre(() => {
    if (!overlay?.header || !options.hasContent()) {
      return undefined;
    }
    return overlay.header.add({ title: options.hasTitle(), subtitle: options.hasSubtitle() });
  });
  return {
    get titleId() {
      return overlay?.header?.titleId;
    },
    get subtitleId() {
      return overlay?.header?.subtitleId;
    },
    get hasClose() {
      return Boolean(overlay?.hasClose);
    },
    get dragZone() {
      return zone?.isEnabled ? { className: zone.className, attach: zone.attach } : undefined;
    },
    get hasHandle() {
      return overlay ? Boolean(zone?.isEnabled) : undefined;
    },
    close() {
      overlay?.close();
    },
  };
}

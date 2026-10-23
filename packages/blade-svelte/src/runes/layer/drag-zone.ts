import type { Attachment } from 'svelte/attachments';
import { defineContext } from '../context';

/**
 * Where a draggable surface takes its drag besides its handle strip: the
 * header. A header composed into the surface's content (BottomSheetHeader,
 * DrawerHeader, or one built from their classes) attaches it to its root.
 */
export interface DragZone {
  /** The surface drags (a sheet down, a drawer toward its edge). */
  readonly isEnabled: boolean;
  /** The zone's classes: no scroll, no pull-to-refresh, the grab cursor. */
  readonly className: string;
  /** The pointer handlers that drag the surface. */
  readonly attach: Attachment<HTMLElement>;
}

const DRAG_ZONE = defineContext<DragZone>('blade-drag-zone');

/** Called by a surface; its content reads it. */
export function provideDragZone(zone: DragZone): void {
  DRAG_ZONE.set(zone);
}

export function getDragZone(): DragZone | undefined {
  return DRAG_ZONE.get();
}

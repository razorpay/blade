import {
  createOverlays,
  getOverlays as getProvidedOverlays,
  provideOverlays as provide,
  type ModalComponent,
  type ModalContent as ModalContentOf,
  type ModalHandle,
  type OpenModalOptions as OpenModalOptionsOf,
  type Overlays as OverlaysOf,
} from '../../runes/modal/overlays.svelte';
import type { BottomSheetStyleProps } from '../bottom-sheet/styles';
import type { ModalLookProp, ModalStyleProps } from './styles';

// The overlay stack bound to this library's Modal: its style props, its
// look and what the sheet look reads for itself (`adaptive`; its desktop
// `placement` rides the modal's own axis) are what `openModal` accepts
// beside the behaviour options. A type only: a plain modal still bundles
// no sheet.
type ModalStyle = ModalStyleProps &
  Pick<BottomSheetStyleProps, 'adaptive'> &
  ModalLookProp;
export type OpenModalOptions<P> = OpenModalOptionsOf<P, ModalStyle>;
export type ModalContent = ModalContentOf<ModalStyle>;
export type Overlays = OverlaysOf<ModalStyle>;
export type {
  ModalComponent,
  ModalControl,
  ModalHandle,
} from '../../runes/modal/overlays.svelte';

/** One stack for the page; an embedded surface provides its own. */
export const globalOverlays: Overlays = createOverlays<ModalStyle>();

/** Call during component init; descendants and their ModalStack share it. */
export function provideOverlays(): Overlays {
  return provide(createOverlays<ModalStyle>());
}

export function getOverlays(): Overlays {
  return getProvidedOverlays(globalOverlays);
}

/**
 * Opens a modal from anywhere — a flow in a `.ts` file as much as a
 * component — on the page's stack. It needs a mounted `ModalStack`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- a component's props are its own
export function openModal<P extends Record<string, any>, R = unknown>(
  component: ModalComponent<P>,
  options?: OpenModalOptions<P>
): ModalHandle<P, R> {
  return globalOverlays.openModal<P, R>(component, options);
}

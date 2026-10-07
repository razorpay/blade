import {
  createOverlays,
  getOverlays as getProvidedOverlays,
  provideOverlays as provide,
} from '../../runes/modal/overlays.svelte';
import type {
  ModalComponent,
  ModalContent as ModalContentOf,
  ModalHandle,
  OpenModalOptions as OpenModalOptionsOf,
  Overlays as OverlaysOf,
} from '../../runes/modal/overlays.svelte';
import type { ModalStyleProps } from './styles';

// The overlay stack bound to this library's Modal: its style props
// (`variant` included) are what `openModal` accepts beside the behaviour
// options.
type ModalStyle = ModalStyleProps;
export type OpenModalOptions<P> = OpenModalOptionsOf<P, ModalStyle>;
export type ModalContent = ModalContentOf<ModalStyle>;
export type Overlays = OverlaysOf<ModalStyle>;
export type { ModalComponent, ModalControl, ModalHandle } from '../../runes/modal/overlays.svelte';

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
  options?: OpenModalOptions<P>,
): ModalHandle<P, R> {
  return globalOverlays.openModal<P, R>(component, options);
}

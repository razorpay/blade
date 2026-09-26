/**
 * Tri-state answer to a back press:
 * - `true` — handled here; nothing else may act on it.
 * - `false` — not handled; the next handler (ultimately the platform) acts.
 * - `undefined` — no opinion; the asking side applies its own default.
 *
 * Composition rule — a dismissable surface pushed onto a layer stack runs
 * both protocols: the stack answers first (`LayerStack.back` →
 * `BackPolicy.onTop`), and `onTop` asks the top layer's own model — for a
 * dialog, `DisclosureModel.back()`. An open disclosure always decides
 * (dismissable closes and handles it; non-dismissable swallows it); only a
 * closed disclosure defers, letting the stack pop the layer beneath.
 */
export type BackAnswer = boolean | undefined;

/**
 * Tri-state answer to a back press:
 * - `true` — handled here; nothing else may act on it.
 * - `false` — not handled; the next handler (ultimately the platform) acts.
 * - `undefined` — no opinion; the asking side applies its own default.
 *
 * Composition rule — the layers (`Layers.back`) ask the top modal layer's
 * own model first — for a dialog, `DisclosureModel.back()`. An open
 * disclosure always decides (dismissable closes and handles it;
 * non-dismissable swallows it); only a closed disclosure defers, letting
 * the app's own back (its navigation) act.
 */
export type BackAnswer = boolean | undefined;

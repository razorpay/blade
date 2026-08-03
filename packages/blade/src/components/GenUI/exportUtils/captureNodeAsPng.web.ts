/**
 * Captures a DOM node as a PNG `Blob`.
 *
 * `html-to-image` is loaded with a dynamic `import()` so it is code-split into a
 * separate async chunk — consumers that never trigger a download don't pay for
 * it in their initial bundle.
 */
const captureNodeAsPng = async (node: HTMLElement): Promise<Blob> => {
  // Wait for web fonts to finish loading so the capture uses the real fonts
  // (not fallbacks shown mid-load) — a prerequisite for matching the screen.
  if (typeof document !== 'undefined' && document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // Non-fatal: proceed with whatever fonts are available.
    }
  }
  const { toBlob } = await import('html-to-image');

  // `pixelRatio: 2` for a crisp (retina) export. Font embedding stays ON so the
  // PNG matches on-screen text exactly — it succeeds when the font stylesheet is
  // readable (same-origin, or served with CORS on a `<link crossorigin>`);
  // browsers block reading cross-origin stylesheet rules, in which case
  // html-to-image logs a non-fatal warning and falls back.
  const blob = await toBlob(node, { pixelRatio: 2, cacheBust: true });

  if (!blob) {
    throw new Error('[GenUI]: Failed to capture node as PNG');
  }

  return blob;
};

export { captureNodeAsPng };

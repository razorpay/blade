/**
 * Wraps ResizeObserver with a guard so callers degrade gracefully instead of
 * throwing in environments where ResizeObserver is unavailable (SSR, old
 * WebViews). Returns a cleanup function, or undefined if unsupported.
 */
export function observeResize(
  nodes: Element | Element[],
  callback: ResizeObserverCallback,
): (() => void) | undefined {
  if (typeof ResizeObserver === 'undefined') return undefined;
  const observer = new ResizeObserver(callback);
  const targets = Array.isArray(nodes) ? nodes : [nodes];
  targets.forEach((n) => observer.observe(n));
  return () => observer.disconnect();
}

import type { Attachment } from 'svelte/attachments';

/**
 * On a clamped text: carries its full text as `title` while it is cut off,
 * and none while it fits, re-checked as it resizes — Blade's
 * `useTruncationTitle`. The box it overflows is its parent.
 */
export const titleWhenTruncated: Attachment<HTMLElement> = (node) => {
  const check = (): void => {
    const box = node.parentElement ?? node;
    const isCut = node.scrollHeight > box.clientHeight || node.scrollWidth > box.clientWidth;
    if (isCut) {
      node.title = node.textContent?.trim() ?? '';
    } else {
      node.removeAttribute('title');
    }
  };
  check();
  if (typeof ResizeObserver !== 'function') {
    return undefined;
  }
  const observer = new ResizeObserver(check);
  observer.observe(node);
  return () => observer.disconnect();
};

import type { Attachment } from 'svelte/attachments';

/**
 * Keeps `node.checked` at `checked()`. A pick the browser already applied
 * and the model refused, and a sibling the browser unchecked for it, are
 * written back; Svelte's `checked={}` does not re-set an unchanged value.
 * Re-runs whenever `checked()` reads something that changed.
 */
export function syncChecked(
  checked: () => boolean
): Attachment<HTMLInputElement> {
  return (node) => {
    const next = checked();
    if (node.checked !== next) {
      node.checked = next;
    }
  };
}

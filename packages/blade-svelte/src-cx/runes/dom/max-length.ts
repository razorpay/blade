import type { Attachment } from 'svelte/attachments';

/**
 * Writes the character cap under the camelCase name native's attribute
 * allowlist reads. Svelte lowercases attribute names on HTML elements,
 * which native drops; on web the two spellings are one attribute.
 */
export function maxLength(getMax: () => number | undefined): Attachment<Element> {
  return (node) => {
    const max = getMax();
    if (max === undefined) {
      node.removeAttribute('maxLength');
    } else {
      node.setAttribute('maxLength', String(max));
    }
  };
}

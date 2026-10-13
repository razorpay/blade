import type { Attachment } from 'svelte/attachments';

export interface NodeRef<T extends Element> {
  /** The node while it is mounted; reactive. */
  readonly current: T | undefined;
  /** Put it on the node with `{@attach}`. */
  readonly attach: Attachment<T>;
}

/**
 * A rune's handle on the element it binds: what `bind:this` was, as an
 * attachment the component places, so the rune owns the reference.
 */
export function createNodeRef<T extends Element>(): NodeRef<T> {
  let current = $state.raw<T>();
  return {
    get current() {
      return current;
    },
    attach(node) {
      current = node;
      return () => {
        current = undefined;
      };
    },
  };
}

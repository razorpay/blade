/**
 * Svelte action that moves a node into a target element (defaults to
 * `document.body`) for the lifetime of the action, then restores it on destroy.
 *
 * Used by `Tooltip` to escape stacking-context / overflow boundaries set by
 * arbitrary ancestors of the trigger.
 *
 * @example
 * ```svelte
 * <div use:portal={document.body}>I now live in body</div>
 * ```
 */
export type PortalTarget = HTMLElement | string;

export type PortalActionReturn = {
  update?: (target: PortalTarget) => void;
  destroy: () => void;
};

const resolveTarget = (target: PortalTarget): HTMLElement => {
  if (typeof target === 'string') {
    const el = document.querySelector(target);
    if (!(el instanceof HTMLElement)) {
      throw new Error(`portal: target "${target}" did not resolve to an HTMLElement`);
    }
    return el;
  }
  return target;
};

export function portal(
  node: HTMLElement,
  target: PortalTarget = document.body,
): PortalActionReturn {
  let resolved = resolveTarget(target);
  resolved.appendChild(node);

  return {
    update(next: PortalTarget) {
      resolved = resolveTarget(next);
      resolved.appendChild(node);
    },
    destroy() {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    },
  };
}

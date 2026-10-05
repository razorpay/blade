/** The parts of a click that decide whether it is a plain navigation. */
export interface LinkClick {
  button: number;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  defaultPrevented: boolean;
}

/**
 * Whether a router may take this click over. Anything the browser treats
 * specially stays the browser's: a modified or non-primary click (new tab,
 * download, context menu), a `target` other than the current context, a
 * handler that already prevented it, and a link that leaves the app.
 */
export function isRoutableClick(
  click: LinkClick,
  link: { href?: string; target?: string },
): boolean {
  if (click.defaultPrevented || click.button !== 0) {
    return false;
  }
  if (click.metaKey || click.ctrlKey || click.shiftKey || click.altKey) {
    return false;
  }
  if (link.target && link.target !== '_self') {
    return false;
  }
  return isInternalHref(link.href);
}

/** A path, query or hash inside the app; never a scheme or `//host`. */
export function isInternalHref(href: string | undefined): boolean {
  if (!href || href.startsWith('//')) {
    return false;
  }
  return !/^[a-z][a-z0-9+.-]*:/i.test(href);
}

/**
 * `rel` for an anchor: a new browsing context must not reach its opener.
 * The caller's tokens are kept.
 */
export function linkRel(target: string | undefined, rel: string | undefined): string | undefined {
  if (target !== '_blank') {
    return rel;
  }
  const tokens = new Set((rel ?? '').split(/\s+/).filter(Boolean));
  tokens.add('noopener');
  tokens.add('noreferrer');
  return [...tokens].join(' ');
}

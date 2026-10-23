import { getAdapters } from '../../adapters';

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

export interface LinkTarget {
  href?: string;
  target?: string;
  rel?: string;
  download?: string | boolean;
  isDisabled?: boolean;
}

export interface LinkBehavior {
  /** The anchor's `rel`: the caller's, plus `noopener noreferrer` for `_blank`. */
  readonly rel: string | undefined;
  /**
   * The anchor's click: cancelled when disabled; otherwise `onClick` runs,
   * then `adapters.navigate` may take a plain click on an internal href.
   */
  click(event: MouseEvent, onClick?: (event: MouseEvent) => void): void;
}

/**
 * What every `href` renderer (Link, a link Button, a link row or tab, Card,
 * Avatar, Breadcrumb) does with its anchor, so all of them reach the app's
 * router the same way. Call during component init: it reads the adapters.
 */
export function createLink(read: () => LinkTarget): LinkBehavior {
  const adapters = getAdapters();
  return {
    get rel() {
      const link = read();
      return link.href === undefined ? link.rel : linkRel(link.target, link.rel);
    },
    click(event, onClick) {
      const link = read();
      if (link.isDisabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
      if (
        link.href !== undefined &&
        adapters.navigate &&
        link.download === undefined &&
        isRoutableClick(event, link) &&
        adapters.navigate(link.href, event)
      ) {
        event.preventDefault();
      }
    },
  };
}

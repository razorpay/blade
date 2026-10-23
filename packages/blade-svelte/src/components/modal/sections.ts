import type { Snippet } from 'svelte';
import type { IconSource } from '../../runes/icon/source';

/**
 * The content of an overlay that takes it as props and snippets — Popover,
 * Menu — drawn by the internal OverlaySections in their look. Modal, BottomSheet and Drawer compose
 * their parts instead.
 */
export interface OverlaySectionsProps {
  /** The overlay's name, first in the header: a string or a snippet. */
  title?: string | Snippet;
  /** One muted line under the title; it describes the overlay. */
  subtitle?: string;
  /**
   * Before the title, 8px from it: an icon (`IconSource`), drawn as a
   * glyph on the title's first line, or a snippet with an asset or an
   * avatar.
   */
  leading?: IconSource | Snippet;
  /** Beside the title, 8px from it: a Counter or a Badge. */
  titleSuffix?: Snippet;
  /** After the title block, 16px clear of it and of the close button. */
  trailing?: Snippet<[{ close: () => void }]>;
  /**
   * The header's title block, around the drawn title and subtitle: it
   * receives them as snippets and places them with anything else.
   */
  header?: Snippet<[{ title: Snippet; subtitle: Snippet; close: () => void }]>;
  /** Content in the layout's padded, scrolling body. Ignored with `children`. */
  body?: Snippet<[{ close: () => void }]>;
  /** The layout's footer: the caller lays out the actions. */
  footer?: Snippet<[{ close: () => void }]>;
  /** Raw content: no container, no padding — the content owns its box. */
  children?: Snippet<[{ close: () => void }]>;
  /**
   * A back button first in the header: a step back, not a dismissal.
   * @default false
   */
  showBackButton?: boolean;
  onBackButtonClick?: (event: { close: () => void }) => void;
  /** @default 'Back' */
  backLabel?: string;
  /**
   * `default`: `body` is padded and scrolls; `none`: a bare column its
   * content fills, edge to edge.
   * @default 'default'
   */
  padding?: 'default' | 'none';
}

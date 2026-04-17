import type React from 'react';

type LightBoxProps = {
  /**
   * Controls whether the LightBox overlay is visible.
   */
  isOpen: boolean;

  /**
   * Called when the user dismisses the LightBox — via the close button, Escape key, or backdrop click.
   */
  onDismiss: () => void;

  /**
   * Index of the currently active item (controlled).
   * Use alongside `onIndexChange` to manage state externally.
   */
  activeIndex?: number;

  /**
   * Index of the item to show when LightBox first opens (uncontrolled).
   * @default 0
   */
  defaultActiveIndex?: number;

  /**
   * Called when the active item changes via navigation arrows, thumbnail click, or keyboard.
   */
  onIndexChange?: (value: { index: number }) => void;

  /**
   * Accessibility label for the LightBox dialog.
   * @default "Media viewer"
   */
  accessibilityLabel?: string;

  /**
   * Accepts only `LightBoxBody`.
   */
  children: React.ReactNode;
};

type LightBoxBodyProps = {
  /**
   * Accepts only `LightBoxItem` components.
   */
  children: React.ReactNode;
};

type LightBoxItemProps =
  | {
      /**
       * Image URL. LightBox renders an `<img>` element using this src.
       * The same URL is used for the thumbnail strip unless `thumbnail` is provided.
       */
      src: string;

      /**
       * Alt text for the image.
       */
      alt?: string;

      /**
       * Optional thumbnail image URL override. Defaults to `src`.
       */
      thumbnail?: string;

      children?: never;
    }
  | {
      /**
       * Thumbnail image URL for the thumbnail strip.
       * Required when `children` is provided.
       */
      thumbnail: string;

      /**
       * Accessible label for the thumbnail in the strip.
       */
      alt?: string;

      /**
       * Custom content to render as the main slide — video, iframe, Preview component, etc.
       */
      children: React.ReactNode;

      src?: never;
    };

export type { LightBoxProps, LightBoxBodyProps, LightBoxItemProps };

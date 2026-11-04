/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from 'react';
import type { IconComponent } from '~components/Icons';
import type { FeedbackColors } from '~tokens/theme/theme';

type ToastActionCommon = {
  text: string;
  /**
   * Icon of the action
   *
   * @platform web
   */
  icon?: IconComponent;
  /**
   * Position of the icon
   *
   * @platform web
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';
};

type ToastButtonAction = ToastActionCommon & {
  /**
   * Renders the action as a `Button` or as a `Link`
   *
   * @platform web
   * @default 'button'
   */
  variant?: 'button';
  onClick?: ({
    event,
    toastId,
  }: {
    event: React.MouseEvent<HTMLButtonElement>;
    toastId: string;
  }) => void;
  isLoading?: boolean;
  href?: undefined;
  target?: undefined;
  rel?: undefined;
};

type ToastLinkAction = ToastActionCommon & {
  /**
   * Renders the action as a `Button` or as a `Link`
   *
   * @platform web
   * @default 'button'
   */
  variant: 'link';
  /**
   * With `href`, the event comes from an anchor element. Without `href`, it comes from a button element.
   */
  onClick?: ({
    event,
    toastId,
  }: {
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>;
    toastId: string;
  }) => void;
  isLoading?: undefined;
  /**
   * URL of the link. Without `href`, the link renders as a button element.
   *
   * @platform web
   */
  href?: string;
  /**
   * @platform web
   */
  target?: string;
  /**
   * When `target` is `_blank`, `Link` sets this to `noreferrer noopener`
   *
   * @platform web
   */
  rel?: string;
};

type ToastProps = {
  /**
   * @default `informational`
   */
  type?: 'informational' | 'promotional';

  /**
   * Content of the toast
   */
  content: React.ReactNode;

  /**
   * @default `neutral`
   */
  color?: FeedbackColors;

  /**
   * Can be used to render an icon
   */
  leading?: React.ComponentType<any>;

  /**
   * If true, the toast will be dismissed after few seconds
   *
   * Duration for promotional toast is 8s
   * Duration for informational toast is 4s
   *
   * @default false
   */
  autoDismiss?: boolean;

  /**
   * Duration in milliseconds for which the toast will be visible
   *
   * On web, a promotional toast pauses this timer while the pointer is over it or focus is inside it.
   * Blade runs the timer of a promotional toast with `autoDismiss`, so `useToast().toasts` shows `duration: Infinity` for it.
   *
   * @default 4000 for informational toast
   * @default 8000 for promotional toast
   */
  duration?: number;

  /**
   * Called when the toast is dismissed or duration runs out
   */
  onDismissButtonClick?: ({
    event,
    toastId,
  }: {
    event: React.MouseEvent<HTMLButtonElement>;
    toastId: string;
  }) => void;

  /**
   * Look of a promotional toast.
   *
   * `glass` uses a lighter backdrop blur, a thinner border and a larger corner radius.
   * It scales in and out from its centre instead of sliding.
   *
   * Works only on promotional toasts. Informational toasts ignore it.
   *
   * @platform web
   * @default 'default'
   */
  variant?: 'default' | 'glass';

  /**
   * Time in milliseconds of the intro motion that `content` plays. Blade does not animate the content.
   *
   * Works only on promotional toasts. Blade holds the action and the progress bar until the intro
   * ends, then fades them in.
   * With `autoDismiss`, the timer and the progress bar also start after the intro.
   *
   * @platform web
   * @default 0
   */
  introDuration?: number;

  /**
   * Shows a progress bar on the bottom edge of the toast for the time left before it dismisses.
   *
   * Works only on promotional toasts with `autoDismiss`.
   *
   * @platform web
   * @default false
   */
  showProgressBar?: boolean;

  /**
   * Primary action of toast
   *
   * Renders a `Button` by default. Set `variant: 'link'` to render a `Link`.
   */
  action?: ToastButtonAction | ToastLinkAction;

  /**
   * Forwarded to react-hot-toast
   *
   * This can be used to programatically update toasts by providing an id
   */
  id?: string;
};

export type { ToastProps };

/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from 'react';
import type { ButtonProps } from '~components/Button';
import type { FeedbackColors } from '~tokens/theme/theme';

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
   * Primary action of toast
   */
  action?: {
    text: string;
    onClick?: ({ event, toastId }: { event: ButtonProps['onClick']; toastId: string }) => void;
    isLoading?: boolean;
  };

  /**
   * Forwarded to react-hot-toast
   *
   * This can be used to programatically update toasts by providing an id
   */
  id?: string;
};

export type { ToastProps };

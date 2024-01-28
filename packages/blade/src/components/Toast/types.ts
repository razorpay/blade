import type { ToastPosition } from 'react-hot-toast';
import type { IconComponent } from '~components/Icons';

type InformationalToastProps = {
  /**
   * @default `informational`
   */
  type?: 'informational';
  /**
   * If the type is `promotional`, the content will be `React.ReactNode`
   */
  content: string;
};

type PromotionalToastProps = {
  /**
   * @default `promotional`
   */
  type?: 'promotional';
  /**
   * If the type is `promotional`, the content will be `React.ReactNode`
   */
  content: React.ReactNode;
};

type ToastCommonProps = {
  /**
   * @default `neutral`
   */
  color?: 'neutral' | 'positive' | 'negative' | 'warning' | 'information';

  /**
   * Can be used to render an icon
   */
  leading?: IconComponent;

  /**
   * If true, the toast will be dismissed after few seconds
   *
   * Duration for promotional toast is 6s
   * Duration for informational toast is 4s
   *
   * @default false
   */
  autoDismiss?: boolean;

  /**
   * Called when the toast is dismissed or duration runs out
   */
  onDismissButtonClick?: () => void;

  /**
   * Primary action of toast
   */
  action?: {
    text: string;
    onClick?: () => void;
    isLoading?: boolean;
  };

  /**
   * Forwarded to react-hot-toast
   *
   * This can be used to programatically update toasts by providing an id
   */
  id?: string;
};

type ToastProps = (InformationalToastProps | PromotionalToastProps) & ToastCommonProps;

type ToastContainerProps = {
  position?: ToastPosition;
};

export type { ToastProps, ToastContainerProps };

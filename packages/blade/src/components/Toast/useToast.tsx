import type { Toast } from 'react-hot-toast';
import toast, { useToasterStore } from 'react-hot-toast';
import type { ToastProps } from './types';
import { Toast as ToastComponent } from './Toast';
import { logger } from '~utils/logger';

type BladeToast = Omit<Toast, 'type'> & ToastProps;
type UseToastReturn = {
  toasts: BladeToast[];
  show: (props: ToastProps) => string;
  dismiss: (id?: string) => void;
};

const useToast = (): UseToastReturn => {
  const { toasts } = useToasterStore();
  const show = (props: ToastProps): string => {
    props.type = props.type ?? 'informational';

    // Do not show promotional toasts if there is already one
    if (
      toasts.find((t) => {
        // @ts-expect-error - react-hot-toast doesn't recognize our promotional type
        return t.type === 'promotional';
      }) &&
      props.type === 'promotional'
    ) {
      if (__DEV__) {
        logger({
          message: 'There can only be one promotional toast at a time',
          type: 'warn',
          moduleName: 'Toast',
        });
      }
      return '';
    }

    const isPromoToast = props.type === 'promotional';
    if (props.autoDismiss === undefined) {
      // Promotional toasts should not auto dismiss
      props.autoDismiss = !isPromoToast;
    }

    if (props.duration === undefined) {
      // Set default durations
      if (isPromoToast) {
        props.duration = 8000;
      } else {
        props.duration = 4000;
      }
    }

    // If autoDismiss is false, set duration to infinity
    if (!props.autoDismiss) {
      props.duration = Infinity;
    }

    return toast.custom(({ visible, id }) => {
      return <ToastComponent {...props} id={id} isVisible={visible} />;
    }, props);
  };

  return {
    toasts: (toasts as unknown) as BladeToast[],
    show,
    dismiss: toast.dismiss,
  };
};

export type { UseToastReturn };
export { useToast };

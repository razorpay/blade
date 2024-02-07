import toast, { useToasterStore } from 'react-hot-toast';
import type { ToastProps } from './types';
import { Toast } from './Toast';

type UseToastReturn = {
  show: (props: ToastProps) => string;
  dismiss: (id?: string) => void;
};

const useToast = (): UseToastReturn => {
  const { toasts } = useToasterStore();
  const show = (props: ToastProps): string => {
    // Do not show promotional toasts if there is already one
    if (
      toasts.find((t) => {
        // @ts-expect-error - react-hot-toast doesn't recognize our promotional type
        return t.type === 'promotional';
      }) &&
      props.type === 'promotional'
    ) {
      return '';
    }

    return toast.custom(
      // @ts-expect-error - customProps is not a valid prop
      ({ visible, ...customProps }) => <Toast {...customProps} isVisible={visible} />,
      props,
    );
  };

  return {
    show,
    dismiss: toast.dismiss,
  };
};

export { useToast };

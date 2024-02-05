import toast from 'react-hot-toast';
import type { ToastProps } from './types';
import { Toast } from './Toast';

type UseToastReturn = {
  show: (props: ToastProps) => string;
  dismiss: (id?: string) => void;
};

const useToast = (): UseToastReturn => {
  const show = (props: ToastProps): string => {
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

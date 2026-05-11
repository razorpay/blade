import { throwBladeError } from '~utils/logger';
import type { ToastProps } from './types';

type UseToastReturn = {
  toasts: ToastProps[];
  show: (props: ToastProps) => string;
  dismiss: (id?: string) => void;
};

const useToast = (): UseToastReturn => {
  throwBladeError({
    message: 'useToast is not yet implemented for native',
    moduleName: 'Toast',
  });

  return {
    toasts: [],
    show: () => '',
    dismiss: () => {},
  };
};

export type { UseToastReturn };
export { useToast };

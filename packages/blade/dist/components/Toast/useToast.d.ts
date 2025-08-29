import { Toast } from 'react-hot-toast';
import { ToastProps } from './types';
type BladeToast = Omit<Toast, 'type'> & ToastProps;
type UseToastReturn = {
    toasts: BladeToast[];
    show: (props: ToastProps) => string;
    dismiss: (id?: string) => void;
};
declare const useToast: () => UseToastReturn;
export type { UseToastReturn };
export { useToast };

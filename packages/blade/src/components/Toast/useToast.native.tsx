import { throwBladeError } from '~utils/logger';

type UseToastReturn = {
  toasts: never[];
  show: (props: never) => string;
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

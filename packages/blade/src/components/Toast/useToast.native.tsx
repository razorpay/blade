import { logger } from '~utils/logger';

type UseToastReturn = {
  show: (props: Record<string, unknown>) => string;
  dismiss: (id?: string) => void;
  toasts: never[];
};

const useToast = (): UseToastReturn => {
  if (__DEV__) {
    logger({
      type: 'warn',
      moduleName: 'Toast',
      message: 'useToast is not yet supported on native. Use a native toast solution instead.',
    });
  }
  return {
    show: () => '',
    dismiss: () => {},
    toasts: [],
  };
};

export { useToast };

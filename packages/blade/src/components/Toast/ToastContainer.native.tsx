import { throwBladeError } from '~utils/logger';

const ToastContainer = (): React.ReactElement => {
  throwBladeError({
    message: 'ToastContainer is not yet implemented for native',
    moduleName: 'ToastContainer',
  });

  return <></>;
};

export { ToastContainer };

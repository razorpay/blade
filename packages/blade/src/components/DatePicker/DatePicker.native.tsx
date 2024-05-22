/* eslint-disable @typescript-eslint/no-explicit-any */
import { throwBladeError } from '~utils/logger';

const DatePicker = (_props: any): React.ReactElement => {
  throwBladeError({
    message: 'DatePicker is not yet implemented for native',
    moduleName: 'DatePicker',
  });

  return <></>;
};

export { DatePicker };

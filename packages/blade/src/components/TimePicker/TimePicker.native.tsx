/* eslint-disable @typescript-eslint/no-explicit-any */
import { throwBladeError } from '~utils/logger';

const TimePicker = (_props: any): React.ReactElement => {
  throwBladeError({
    message: 'DatePicker is not yet implemented for native',
    moduleName: 'DatePicker',
  });

  return <></>;
};

export { TimePicker };

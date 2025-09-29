/* eslint-disable @typescript-eslint/no-explicit-any */
import { throwBladeError } from '~utils/logger';

const TimePicker = (_props: any): React.ReactElement => {
  throwBladeError({
    message: 'TimePicker is not yet implemented for native',
    moduleName: 'TimePicker',
  });

  return <></>;
};

export { TimePicker };

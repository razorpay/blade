import { throwBladeError } from '~utils/logger';

import type { PhoneNumberInputProps } from './types';

const PhoneNumberInput = (_props: PhoneNumberInputProps): React.ReactElement => {
  throwBladeError({
    message: 'PhoneNumberInput is not yet implemented for native',
    moduleName: 'PhoneNumberInput',
  });

  return <></>;
};

export { PhoneNumberInput };

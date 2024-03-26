import type { PhoneNumberInputProps } from './types';
import { throwBladeError } from '~utils/logger';

const PhoneNumberInput = (_props: PhoneNumberInputProps): React.ReactElement => {
  throwBladeError({
    message: 'PhoneNumberInput is not yet implemented for native',
    moduleName: 'PhoneNumberInput',
  });

  return <></>;
};

export { PhoneNumberInput };

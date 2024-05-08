/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useId } from '~utils/useId';

/**
 * hook to generate unique ids for a form element
 *
 * @param prefix prefix to append before the id
 */
const useFormId = (prefix: string) => {
  const baseId = useId(prefix);
  const inputId = useId(`${baseId}-input`);
  const errorTextId = useId(`${baseId}-errortext`);
  const helpTextId = useId(`${baseId}-helptext`);
  const successTextId = useId(`${baseId}-successtext`);
  const labelId = useId(`${baseId}-label`);

  return {
    baseId,
    inputId,
    errorTextId,
    helpTextId,
    successTextId,
    labelId,
  };
};

export { useFormId };

import { useId } from '@razorpay/blade-core/utils';

export type FormIds = {
  baseId: string;
  inputId: string;
  errorTextId: string;
  helpTextId: string;
  successTextId: string;
  labelId: string;
};

/**
 * Generates a stable set of ids for a form element. Mirrors React's
 * `Form/useFormId`. Call once in a component's script body (which runs once per
 * instance) so the ids stay stable for that instance.
 *
 * @param prefix prefix prepended to each id
 * @param idProp external id passed by the consumer (used as the base when set)
 */
export const useFormId = (prefix: string, idProp?: string): FormIds => {
  const baseId = useId(prefix, idProp);
  return {
    baseId,
    inputId: `${baseId}-input`,
    errorTextId: `${baseId}-errortext`,
    helpTextId: `${baseId}-helptext`,
    successTextId: `${baseId}-successtext`,
    labelId: `${baseId}-label`,
  };
};

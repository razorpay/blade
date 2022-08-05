import { useId } from './useId';

type UseFormIdReturn = {
  inputId: string | undefined;
  errorTextId: string | undefined;
  helpTextId: string | undefined;
  successTextId: string | undefined;
};

const useFormId = (prefix: string): UseFormIdReturn => {
  const idBase = useId(prefix);
  const inputId = useId(`${idBase}-input`);
  const errorTextId = useId(`${idBase}-errortext`);
  const helpTextId = useId(`${idBase}-helptext`);
  const successTextId = useId(`${idBase}-successtext`);

  return {
    inputId,
    errorTextId,
    helpTextId,
    successTextId,
  };
};

export { useFormId };

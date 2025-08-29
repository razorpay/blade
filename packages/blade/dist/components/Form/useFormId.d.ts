/**
 * hook to generate unique ids for a form element
 *
 * @param prefix prefix to append before the id
 */
declare const useFormId: (prefix: string) => {
    baseId: string;
    inputId: string;
    errorTextId: string;
    helpTextId: string;
    successTextId: string;
    labelId: string;
};
export { useFormId };

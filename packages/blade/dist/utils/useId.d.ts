/**
 * Reack hook to generate unique id
 * It helps us provide stable ID which we can reference in the components
 * and also works in server side rendered component
 * TODO: Add support for `React.useId` after React18 upgrade
 *
 * @param prefix prefix to append before the id
 * @param idProp the external id passed from the user
 */
declare const useId: (prefix?: string, idProp?: string) => string;
export { useId };

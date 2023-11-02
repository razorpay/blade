/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

/**
 * Credit: https://github.com/reach/reach-ui/blob/dev/packages/auto-id/src/auto-id.ts
 */
let handoffComplete = false;
let id = 0;
const genId = () => ++id;

/**
 * Reack hook to generate unique id
 * It helps us provide stable ID which we can reference in the components
 * and also works in server side rendered component
 * TODO: Add support for `React.useId` after React18 upgrade
 *
 * @param prefix prefix to append before the id
 * @param idProp the external id passed from the user
 */
const useId = (prefix?: string, idProp?: string) => {
  const initialId = idProp || (handoffComplete ? genId() : null);
  const [uid, setUid] = React.useState(initialId);

  useIsomorphicLayoutEffect(() => {
    // Patch the ID after render. We do this in `useLayoutEffect` to avoid any
    // rendering flicker, though it'll make the first render slower (unlikely
    // to matter, but you're welcome to measure your app and let us know if
    // it's a problem).
    if (uid === null) setUid(genId());
  }, []);

  React.useEffect(() => {
    if (!handoffComplete) {
      handoffComplete = true;
    }
  }, []);

  const id = uid != null ? uid.toString() : undefined;
  return prefix ? `${prefix}-${id}` : id!;
};

export { useId };

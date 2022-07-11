/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';
import { useSafeLayoutEffect } from './useSafeLayoutEffect';

/**
 * Credit: https://github.com/reach/reach-ui/blob/develop/packages/auto-id/src/index.tsx
 */
let handoffComplete = false;
let id = 0;
const genId = () => ++id;

/**
 * Reack hook to generate unique id
 * TODO: Add support for `React.useId` after React18 upgrade
 *
 * @param idProp the external id passed from the user
 * @param prefix prefix to append before the id
 */
const useId = (prefix?: string, idProp?: string) => {
  const initialId = idProp || (handoffComplete ? genId() : null);
  const [uid, setUid] = React.useState(initialId);

  useSafeLayoutEffect(() => {
    if (uid === null) setUid(genId());
  }, []);

  React.useEffect(() => {
    if (!handoffComplete) {
      handoffComplete = true;
    }
  }, []);

  const id = uid != null ? uid.toString() : undefined;
  return prefix ? `${prefix}-${id!}` : id!;
};

export { useId };

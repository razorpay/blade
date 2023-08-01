/* eslint-disable no-console */
import isObject from 'lodash/isObject';

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Record<number | string, unknown> ? DeepPartial<T[P]> : T[P];
};

export const isPartialMatchObjectKeys = <ActualObject>({
  objectToMatch,
  objectToInspect,
}: {
  objectToMatch: DeepPartial<ActualObject>;
  objectToInspect: ActualObject;
}): boolean => {
  const matchResponses: boolean[] = [];

  const matchObjectKeys = ({
    innerObjectToMatch,
    innerObjectToInspect,
  }: {
    innerObjectToMatch: DeepPartial<ActualObject>;
    innerObjectToInspect: DeepPartial<ActualObject>;
  }): void => {
    for (const [key, valueToMatch] of Object.entries(innerObjectToMatch)) {
      const valueToInspect = innerObjectToInspect[key as keyof DeepPartial<ActualObject>];

      if (innerObjectToInspect.hasOwnProperty(key)) {
        if (
          valueToMatch === null ||
          valueToMatch === undefined ||
          valueToMatch === '' ||
          Array.isArray(valueToMatch) ||
          // the condition checks if the "valueToMatch" is not of type object then "valueToMatch" type should be same as type of "valueToInspect"
          (!(valueToMatch instanceof Object) && typeof valueToMatch !== typeof valueToInspect)
        ) {
          if (__DEV__) {
            // this is an invalid case, so we log error
            console.error(
              `[isPartialMatchObjectKeys]: Unexpected value: ${JSON.stringify(
                valueToMatch,
              )} of type ${typeof valueToMatch} for key: ${key}`,
            );
          }
          matchResponses.push(false);
        }

        if (typeof valueToMatch === 'string') {
          // we have reached leaf node of the objectToMatch(i.e sub-object)
          matchResponses.push(true);
        }

        if (isObject(valueToMatch) && isObject(valueToInspect)) {
          // let's go inside further and do a nested check
          matchObjectKeys({
            innerObjectToMatch: valueToMatch,
            innerObjectToInspect: valueToInspect,
          });
        }
      } else {
        if (__DEV__) {
          // the key doesn't exist in the innerObjectToMatch, so we log error
          console.error(
            `[isPartialMatchObjectKeys]: ${key} doesn't exist in ${JSON.stringify(
              innerObjectToInspect,
              null,
              2,
            )}`,
          );
        }
        matchResponses.push(false);
      }
    }
  };

  matchObjectKeys({ innerObjectToMatch: objectToMatch, innerObjectToInspect: objectToInspect });

  return matchResponses.every(Boolean);
};

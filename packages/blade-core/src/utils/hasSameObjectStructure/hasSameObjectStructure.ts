import isObject from '../lodashButBetter/isObject';
import keys from '../lodashButBetter/keys';

export interface ObjectWithKeys {
  [key: string | number]: ObjectWithKeys | number | string;
}

const hasSameObjectStructure = (obj1: ObjectWithKeys, obj2: ObjectWithKeys): boolean => {
  // Check if both objects are objects or not
  if (!isObject(obj1) || !isObject(obj2)) {
    return isObject(obj1) === isObject(obj2);
  }

  // Get the keys of both objects
  const keys1 = keys(obj1);
  const keys2 = keys(obj2);

  // Check if the length of the keys are the same
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Compare keys
  keys1.sort();
  keys2.sort();

  for (let i = 0; i < keys1.length; i++) {
    if (keys1[i] !== keys2[i]) {
      return false;
    }
  }

  // Recursively check the key structures of nested objects
  for (const key of keys1) {
    if (!hasSameObjectStructure(obj1[key] as ObjectWithKeys, obj2[key] as ObjectWithKeys)) {
      return false;
    }
  }

  // If all checks pass, the structures are the same
  return true;
};

export { hasSameObjectStructure };


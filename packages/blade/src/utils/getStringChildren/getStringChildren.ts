import type { StringChildrenType } from '~src/_helpers/types';

const getStringChildrenFromArray = (
  childrenArray: StringChildrenType | undefined,
): string | undefined => {
  if (Array.isArray(childrenArray)) {
    return childrenArray.join('');
  }

  return childrenArray;
};

export { getStringChildrenFromArray };

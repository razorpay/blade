import isEmpty from 'lodash/isEmpty';
import type { StringChildrenType } from '~utils/types';

const getStringFromReactText = (
  childReactText: StringChildrenType | undefined,
): string | undefined => {
  if (isEmpty(childReactText)) {
    return undefined;
  }

  if (Array.isArray(childReactText)) {
    return childReactText.join('');
  }

  return String(childReactText);
};

export { getStringFromReactText };

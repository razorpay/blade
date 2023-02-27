import { isEmpty } from 'lodash';
import type { StringChildrenType } from '~src/_helpers/types';

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

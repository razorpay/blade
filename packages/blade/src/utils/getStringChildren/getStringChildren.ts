import type { StringChildrenType } from '~src/_helpers/types';

const getStringFromReactText = (
  childReactText: StringChildrenType | undefined,
): string | undefined => {
  if (!childReactText) {
    return undefined;
  }

  if (Array.isArray(childReactText)) {
    return childReactText.join('');
  }

  return String(childReactText);
};

export { getStringFromReactText };

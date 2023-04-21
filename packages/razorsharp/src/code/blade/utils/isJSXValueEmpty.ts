import type { JSXValue } from '~/code/types/Blade';

export const isJSXValueEmpty = (jsxValue: JSXValue): boolean => {
  if (!jsxValue || !jsxValue.type) return true;

  if (
    typeof jsxValue.value === 'undefined' ||
    jsxValue.value === null ||
    (typeof jsxValue.value === 'number' && isNaN(jsxValue.value)) ||
    (typeof jsxValue.value === 'string' && jsxValue.value.length === 0)
  ) {
    return true;
  }

  return false;
};

import { indent } from './indent';
import { isJSXValueEmpty } from './isJSXValueEmpty';
import { newLine } from './newLine';
import type { BladeHelperProps, BladeProps, JSXValue } from '~/code/types/Blade';

export const jsxValue = (value: string | boolean | undefined): string => {
  if (typeof value === 'undefined') return '';
  if (value === 'True' || value === true) return 'true';
  if (value === 'False' || value === false) return 'false';

  return value;
};

export const jsxAttribute = (key: string, jsxValue: JSXValue): string => {
  const isCommented = jsxValue.isCommented || false;
  const comment =
    typeof jsxValue.comment === 'string' && jsxValue.comment.length > 0
      ? `// ${jsxValue.comment}\n`
      : '';

  const propPrefix = comment + (isCommented ? '// ' : '');

  if (jsxValue.type === 'number' || jsxValue.type === 'boolean' || jsxValue.type === 'instance') {
    return `${propPrefix}${key}={${jsxValue.value}}`;
  }

  return `${propPrefix}${key}="${jsxValue.value}"`;
};

export const attributes = (props: BladeProps): string => {
  return Object.entries(props)
    .filter(([key, jsxValue]) => key && !isJSXValueEmpty(jsxValue))
    .map(([key, value]) => jsxAttribute(key, value))
    .map((item) => newLine(indent(item)))
    .join('');
};

export const generateHelperCode = (props: BladeHelperProps): string => {
  return Object.entries(props)
    .map(([key, value]) => jsxAttribute(key, { type: value, value: '' }))
    .map((item) => newLine(indent(item)))
    .join('');
};

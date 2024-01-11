import type { JSXAttribute, JSXExpressionContainer } from 'jscodeshift';

export const isExpression = (prop: unknown): prop is JSXExpressionContainer => {
  return (prop as JSXAttribute)?.value?.type === 'JSXExpressionContainer';
};

export const red = (message: string): string => `\u001b[1m\u001b[31m${message}\u001b[39m\u001b[22m`;

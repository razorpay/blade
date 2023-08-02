import type { TSESLint } from '@typescript-eslint/utils';

type MessageIds = 'invalidWebImport' | 'invalidNativeImport';

const noCrossPlatformImportsRule: TSESLint.RuleModule<MessageIds> = {
  defaultOptions: [],
  meta: {
    type: 'problem',
    messages: {
      invalidWebImport: 'Avoid importing from a .web file in a .native file.',
      invalidNativeImport: 'Avoid importing from a .native file in a .web file.',
    },
    schema: [], // no options
  },
  create: (context) => ({
    ImportDeclaration(node) {
      const sourceValue = node.source.value;
      const isWebImport = sourceValue.endsWith('.web');
      const isNativeImport = sourceValue.endsWith('.native');

      if (
        isWebImport &&
        (context.getFilename().endsWith('.native.tsx') ||
          context.getFilename().endsWith('.native.ts'))
      ) {
        context.report({
          node,
          messageId: 'invalidWebImport',
        });
      } else if (
        isNativeImport &&
        (context.getFilename().endsWith('.web.tsx') || context.getFilename().endsWith('.web.ts'))
      ) {
        context.report({
          node,
          messageId: 'invalidNativeImport',
        });
      }
    },
  }),
};

export default noCrossPlatformImportsRule;

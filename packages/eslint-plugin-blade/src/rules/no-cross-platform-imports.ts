import type { TSESLint } from '@typescript-eslint/utils';

type MessageIds = 'invalidWebImport' | 'invalidNativeImport' | 'invalidWebOrNativeImport';
type RuleOptions = Array<{
  ignoreImportsPattern?: string;
}>;

const noCrossPlatformImportsRule: TSESLint.RuleModule<MessageIds> = {
  defaultOptions: [],
  meta: {
    type: 'problem',
    messages: {
      invalidWebImport: `Avoid importing from a '.web' file within a '.native' file.`,
      invalidNativeImport: 'Avoid importing from a .native file within a .web file.',
      invalidWebOrNativeImport: `Avoid importing from a '.native' or '.web' file within within this module, as it needs to be functional in both environments`,
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignoreImportsPattern: {
            type: 'string',
          },
        },
      },
    ],
  },
  create: (context: TSESLint.RuleContext<MessageIds, RuleOptions>) => ({
    ImportDeclaration(node) {
      const ignoreImportsPattern = context.options[0] && context.options[0].ignoreImportsPattern;
      const sourceValue = node.source.value;
      const isWebImport = sourceValue.endsWith('.web');
      const isNativeImport = sourceValue.endsWith('.native');
      const filename = context.getFilename();

      if (ignoreImportsPattern && new RegExp(ignoreImportsPattern, 'u').test(sourceValue)) {
        return;
      }

      if (isWebImport && (filename.endsWith('.native.tsx') || filename.endsWith('.native.ts'))) {
        context.report({
          node,
          messageId: 'invalidWebImport',
        });
      } else if (
        isNativeImport &&
        (filename.endsWith('.web.tsx') || filename.endsWith('.web.ts'))
      ) {
        context.report({
          node,
          messageId: 'invalidNativeImport',
        });
      } else if (
        (isWebImport || isNativeImport) &&
        !(filename.includes('.web.') || filename.includes('.native.'))
      ) {
        context.report({
          node,
          messageId: 'invalidWebOrNativeImport',
        });
      }
    },
  }),
};

export default noCrossPlatformImportsRule;

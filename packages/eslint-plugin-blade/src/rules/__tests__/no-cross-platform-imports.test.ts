import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ESLintUtils } from '@typescript-eslint/utils';
import noCrossPlatformImportsRule from '../no-cross-platform-imports';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

const nativeTsFile = path.join(__dirname, 'nativeFile.native.ts');
const nativeTsxFile = path.join(__dirname, 'nativeFile.native.tsx');
const webTsFile = path.join(__dirname, 'webFile.web.ts');
const webTsxFile = path.join(__dirname, 'webFile.web.tsx');

ruleTester.run('no-cross-platform-import', noCrossPlatformImportsRule, {
  valid: [
    {
      code: `import validImport from './validImport.native';`,
      filename: nativeTsFile,
    },
    {
      code: `import validImport from './validImport.native';`,
      filename: nativeTsxFile,
    },
    {
      code: `import validImport from './validImport.web';`,
      filename: webTsFile,
    },
    {
      code: `import validImport from './validImport.web';`,
      filename: webTsxFile,
    },
  ],
  invalid: [
    {
      code: `import invalidImport from './invalidImport.web';`,
      filename: nativeTsFile,
      errors: [
        {
          messageId: 'invalidWebImport',
        },
      ],
    },
    {
      code: `import invalidImport from './invalidImport.web';`,
      filename: nativeTsxFile,
      errors: [
        {
          messageId: 'invalidWebImport',
        },
      ],
    },
    {
      code: `import invalidImport from './invalidImport.native';`,
      filename: webTsFile,
      errors: [
        {
          messageId: 'invalidNativeImport',
        },
      ],
    },
    {
      code: `import invalidImport from './invalidImport.native';`,
      filename: webTsxFile,
      errors: [
        {
          messageId: 'invalidNativeImport',
        },
      ],
    },
  ],
});

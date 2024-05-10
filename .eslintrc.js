/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
  },
  extends: [
    'kentcdodds',
    'kentcdodds/react',
    'plugin:prettier/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react-native-a11y/all',
  ],
  rules: {
    'no-negated-condition': 'off',
    'max-lines-per-function': 'off',
    'max-lines': 'off',
    'no-console': 'off',
    'react-native-a11y/has-accessibility-hint': 'off',
    // need to turn this off because this rule is also being triggered on the web files as well
    'react-native-a11y/has-valid-accessibility-descriptors': 'off',
    // we need to disable these rules because with makeAccessible function
    // eslint is not smart enough to statically detect that we set the role
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/no-noninteractive-tabindex': 'off',
    complexity: ['off'],
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'ignore',
        },
      },
    ],
    'import/extensions': ['error', 'never', { css: 'always' }],
    'no-restricted-properties': [
      'error',
      {
        property: 'displayName',
        message:
          "Please define displayName using `assignWithoutSideEffects` instead. This will make sure the code doesn't create side-effects and tree-shaking continues to work",
      },
      {
        property: 'componentId',
        message:
          "Please define componentId using `assignWithoutSideEffects` instead. This will make sure the code doesn't create side-effects and tree-shaking continues to work",
      },
    ],
    'react/display-name': 'off',
    'import/no-named-as-default': 'off',
    // Some bug with import/no-cycle where the ignoreExternal is not working as expected
    // Setting ignoreExternal: true is slowing things down
    // https://github.com/import-js/eslint-plugin-import/issues/2348
    'import/no-cycle': ['error', { maxDepth: 4, ignoreExternal: false }],
    'import/no-deprecated': 'off',
  },
  env: {
    browser: true,
    jest: true,
  },
  settings: {
    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: '~/**',
            group: 'external',
            position: 'after',
          },
        ],
        groups: [
          'builtin',
          'external',
          'internal',
          'unknown',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
      },
    ],
    'import/resolver': {
      node: {
        extensions: [
          '.ts',
          '.tsx',
          '.web.ts',
          '.web.tsx',
          '.desktop.ts',
          '.desktop.tsx',
          '.mobile.ts',
          '.mobile.tsx',
          '.native.ts',
          '.native.tsx',
          '.ios.ts',
          '.ios.tsx',
          '.android.ts',
          '.android.tsx',
        ],
      },
      typescript: {
        project: 'packages/*/tsconfig.json',
      },
    },
  },
  overrides: [
    {
      files: ['**/*.{md,mdx}'],
      extends: ['plugin:mdx/recommended'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'react/jsx-filename-extension': [1, { extensions: ['.md', '.mdx'] }],
        'react/display-name': 'off',
        'react/prop-types': 'off',
        'no-irregular-whitespace': 'off',
      },
    },
    {
      files: ['**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json', './packages/*/tsconfig.json'],
      },
      extends: [
        'plugin:@typescript-eslint/recommended',
        // 'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier/recommended',
      ],
      plugins: ['@typescript-eslint', 'jsx-a11y', 'no-only-tests', 'blade'],
      rules: {
        'blade/no-cross-platform-imports': ['error', { ignoreImportsPattern: 'renderWithSSR' }],
        'import/no-cycle': ['error', { maxDepth: 4, ignoreExternal: false }],
        'import/no-deprecated': 'off',
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],
        'no-undef': 'off',
        'react/jsx-filename-extension': [
          'error',
          {
            extensions: ['.ts', '.tsx'],
          },
        ],
        'babel/new-cap': ['error', { capIsNewExceptionPattern: '^styled.' }],
        'no-shadow': 'off',
        'import/named': 'off',
        'import/namespace': 'off',
        'import/default': 'off',
        'import/no-named-as-default-member': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }], // makes it less strict for inline functions
        '@typescript-eslint/no-unnecessary-condition': 'off',
        '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/sort-type-union-intersection-members': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/consistent-type-exports': 'error',
        '@typescript-eslint/ban-ts-comment': 'off',
        'react-native-a11y/has-valid-accessibility-live-region': 'off',
        '@typescript-eslint/no-shadow': ['off'],
        '@typescript-eslint/explicit-module-boundary-types': ['off'],
        'no-only-tests/no-only-tests': 'error',
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: 'lodash',
                message:
                  "Named export from lodash is restricted. Use path exports like `import get from 'lodash/get';` instead",
              },
            ],
            patterns: ['!lodash/*'],
          },
        ],
        'react/display-name': 'off',
      },
    },
    {
      files: ['**/*.stories.{ts,tsx}', '**/*.stories.internal.{ts,tsx}'],
      rules: {
        'react/display-name': ['off'],
        'import/no-deprecated': 'off',
        'import/no-cycle': 'off',
      },
    },
  ],
  ignorePatterns: ['packages/blade-coverage-extension'],
};

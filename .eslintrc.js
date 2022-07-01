/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
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
    'import/no-cycle': 'error',
    'react-native-a11y/has-accessibility-hint': 'off',
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
          '.js',
          '.ts',
          '.tsx',
          '.web.js',
          '.web.ts',
          '.web.tsx',
          '.desktop.js',
          '.desktop.ts',
          '.desktop.tsx',
          '.mobile.js',
          '.mobile.ts',
          '.mobile.tsx',
          '.native.js',
          '.native.ts',
          '.native.tsx',
          '.ios.js',
          '.ios.ts',
          '.ios.tsx',
          '.android.js',
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
      plugins: ['@typescript-eslint', 'jsx-a11y'],
      rules: {
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
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        // '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/no-unnecessary-condition': 'off',
        '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/sort-type-union-intersection-members': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
    {
      files: ['**/*.stories.{ts,tsx}', '**/*.stories.internal.{ts,tsx}'],
      rules: {
        'react/display-name': ['off'],
      },
    },
  ],
};

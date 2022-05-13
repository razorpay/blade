module.exports = {
  extends: ['kentcdodds', 'kentcdodds/react', 'plugin:prettier/recommended'],
  rules: {
    'no-negated-condition': 'off',
    'max-lines-per-function': 'off',
    'max-lines': 'off',
    'no-console': 'off',
    'import/no-cycle': 'error',
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
      extends: [
        'plugin:@typescript-eslint/recommended',
        // 'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier/recommended',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
      },
      plugins: ['@typescript-eslint/eslint-plugin'],
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
        // '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/no-unnecessary-condition': 'off',
        '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/sort-type-union-intersection-members': 'off',
      },
    },
    {
      files: ['**/*.stories.{ts,tsx}'],
      rules: {
        'react/display-name': ['off'],
      },
    },
  ],
};

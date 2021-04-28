module.exports = {
  extends: ['kentcdodds', 'kentcdodds/react', 'prettier'],
  rules: {
    'no-negated-condition': 'off',
    'max-lines-per-function': 'off',
    'no-console': ['warn'],
    complexity: ['off'],
    'object-property-newline': [
      'error',
      {
        allowAllPropertiesOnSameLine: false,
      },
    ],
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: {
          multiline: true,
          minProperties: 1,
        },
        ObjectPattern: {
          multiline: true,
        },
        ImportDeclaration: 'never',
        ExportDeclaration: {
          multiline: true,
          minProperties: 10,
        },
      },
    ],
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
      files: ['**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
      },
      plugins: ['@typescript-eslint/eslint-plugin'],
      rules: {
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],
        'no-undef': 'off',
        'react/react-in-jsx-scope': 'error',
        'react/jsx-filename-extension': [
          'error',
          {
            extensions: ['.ts', '.tsx'],
          },
        ],
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
        // '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/no-unnecessary-condition': 'off',
      },
      extends: [
        'plugin:@typescript-eslint/recommended',
        // 'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier',
      ],
    },
  ],
};

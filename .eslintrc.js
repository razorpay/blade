module.exports = {
  extends: ['kentcdodds', 'kentcdodds/react', 'plugin:prettier/recommended'],
  rules: {
    'no-negated-condition': 'off',
    'import/order': 'off',
    'max-lines-per-function': 'off',
    'no-console': ['warn'],
    complexity: ['off'],
    'import/order': [
      'error',
      {
        alphabetize: { order: 'ignore' },
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
        'no-undef': 'off',
        'react/react-in-jsx-scope': 'error',
        'react/jsx-filename-extension': ['error', { extensions: ['.ts', '.tsx'] }],
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
        // '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/explicit-function-return-type': 'error',
      },
      extends: [
        'plugin:@typescript-eslint/recommended',
        // 'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier/@typescript-eslint',
      ],
    },
  ],
};

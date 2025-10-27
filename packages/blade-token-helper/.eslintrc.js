// packages/blade-token-helper/.eslintrc.js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    // Only use project for TypeScript files, not for this config file
    project: './tsconfig.json',
  },
  rules: {
    // Disable unsafe TypeScript rules for VSCode extensions
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',

    // Allow any types for VSCode API
    '@typescript-eslint/no-explicit-any': 'off',

    // Disable other strict rules that might cause issues with VSCode API
    '@typescript-eslint/no-unnecessary-condition': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    // Remove the problematic no-shadow rule
    // '@typescript-eslint/no-shadow': 'warn',
  },
  env: {
    node: true,
    es6: true,
  },
  // Override for this specific file to not use TypeScript project
  overrides: [
    {
      files: ['.eslintrc.js'],
      parserOptions: {
        project: null,
      },
    },
  ],
};

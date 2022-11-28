const path = require('path');

module.exports = {
  extends: ['react-app'],
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      settings: {
        'import/resolver': {
          node: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
          },
        },
      },
      plugins: ['@typescript-eslint'],
      parserOptions: {
        tsconfigRootDir: path.join(__dirname, '../..'),
        project: ['./tsconfig.json'],
      },
    },
  ],
};

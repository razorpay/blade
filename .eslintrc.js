module.exports = {
  extends: ['kentcdodds', 'kentcdodds/react', 'plugin:prettier/recommended'],
  rules: {
    'no-negated-condition': 'off',
    'import/order': 'off',
    'max-lines-per-function': 'off',
    'no-console': ['warn'],
    complexity: ['off'],
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
          '.desktop.js',
          '.mobile.js',
          '.native.js',
          '.ios.js',
          '.android.js',
        ],
      },
    },
  },
};

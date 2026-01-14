module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '18.12.1',
        },
        modules: false,
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: ['@babel/plugin-transform-runtime'],
};

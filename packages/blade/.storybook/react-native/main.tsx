module.exports = {
  stories: [
    '../../src/**/!(_KitchenSink)*.stories.?(ts|tsx|js|jsx)',
    '../../src/**/*.stories.internal.?(ts|tsx|js|jsx)',
  ],
  addons: [
    '@storybook/addon-ondevice-notes',
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-actions',
  ],
};

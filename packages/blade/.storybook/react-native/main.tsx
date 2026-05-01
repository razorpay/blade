module.exports = {
  stories: [
    // Only Text stories enabled — RN storybook is in maintenance mode and most
    // stories are untested. Add more stories here once they are verified on RN.
    '../../src/components/Typography/Text/*.stories.?(ts|tsx|js|jsx)',
    // '../../src/**/!(_KitchenSink|*.test)*.stories.?(ts|tsx|js|jsx)',
    // '../../src/**/*.stories.internal.?(ts|tsx|js|jsx)',
  ],
  addons: [
    '@storybook/addon-ondevice-notes',
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-actions',
  ],
};

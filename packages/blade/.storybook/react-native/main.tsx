module.exports = {
  stories: [
    '../../src/**/!(_KitchenSink|*.test|MotionRecipes|BottomNav|ChatInput|DatePicker|DetailedView|DrawerExamples|Fade|ListView|ListViewFigmaExample|Menu|Morph|Move|Settings|SideNav|Slide|RazorSense|Stagger|TableEditableCellAPI|TableFigmaExample|TableStripedRows|Toast|Typography|ChatMessage|CreationView|TopNav|LightBox|Preview)*.stories.?(ts|tsx|js|jsx)',
    '../../src/**/*.stories.internal.?(ts|tsx|js|jsx)',
  ],
  addons: [
    '@storybook/addon-ondevice-notes',
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-actions',
  ],
};

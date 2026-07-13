// Stories that use web-only dependencies (react-pdf, framer-motion, CSS modules, etc.)
// and cannot run on React Native. Add new web-only story names here.
const WEB_ONLY_STORIES = [
  '_KitchenSink',
  '*.test',
  'MotionRecipes',
  'BottomNav',
  'ChatInput',
  'DetailedView',
  'DrawerExamples',
  'Fade',
  'ListView',
  'ListViewFigmaExample',
  'Menu',
  'Morph',
  'Move',
  'Settings',
  'SideNav',
  'Slide',
  'RazorSense',
  'Stagger',
  'TableEditableCellAPI',
  'TableFigmaExample',
  'TableStripedRows',
  'Toast',
  'Typography',
  'ChatMessage',
  'CreationView',
  'TopNav',
  'LightBox',
  'Preview',
];

const exclusionGlob = `!(${WEB_ONLY_STORIES.join('|')})`;

module.exports = {
  stories: [
    `../../src/**/${exclusionGlob}*.stories.?(ts|tsx|js|jsx)`,
    '../../src/**/*.stories.internal.?(ts|tsx|js|jsx)',
  ],
  addons: [
    '@storybook/addon-ondevice-notes',
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-actions',
  ],
};

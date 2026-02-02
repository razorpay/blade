// .storybook/manager.js
import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

const surfaceTextNormal = 'rgba(19, 38, 68, 1)';
const bladePrimary = 'rgba(21, 102, 241, 1)';
const bladeTextFont =
  '"Inter", -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif';

const bladeCodeFont = '"Menlo", San Francisco Mono, Courier New, Roboto Mono, monospace';

const theme = create({
  base: 'light',

  colorPrimary: bladePrimary,
  colorSecondary: bladePrimary,

  // UI
  appBg: '#F1F4F8',
  appContentBg: '#FFFFFF',
  appBorderColor: 'rgba(0,0,0,.02)',
  appBorderRadius: 4,

  // Typography
  fontBase: bladeTextFont,
  fontCode: bladeCodeFont,

  // Text colors
  textColor: surfaceTextNormal,
  textInverseColor: '#FFFFFF',
  textMutedColor: '#666666',

  // Toolbar default and active colors
  barTextColor: surfaceTextNormal,
  barSelectedColor: bladePrimary,
  barBg: '#FFFFFF',

  // Form colors
  inputBg: '#FFFFFF',
  inputBorder: 'rgba(0,0,0,.1)',
  inputTextColor: surfaceTextNormal,
  inputBorderRadius: 2,

  // Brand
  brandTitle: `
    <img
      width="90px"
      alt="Blade logo" 
      src="https://raw.githubusercontent.com/razorpay/blade/348012984e5039265ff8197e73c258ec00c7606e/branding/blade-logo-name.min.svg" 
    />
  `,
  brandUrl: 'https://github.com/razorpay/blade',
});

addons.setConfig({
  theme,
});


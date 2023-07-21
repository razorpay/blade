// .storybook/manager.js
import React from 'react';
import { create } from '@storybook/theming';
import { useGlobals } from '@storybook/api';
import { Icons, IconButton } from '@storybook/components';
import { INTERNAL_STORY_ADDON_PARAM } from './constants';
import { addons, types } from '@storybook/manager-api';
export const theme = create({
  base: 'light',

  colorPrimary: '#FF4785',
  colorSecondary: '#1EA7FD',

  // UI
  appBg: '#F6F9FC',
  appContentBg: '#FFFFFF',
  appBorderColor: 'rgba(0,0,0,.1)',
  appBorderRadius: 4,

  // Typography
  fontBase:
    'Lato, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  fontCode: 'monospace',

  // Text colors
  textColor: 'rgb(19, 38, 68)',
  textInverseColor: '#FFFFFF',
  textMutedColor: '#666666',

  // Toolbar default and active colors
  barTextColor: '#999999',
  barSelectedColor: '#1EA7FD',
  barBg: '#FFFFFF',

  // Form colors
  inputBg: '#FFFFFF',
  inputBorder: 'rgba(0,0,0,.1)',
  inputTextColor: '#333333',
  inputBorderRadius: 4,

  brandTitle: 'Blade',
  brandUrl: 'https://github.com/razorpay/blade',
  // brandImage: 'https://place-hold.it/350x150',
});

const ADDON_ID = 'internal-components-addon';
const TOOL_ID = 'internal-components-tool';
const hiddenStoryStyle = document.createElement('style');
hiddenStoryStyle.textContent = `
  [id*='internal'] {
    display: none !important;
  }
`;
document.head.append(hiddenStoryStyle);

export const toggleHiddenStoryStyle = (isDisabled) => (hiddenStoryStyle.disabled = isDisabled);

const InternalStoryAddon = () => {
  const [globals, updateGlobals] = useGlobals();

  const isActive = globals[INTERNAL_STORY_ADDON_PARAM] || false;
  toggleHiddenStoryStyle(isActive);

  const toggleVisibility = React.useCallback(() => {
    updateGlobals({
      [INTERNAL_STORY_ADDON_PARAM]: !isActive,
    });
    toggleHiddenStoryStyle(!isActive);
  }, [isActive]);

  return null;
};

addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Toggle Visibility Of Internal Components',
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: () => <InternalStoryAddon />,
  });
});

addons.setConfig({
  theme,
});

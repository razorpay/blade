// .storybook/manager.js
import React from 'react';
import { create } from '@storybook/theming';
import { addons, types } from '@storybook/addons';
import { useGlobals } from '@storybook/api';
import { Icons, IconButton } from '@storybook/components';

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
  textColor: '#333333',
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
  const [{ showInternalComponents }, updateGlobals] = useGlobals();

  const toggleVisibility = React.useCallback(() => {
    updateGlobals({
      showInternalComponents: !showInternalComponents,
    });
    toggleHiddenStoryStyle(!showInternalComponents);
  }, [showInternalComponents]);

  return (
    <IconButton
      key={TOOL_ID}
      active={showInternalComponents}
      title="Show internal components"
      onClick={toggleVisibility}
    >
      <Icons icon="lock" />
    </IconButton>
  );
};

addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Toggle Visibility Of Internal Components',
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: InternalStoryAddon,
  });
});

addons.setConfig({
  theme,
});

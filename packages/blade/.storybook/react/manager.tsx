// .storybook/manager.js
import React from 'react';
import { create } from '@storybook/theming';
import { useGlobals } from '@storybook/api';
import { Icons, IconButton } from '@storybook/components';
import { INTERNAL_STORY_ADDON_PARAM } from './constants';
import { addons, types } from '@storybook/manager-api';

const surafaceTextNormal = 'rgba(19, 38, 68, 1)';
const bladePrimary = 'rgba(21, 102, 241, 1)';
const bladeTextFont =
  '"Inter", -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif';

const bladeCodeFont = '"Menlo", San Francisco Mono, Courier New, Roboto Mono, monospace';

export const theme = create({
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
  textColor: surafaceTextNormal,
  textInverseColor: '#FFFFFF',
  textMutedColor: '#666666',

  // Toolbar default and active colors
  barTextColor: surafaceTextNormal,
  barSelectedColor: bladePrimary,
  barBg: '#FFFFFF',

  // Form colors
  inputBg: '#FFFFFF',
  inputBorder: 'rgba(0,0,0,.1)',
  inputTextColor: surafaceTextNormal,
  inputBorderRadius: 2,

  // hack for changing height width of brand image
  brandTitle: `
    <img
      width="90px"
      alt="Blade logo" 
      src="https://raw.githubusercontent.com/razorpay/blade/348012984e5039265ff8197e73c258ec00c7606e/branding/blade-logo-name.min.svg" 
    />
  `,
  brandUrl: 'https://github.com/razorpay/blade',
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

  return (
    <IconButton
      autoFocus={false}
      content={null}
      nonce={null}
      rel={null}
      rev={null}
      key={TOOL_ID}
      active={isActive}
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
    render: () => <InternalStoryAddon />,
  });
});

addons.setConfig({
  theme,
});

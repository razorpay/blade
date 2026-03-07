// .storybook/manager.js
import React from 'react';
import { useGlobals } from 'storybook/manager-api';
import { IconButton } from 'storybook/internal/components';
import { LockIcon } from '@storybook/icons';
import { INTERNAL_STORY_ADDON_PARAM } from './constants';
import { addons, types } from 'storybook/manager-api';
import { theme, toggleHiddenStoryStyle } from './storybook-theme';

const ADDON_ID = 'internal-components-addon';
const TOOL_ID = 'internal-components-tool';

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
      <LockIcon />
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

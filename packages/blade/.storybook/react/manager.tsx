// .storybook/manager.js
import React from 'react';
import { create } from 'storybook/theming';
import { useGlobals } from 'storybook/manager-api';
import { IconButton } from 'storybook/internal/components';
import { LockIcon } from '@storybook/icons';
import { INTERNAL_STORY_ADDON_PARAM } from './constants';
import { addons, types } from 'storybook/manager-api';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { themeConfig } from './storybook-theme';

const theme = create(themeConfig);

const ADDON_ID = 'internal-components-addon';
const TOOL_ID = 'internal-components-tool';
const THEME_SYNC_ADDON_ID = 'color-scheme-background-sync-addon';
const COLOR_SCHEME_GLOBAL = 'colorScheme';
const BACKGROUNDS_GLOBAL = 'backgrounds';

type ResolvedColorScheme = 'light' | 'dark';

const resolveColorScheme = (colorScheme?: string): ResolvedColorScheme => {
  if (colorScheme === 'dark') {
    return 'dark';
  }
  if (colorScheme === 'system') {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

const getBackgroundValue = (backgrounds: unknown): string | undefined =>
  typeof backgrounds === 'string'
    ? backgrounds
    : (backgrounds as { value?: string } | undefined)?.value;

const hiddenStoryStyle = document.createElement('style');
// Targets the sidebar row wrapper and not the inner anchor, otherwise the wrapper keeps its
// min-height and leaves an empty row behind for every hidden story.
hiddenStoryStyle.textContent = `
  .sidebar-item[data-item-id*='internal'] {
    display: none !important;
  }
`;
document.head.append(hiddenStoryStyle);

const toggleHiddenStoryStyle = (isDisabled: boolean): boolean =>
  (hiddenStoryStyle.disabled = isDisabled);

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

// Keeps the Blade "Color Scheme" toolbar item and the Storybook "Background" toolbar item in sync.
// Changing one updates the other. The other side's resulting globals update is a no-op because it
// already matches, so this never loops.
addons.register(THEME_SYNC_ADDON_ID, (api) => {
  let previousColorScheme = 'light';
  let previousBackground: string | undefined;

  const syncColorSchemeAndBackground = (payload?: { userGlobals?: Record<string, unknown> }) => {
    const globals = payload?.userGlobals ?? api.getUserGlobals();
    const colorScheme = (globals[COLOR_SCHEME_GLOBAL] as string | undefined) ?? 'light';
    const backgrounds = globals[BACKGROUNDS_GLOBAL];
    const background = getBackgroundValue(backgrounds);

    const hasColorSchemeChanged = colorScheme !== previousColorScheme;
    const hasBackgroundChanged = background !== previousBackground;
    previousColorScheme = colorScheme;
    previousBackground = background;

    const resolvedColorScheme = resolveColorScheme(colorScheme);

    if (hasColorSchemeChanged) {
      if (background !== resolvedColorScheme) {
        api.updateGlobals({
          [BACKGROUNDS_GLOBAL]: {
            ...(typeof backgrounds === 'object' ? backgrounds : {}),
            value: resolvedColorScheme,
          },
        });
      }
      return;
    }

    if (
      hasBackgroundChanged &&
      (background === 'light' || background === 'dark') &&
      background !== resolvedColorScheme
    ) {
      api.updateGlobals({ [COLOR_SCHEME_GLOBAL]: background });
    }
  };

  api.on(SET_GLOBALS, syncColorSchemeAndBackground);
  api.on(GLOBALS_UPDATED, syncColorSchemeAndBackground);
});

addons.setConfig({
  theme,
});

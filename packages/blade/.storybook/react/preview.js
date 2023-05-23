import styled from 'styled-components';
import { theme, toggleHiddenStoryStyle } from './manager';
import { global } from '@storybook/design-system';
import { BladeProvider } from '../../src/components/BladeProvider';
import { paymentTheme, bankingTheme } from '../../src/tokens/theme';
import ErrorBoundary from './ErrorBoundary';
import { INTERNAL_STORY_ADDON_PARAM } from './constants';
const { GlobalStyle } = global;
import { DocsContainer } from '@storybook/addon-docs/blocks';

export const parameters = {
  previewTabs: {
    'storybook/docs/panel': { index: 0 },
    canvas: { title: 'Stories', index: 1 },
  },
  // on development setting it to undefined so that on 'live reload' it won't switch
  // to docs panel while developing the component
  viewMode: process.env.NODE_ENV === 'development' ? undefined : 'docs',
  actions: { argTypesRegex: '^on[A-Z].*' },
  options: {
    storySort: {
      order: [
        'Guides',
        ['Intro', 'Installation', 'Local Development', 'How to use?'],
        'Tokens',
        [
          'Colors',
          'Typography',
          'Elevation',
          'Border',
          'Spacing',
          'Breakpoints',
          'Motion',
          'CSS Variables',
        ],
        'Components',
        'Recipes',
      ],
    },
  },
  docs: {
    container: ({ children, context }) => {
      const getThemeTokens = () => {
        if (context.globals.themeTokenName === 'paymentTheme') {
          return paymentTheme;
        }
        if (context.globals.themeTokenName === 'bankingTheme') {
          return bankingTheme;
        }
      };
      return (
        <DocsContainer context={context}>
          <BladeProvider
            key={`${context.globals.themeTokenName}-${context.globals.colorScheme}`}
            themeTokens={getThemeTokens()}
            colorScheme={context.globals.colorScheme}
          >
            {children}
          </BladeProvider>
        </DocsContainer>
      );
    },
    theme,
    components: {
      summary: styled.summary`
        font-family: ${theme.fontBase};
        color: ${theme.textColor};
        font-weight: normal;
        cursor: pointer;
      `,
      li: styled.li`
        :not(:first-child) {
          padding-top: 16px;
        }
        font-size: 14px;

        & :not(pre) > code {
          line-height: 1;
          margin: 0 2px;
          padding: 3px 5px;
          white-space: nowrap;
          border-radius: 3px;
          font-size: 13px;
          border: 1px solid #eeeeee;
          background-color: #f8f8f8;
        }
      `,
    },
  },
};

const StoryCanvas = styled.div(
  ({ theme, context }) =>
    `
      position: ${context.viewMode === 'story' ? 'absolute' : 'relative'};
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      border-right: 'none';
      border: ${theme.border.width.thin}px solid ${theme.colors.surface.border.subtle.lowContrast};
      width: 100%;
      height: 100%;
      overflow: auto;
      padding: 2rem;
      border-radius: ${
        context.viewMode === 'story'
          ? `${theme.border.radius.none}px`
          : `${theme.border.radius.medium}px`
      };
      background: ${theme.colors.surface.background.level1.lowContrast};
    `,
);

export const decorators = [
  (Story, context) => {
    toggleHiddenStoryStyle(context.globals.showInternalComponents);
    const getThemeTokens = () => {
      if (context.globals.themeTokenName === 'paymentTheme') {
        return paymentTheme;
      }
      if (context.globals.themeTokenName === 'bankingTheme') {
        return bankingTheme;
      }
    };

    return (
      <ErrorBoundary>
        <GlobalStyle />
        <BladeProvider
          key={`${context.globals.themeTokenName}-${context.globals.colorScheme}`}
          themeTokens={getThemeTokens()}
          colorScheme={context.globals.colorScheme}
        >
          <StoryCanvas context={context}>
            <Story />
          </StoryCanvas>
        </BladeProvider>
      </ErrorBoundary>
    );
  },
];

export const globalTypes = {
  themeTokenName: {
    name: 'Theme Tokens',
    description: 'Theme Tokens for Blade',
    defaultValue: 'paymentTheme',
    toolbar: {
      icon: 'paintbrush',
      // Array of plain string values or MenuItem shape (see below)
      items: [
        { value: 'paymentTheme', title: 'Payment' },
        { value: 'bankingTheme', title: 'Banking' },
      ],
      // Property that specifies if the name of the item will be displayed
      showName: true,
    },
  },
  colorScheme: {
    name: 'Color Scheme',
    description: 'Color Scheme for Blade',
    defaultValue: 'light',
    toolbar: {
      icon: 'eye',
      // Array of plain string values or MenuItem shape (see below)
      items: [
        { value: 'light', title: 'Light' },
        { value: 'dark', title: 'Dark' },
        { value: 'system', title: 'System' },
      ],
      // Property that specifies if the name of the item will be displayed
      showName: true,
    },
  },
};

export const globals = {
  [INTERNAL_STORY_ADDON_PARAM]: false,
};

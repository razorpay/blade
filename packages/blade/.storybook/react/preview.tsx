import styled from 'styled-components';
import { theme, toggleHiddenStoryStyle } from './manager';
import { global } from '@storybook/design-system';
import { BladeProvider } from '../../src/components';
import { bladeTheme } from '../../src/tokens/theme';
import { createTheme } from '../../src/tokens/theme/createTheme';
import ErrorBoundary from './ErrorBoundary';
import { INTERNAL_STORY_ADDON_PARAM } from './constants';
const { GlobalStyle } = global;
import { DocsContainer } from '@storybook/addon-docs';
import React from 'react';
import './global.css';

export const parameters = {
  // disable snapshot by default and then enable it only for kitchen sink
  chromatic: {
    disableSnapshot: true,
    pauseAnimationAtEnd: true,
  },
  previewTabs: {
    'storybook/docs/panel': { index: 0 },
    canvas: { title: 'Stories', index: 1 },
  },
  backgrounds: {
    disable: true,
    grid: {
      disable: true,
    },
  },
  // on development setting it to undefined so that on 'live reload' it won't switch
  // to docs panel while developing the component
  viewMode: process.env.NODE_ENV === 'development' ? undefined : 'docs',
  actions: { argTypesRegex: '^on[A-Z].*' },
  options: {
    storySort: {
      method: 'alphabetical',
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
        'Utils',
        [
          'makeBorderSize',
          'makeMotionTime',
          'makeSize',
          'makeSpace',
          'makeTypographySize',
          'useTheme',
        ],
        'Components',
        ['*', 'KitchenSink'],
        'Recipes',
      ],
    },
  },
  docs: {
    container: ({ children, context }) => {
      console.log('----', context);
      const getThemeTokens = () => {
        if (context.store.globals.globals.brandColor) {
          return createTheme({ brandColor: context.store.globals.globals.brandColor });
        }
        return bladeTheme;
      };
      return (
        <DocsContainer context={context}>
          <BladeProvider
            key={`${context.store.globals.globals.themeTokenName}-${context.store.globals.globals.colorScheme}`}
            themeTokens={getThemeTokens()}
            colorScheme={context.store.globals.globals.colorScheme}
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
        font-size: 14px;
        cursor: pointer;
      `,
      a: styled.a`
        color: ${theme.colorPrimary};
        font-weight: 500;
      `,
      // Setting font-weight back to 600 in headings since storybook tries to override it
      ...(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).reduce<Record<`h${number}`, string>>(
        (headingOverride, headingLevel) => {
          headingOverride[headingLevel] = styled[headingLevel]`
            & a {
              font-weight: 600;
            }
          `;

          return headingOverride;
        },
        {},
      ),
    },
  },
};

const StoryCanvas = styled.div<{ context }>(
  ({ theme, context }) =>
    `
      width: 100%;
      height: ${context.viewMode === 'story' ? '100vh' : '100%'};
      overflow: auto;
      padding: ${
        context.kind.includes('/Dropdown/With Select') ||
        context.kind.includes('/Dropdown/With Button') ||
        context.kind.includes('/Dropdown/With AutoComplete') ||
        context.kind.includes('/Carousel')
          ? '0rem'
          : '2rem'
      };
      background-color: ${theme.colors.surface.background.gray.subtle};
      border-radius: ${
        context.viewMode === 'story'
          ? `${theme.border.radius.none}px`
          : `${theme.border.radius.medium}px`
      };
    `,
);

export const decorators = [
  (Story, context) => {
    toggleHiddenStoryStyle(context.globals.showInternalComponents);
    const getThemeTokens = () => {
      if (context.globals.brandColor) {
        return createTheme({ brandColor: context.globals.brandColor });
      }
      return bladeTheme;
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
  // TODO: Rebranding - Uncomment this when we fix white-labeling
  // brandColor: {
  //   name: 'Brand Color',
  //   description: 'Brand Color (You can pass any valid color to BladeProvider)',
  //   defaultValue: undefined,
  //   toolbar: {
  //     icon: 'contrast',
  //     // Array of plain string values or MenuItem shape (see below)
  //     items: [
  //       { value: undefined, title: 'Razorpay' },
  //       { value: '#EE681A', title: 'ICICI' },
  //       { value: '#83003D', title: 'Axis' },
  //       { value: '#15A5EB', title: 'SBI' },
  //       { value: '#107259', title: 'IDBI' },
  //       { value: '#FFF10A', title: 'Allahabad' },
  //       { value: '#F32951', title: 'BookMyShow' },
  //       { value: '#F86B15', title: 'Swiggy' },
  //       { value: '#CF2033', title: 'Zomato' },
  //       { value: '#19BEA2', title: 'DSP Mutual Fund' },
  //       { value: '#DF005D', title: 'Nykaa' },
  //     ],
  //     // Property that specifies if the name of the item will be displayed
  //     showName: true,
  //   },
  // },
};

export const globals = {
  [INTERNAL_STORY_ADDON_PARAM]: false,
};

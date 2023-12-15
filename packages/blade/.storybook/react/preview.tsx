import styled from 'styled-components';
import { theme, toggleHiddenStoryStyle } from './manager';
import { global } from '@storybook/design-system';
import { BladeProvider } from '../../src/components';
import { paymentTheme, bankingTheme } from '../../src/tokens/theme';
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
        if (context.store.globals.globals.themeTokenName === 'paymentTheme') {
          return paymentTheme;
        }
        if (context.store.globals.globals.themeTokenName === 'bankingTheme') {
          return bankingTheme;
        }
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
        font-weight: normal;
        cursor: pointer;
      `,
      li: styled.li`
        :not(:first-child) {
          padding-top: 12px;
        }
        font-size: 14px;

        & :not(pre) > code {
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

const StoryCanvas = styled.div<{ context }>(
  ({ theme, context }) =>
    `
      border: ${theme.border.width.thin}px solid ${theme.colors.surface.border.subtle.lowContrast};
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
      if (context.globals.brandColor) {
        return createTheme({ brandColor: context.globals.brandColor });
      }
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
  brandColor: {
    name: 'Brand Color',
    description: 'Brand Color (You can pass any valid color to BladeProvider)',
    defaultValue: undefined,
    toolbar: {
      icon: 'contrast',
      // Array of plain string values or MenuItem shape (see below)
      items: [
        { value: undefined, title: 'Razorpay' },
        { value: '#EE681A', title: 'ICICI' },
        { value: '#83003D', title: 'Axis' },
        { value: '#15A5EB', title: 'SBI' },
        { value: '#107259', title: 'IDBI' },
        { value: '#FFF10A', title: 'Allahabad' },
        { value: '#F32951', title: 'BookMyShow' },
        { value: '#F86B15', title: 'Swiggy' },
        { value: '#CF2033', title: 'Zomato' },
        { value: '#19BEA2', title: 'DSP Mutual Fund' },
        { value: '#DF005D', title: 'Nykaa' },
      ],
      // Property that specifies if the name of the item will be displayed
      showName: true,
    },
  },
};

export const globals = {
  [INTERNAL_STORY_ADDON_PARAM]: false,
};

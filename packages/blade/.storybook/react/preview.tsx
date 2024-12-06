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
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';
import './global.css';
import { domMax, LazyMotion } from 'framer-motion';

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
  viewport: {
    viewports: {
      ...MINIMAL_VIEWPORTS,
      iPhone6: {
        name: 'iPhone 6',
        styles: {
          height: '667px',
          width: '375px',
        },
        type: 'mobile',
      },
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
        ['Intro', 'Installation', 'Contributing', 'How to use?'],
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
        ['*', 'Interaction Tests', 'KitchenSink'],
        'Motion',
        [
          'Introduction to Motion',
          'Fade',
          'Move',
          'Slide',
          '*',
          'AnimateInteractions',
          'Stagger',
          'Recipes',
        ],
        'Recipes',
      ],
    },
  },
  docs: {
    container: ({ children, context }) => {
      console.log('----', context);
      const getThemeTokens = () => {
        if (context.store.globals.globals.brandColor) {
          return createTheme({ brandColor: context.store.globals.globals.brandColor }).theme;
        }
        return bladeTheme;
      };

      if (context.store.globals.globals.version === '10' && window.top) {
        window.top.location.href =
          'https://v10--61c19ee8d3d282003ac1d81c.chromatic.com' +
          window.top.location.pathname +
          window.top.location.search;
      }
      return (
        <DocsContainer context={context}>
          <LazyMotion strict features={domMax}>
            <BladeProvider
              key={`${context.store.globals.globals.themeTokenName}-${context.store.globals.globals.colorScheme}`}
              themeTokens={getThemeTokens()}
              colorScheme={context.store.globals.globals.colorScheme}
            >
              {children}
            </BladeProvider>
          </LazyMotion>
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
        context.kind.includes('/Carousel') ||
        context.kind.includes('/TopNav') ||
        context.kind.includes('/Examples') ||
        context.kind.includes('/SideNav') ||
        context.kind.includes('/Recipes')
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
        return createTheme({ brandColor: context.globals.brandColor }).theme;
      }
      return bladeTheme;
    };

    if (context.globals.version === '10' && window.top) {
      window.top.location.href =
        'https://v10--61c19ee8d3d282003ac1d81c.chromatic.com' +
        window.top.location.pathname +
        window.top.location.search;
    }

    return (
      <ErrorBoundary>
        <GlobalStyle />
        {/* strict in LazyMotion will make sure we don't use excessive `motion` component in blade components and instead use light weight `m` */}
        <LazyMotion strict features={domMax}>
          <BladeProvider
            key={`${context.globals.themeTokenName}-${context.globals.colorScheme}`}
            themeTokens={getThemeTokens()}
            colorScheme={context.globals.colorScheme}
          >
            <StoryCanvas context={context}>
              <Story />
            </StoryCanvas>
          </BladeProvider>
        </LazyMotion>
      </ErrorBoundary>
    );
  },
];

export const globalTypes = {
  version: {
    name: 'Blade Documentation Version',
    description: 'Version of the Blade',
    defaultValue: '11',
    toolbar: {
      icon: 'time',
      title: ' v11 - Rebranded',
      // Array of plain string values or MenuItem shape (see below)
      items: [
        { value: '10', title: ' v10 - Old' },
        { value: '11', title: ' v11 - Rebranded', default: true },
      ],
      dynamicTitle: true,
      // Property that specifies if the name of the item will be displayed
      showName: false,
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
      icon: 'paintbrush',
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

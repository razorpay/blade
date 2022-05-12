import { theme } from './manager';
import { global } from '@storybook/design-system';
import { BladeProvider } from '../../src/components/BladeProvider';
import { paymentTheme, bankingTheme } from '../../src/tokens/theme';

const { GlobalStyle } = global;

export const parameters = {
  previewTabs: {
    'storybook/docs/panel': { index: 0 },
    canvas: { title: 'Stories', index: 1 },
  },
  viewMode: 'docs',
  actions: { argTypesRegex: '^on[A-Z].*' },
  options: {
    storySort: {
      order: [
        'Guides',
        ['Intro', 'Installation', 'Usage', 'Local Development'],
        'Tokens',
        ['Colors', 'Typography', 'Breakpoints', 'Border', 'Spacing', 'Shadows'],
        'Recipes',
        'Components',
      ],
    },
  },
  docs: {
    theme,
  },
};

export const decorators = [
  (Story, context) => {
    const getThemeTokens = () => {
      if (context.globals.themeTokenName === 'paymentTheme') {
        return paymentTheme;
      }
      if (context.globals.themeTokenName === 'bankingTheme') {
        return bankingTheme;
      }
    };
    return (
      <>
        <GlobalStyle />
        <BladeProvider
          key={`${context.globals.themeTokenName}-${context.globals.colorScheme}`}
          themeTokens={getThemeTokens()}
          colorScheme={context.globals.colorScheme}
        >
          <Story />
        </BladeProvider>
      </>
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

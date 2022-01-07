import { theme } from './manager';
import { BladeProvider } from '@razorpay/blade/components';
import { paymentTheme, bankingTheme } from '@razorpay/blade/tokens';

let selectedTheme = 'Payment';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  options: {
    storySort: {
      order: [
        'Guides',
        ['Intro', 'Installation', 'Usage', 'Local Development'],
        'Tokens',
        ['Colors', 'Border', 'Spacing', 'Shadows', 'Typography'],
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
      if (context.globals.themeTokens === 'paymentTheme') {
        return paymentTheme;
      }
      if (context.globals.themeTokens === 'bankingTheme') {
        return bankingTheme;
      }
    };

    return (
      <BladeProvider
        key={`${context.globals.themeTokens}-${context.globals.colorScheme}`}
        themeTokens={getThemeTokens()}
        colorScheme={context.globals.colorScheme}
      >
        <Story />
      </BladeProvider>
    );
  },
];

export const globalTypes = {
  themeTokens: {
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

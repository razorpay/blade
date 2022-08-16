import type { Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import outdent from 'outdent';
import { Highlight, Link } from '@storybook/design-system';
import overrideTheme from './overrideTheme';
import paymentTheme from './paymentTheme';
import { Button } from '~components/Button';
import { BladeProvider } from '~components/BladeProvider';
import { Checkbox, CheckboxGroup } from '~components/Checkbox';
import Box from '~components/Box';
import { Text, Title as BladeTitle } from '~components/Typography';

const Page = (): ReactElement => {
  return (
    <>
      <Title />
      <Subtitle>
        overrideTheme takes two themes, baseThemeTokens & overrides and returns a new ThemeTokens
        object, which you can pass into BladeProvider.
      </Subtitle>
      <Link href="https://github.com/razorpay/blade/blob/master/packages/blade/src/tokens/theme/overrideTheme.stories.tsx">
        Link to source example
      </Link>
      <br />
      <br />
      <Title>Usage</Title>
      <Highlight language="tsx">{outdent`
        const customTheme = overrideTheme({
          baseThemeTokens: paymentTheme, // theme to override
          overrides: {
            colors: {
              onLight: {
                brand: {
                  primary: {
                    '500': 'red',
                  },
                },
              },
            },
          },
        });

        const App = () => {
          return &lt;BladeProvider themeTokens={customTheme} \/\>
        }
        `}</Highlight>
      <Title>Example</Title>
      <Primary />
      <Title>Properties</Title>
      <ArgsTable story={PRIMARY_STORY} />
      <Stories />
    </>
  );
};

export default {
  title: 'Utilities/overrideTheme',
  args: {
    hue: 28,
  },
  argTypes: {
    hue: {
      control: {
        name: 'hue',
        type: 'range',
        min: 0,
        max: 360,
        step: 1,
      },
      description: 'Change this hue to see the colors change',
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta;

const OverrideThemeExample = (props: { hue: number }): React.ReactElement => {
  // Global parameters
  const hue = props.hue;
  const primaryColor = `hsla(${hue}, 100%, 50%, 1)`;
  const secondaryColor = `hsla(${hue}, 100%, 99%, 1)`;
  const tertiaryColor = `hsla(${hue}, 100%, 96%, 1)`;
  const primaryText = `hsla(${hue}, 100%, 99%, 1)`;
  const focusColor = `hsla(${hue}, 100%, 80%, 1)`;
  const secondaryText = primaryColor;
  const tertiaryText = primaryColor;

  const customTheme = overrideTheme({
    baseThemeTokens: paymentTheme,
    overrides: {
      colors: {
        onLight: {
          action: {
            // action's text (button text)
            text: {
              primary: {
                default: primaryText,
              },
              secondary: {
                default: secondaryText,
              },
              tertiary: {
                default: tertiaryText,
              },
            },
            // action's background (button bg)
            background: {
              primary: {
                default: primaryColor,
                hover: primaryColor,
                focus: primaryColor,
              },
              secondary: {
                default: secondaryColor,
                hover: secondaryColor,
                focus: secondaryColor,
              },
              tertiary: {
                default: tertiaryColor,
                hover: tertiaryColor,
                focus: tertiaryColor,
              },
            },
            // action's border (button border)
            border: {
              primary: {
                default: primaryColor,
                hover: primaryColor,
                focus: primaryColor,
              },
              secondary: {
                default: primaryColor,
                hover: primaryColor,
                focus: primaryColor,
              },
              tertiary: {
                default: tertiaryColor,
                hover: tertiaryColor,
                focus: tertiaryColor,
              },
            },
          },
          // text color
          surface: {
            text: {
              normal: {
                lowContrast: secondaryText,
              },
            },
          },
          // brand colors
          brand: {
            primary: {
              '500': primaryColor,
              '400': focusColor,
              '300': primaryColor,
              '600': primaryColor,
            },
            secondary: {
              '500': secondaryColor,
            },
          },
        },
      },
    },
  });

  return (
    <BladeProvider themeTokens={customTheme}>
      <BladeTitle>Blade OverrideTheme Example</BladeTitle>
      <Text>By using overrideTheme() function we can customize blade theme.</Text>

      <Box marginBottom="spacing.4" marginTop="spacing.4" display="flex" alignItems="center">
        <Button variant="primary">Primary</Button>
        <Box marginLeft="spacing.2" />
        <Button variant="secondary">Secondary</Button>
        <Box marginLeft="spacing.2" />
        <Button variant="tertiary">Tertiary</Button>
      </Box>

      <CheckboxGroup label="Select fruit" defaultValue={['apple']}>
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="mango">Mango</Checkbox>
        <Checkbox value="orange">Prange</Checkbox>
      </CheckboxGroup>
    </BladeProvider>
  );
};

const Example = OverrideThemeExample.bind({});

export { Example };

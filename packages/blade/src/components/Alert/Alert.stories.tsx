import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import type { ReactElement } from 'react';

import type { AlertProps } from './Alert';
import { Alert as AlertComponent } from './Alert';
import useMakeFigmaURL from '~src/_helpers/storybook/useMakeFigmaURL';
import { colors } from '~tokens/global';
import Box from '~components/Box';
import FigmaEmbed from '~src/_helpers/storybook/FigmaEmbed';
import Sandbox from '~src/_helpers/storybook/Sandbox';

const Page = (): ReactElement => {
  const figmaURL = useMakeFigmaURL([
    {
      themeTokenName: 'paymentTheme',
      lightModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=6922%3A17789',
      darkModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=6922%3A17789',
    },
    {
      themeTokenName: 'bankingTheme',
      lightModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=11098%3A286031',
      darkModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=11098%3A286031',
    },
  ]);

  return (
    <>
      <Title />
      <Subtitle>
        Alerts are messages that communicate information to users about any significant changes or
        explanations inside the system in a prominent way.
      </Subtitle>
      <FigmaEmbed title="Alert Figma Designs" src={figmaURL} />
      <Title>Usage</Title>
      <Sandbox editorHeight={500}>
        {`
        import { useState } from 'react';
        import { Alert, Button } from '@razorpay/blade/components';

        function App() {
          const [showAlert, setShowAlert] = useState(false);
          return (
            <div>
              <Button onClick={() => setShowAlert(!showAlert)}>
                Click to be alerted!
              </Button>
              <br /><br />
              <div>
                { 
                  showAlert 
                  ? <Alert 
                      title="The Button is Clicked 👀" 
                      description="Click the Button again to hide alert"
                      actions={{
                        primary: {
                          onClick: () => {
                            alert('Alert from the alert hehe')
                          },
                          text: 'Primary Action'
                        },
                        secondary: {
                          href: 'https://razorpay.com',
                          target: '_blank',
                          text: 'Go to Razorpay.com'
                        }
                      }}
                    /> 
                  : null 
                }
              </div>
            </div>
          )
        }

        export default App;
        `}
      </Sandbox>
      <Title>Example</Title>
      <Subtitle>You can change the properties using the controls in the table below.</Subtitle>
      <Primary />
      <Title>Properties</Title>
      <ArgsTable story={PRIMARY_STORY} />
      <Stories />
    </>
  );
};

const meta: Meta<AlertProps> = {
  title: 'Components/Alert',
  component: AlertComponent,
  args: {
    title: 'International Payments Only',
    description:
      'Currently you can only accept payments in international currencies using PayPal. You cannot accept payments in INR (₹) using PayPal.',
    isFullWidth: false,
    isDismissable: true,
    contrast: 'low',
    intent: 'information',
    isBorderless: false,
    actions: {
      primary: {
        text: 'Primary Action',
        onClick: () => {
          console.log('Primary action clicked');
        },
      },
      secondary: {
        text: 'Link',
        onClick: () => {
          console.log('Secondary action clicked');
        },
        href: 'https://razorpay.com',
        target: '_blank',
      },
    },
  },
  argTypes: {
    onDismiss: { action: 'Dismissed' },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
};

const AlertTemplate: ComponentStory<typeof AlertComponent> = ({ ...args }) => {
  return <AlertComponent {...args} />;
};

export const Default = AlertTemplate.bind({});

export const HighContrast = AlertTemplate.bind({});
HighContrast.args = {
  contrast: 'high',
  intent: 'notice',
};
HighContrast.parameters = {
  docs: {
    description: {
      story: 'A high contrast Alert for more prominent look',
    },
  },
};

export const WithoutActions = AlertTemplate.bind({});
WithoutActions.args = {
  actions: undefined,
};
WithoutActions.parameters = {
  docs: {
    description: {
      story: 'Alert can also be used without any actions',
    },
  },
};

export const NonDismissable = AlertTemplate.bind({});
NonDismissable.args = {
  isDismissable: false,
};
NonDismissable.parameters = {
  docs: {
    description: {
      story: 'Alert can be made non dismissable',
    },
  },
};

export const DescriptionOnly = AlertTemplate.bind({});
DescriptionOnly.args = {
  description:
    'The payment was made 6 months ago, therefore you can’t issue refund to this merchant.',
  intent: 'notice',
  actions: undefined,
  title: undefined,
};
DescriptionOnly.parameters = {
  docs: {
    description: {
      story: 'Sometimes a description is enough to set the required context',
    },
  },
};

export const PrimaryActionOnly = AlertTemplate.bind({});
PrimaryActionOnly.args = {
  description:
    'There was some internal error while fetching the merchants list, this might also be due to the poor internet connection.',
  intent: 'negative',
  actions: {
    primary: {
      text: 'Try Refetching',
      onClick: () => {
        console.log('Refetch');
      },
    },
  },
  title: 'Unable to fetch merchants',
};
PrimaryActionOnly.parameters = {
  docs: {
    description: {
      story: 'Just a primary action can be enough in some cases',
    },
  },
};

export const FullWidth = AlertTemplate.bind({});
FullWidth.args = {
  description: 'Currently you can only accept payments in international currencies using PayPal.',
  intent: 'notice',
  actions: undefined,
  title: undefined,
  isFullWidth: true,
};
FullWidth.parameters = {
  docs: {
    description: {
      story: 'A full width Alert can be used to span the entire width of its container',
    },
  },
};

export const Borderless: ComponentStory<typeof AlertComponent> = ({ ...args }) => {
  return (
    <Box background={colors.neutral.blueGrayLight[100]} height={200} position="relative">
      <Box position="absolute" width="100%">
        <AlertComponent {...args} />
      </Box>
    </Box>
  );
};
Borderless.args = {
  description: 'Use vendor payouts to quickly generate invoices.',
  actions: undefined,
  title: undefined,
  isBorderless: true,
};
Borderless.parameters = {
  docs: {
    description: {
      story:
        'A borderless Alert can be used for full-bleed layouts, this automatically makes the alert full width. You can also wrap the alert and adjust layout with absolute positioning if needed.',
    },
  },
};

export default meta;

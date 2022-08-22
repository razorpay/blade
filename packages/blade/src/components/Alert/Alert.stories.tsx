import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import { Highlight, Link } from '@storybook/design-system';

import type { AlertProps } from './Alert';
import AlertComponent from './Alert';
import useMakeFigmaURL from '~src/_helpers/storybook/useMakeFigmaURL';

const Page = (): ReactElement => {
  const figmaURL = useMakeFigmaURL([
    {
      themeTokenName: 'paymentTheme',
      lightModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=6824%3A61',
      darkModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=6824%3A61',
    },
    {
      themeTokenName: 'bankingTheme',
      lightModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=6824%3A61',
      darkModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=6824%3A61',
    },
  ]);

  return (
    <>
      <Title />
      <Subtitle>
        Alerts are messages that communicate information to users about any significant changes or
        explanations inside the system in a prominent way.
      </Subtitle>
      <Title>Usage</Title>
      <Link withArrow={true} href={figmaURL} target="_blank" rel="noreferrer noopener">
        View in Figma
      </Link>
      <Highlight language="tsx">{`import { Alert } from '@razorpay/blade/components' \nimport type { AlertProps } from '@razorpay/blade/components'`}</Highlight>
      <Title>Example</Title>
      <Subtitle>
        You can change the properties of this button using the controls in the table below.
      </Subtitle>
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

const IconButtonTemplate: ComponentStory<typeof AlertComponent> = ({ ...args }) => {
  return <AlertComponent {...args} />;
};

export const Alert = IconButtonTemplate.bind({});
Alert.storyName = 'Alert';

export default meta;

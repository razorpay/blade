import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import { Highlight, Link } from '@storybook/design-system';
import iconMap from '../../Icons/iconMap';
import useMakeFigmaURL from '../../../_helpers/storybook/useMakeFigmaURL';
import type { ButtonProps } from './Button';
import ButtonComponent from './Button';

const Page = (): ReactElement => {
  const figmaURL = useMakeFigmaURL([
    {
      themeTokenName: 'paymentTheme',
      lightModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=5200%3A0',
      darkModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=5200%3A0',
    },
    {
      themeTokenName: 'bankingTheme',
      lightModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=9611%3A78487',
      darkModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=9611%3A78487',
    },
  ]);

  return (
    <>
      <Title />
      <Subtitle>
        This is the Button component which can be used for various CTAs. It is available in 3
        different variants.
      </Subtitle>
      <Link withArrow={true} href={figmaURL} target="_blank" rel="noreferrer noopener">
        View in Figma
      </Link>
      <br />
      <br />
      <Title>Usage</Title>
      <Highlight language="tsx">{`import { Button } from '@razorpay/blade/components' \nimport type { ButtonProps } from '@razorpay/blade/components'`}</Highlight>
      <Title>Example</Title>
      <Primary />
      <Title>Properties</Title>
      <ArgsTable story={PRIMARY_STORY} />
      <Stories />
    </>
  );
};

export default {
  title: 'Components/Button/Button',
  component: ButtonComponent,
  args: {
    variant: 'primary',
    children: 'Pay Now',
    onClick: (): void => {
      console.log('clicked');
    },
    isDisabled: false,
    size: 'medium',
    iconPosition: 'left',
    isFullWidth: false,
    type: 'button',
  },
  argTypes: {
    icon: {
      name: 'icon',
      type: 'select',
      options: Object.keys(iconMap),
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<ButtonProps>;

const ButtonTemplate: ComponentStory<typeof ButtonComponent> = ({ icon, children, ...args }) => {
  const IconComponent = iconMap[(icon as unknown) as string];

  return (
    <ButtonComponent icon={IconComponent} {...args}>
      {children}
    </ButtonComponent>
  );
};

export const Button = ButtonTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
Button.storyName = 'Button';

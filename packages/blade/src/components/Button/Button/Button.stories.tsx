import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { Highlight, Link } from '@storybook/design-system';
import styled from 'styled-components';
import type { ButtonProps } from './Button';
import ButtonComponent from './Button';
import BaseText from '~components/Typography/BaseText';
import { CreditCardIcon } from '~components/Icons';
import { Text } from '~components/Typography';
import iconMap from '~components/Icons/iconMap';
import useMakeFigmaURL from '~src/_helpers/storybook/useMakeFigmaURL';

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
      <Subtitle>
        This is the default button. You can change the properties of this button using the controls
        in the table below.
      </Subtitle>
      <Primary />
      <Title>Properties</Title>
      <ArgsTable story={PRIMARY_STORY} />
      <Stories />
    </>
  );
};

export default {
  title: 'Components/Button',
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

const StyledBaseText = styled(BaseText)({ padding: '8px 0px' });
const ButtonWithSizeTemplate: ComponentStory<typeof ButtonComponent> = ({
  children = 'Button',
  ...args
}) => {
  return (
    <>
      <StyledBaseText fontWeight="bold">xsmall</StyledBaseText>
      <ButtonComponent {...args} size="xsmall">
        {children}
      </ButtonComponent>

      <StyledBaseText fontWeight="bold">small</StyledBaseText>
      <ButtonComponent {...args} size="small">
        {children}
      </ButtonComponent>

      <StyledBaseText fontWeight="bold">medium</StyledBaseText>
      <ButtonComponent {...args} size="medium">
        {children}
      </ButtonComponent>

      <StyledBaseText fontWeight="bold">large</StyledBaseText>
      <ButtonComponent {...args} size="large">
        {children}
      </ButtonComponent>
    </>
  );
};

const ButtonWithVariantTemplate: ComponentStory<typeof ButtonComponent> = ({
  children = 'Button',
  ...args
}) => {
  return (
    <>
      <StyledBaseText fontWeight="bold">Primary</StyledBaseText>
      <ButtonComponent {...args} variant="primary">
        {children}
      </ButtonComponent>

      <StyledBaseText fontWeight="bold">Secondary</StyledBaseText>
      <ButtonComponent {...args} variant="secondary">
        {children}
      </ButtonComponent>

      <StyledBaseText fontWeight="bold">Tertiary</StyledBaseText>
      <ButtonComponent {...args} variant="tertiary">
        {children}
      </ButtonComponent>
    </>
  );
};

export const Default = ButtonTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
Default.storyName = 'Default';

export const PrimaryButton = ButtonWithSizeTemplate.bind({});
PrimaryButton.storyName = 'Primary';
PrimaryButton.args = {
  variant: 'primary',
};
PrimaryButton.parameters = {
  docs: {
    description: {
      story: 'Primary Button in different sizes',
    },
  },
};

export const SecondaryButton = ButtonWithSizeTemplate.bind({});
SecondaryButton.storyName = 'Secondary';
SecondaryButton.args = {
  variant: 'secondary',
};
SecondaryButton.parameters = {
  docs: {
    description: {
      story: 'Secondary Button in different sizes',
    },
  },
};

export const TertiaryButton = ButtonWithSizeTemplate.bind({});
TertiaryButton.storyName = 'Tertiary';
TertiaryButton.args = {
  variant: 'tertiary',
};
TertiaryButton.parameters = {
  docs: {
    description: {
      story: 'Tertiary Button in different sizes',
    },
  },
};

export const DisabledButton = ButtonWithVariantTemplate.bind({});
DisabledButton.storyName = 'Disabled';
DisabledButton.args = {
  isDisabled: true,
};
DisabledButton.parameters = {
  docs: {
    description: {
      story: 'Primary, Secondary & Tertiary buttons in disabled states',
    },
  },
};

export const IconLeftButton = ButtonWithVariantTemplate.bind({});
IconLeftButton.storyName = 'Left Icon';
IconLeftButton.args = {
  icon: CreditCardIcon,
  iconPosition: 'left',
};
IconLeftButton.parameters = {
  docs: {
    description: {
      story: 'Primary, Secondary & Tertiary buttons with an Icon on Left',
    },
  },
};

export const IconRightButton = ButtonWithVariantTemplate.bind({});
IconRightButton.storyName = 'Right Icon';
IconRightButton.args = {
  icon: CreditCardIcon,
  iconPosition: 'right',
};
IconRightButton.parameters = {
  docs: {
    description: {
      story: 'Primary, Secondary & Tertiary buttons with an Icon on Right',
    },
  },
};

export const IconOnlyButton = ButtonWithVariantTemplate.bind({});
IconOnlyButton.storyName = 'Icon Only';
IconOnlyButton.args = {
  icon: CreditCardIcon,
  children: '',
};
IconOnlyButton.parameters = {
  docs: {
    description: {
      story: 'Primary, Secondary & Tertiary buttons with only an Icon',
    },
  },
};

const ButtonLoadingExample = (args: ButtonProps): React.ReactElement => {
  const [loading, setLoading] = useState(false);

  const toggle = (): void => setLoading((prev) => !prev);

  return (
    <>
      <ButtonComponent {...args} isLoading={loading} />
      <Text>Open voice over (fn+⌘+F5) to hear loading state being announced</Text>
      <ButtonComponent size="small" variant="secondary" onClick={toggle}>
        Toggle loading
      </ButtonComponent>
    </>
  );
};

const ButtonLoadingTemplate: ComponentStory<typeof ButtonComponent> = ({
  icon,
  children,
  ...args
}) => {
  const IconComponent = iconMap[(icon as unknown) as string];
  return (
    <ButtonLoadingExample icon={IconComponent} {...args}>
      {children}
    </ButtonLoadingExample>
  );
};

export const ButtonLoading = ButtonLoadingTemplate.bind({});
ButtonLoading.parameters = {
  docs: {
    description: {
      story: 'Loading state for the button with live announce accessibility support',
    },
  },
};

export const FullWidthButton = ButtonWithVariantTemplate.bind({});
FullWidthButton.storyName = 'Full Width';
FullWidthButton.args = {
  isFullWidth: true,
};
FullWidthButton.parameters = {
  docs: {
    description: {
      story: 'Primary, Secondary & Tertiary buttons with full width',
    },
  },
};

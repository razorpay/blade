import type { StoryFn, Meta } from '@storybook/react';
import { Title, Description, Heading } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import React, { useState } from 'react';
import { Highlight } from '@storybook/design-system';
import styled from 'styled-components';
import type { ButtonProps } from './Button';
import ButtonComponent from './Button';
import { BaseText } from '~components/Typography/BaseText';
import { CreditCardIcon } from '~components/Icons';
import { Text, Heading as HeadingComponent } from '~components/Typography';
import iconMap from '~components/Icons/iconMap';
import BaseBox from '~components/Box/BaseBox';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import type { BladeElementRef } from '~utils/types';
import {
  getBladeCommonEventArgTypes,
  getStyledPropsArgTypes,
} from '~components/Box/BaseBox/storybookArgTypes';
import { castWebType } from '~utils';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="This is the Button component which can be used for various CTAs. It is available in 3 different variants."
      componentName="Button"
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74881-74603&t=2pKzbmnd3phWhn1M-1&scaling=min-zoom&page-id=614%3A1&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox showConsole>
        {`
        import { Button } from '@razorpay/blade/components'
        
        function App() {
          return (
            // Try changing variant here to secondary
            <Button 
              variant="primary" 
              onClick={() => console.log('Tadaaaa')}
            >
              Click Me!
            </Button>
          )
        }

        export default App;
      `}
      </Sandbox>
      <Heading>Usage with Icon</Heading>
      <Description markdown="`icon` prop accepts an `IconComponent` of Blade which should be used as:" />
      <Highlight language="tsx">{`import { Button, CreditCardIcon } from '@razorpay/blade/components'; \n\n &ltButton icon={CreditCardIcon}>Pay Now&lt/Button>`}</Highlight>
      <br />
      <br />
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Button',
  component: ButtonComponent,
  args: {
    variant: 'primary',
    color: 'primary',
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
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
    ...getBladeCommonEventArgTypes(),
    icon: {
      name: 'icon',
      type: 'select',
      options: Object.keys(iconMap),
      mapping: iconMap,
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<ButtonProps>;

const ButtonTemplate: StoryFn<typeof ButtonComponent> = ({ children = 'Button', ...args }) => {
  return <ButtonComponent {...args}>{children}</ButtonComponent>;
};

const StyledBaseText = styled(BaseText)({ padding: '8px 0px' });
const ButtonWithSizeTemplate: StoryFn<typeof ButtonComponent> = ({
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

const ButtonWithVariantTemplate: StoryFn<typeof ButtonComponent> = ({
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

const ButtonWithColorTemplate: StoryFn<typeof ButtonComponent> = ({
  children = 'Button',
  ...args
}) => {
  const colors: ButtonProps['color'][] = ['primary', 'white', 'positive', 'negative'];

  return (
    <>
      {colors.map((color) => {
        const textColor =
          color === 'white' ? 'surface.text.staticWhite.normal' : 'surface.text.staticBlack.normal';
        return (
          <BaseBox
            key={color}
            display="flex"
            flexDirection="row"
            gap="spacing.5"
            backgroundColor={color === 'white' ? 'surface.background.cloud.intense' : 'transparent'}
            margin="spacing.4"
            padding="spacing.5"
          >
            <BaseBox
              width="100px"
              margin="spacing.2"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <HeadingComponent marginBottom="spacing.3" color={textColor} size="medium">
                {color}
              </HeadingComponent>
            </BaseBox>
            <BaseBox margin="spacing.2">
              <Text marginBottom="spacing.3" color={textColor}>
                Primary
              </Text>
              <ButtonComponent {...args} color={color} variant="primary">
                {children}
              </ButtonComponent>

              <ButtonComponent
                marginLeft="spacing.4"
                {...args}
                color={color}
                variant="primary"
                isDisabled
              >
                {children}
              </ButtonComponent>
            </BaseBox>

            <BaseBox margin="spacing.2">
              <Text marginBottom="spacing.3" color={textColor}>
                Secondary
              </Text>
              <ButtonComponent {...args} color={color} variant="secondary">
                {children}
              </ButtonComponent>

              <ButtonComponent
                marginLeft="spacing.4"
                {...args}
                color={color}
                variant="secondary"
                isDisabled
              >
                {children}
              </ButtonComponent>
            </BaseBox>

            {(color == 'primary' || color == 'white') && (
              <BaseBox margin="spacing.2">
                <Text marginBottom="spacing.3" color={textColor}>
                  Tertiary
                </Text>
                <ButtonComponent {...args} color={color} variant="tertiary">
                  {children}
                </ButtonComponent>

                <ButtonComponent
                  marginLeft="spacing.4"
                  {...args}
                  color={color}
                  variant="tertiary"
                  isDisabled
                >
                  {children}
                </ButtonComponent>
              </BaseBox>
            )}
          </BaseBox>
        );
      })}
    </>
  );
};

export const Default = ButtonTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
Default.storyName = 'Default';

export const ButtonWithColors = ButtonWithColorTemplate.bind({});
ButtonWithColors.storyName = 'Button with colors';

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

export const ButtonAsLink = ButtonTemplate.bind({});
ButtonAsLink.args = {
  variant: 'primary',
  children: 'I am Link!',
  href: 'https://razorpay.com/',
  target: '_blank',
  rel: 'noopener noreferrer',
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
    source: {
      code: `<Button variant='primary' icon={CreditCardIcon} iconPosition='left'>Pay Now</Button>
      \n<Button variant='secondary' icon={CreditCardIcon} iconPosition='left'>Pay Now</Button>
      \n<Button variant='tertiary' icon={CreditCardIcon} iconPosition='left'>Pay Now</Button>`,
      language: 'jsx',
      type: 'code',
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
    source: {
      code: `<Button variant='primary' icon={CreditCardIcon} iconPosition='right'>Pay Now</Button>
      \n<Button variant='secondary' icon={CreditCardIcon} iconPosition='right'>Pay Now</Button>
      \n<Button variant='tertiary' icon={CreditCardIcon} iconPosition='right'>Pay Now</Button>`,
      language: 'jsx',
      type: 'code',
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
    source: {
      code: `<Button variant='primary' icon={CreditCardIcon}  />
      \n<Button variant='secondary' icon={CreditCardIcon} />
      \n<Button variant='tertiary' icon={CreditCardIcon} />`,
      language: 'jsx',
      type: 'code',
    },
  },
};

const ButtonLoadingExample = (args: ButtonProps): React.ReactElement => {
  const [loading, setLoading] = useState(false);

  const toggle = (): void => setLoading((prev) => !prev);

  return (
    <>
      <ButtonComponent {...args} isLoading={loading} />
      <BaseBox marginTop="spacing.3" />
      <Text>Open voice over (fn+⌘+F5) to hear loading state being announced</Text>
      <BaseBox marginTop="spacing.3" />
      <ButtonComponent size="small" variant="secondary" onClick={toggle}>
        Toggle loading
      </ButtonComponent>
    </>
  );
};

const ButtonLoadingTemplate: StoryFn<typeof ButtonComponent> = ({
  children = 'Button',
  ...args
}) => {
  return <ButtonLoadingExample {...args}>{children}</ButtonLoadingExample>;
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

export const ButtonRef: StoryFn<typeof ButtonComponent> = () => {
  const buttonRef = React.useRef<BladeElementRef>(null);

  return (
    <BaseBox gap="spacing.3" display="flex">
      <ButtonComponent ref={buttonRef}>Button</ButtonComponent>
      <ButtonComponent onClick={() => castWebType(buttonRef?.current)?.focus()}>
        Click to focus other button
      </ButtonComponent>
    </BaseBox>
  );
};

ButtonRef.storyName = 'Button Ref';
ButtonRef.parameters = {
  docs: {
    description: {
      story:
        'Button component exposes the `ref` prop. The `ref` exposes two methods `focus` & `scrollIntoView` which can be used to programatically control the DOM element',
    },
  },
};

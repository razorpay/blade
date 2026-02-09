import type { StoryFn, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import type { AlertProps } from './Alert';
import { Alert as AlertComponent } from './Alert';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Alert"
      componentDescription="Alerts are messages that communicate information to users about any significant changes or explanations inside the system in a prominent way."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=6824-100&t=G19TEPr7l1vIpcWY-1&scaling=min-zoom&page-id=6824%3A0&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox editorHeight={500}>
        {`
        import { Alert } from '@razorpay/blade/components';

        function App() {
          return (
            <Alert
              title="Alert Title"
              description="Add your description message here"
              marginTop="spacing.4"
              actions={{
                primary: {
                  onClick: () => {
                    alert('Alert from the alert hehe');
                  },
                  text: 'Primary Action',
                },
                secondary: {
                  href: 'https://razorpay.com',
                  target: '_blank',
                  text: 'Go to Razorpay.com',
                },
              }}
            />
          );
        }
        
        export default App;        
        `}
      </Sandbox>
    </StoryPageWrapper>
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
    isDismissible: true,
    emphasis: 'subtle',
    color: 'information',
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
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
    onDismiss: { action: 'Dismissed' },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
};

const AlertTemplate: StoryFn<typeof AlertComponent> = ({ ...args }) => {
  return <AlertComponent {...args} />;
};

export const Default = AlertTemplate.bind({});

export const HighEmphasis = AlertTemplate.bind({});
HighEmphasis.args = {
  emphasis: 'intense',
  color: 'notice',
};
HighEmphasis.parameters = {
  docs: {
    description: {
      story: 'A high emphasis Alert for more prominent look',
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
  isDismissible: false,
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
  color: 'notice',
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
  color: 'negative',
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

export const FullWidth: StoryFn<typeof AlertComponent> = ({ ...args }) => {
  return (
    <BaseBox height="200px" position="relative">
      <BaseBox position="absolute" width="100%">
        <AlertComponent {...args} />
      </BaseBox>
    </BaseBox>
  );
};
FullWidth.args = {
  description: 'Currently you can only accept payments in international currencies using PayPal.',
  color: 'notice',
  actions: undefined,
  title: undefined,
  isFullWidth: true,
};
FullWidth.parameters = {
  docs: {
    description: {
      story:
        'A full width Alert can be used to span the entire width of its container. It also makes the Alert borderless and can be used for full-bleed layouts. You can also wrap the alert and adjust layout with absolute positioning if needed.',
    },
  },
};

export const FullWidthWithActions: StoryFn<typeof AlertComponent> = ({ ...args }) => {
  return (
    <BaseBox height="200px" position="relative">
      <BaseBox position="absolute" width="100%">
        <AlertComponent {...args} />
      </BaseBox>
    </BaseBox>
  );
};
FullWidthWithActions.args = {
  description: 'Currently you can only accept payments in international currencies using PayPal.',
  color: 'negative',
  isFullWidth: true,
};
FullWidthWithActions.parameters = {
  docs: {
    description: {
      story:
        'A full width Alert with `actions` will render them inline if there is enough space and responsively wrap them to the next line in smaller displays.',
    },
  },
};

const intents = [
  { label: 'Positive', color: 'positive' },
  { label: 'Negative', color: 'negative' },
  { label: 'Notice', color: 'notice' },
  { label: 'Information', color: 'information' },
  { label: 'Neutral', color: 'neutral' },
] as const;

const renderAlertGrid = ({ isFullWidth }: { isFullWidth: boolean }): ReactElement => {
  return (
    <BaseBox display="flex" flexDirection="column" gap="spacing.6">
      <BaseBox
        display="grid"
        gridTemplateColumns={{ base: '1fr', m: '1fr 1fr' }}
        gap="spacing.4"
        width="100%"
      >
        <BaseBox>
          <Text size="small" weight="semibold" color="surface.text.gray.subtle">
            Subtle
          </Text>
        </BaseBox>
        <BaseBox>
          <Text size="small" weight="semibold" color="surface.text.gray.subtle">
            Intense
          </Text>
        </BaseBox>
      </BaseBox>
      {intents.map(({ label, color }) => {
        return (
          <BaseBox key={color} display="flex" flexDirection="column" gap="spacing.3">
            <Text size="small" weight="semibold" color="surface.text.gray.subtle">
              {label}
            </Text>
            <BaseBox
              display="grid"
              gridTemplateColumns={{ base: '1fr', m: '1fr 1fr' }}
              gap="spacing.4"
              width="100%"
            >
              <BaseBox>
                <AlertComponent
                  title="Alert Title"
                  description="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries."
                  color={color}
                  actions={{
                    primary: {
                      text: 'Button',
                      onClick: () => {
                        console.log('Primary action clicked');
                      },
                    },
                    secondary: {
                      text: 'Link',
                      href: 'https://razorpay.com',
                      target: '_blank',
                    },
                  }}
                  isFullWidth={isFullWidth}
                />
              </BaseBox>
              <BaseBox>
                <AlertComponent
                  title="Alert Title"
                  description="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries."
                  color={color}
                  emphasis="intense"
                  actions={{
                    primary: {
                      text: 'Button',
                      onClick: () => {
                        console.log('Primary action clicked');
                      },
                    },
                    secondary: {
                      text: 'Link',
                      href: 'https://razorpay.com',
                      target: '_blank',
                    },
                  }}
                  isFullWidth={isFullWidth}
                />
              </BaseBox>
            </BaseBox>
          </BaseBox>
        );
      })}
    </BaseBox>
  );
};

export const Showcase: StoryFn<typeof AlertComponent> = () => {
  return (
    <BaseBox display="flex" flexDirection="column" gap="spacing.8">
      <BaseBox display="flex" flexDirection="column" gap="spacing.4">
        <Text size="medium" weight="semibold" color="surface.text.gray.subtle">
          Default Width
        </Text>
        {renderAlertGrid({ isFullWidth: false })}
      </BaseBox>
      <BaseBox display="flex" flexDirection="column" gap="spacing.4">
        <Text size="medium" weight="semibold" color="surface.text.gray.subtle">
          Full Width
        </Text>
        {renderAlertGrid({ isFullWidth: true })}
      </BaseBox>
    </BaseBox>
  );
};
Showcase.parameters = {
  docs: {
    description: {
      story:
        'A visual grid to compare Alert intents across subtle and intense emphasis, for both default width and full width layouts.',
    },
  },
};

export const SubtleStack: StoryFn<typeof AlertComponent> = () => {
  return (
    <BaseBox display="flex" flexDirection="column" gap="spacing.6">
      <AlertComponent
        title="Alert Title"
        description="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries."
        actions={{
          primary: {
            text: 'Button',
            onClick: () => {
              console.log('Primary action clicked');
            },
          },
          secondary: {
            text: 'Link',
            href: 'https://razorpay.com',
            target: '_blank',
          },
        }}
        color="positive"
      />
      <AlertComponent
        description="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries."
        actions={{
          primary: {
            text: 'Button',
            onClick: () => {
              console.log('Primary action clicked');
            },
          },
          secondary: {
            text: 'Link',
            href: 'https://razorpay.com',
            target: '_blank',
          },
        }}
        color="positive"
      />
      <AlertComponent
        description="This is a placeholder text"
        actions={undefined}
        color="positive"
      />
      <AlertComponent
        description="This is a placeholder text"
        actions={undefined}
        color="positive"
      />
      <AlertComponent
        description="This is a placeholder text"
        actions={undefined}
        color="positive"
      />
      <AlertComponent
        description="This is a placeholder text"
        actions={undefined}
        color="positive"
      />
      <AlertComponent
        description="This is a placeholder text"
        actions={undefined}
        color="positive"
      />
      <AlertComponent
        title="Alert Title"
        description="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries."
        actions={{
          primary: {
            text: 'Button',
            onClick: () => {
              console.log('Primary action clicked');
            },
          },
          secondary: {
            text: 'Link',
            href: 'https://razorpay.com',
            target: '_blank',
          },
        }}
        color="positive"
      />
      <AlertComponent
        description="Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries."
        actions={{
          primary: {
            text: 'Button',
            onClick: () => {
              console.log('Primary action clicked');
            },
          },
          secondary: {
            text: 'Link',
            href: 'https://razorpay.com',
            target: '_blank',
          },
        }}
        color="positive"
      />
    </BaseBox>
  );
};
SubtleStack.parameters = {
  docs: {
    description: {
      story: 'A subtle information alert stack to showcase compact layouts and repeated messaging.',
    },
  },
};

export default meta;

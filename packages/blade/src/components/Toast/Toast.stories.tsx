/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Title } from '@storybook/addon-docs';
import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { useToast } from './useToast';
import { Toast } from './Toast';
import type { ToastProps } from './';
import { ToastContainer } from './';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Heading, Text } from '~components/Typography';
import { List, ListItem, ListItemCode } from '~components/List';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Toast"
      componentDescription="Toast is a feedback element to display temporary short messages in the interface"
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=75839-1125191&t=J1cSX69DjMGlLgC9-1&scaling=min-zoom&page-id=7665%3A27414&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { ToastContainer, useToast } from '@razorpay/blade/components';

        function App() {
          const toast = useToast();

          // Integrating Blade Toast in your App
          // 1. Render the ToastContainer component at the root of your app
          // 2. Utilize the methods exposed via useToast hook to show/dismiss toasts
          return (
            <Box>
              <ToastContainer />
              <Button 
                onClick={() => {
                  toast.show({ content: 'Payment successful', color: 'positive' })
                }}
              >
                Show Toast
              </Button>
            </Box>
          );
        }
        
        export default App;        
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  argTypes: {
    isVisible: {
      table: {
        disable: true,
      },
    },
    id: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<ToastProps>;

const texts = {
  negative: 'Unable to fetch merchant details',
  positive: 'Customer details failed successfully',
  notice: 'Your KYC is pending',
  information: 'Your transaction will be settled in 3 business days',
  neutral: 'Your transaction will be settled in 3 business days',
} as const;

const BasicToastTemplate: StoryFn<ToastProps> = (args) => {
  const toast = useToast();

  if (args.type === 'promotional') {
    args.content = <Text size="small">{args.content}</Text>;
  }

  return (
    <Box height="80vh">
      <Text size="medium" marginBottom="spacing.4">
        To start using toast simply:
      </Text>
      <List>
        <ListItem>
          Import and render the <ListItemCode>ToastContainer</ListItemCode> component from blade at
          the root of your project
        </ListItem>
        <ListItem>
          Utilize the methods exposed via <ListItemCode>useToast()</ListItemCode> hook to
          show/dismiss toasts
        </ListItem>
      </List>
      <Text marginY="spacing.4" color="surface.text.gray.muted">
        After changing storybook controls, press the "show toast" button to see changes
      </Text>
      <Button
        onClick={() => {
          toast.show(args);
        }}
      >
        Show Toast
      </Button>
      <ToastContainer />
    </Box>
  );
};

BasicToastTemplate.storyName = 'Basic';
export const Basic = BasicToastTemplate.bind({});
Basic.args = {
  color: 'neutral',
  type: 'informational',
  autoDismiss: false,
  content: 'Payment successful',
  action: {
    text: 'Okay',
    onClick: ({ toastId }) => console.log(toastId),
  },
};

const ToastVariantsTemplate: StoryFn<ToastProps> = () => {
  const toast = useToast();
  const hasPromoToast = toast.toasts.some((t) => t.type === 'promotional');

  const showInformationalToast = ({ color }: { color: ToastProps['color'] }) => {
    toast.show({
      content: texts[color!],
      color,
      action: {
        text: 'Okay',
        onClick: ({ toastId }) => toast.dismiss(toastId),
      },
      onDismissButtonClick: ({ toastId }) => console.log(`${toastId} Dismissed!`),
    });
  };

  const showPromotionalToast = () => {
    toast.show({
      type: 'promotional',
      content: (
        <Box display="flex" gap="spacing.3" flexDirection="column">
          <Heading>Introducing TurboUPI</Heading>
          <img
            loading="lazy"
            width="100%"
            height="100px"
            alt="Promotional Toast"
            style={{ objectFit: 'cover', borderRadius: '8px' }}
            src="https://d6xcmfyh68wv8.cloudfront.net/blog-content/uploads/2023/05/Features-blog.png"
          />
          <Text weight="semibold">Lightning-fast payments with the new Razorpay Turbo UPI</Text>
          <Text size="xsmall">
            Turbo UPI allows end-users to complete their payment in-app, with no redirections or
            dependence on third-party UPI apps. With Turbo UPI, payments will be 5x faster with a
            significantly-improved success rate of 10%!
          </Text>
        </Box>
      ),
      action: {
        text: 'Try TurboUPI',
        onClick: ({ toastId }) => toast.dismiss(toastId),
      },
      onDismissButtonClick: ({ toastId }) => console.log(`${toastId} Dismissed!`),
    });
  };

  return (
    <Box height="80vh">
      <Text>Show Informational Toasts:</Text>
      <Box display="flex" gap="spacing.3" marginY="spacing.5">
        <Button variant="tertiary" onClick={() => showInformationalToast({ color: 'positive' })}>
          Positive
        </Button>
        <Button variant="tertiary" onClick={() => showInformationalToast({ color: 'negative' })}>
          Negative
        </Button>
        <Button variant="tertiary" onClick={() => showInformationalToast({ color: 'notice' })}>
          Notice
        </Button>
        <Button variant="tertiary" onClick={() => showInformationalToast({ color: 'information' })}>
          Information
        </Button>
        <Button variant="tertiary" onClick={() => showInformationalToast({ color: 'neutral' })}>
          Neutral
        </Button>
      </Box>
      <Text>Show Promotional Toasts:</Text>
      <Text size="small" color="surface.text.gray.muted">
        Note: There can only be 1 promotional toast at a time
      </Text>
      <Box display="flex" gap="spacing.3" marginY="spacing.5">
        <Button
          variant="tertiary"
          onClick={() => showPromotionalToast()}
          isDisabled={hasPromoToast}
        >
          Promotional
        </Button>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export const ToastVariants = ToastVariantsTemplate.bind({});
ToastVariants.storyName = 'Toast Variants';

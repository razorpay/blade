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

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Toast"
      componentDescription="Toast is a feedback element to display temporary short messages in the interface"
      figmaURL="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=75839-1125191&mode=design&t=SLxhqgKm27oCjSYV-4"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { ToastContainer, useToast } from '@razorpay/blade/components';

        function App(): React.ReactElement {
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

const BasicToastTemplate: StoryFn<ToastProps> = (args) => {
  const toast = useToast();

  if (args.type === 'promotional') {
    args.content = <Text size="small">{args.content}</Text>;
  }

  return (
    <Box>
      <Text marginBottom="spacing.3" color="surface.text.gray.subtle">
        After changing storybook controls, press the show "toast button" to see changes
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

  const showInformationalToast = ({ color }: { color: ToastProps['color'] }) => {
    toast.show({
      content: `Payment ${color}`,
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
    <Box>
      <Text>Show Informational Toasts:</Text>
      <Box display="flex" gap="spacing.3" marginY="spacing.4">
        <Button variant="tertiary" onClick={() => showInformationalToast({ color: 'positive' })}>
          Positive
        </Button>
        <Button variant="tertiary" onClick={() => showInformationalToast({ color: 'negative' })}>
          Negative
        </Button>
        <Button variant="tertiary" onClick={() => showInformationalToast({ color: 'warning' })}>
          Warning
        </Button>
        <Button variant="tertiary" onClick={() => showInformationalToast({ color: 'information' })}>
          Information
        </Button>
        <Button variant="tertiary" onClick={() => showInformationalToast({ color: 'neutral' })}>
          Neutral
        </Button>
      </Box>
      <Text>Show Promotional Toasts:</Text>
      <Box display="flex" gap="spacing.3" marginY="spacing.4">
        <Button variant="tertiary" onClick={() => showPromotionalToast()}>
          Promotional
        </Button>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export const ToastVariants = ToastVariantsTemplate.bind({});
ToastVariants.storyName = 'Toast Variants';
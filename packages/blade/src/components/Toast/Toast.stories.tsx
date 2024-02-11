/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Title } from '@storybook/addon-docs';
import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { useToasterStore } from 'react-hot-toast';
import { useToast } from './useToast';
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
      componentDescription="A switch component is used to quickly switch between two possible states. These are only used for binary actions that occur immediately after the user turn the switch on/off."
      figmaURL="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=13227%3A163026"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { Switch } from '@razorpay/blade/components';

        function App(): React.ReactElement {
          return (
            // Check console
            <Switch
              onChange={(e) => console.log(e.isChecked)}
              accessibilityLabel="Toggle DarkMode"
            />
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
  component: ToastContainer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<ToastProps>;

const ToastTemplate: StoryFn<typeof ToastContainer> = () => {
  const toast = useToast();
  const { toasts } = useToasterStore();
  const promoToasts = React.useMemo(
    // @ts-expect-error
    () => toasts.filter((toast) => toast.type === 'promotional' && toast.visible),
    [toasts],
  );
  const hasPromoToast = promoToasts.length > 0;
  return (
    <Box>
      <ToastContainer />
      <Button
        onClick={() =>
          toast.show({
            content:
              Math.random() > 0.5
                ? 'Payment Successful'
                : 'Razorpay Turbo UPI streamlines all the friction points of previous flows. Businesses can now manage the UPI checkout experience within their app, without the user ever leaving the app',
            // @ts-expect-error
            color: ['positive', 'negative', 'warning', 'information', 'neutral'][
              Math.floor(Math.random() * 5)
            ],
            action: {
              text: 'Okay',
              onClick: () => console.log(1),
            },
            onDismissButtonClick: () => console.log(1),
          })
        }
      >
        show info
      </Button>
      <Button
        marginLeft="spacing.3"
        isDisabled={hasPromoToast}
        onClick={() =>
          toast.show({
            type: 'promotional',
            content: (
              <Box display="flex" gap="spacing.3" flexDirection="column">
                <Heading>Introducing TurboUPI</Heading>
                <img
                  loading="lazy"
                  src="https://d6xcmfyh68wv8.cloudfront.net/blog-content/uploads/2023/05/Features-blog.png"
                  width="100%"
                  height="100px"
                  alt="Promotional Toast"
                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                />
                <Text weight="semibold">
                  Lightning-fast payments with the new Razorpay Turbo UPI
                </Text>
                <Text size="xsmall">
                  Turbo UPI allows end-users to complete their payment in-app, with no redirections
                  or dependence on third-party UPI apps. With Turbo UPI, payments will be 5x faster
                  with a significantly-improved success rate of 10%!
                </Text>
              </Box>
            ),
            action: {
              text: 'Try TurboUPI',
              onClick: () => console.log(1),
            },
            onDismissButtonClick: () => console.log(1),
          })
        }
      >
        show promo
      </Button>
    </Box>
  );
};

export const Default = ToastTemplate.bind({});
Default.storyName = 'Default';

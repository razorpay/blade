/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Title } from '@storybook/addon-docs/blocks';
import type { StoryFn, Meta } from '@storybook/react-vite';
import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useToast } from './useToast';
import { Toast } from './Toast';
import type { ToastProps } from './';
import { ToastContainer } from './';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { castWebType, makeMotionTime } from '~utils';
import { useTheme } from '~components/BladeProvider';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Heading, Text } from '~components/Typography';
import { List, ListItem, ListItemCode } from '~components/List';
import { AnnouncementIcon, ArrowRightIcon } from '~components/Icons';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '~components/Modal';

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
  information:
    'Your transaction will be settled in 3 business days, this is a long message to test the toast container overflow behavior',
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
      leading: AnnouncementIcon,
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

const ContainerOffsetTemplate: StoryFn<ToastProps> = () => {
  const toast = useToast();

  const showToast = () => {
    toast.show({
      content: 'This toast appears with custom bottom offset',
      color: 'information',
      action: {
        text: 'Dismiss',
        onClick: ({ toastId }) => toast.dismiss(toastId),
      },
    });
  };

  return (
    <Box height="80vh">
      <Text size="medium" marginBottom="spacing.4">
        ToastContainer with custom `offsetBottom`
      </Text>
      <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.6">
        The toast will appear 100px from the bottom of the viewport instead of the default position
      </Text>
      <Button onClick={showToast}>Show Toast with Custom Offset</Button>
      <ToastContainer offsetBottom={100} />
    </Box>
  );
};

export const ContainerOffset = ContainerOffsetTemplate.bind({});
ContainerOffset.storyName = 'Container Offset';

const ZIndexTemplate: StoryFn<ToastProps> = () => {
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const showToastAboveModal = () => {
    toast.show({
      content: 'This toast has z-index 3000 and appears above the modal (z-index 2000)',
      color: 'positive',
      duration: 10000,
      action: {
        text: 'Dismiss',
        onClick: ({ toastId }) => toast.dismiss(toastId),
      },
    });
  };

  return (
    <Box height="80vh">
      <Text size="medium" marginBottom="spacing.4">
        Toast with Custom zIndex
      </Text>

      <Box
        marginTop="spacing.6"
        paddingTop="spacing.6"
        borderTopWidth="thin"
        borderTopColor="surface.border.gray.muted"
      >
        <Text size="medium" marginBottom="spacing.4">
          Toast Above Modal Demo
        </Text>
        <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.6">
          Open a full-page modal with z-index 2000, then show a toast with z-index 3000 to see it
          appear above the modal.
        </Text>
        <Box display="flex" gap="spacing.3">
          <Button onClick={() => setIsModalOpen(true)}>Open Modal (z-index 2000)</Button>
          {isModalOpen && (
            <Button onClick={showToastAboveModal}>Show Toast Above Modal (z-index 3000)</Button>
          )}
        </Box>
      </Box>
      <Modal isOpen={isModalOpen} onDismiss={() => setIsModalOpen(false)} size="full" zIndex={2000}>
        <ModalHeader title="Modal with z-index 2000" />
        <ModalBody>
          <Text marginBottom="spacing.4">
            This is a full-page modal with z-index 2000. Click the button below to show a toast with
            z-index 3000, which will appear above this modal.
          </Text>
          <Button onClick={showToastAboveModal}>Show Toast Above Modal (z-index 3000)</Button>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Close Modal
          </Button>
        </ModalFooter>
      </Modal>
      <ToastContainer zIndex={3000} />
    </Box>
  );
};

export const ZIndex = ZIndexTemplate.bind({});
ZIndex.storyName = 'Z-Index';

const PromotionalWithProgressBarTemplate: StoryFn<ToastProps> = () => {
  const toast = useToast();
  const hasPromoToast = toast.toasts.some((t) => t.type === 'promotional');

  const showToast = () => {
    toast.show({
      type: 'promotional',
      leading: AnnouncementIcon,
      autoDismiss: true,
      showProgressBar: true,
      content: (
        <Box display="flex" gap="spacing.2" flexDirection="column">
          <Heading size="small">Your monthly report is ready</Heading>
          <Text size="small">
            See payments, refunds and settlements of last month in one place.
          </Text>
        </Box>
      ),
      action: {
        text: 'View report',
        onClick: ({ toastId }) => toast.dismiss(toastId),
      },
    });
  };

  return (
    <Box height="80vh">
      <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.4">
        The bar shows the time left. Hover the toast or move focus into it to pause the timer.
      </Text>
      <Button onClick={showToast} isDisabled={hasPromoToast}>
        Show Promotional Toast
      </Button>
      <ToastContainer />
    </Box>
  );
};

export const PromotionalWithProgressBar = PromotionalWithProgressBarTemplate.bind({});
PromotionalWithProgressBar.storyName = 'Promotional With Progress Bar';

const PromotionalWithLinkActionTemplate: StoryFn<ToastProps> = () => {
  const toast = useToast();
  const hasPromoToast = toast.toasts.some((t) => t.type === 'promotional');

  const showToast = () => {
    toast.show({
      type: 'promotional',
      leading: AnnouncementIcon,
      content: (
        <Box display="flex" gap="spacing.2" flexDirection="column">
          <Heading size="small">Reports are now faster</Heading>
          <Text size="small">Download any report in a few seconds.</Text>
        </Box>
      ),
      action: {
        text: 'See what is new',
        variant: 'link',
        href: 'https://blade.razorpay.com',
        target: '_blank',
        icon: ArrowRightIcon,
        iconPosition: 'right',
      },
    });
  };

  return (
    <Box height="80vh">
      <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.4">
        Set the action variant to link to render the action as a Link.
      </Text>
      <Button onClick={showToast} isDisabled={hasPromoToast}>
        Show Promotional Toast
      </Button>
      <ToastContainer />
    </Box>
  );
};

export const PromotionalWithLinkAction = PromotionalWithLinkActionTemplate.bind({});
PromotionalWithLinkAction.storyName = 'Promotional With Link Action';

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(100%);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Both frames sit in one grid cell, so the toast keeps one height for the intro and the main frame
const Frame = styled.div<{ isActive: boolean }>(
  ({ isActive, theme }) => css`
    grid-area: 1 / 1;
    visibility: ${isActive ? 'visible' : 'hidden'};
    ${isActive &&
    css`
      animation: ${slideUp} ${makeMotionTime(theme.motion.duration.gentle)}
        ${castWebType(theme.motion.easing.entrance)} both;
    `}
  `,
);

const IntroContent = ({ introDuration }: { introDuration: number }) => {
  const [isIntroDone, setIsIntroDone] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => setIsIntroDone(true), introDuration);
    return () => clearTimeout(timeout);
  }, [introDuration]);

  return (
    <Box display="grid">
      <Frame isActive={!isIntroDone}>
        <Heading size="large">
          Meet your new
          <br />
          reports page
        </Heading>
      </Frame>
      <Frame isActive={isIntroDone}>
        <Box display="flex" gap="spacing.2" flexDirection="column">
          <Heading size="small">Reports are now faster</Heading>
          <Text size="small">Download any report in a few seconds.</Text>
        </Box>
      </Frame>
    </Box>
  );
};

const PromotionalWithIntroTemplate: StoryFn<ToastProps> = () => {
  const toast = useToast();
  const { theme } = useTheme();
  const hasPromoToast = toast.toasts.some((t) => t.type === 'promotional');
  const introDuration = theme.motion.delay.long;

  const showToast = () => {
    toast.show({
      type: 'promotional',
      autoDismiss: true,
      showProgressBar: true,
      introDuration,
      content: <IntroContent introDuration={introDuration} />,
      action: {
        text: 'See what is new',
        variant: 'link',
        href: 'https://blade.razorpay.com',
        target: '_blank',
        icon: ArrowRightIcon,
        iconPosition: 'right',
      },
    });
  };

  return (
    <Box height="80vh">
      <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.4">
        The content plays its own intro. The introDuration prop matches the intro, so the action,
        the timer and the bar start with the main content. Keep every frame the same height.
      </Text>
      <Button onClick={showToast} isDisabled={hasPromoToast}>
        Show Promotional Toast
      </Button>
      <ToastContainer />
    </Box>
  );
};

export const PromotionalWithIntro = PromotionalWithIntroTemplate.bind({});
PromotionalWithIntro.storyName = 'Promotional With Intro';

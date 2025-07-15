import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import type { ModalProps } from '../Modal';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../Modal';
import { useBreakpoint, useTheme } from '../../../utils';
import AlertPng from './assets/alert.png';
import DonateNow from './assets/donatenow.png';
import DonationsButton from './assets/donationButton.png';
import Card4 from './assets/card4.png';
import PayNow from './assets/paynow.png';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import type { ButtonProps } from '~components/Button';
import { MapIcon, LockIcon, ShareIcon, CopyIcon, PhoneIcon, MailIcon } from '~components/Icons';
import type { IconColors, IconComponent } from '~components/Icons';
import { Heading, Text } from '~components/Typography';
import { Badge } from '~components/Badge';
import { Card, CardBody } from '~components/Card';
import { OTPInput } from '~components/Input/OTPInput';
import { Link } from '~components/Link';
import { TextInput } from '~components/Input/TextInput';
import { Divider } from '~components/Divider';
import type { BottomSheetBodyProps } from '~components/BottomSheet';
import { BottomSheet, BottomSheetBody, BottomSheetHeader } from '~components/BottomSheet';
import type { ModalBodyProps } from '~components/Modal';

export default {
  title: 'Patterns/Modal',
  component: Modal,
  args: {
    size: 'medium',
  },
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="This is a Modal component. This story is used for snapshot testing of Modal component."
          componentName="Modal"
        />
      ),
    },
  },
} as Meta<ModalProps>;

const ConformationalModalBody = ({
  type = 'neutral',
  icon: Icon,
  title,
  description,
}: {
  type: 'neutral' | 'negative' | 'positive';
  icon: IconComponent;
  title: string;
  description: string;
}): React.ReactNode => {
  const { theme } = useTheme();
  const getIconColor = (): IconColors => {
    if (type === 'neutral') {
      return 'surface.icon.gray.subtle';
    } else if (type === 'negative') {
      return 'feedback.icon.negative.intense';
    }
    return 'feedback.icon.positive.intense';
  };
  const getBackgroundColor = (): string => {
    if (type === 'neutral') {
      return theme.colors.interactive.background.gray.default;
    } else if (type === 'negative') {
      return theme.colors.feedback.background.negative.subtle;
    }
    return theme.colors.surface.background.primary.subtle;
  };

  return (
    <>
      {' '}
      <Box display="flex" flexDirection="column" gap="spacing.5">
        <div
          style={{
            backgroundColor: getBackgroundColor(),
            width: 'fit-content',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: theme.border.radius.medium,
            padding: theme.spacing[4],
          }}
        >
          <Icon color={getIconColor()} />
        </div>

        <Box display="flex" flexDirection="column" gap="spacing.3">
          <Heading size="large" weight="semibold">
            {title}
          </Heading>
          <Text>{description}</Text>
        </Box>
      </Box>
    </>
  );
};

const ConformationModalFooter = ({
  primaryButtonText,
  secondaryButtonText,
  type,
}: {
  primaryButtonText: string;
  secondaryButtonText?: string;
  type: 'neutral' | 'negative' | 'positive';
}): React.ReactNode => {
  const getPrimaryButtonColor = (): ButtonProps['color'] => {
    if (type === 'neutral') {
      return 'primary';
    } else if (type === 'negative') {
      return 'negative';
    }
    return 'positive';
  };

  return (
    <Box display="flex" flexDirection="row" gap="spacing.3" justifyContent="space-between">
      {secondaryButtonText && (
        <Button variant="tertiary" isFullWidth>
          {secondaryButtonText}
        </Button>
      )}

      <Button isFullWidth color={getPrimaryButtonColor()}>
        {primaryButtonText}
      </Button>
    </Box>
  );
};

const ResponsiveModalWrapper = ({
  children,
  footer,
  isOpen,
  onDismiss,
  modalBodyPadding,
  modalSize = 'small',
}: {
  children: React.ReactElement | React.ReactElement[];
  footer?: React.ReactElement;
  isOpen: boolean;
  onDismiss: () => void;
  modalBodyPadding?: ModalBodyProps['padding'];
  modalSize?: ModalProps['size'];
}): React.ReactNode => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  if (isMobile) {
    return (
      <BottomSheet isOpen={isOpen} onDismiss={onDismiss} snapPoints={[0.35, 0.5, 0.85]}>
        <BottomSheetHeader />
        <BottomSheetBody padding={modalBodyPadding as BottomSheetBodyProps['padding']}>
          {children}
          {footer && <Box marginTop="spacing.6">{footer}</Box>}
        </BottomSheetBody>
      </BottomSheet>
    );
  }

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} size={modalSize}>
      <ModalHeader />
      <ModalBody padding={modalBodyPadding}>{children}</ModalBody>
      {footer && <ModalFooter>{footer}</ModalFooter>}
    </Modal>
  );
};

const NeutralModalTemplate: StoryFn<typeof Modal> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <ResponsiveModalWrapper
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        footer={
          <ConformationModalFooter
            type="neutral"
            primaryButtonText="Yes"
            secondaryButtonText="No"
          />
        }
      >
        <ConformationalModalBody
          type="neutral"
          icon={MapIcon}
          title="Restart the Tour?"
          description="This tour will give a quick guide on this product"
        />
      </ResponsiveModalWrapper>
    </Box>
  );
};

export const NeutralModal = NeutralModalTemplate.bind({});
NeutralModal.storyName = 'Confirmation Modal - Neutral';

const NegativeModalTemplate: StoryFn<typeof Modal> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <ResponsiveModalWrapper
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        footer={
          <ConformationModalFooter
            type="negative"
            primaryButtonText="Yes"
            secondaryButtonText="No"
          />
        }
      >
        <ConformationalModalBody
          type="negative"
          icon={MapIcon}
          title="Restart the Tour?"
          description="This tour will give a quick guide on this product"
        />
      </ResponsiveModalWrapper>
    </Box>
  );
};

export const NegativeModal = NegativeModalTemplate.bind({});
NegativeModal.storyName = 'Confirmation Modal - Negative';

const InformationModalTemplate: StoryFn<typeof Modal> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <ResponsiveModalWrapper
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        modalBodyPadding="spacing.0"
      >
        <ModalBody padding="spacing.0">
          <img src={AlertPng} alt="Alert" width={isMobile ? '100%' : '400px'} height={200} />
          <Box margin="spacing.6">
            <Badge color="negative">Action Required </Badge>
            <Box marginTop="spacing.4">
              <Heading size="large" weight="semibold">
                Update your KYC by 5th July
              </Heading>
              <Text>
                Subtitle go here, support details helps your customers to easily reach out to you
                when they face any.
              </Text>
            </Box>
          </Box>
          <Box marginX="spacing.6" marginBottom="spacing.6">
            <Button isFullWidth>Update KYC</Button>
          </Box>
        </ModalBody>
      </ResponsiveModalWrapper>
    </Box>
  );
};

export const InformationModal = InformationModalTemplate.bind({});
InformationModal.storyName = 'Information Modal';

const FlowSelectionModalTemplate: StoryFn<typeof Modal> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedMethod, setSelectedMethod] = React.useState('');

  const paymentMethods = [
    {
      value: 'quickpay',
      title: 'Quick Pay Button',
      subtitle:
        'Accepting fixed price payments?  Customers make quick payments of fixed price through this button',
      img: DonateNow,
    },
    {
      value: 'buynow',
      title: 'Buy Now Button',
      subtitle:
        'Selling products or event tickets?  Sell multiple items with support for quantity using this button.',
      img: DonationsButton,
    },
    {
      value: 'donations',
      title: 'Donations Button',
      subtitle:
        'Raising money for a good cause?  Supporters can pick from presets or donate amount of their choice',
      img: PayNow,
    },
    {
      value: 'custom',
      title: 'Custom Button',
      subtitle:
        'Build your own button with your own design and branding. You can also use our pre-built templates.',
      img: Card4,
    },
  ];

  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <ResponsiveModalWrapper
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false);
        }}
        modalSize="large"
        footer={
          <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              isDisabled={!selectedMethod}
              onClick={() => {
                console.log('Selected payment method:', selectedMethod);
                setIsOpen(false);
              }}
            >
              Proceed
            </Button>
          </Box>
        }
        modalBodyPadding="spacing.0"
      >
        <Box padding="spacing.6">
          <Heading size="small" weight="semibold">
            Pick a Button Type
          </Heading>
          <Text color="surface.text.gray.muted">
            Pick a button which meets your requirements and get a head start on collecting payments
            or you could build your own
          </Text>
        </Box>
        <Box padding="spacing.6">
          <Box display="flex" flexDirection="row" gap="spacing.4" flexWrap="wrap">
            {paymentMethods.map((method) => (
              <Card
                key={method.value}
                isSelected={selectedMethod === method.value}
                onClick={() => setSelectedMethod(method.value)}
                padding="spacing.0"
                accessibilityLabel={`Select ${method.title}`}
                width={isMobile ? '160px' : '230px'}
                borderRadius="medium"
              >
                <CardBody>
                  <Box overflow="none">
                    <img
                      src={method.img}
                      alt={method.title}
                      width={isMobile ? '160px' : '230px'}
                      height="130px"
                    />
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="row"
                    gap="spacing.4"
                    alignItems="center"
                    paddingX="spacing.5"
                    paddingY="spacing.4"
                  >
                    <Box>
                      <Text size="medium" weight="semibold">
                        {method.title}
                      </Text>
                      <Text size="small" color="surface.text.gray.muted">
                        {method.subtitle}
                      </Text>
                    </Box>
                  </Box>
                </CardBody>
              </Card>
            ))}
          </Box>
        </Box>
      </ResponsiveModalWrapper>
    </Box>
  );
};

export const FlowSelectionModal = FlowSelectionModalTemplate.bind({});
FlowSelectionModal.storyName = 'Flow Selection Modal';

const OTPModalTemplate: StoryFn<typeof Modal> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { theme } = useTheme();
  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <ResponsiveModalWrapper
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false);
        }}
        footer={<Button isFullWidth> Confirm </Button>}
      >
        <div
          style={{
            backgroundColor: theme.colors.interactive.background.gray.default,
            width: 'fit-content',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: theme.border.radius.medium,
            padding: theme.spacing[4],
          }}
        >
          <LockIcon color="surface.icon.gray.subtle" />
        </div>
        <Box marginTop="spacing.4" display="flex" flexDirection="column" gap="spacing.2">
          <Text size="large" weight="semibold">
            2 Step Verification
          </Text>
          <Text size="small" weight="regular" color="surface.text.gray.subtle">
            This action requires 2-step verification. A 6-digit OTP has been sent via SMS to
            8757450923. The OTP will expire in 5 minutes.
          </Text>
        </Box>
        <Box marginY="spacing.5">
          <OTPInput label="Enter the code" otpLength={6} />
        </Box>
        <Box
          marginTop="spacing.5"
          display="flex"
          flexDirection="row"
          gap="spacing.2"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Text size="small" weight="regular" color="surface.text.gray.subtle">
            Didn’t receive OTP?
          </Text>
          <Link href="https://www.google.com" size="small" weight="semibold">
            Resend OTP
          </Link>
        </Box>
      </ResponsiveModalWrapper>
    </Box>
  );
};

export const OTPModal = OTPModalTemplate.bind({});
OTPModal.storyName = 'OTP Modal';

const ShareModalTemplate: StoryFn<typeof Modal> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { theme } = useTheme();
  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <ResponsiveModalWrapper
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false);
        }}
        footer={<Button isFullWidth> Confirm </Button>}
      >
        <div
          style={{
            backgroundColor: theme.colors.interactive.background.gray.default,
            width: 'fit-content',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: theme.border.radius.medium,
            padding: theme.spacing[4],
          }}
        >
          <ShareIcon color="surface.icon.gray.subtle" />
        </div>
        <Box marginTop="spacing.4" display="flex" flexDirection="column" gap="spacing.2">
          <Text size="large" weight="semibold">
            Share Payment Link
          </Text>
          <Text size="small" weight="regular" color="surface.text.gray.subtle">
            Subtitle go here, support details helps your customers to easily reach out to you when
            they face any
          </Text>
        </Box>
        <Box
          marginTop="spacing.5"
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap="spacing.4"
          width="100%"
        >
          <Box width="80%">
            <TextInput value="https://rzp.io/test-ai" label="" />
          </Box>
          <Box>
            <Button icon={CopyIcon} iconPosition="left">
              Copy
            </Button>
          </Box>
        </Box>
        <Box marginTop="spacing.5">
          <Box display="flex" flexDirection="row" gap="spacing.2" alignItems="center">
            <Text color="surface.text.gray.muted" size="small" weight="medium">
              {' '}
              Share Via{' '}
            </Text>
            <Box marginLeft="spacing.5" display="flex" flexDirection="row" gap="spacing.4">
              <Box
                padding="6px"
                borderRadius="round"
                borderColor="surface.border.gray.muted"
                borderWidth="thicker"
                height="40px"
                width="40px"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                  alt="Facebook"
                  width="28px"
                  height="28px"
                />
              </Box>
              <Box
                padding="6px"
                borderRadius="round"
                borderColor="surface.border.gray.muted"
                borderWidth="thicker"
                height="40px"
                width="40px"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg"
                  alt="Twitter"
                  width="20px"
                  height="20px"
                />
              </Box>
              <Box
                padding="6px"
                borderRadius="round"
                borderColor="surface.border.gray.muted"
                borderWidth="thicker"
                height="40px"
                width="40px"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                  alt="WhatsApp"
                  width="30px"
                  height="30px"
                />
              </Box>
              <Box
                padding="6px"
                borderRadius="round"
                borderColor="surface.border.gray.muted"
                borderWidth="thicker"
                height="40px"
                width="40px"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
                  alt="WhatsApp"
                  width="24px"
                  height="24px"
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          gap="spacing.5"
          alignItems="center"
          marginX="spacing.6"
        >
          <Divider />
          <Text color="surface.text.gray.muted" size="small" weight="medium">
            OR
          </Text>
          <Divider />
        </Box>
        <Box display="flex" flexDirection="column" gap="spacing.4">
          <Text size="small" weight="medium" color="surface.text.gray.muted">
            {' '}
            Share via SMS or email
          </Text>
          <TextInput leadingIcon={PhoneIcon} placeholder="Enter your phone number" label="" />
          <TextInput leadingIcon={MailIcon} placeholder="Enter Email" label="" />
        </Box>
      </ResponsiveModalWrapper>
    </Box>
  );
};

export const ShareModal = ShareModalTemplate.bind({});
ShareModal.storyName = 'Share Modal';

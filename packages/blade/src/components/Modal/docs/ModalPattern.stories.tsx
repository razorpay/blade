import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import type { ModalProps } from '../Modal';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../Modal';
import { useBreakpoint, useTheme } from '../../../utils';
import AlertPng from './assets/alert.png';
import DonateNow from './assets/donatenow.png';
import DonationsButton from './assets/donationButton.png';
import SideImage from './assets/sideImage.png';
import Card4 from './assets/card4.png';
import PayNow from './assets/paynow.png';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import type { ButtonProps } from '~components/Button';
import {
  MapIcon,
  LockIcon,
  ShareIcon,
  CopyIcon,
  PhoneIcon,
  MailIcon,
  TrashIcon,
  ZapIcon,
} from '~components/Icons';
import type { IconColors, IconComponent } from '~components/Icons';
import { Heading, Text } from '~components/Typography';
import { Badge } from '~components/Badge';
import { Card, CardBody } from '~components/Card';
import { OTPInput } from '~components/Input/OTPInput';
import { Link } from '~components/Link';
import { TextInput } from '~components/Input/TextInput';
import { Divider } from '~components/Divider';
import type { BottomSheetBodyProps } from '~components/BottomSheet';
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetFooter,
  BottomSheetHeader,
} from '~components/BottomSheet';
import type { ModalBodyProps } from '~components/Modal';
import { Chip, ChipGroup } from '~components/Chip';

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
  image,
  description,
}: {
  type: 'neutral' | 'negative' | 'positive';
  icon?: IconComponent;
  title: string;
  description: string;
  image?: string;
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
        {image ? (
          <Box
            paddingX="spacing.1"
            paddingY="10px"
            borderColor="surface.border.gray.muted"
            borderRadius="medium"
            width="48px"
            height="48px"
          >
            <img src={image} width={42} height={28} alt="logo" />
          </Box>
        ) : Icon ? (
          <div
            style={{
              backgroundColor: getBackgroundColor(),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: theme.border.radius.medium,
              padding: theme.spacing[4],
              height: '48px',
              width: '48px',
            }}
          >
            <Icon color={getIconColor()} size="large" />
          </div>
        ) : null}
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Text size="large" weight="semibold">
            {title}
          </Text>
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
    <Box
      display="flex"
      flexDirection="row"
      gap="spacing.5"
      justifyContent="flex-end"
      marginTop="spacing.6"
    >
      {secondaryButtonText && <Button variant="tertiary">{secondaryButtonText}</Button>}

      <Button color={getPrimaryButtonColor()}>{primaryButtonText}</Button>
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
  wrapInBottomSheetFooter = false,
  customSnapPoints = [0.35, 0.5, 0.85],
}: {
  children: React.ReactElement | React.ReactElement[];
  footer?: React.ReactElement;
  isOpen: boolean;
  onDismiss: () => void;
  modalBodyPadding?: ModalBodyProps['padding'];
  modalSize?: ModalProps['size'];
  wrapInBottomSheetFooter?: boolean;
  customSnapPoints?: [number, number, number];
}): React.ReactNode => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  if (isMobile) {
    return (
      <BottomSheet isOpen={isOpen} onDismiss={onDismiss} snapPoints={customSnapPoints}>
        <BottomSheetHeader />
        <BottomSheetBody padding={modalBodyPadding as BottomSheetBodyProps['padding']}>
          {children}
          {footer && !wrapInBottomSheetFooter && <Box marginTop="spacing.6">{footer}</Box>}
        </BottomSheetBody>
        {footer && wrapInBottomSheetFooter && <BottomSheetFooter>{footer}</BottomSheetFooter>}
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
      <ResponsiveModalWrapper isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <ConformationalModalBody
          type="neutral"
          icon={MapIcon}
          title="Restart the Tour?"
          description="This tour will give a quick guide on this product"
        />
        <ConformationModalFooter type="neutral" primaryButtonText="Yes" secondaryButtonText="No" />
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
      <ResponsiveModalWrapper isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <ConformationalModalBody
          type="negative"
          icon={TrashIcon}
          title="Restart the Tour?"
          description="This tour will give a quick guide on this product"
        />
        <ConformationModalFooter type="negative" primaryButtonText="Yes" secondaryButtonText="No" />
      </ResponsiveModalWrapper>
    </Box>
  );
};

export const NegativeModal = NegativeModalTemplate.bind({});
NegativeModal.storyName = 'Confirmation Modal - Negative';

const ConfirmationModalWithImageTemplate: StoryFn<typeof Modal> = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <ResponsiveModalWrapper isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <ConformationalModalBody
          type="negative"
          image="https://logo.svgcdn.com/d/woocommerce-plain-wordmark.svg"
          title="Switch to WooCommerce"
          description="Are you sure you want to switch platform? We can allow one platform at a time. This will remove all your previous settings."
        />
        <ConformationModalFooter type="neutral" primaryButtonText="Yes" secondaryButtonText="No" />
      </ResponsiveModalWrapper>
    </Box>
  );
};

export const ConfirmationnModalWithImage = ConfirmationModalWithImageTemplate.bind({});
ConfirmationnModalWithImage.storyName = 'Confirmation Modal - with Image';

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
        customSnapPoints={[0.45, 0.75, 0.95]}
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

const EditAndAddModalTemplate: StoryFn<typeof Modal> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <ResponsiveModalWrapper
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        footer={
          //TODO: look into spacing
          <Box display="flex" gap="spacing.5" justifyContent="flex-end" width="100%">
            <Button variant="tertiary">Cancel</Button>
            <Button> Update</Button>
          </Box>
        }
      >
        <Box display="flex" flexDirection="column" gap="spacing.2">
          <Text size="large" weight="semibold">
            Edit display name
          </Text>
          <Text size="medium" weight="regular" color="surface.text.gray.muted">
            The new display name will reflect immediately on your dashboard after you update it. It
            will be visible to you and your team on the Razorpay dashboard.
          </Text>
        </Box>
        <Box marginTop="spacing.5">
          <TextInput label="Enter new display name" placeholder="Enter your display name" />
        </Box>
      </ResponsiveModalWrapper>
    </Box>
  );
};

export const EditAndAddModal = EditAndAddModalTemplate.bind({});
EditAndAddModal.storyName = 'Edit and Add Modal';

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
      isDisabled: true,
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
            <Button variant="tertiary" onClick={() => setIsOpen(false)}>
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
        wrapInBottomSheetFooter
        customSnapPoints={[0.8, 0.9, 0.95]}
      >
        <Box padding="spacing.6">
          <Heading size="small" weight="semibold">
            Pick a Button Type
          </Heading>
          <Text color="surface.text.gray.muted" size="small" weight="regular">
            Pick a button which meets your requirements and get a head start on collecting payments
            or you could build your own
          </Text>
        </Box>
        <Box padding="spacing.6">
          <Box
            display="flex"
            flexDirection="row"
            gap="spacing.5"
            flexWrap="wrap"
            alignItems="center"
            justifyContent="center"
          >
            {paymentMethods.map((method, index) => (
              <Card
                key={`${method.value}-${index}`}
                isSelected={selectedMethod === method.value}
                onClick={method.isDisabled ? undefined : () => setSelectedMethod(method.value)}
                padding="spacing.0"
                accessibilityLabel={`Select ${method.title}`}
                width={isMobile ? '160px' : '230px'}
                borderRadius="medium"
                elevation="none"
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
                      <Text
                        size="medium"
                        weight="semibold"
                        color={
                          method.isDisabled ? 'surface.text.gray.muted' : 'surface.text.gray.normal'
                        }
                      >
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

const FlowSelectionModalTemplateWithIcon: StoryFn<typeof Modal> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedMethod, setSelectedMethod] = React.useState('');

  const paymentMethods = [
    {
      value: 'quickpay',
      title: 'Quick Pay Button',
      subtitle:
        'Accepting fixed price payments?  Customers make quick payments of fixed price through this button',
      icon: ZapIcon,
    },
    {
      value: 'buynow',
      title: 'Buy Now Button',
      subtitle:
        'Selling products or event tickets?  Sell multiple items with support for quantity using this button.',
      icon: ZapIcon,
    },
    {
      value: 'custom',
      title: 'Custom Button',
      subtitle:
        'Build your own button with your own design and branding or use our pre-built templates.',
      icon: ZapIcon,
      isDisabled: true,
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
        modalSize="medium"
        footer={
          <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
            <Button variant="tertiary" onClick={() => setIsOpen(false)}>
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
        wrapInBottomSheetFooter
        customSnapPoints={[0.8, 0.9, 0.95]}
      >
        <Box padding="spacing.6">
          <Heading size="small" weight="semibold">
            Pick a Button Type
          </Heading>
          <Text color="surface.text.gray.muted" size="small" weight="regular">
            Pick a button which meets your requirements and get a head start on collecting payments
            or you could build your own
          </Text>
        </Box>
        <Box padding="spacing.6">
          <Box
            display="flex"
            flexDirection="row"
            gap="spacing.5"
            flexWrap="wrap"
            alignItems="center"
            justifyContent="center"
          >
            {paymentMethods.map((method, index) => (
              <Card
                key={`${method.value}-${index}`}
                isSelected={selectedMethod === method.value}
                onClick={method.isDisabled ? undefined : () => setSelectedMethod(method.value)}
                padding="spacing.0"
                accessibilityLabel={`Select ${method.title}`}
                width={isMobile ? '160px' : '228px'}
                borderRadius="medium"
                elevation="none"
              >
                <CardBody>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    marginTop="spacing.6"
                    marginX="spacing.5"
                  >
                    <Box
                      padding="10px"
                      backgroundColor="surface.background.primary.subtle"
                      width="40px"
                      height="40px"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      borderRadius="medium"
                    >
                      <ZapIcon color="surface.icon.primary.normal" />
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="row"
                    gap="spacing.4"
                    alignItems="center"
                    paddingX="spacing.5"
                    paddingY="spacing.4"
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                      maxHeight="95px"
                    >
                      <Text
                        size="medium"
                        weight="semibold"
                        color={
                          method.isDisabled ? 'surface.text.gray.muted' : 'surface.text.gray.normal'
                        }
                      >
                        {method.title}
                      </Text>
                      <Text size="small" color="surface.text.gray.muted" textAlign="center">
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
export const FlowSelectionModalWithIcon = FlowSelectionModalTemplateWithIcon.bind({});
FlowSelectionModalWithIcon.storyName = 'Flow Selection Modal - with Icon Cards';

const OTPModalTemplate: StoryFn<typeof Modal> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { theme } = useTheme();
  const [isResendOtpTimerRunning, setIsResendOtpTimerRunning] = React.useState(false);
  const [resendOtpTimer, setResendOtpTimer] = React.useState(30);

  // Start timer when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setIsResendOtpTimerRunning(true);
      setResendOtpTimer(30);
    } else {
      setIsResendOtpTimerRunning(false);
      setResendOtpTimer(30);
    }
  }, [isOpen]);

  // Handle timer countdown
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isResendOtpTimerRunning && resendOtpTimer > 0) {
      timer = setInterval(() => {
        setResendOtpTimer((prev) => {
          if (prev <= 1) {
            setIsResendOtpTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isResendOtpTimerRunning, resendOtpTimer]);

  const handleResendOtp = (): void => {
    // Reset timer and start countdown
    setIsResendOtpTimerRunning(true);
    setResendOtpTimer(30);
    // Here you would typically trigger the OTP resend API
    console.log('Resending OTP...');
  };

  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <ResponsiveModalWrapper
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false);
        }}
        footer={
          <Box display="flex" justifyContent="flex-end" width="100%">
            <Button> Confirm </Button>
          </Box>
        }
        customSnapPoints={[0.5, 0.6, 0.75]}
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
            {isResendOtpTimerRunning
              ? `Resend OTP in ${resendOtpTimer} seconds`
              : "Didn't receive OTP?"}
          </Text>
          {isResendOtpTimerRunning ? null : (
            <Link
              isDisabled={isResendOtpTimerRunning}
              onClick={handleResendOtp}
              size="small"
              variant="button"
            >
              {isResendOtpTimerRunning ? `Resend OTP in ${resendOtpTimer}s` : 'Resend OTP'}
            </Link>
          )}
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
        <Box display="flex" flexDirection="row" gap="spacing.5" alignItems="center">
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

const SingleStepFormTemplate: StoryFn<typeof Modal> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  const shippingTime = [
    {
      value: '1-2 days',
      label: '1-2 days',
    },
    {
      value: '3-5 days',
      label: '3-5 days',
    },
    {
      value: '6-8 days',
      label: '6-8 days',
    },
    {
      value: '9-15 days',
      label: '9-15 days',
    },
    {
      value: 'not applicable',
      label: 'Not Applicable',
    },
  ];

  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <ResponsiveModalWrapper
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        modalSize="large"
        modalBodyPadding="spacing.0"
        customSnapPoints={[0.8, 0.9, 0.95]}
        wrapInBottomSheetFooter
        footer={
          isMobile ? (
            <Box display="flex" justifyContent="flex-end" gap="spacing.5">
              <Button variant="tertiary" onClick={() => setIsOpen(false)}>
                Back
              </Button>
              <Button variant="primary" onClick={() => setIsOpen(false)}>
                Continue
              </Button>
            </Box>
          ) : undefined
        }
      >
        <Box
          display="grid"
          gridTemplateColumns={isMobile ? '1fr' : 'auto 1fr'}
          gridTemplateRows={isMobile ? '1fr' : 'auto 1fr'}
          width="100%"
          height="100%"
        >
          {!isMobile && (
            <Box
              backgroundColor="surface.background.gray.subtle"
              height="596px"
              width="100%"
              display="flex"
              flexDirection="column"
              justifyContent="flex-end"
              overflow="hidden"
              gridRow="span 2"
            >
              <img
                src={SideImage}
                height="452px"
                width="100%"
                alt="random graphics"
                style={{ objectFit: 'fill' }}
              />
            </Box>
          )}
          <Box
            height="520px"
            paddingTop="spacing.6"
            paddingX="spacing.6"
            width="100%"
            overflow="scroll"
          >
            <Heading size="medium" weight="semibold">
              Create policy pages with Razorpay
            </Heading>
            <Text size="medium" weight="regular" color="surface.text.gray.muted">
              We need a few details to create the missing policy pages for you
            </Text>
            <Box
              marginTop="spacing.6"
              display="flex"
              gap="spacing.7"
              flexDirection="column"
              height="100%"
              width="100%"
            >
              <ChipGroup label="Shipping time">
                {shippingTime.map((time) => (
                  <Chip key={time.value} value={time.value}>
                    {time.label}
                  </Chip>
                ))}
              </ChipGroup>
              <ChipGroup label="Cancellation request time">
                {shippingTime.map((time) => (
                  <Chip key={time.value} value={time.value}>
                    {time.label}
                  </Chip>
                ))}
              </ChipGroup>
              <ChipGroup label="Refund processing time">
                {shippingTime.map((time) => (
                  <Chip key={time.value} value={time.value}>
                    {time.label}
                  </Chip>
                ))}
              </ChipGroup>
              <TextInput label="Support contact number" prefix="+91" placeholder="9XXXXXXXXX" />
              <TextInput label="Support Email ID" placeholder="support@razorpay.com" />
            </Box>
          </Box>
          {!isMobile && (
            <ModalFooter>
              <Box display="flex" justifyContent="flex-end" gap="spacing.5">
                <Button variant="tertiary" onClick={() => setIsOpen(false)}>
                  Back
                </Button>
                <Button variant="primary" onClick={() => setIsOpen(false)}>
                  Continue
                </Button>
              </Box>
            </ModalFooter>
          )}
        </Box>
      </ResponsiveModalWrapper>
    </Box>
  );
};

export const SingleStepForm = SingleStepFormTemplate.bind({});
SingleStepForm.storyName = 'Single Step Form Modal';

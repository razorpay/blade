import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import isChromatic from 'chromatic/isChromatic';
import { Modal, ModalFooter, ModalHeader, ModalBody } from '../Modal';
import { useBreakpoint, useTheme } from '../../../utils';
import type { ModalBodyProps, ModalProps } from '../index';
import Facebook from './assets/fb.png';
import Instagram from './assets/ig.png';
import Twitter from './assets/x.png';
import WhatsApp from './assets/wa.png';
import AlertPng from './assets/alert.png';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Button } from '~components/Button';
import { Radio, RadioGroup } from '~components/Radio';
import { Skeleton } from '~components/Skeleton';
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetFooter,
  BottomSheetHeader,
} from '~components/BottomSheet';
import type { BottomSheetBodyProps } from '~components/BottomSheet';
import {
  LockIcon,
  ShareIcon,
  CopyIcon,
  PhoneIcon,
  MailIcon,
  DownloadIcon,
} from '~components/Icons';
import { Link } from '~components/Link';
import { OTPInput } from '~components/Input/OTPInput';
import { Heading, Text } from '~components/Typography';
import { Box } from '~components/Box';
import { TextInput } from '~components/Input/TextInput';
import { Tooltip } from '~components/Tooltip';
import { Divider } from '~components/Divider';
import { Badge } from '~components/Badge';

export default {
  title: 'Components/Modal/SimpleModal',
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

const ModalTemplate: StoryFn<typeof Modal> = ({ size }) => {
  // `!!isChramatic` is not readable hence disabling the eslint rule
  // eslint-disable-next-line no-unneeded-ternary
  const [isOpen, setIsOpen] = React.useState(isChromatic() ? true : false);

  return (
    <>
      <Button onClick={() => setIsOpen(!isOpen)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false);
        }}
        size={size}
      >
        <ModalHeader
          title="Address Details"
          subtitle="This example is created for Modal snapshot testing"
        />
        <ModalBody>
          <RadioGroup label="Addresses">
            <Radio value="home">Home - 11850 Florida 24, Cedar Key, Florida</Radio>
            <Radio value="office-1">Office - 2033 Florida 21, Cedar Key, Florida</Radio>
            <Radio value="office-2">Work - 5938 New York, Main Street</Radio>
          </RadioGroup>
        </ModalBody>
        <ModalFooter>
          <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
            <Button variant="tertiary">Remove address</Button>
            <Button>Add address</Button>
          </Box>
        </ModalFooter>
      </Modal>
    </>
  );
};

export const SimpleModal = ModalTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
SimpleModal.storyName = 'Simple Modal';

const FullPageModalTemplate: StoryFn<typeof Modal> = ({ size }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isImageLoading, setIsImageLoading] = React.useState(true);

  return (
    <>
      <Button onClick={() => setIsOpen(!isOpen)}>Open Modal</Button>
      <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size={size}>
        <ModalHeader
          title="Full Page Modal"
          subtitle="This example is created for Full Page Modal"
        />
        <ModalBody height="100%" padding="spacing.0">
          <Box position="relative" width="100%" height="100%">
            {isImageLoading && (
              <Box
                position="absolute"
                top="0px"
                left="0px"
                width="100%"
                height="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                backgroundColor="surface.background.gray.intense"
              >
                <Skeleton height="100%" width="100%" />
              </Box>
            )}
            <img
              width="100%"
              height="100%"
              src="https://picsum.photos/1920/1080"
              alt="randm"
              onLoad={() => setIsImageLoading(false)}
              style={{ display: isImageLoading ? 'none' : 'block' }}
            />
          </Box>
        </ModalBody>
        <ModalFooter>
          <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
            <Button variant="primary" icon={DownloadIcon} isDisabled={isImageLoading}>
              Download
            </Button>
          </Box>
        </ModalFooter>
      </Modal>
    </>
  );
};

export const FullPageModal = FullPageModalTemplate.bind({});
FullPageModal.args = {
  size: 'full',
};
FullPageModal.storyName = 'Full Page Modal';

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

const OTPModalTemplate: StoryFn<typeof Modal> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';
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
            <Button isFullWidth={isMobile}> Confirm </Button>
          </Box>
        }
        customSnapPoints={[0.5, 0.6, 0.75]}
      >
        <div
          style={{
            backgroundColor: theme.colors.interactive.background.gray.default,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: theme.border.radius.medium,
            padding: theme.spacing[4],
            width: '48px',
            height: '48px',
          }}
        >
          <LockIcon color="surface.icon.gray.subtle" size="xlarge" />
        </div>
        <Box marginTop="spacing.4" display="flex" flexDirection="column" gap="spacing.2">
          <Text size="large" weight="semibold">
            2 Step Verification
          </Text>
          <Text size="medium" weight="regular" color="surface.text.gray.subtle">
            This action requires 2-step verification. A 6-digit OTP has been sent via SMS to
            8757450923. The OTP will expire in 5 minutes.
          </Text>
        </Box>
        <Box marginY="spacing.5">
          <OTPInput label="Enter the code" otpLength={6} size="large" />
        </Box>
        <Box
          marginTop="spacing.5"
          display="flex"
          flexDirection="row"
          gap="spacing.2"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Text size="medium" weight="regular" color="surface.text.gray.subtle">
            {isResendOtpTimerRunning
              ? `Resend OTP in ${resendOtpTimer} seconds`
              : "Didn't receive OTP?"}
          </Text>
          {isResendOtpTimerRunning ? null : (
            <Link
              isDisabled={isResendOtpTimerRunning}
              onClick={handleResendOtp}
              size="medium"
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
  const [isCopied, setIsCopied] = React.useState(false);

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
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: theme.border.radius.medium,
            padding: theme.spacing[4],
            height: '48px',
            width: '48px',
          }}
        >
          <ShareIcon color="surface.icon.gray.subtle" size="xlarge" />
        </div>
        <Box marginTop="spacing.5" display="flex" flexDirection="column" gap="spacing.3">
          <Text size="large" weight="semibold" color="surface.text.gray.normal">
            Share Payment Link
          </Text>
          <Text size="medium" weight="regular" color="surface.text.gray.subtle">
            Subtitle go here, support details helps your customers to easily reach out to you when
            they face any
          </Text>
        </Box>
        <Box
          marginTop="spacing.6"
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
            {isCopied ? (
              <Tooltip content="Copied">
                <Button icon={CopyIcon}>Copy</Button>
              </Tooltip>
            ) : (
              <Button
                icon={CopyIcon}
                onClick={() => {
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 5000);
                }}
              >
                Copy
              </Button>
            )}
          </Box>
        </Box>
        <Box marginTop="spacing.5">
          <Box display="flex" flexDirection="row" gap="spacing.5" alignItems="center">
            <Text color="surface.text.gray.muted" size="small" weight="medium">
              {' '}
              Share Via{' '}
            </Text>
            <Box display="flex" flexDirection="row" gap="spacing.4">
              <Box
                padding="6px"
                borderRadius="round"
                borderColor="surface.border.gray.muted"
                borderWidth="thin"
                height="40px"
                width="40px"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <img src={Facebook} alt="Facebook" width="28px" height="28px" />
              </Box>
              <Box
                padding="10px"
                borderRadius="round"
                borderColor="surface.border.gray.muted"
                borderWidth="thin"
                height="40px"
                width="40px"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <img src={Twitter} alt="Twitter" width="32px" height="20px" />
              </Box>
              <Box
                padding="7px"
                borderRadius="round"
                borderColor="surface.border.gray.muted"
                borderWidth="thin"
                height="40px"
                width="40px"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <img src={WhatsApp} alt="WhatsApp" width="25.6px" height="26px" />
              </Box>
              <Box
                padding="8px"
                borderRadius="round"
                borderColor="surface.border.gray.muted"
                borderWidth="thin"
                height="40px"
                width="40px"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <img src={Instagram} alt="Instagram" width="24px" height="24px" />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          gap="spacing.5"
          alignItems="center"
          marginTop="spacing.6"
          marginBottom="spacing.6"
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

const InformationalModalWithImageTemplate: StoryFn<typeof Modal> = () => {
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
        customSnapPoints={[0.6, 0.75, 0.95]}
      >
        <ModalBody padding="spacing.0">
          <img src={AlertPng} alt="Alert" width={isMobile ? '100%' : '400px'} height={200} />
          <Box margin="spacing.6">
            <Badge color="negative">Action Required </Badge>
            <Box marginTop="spacing.4">
              <Heading size="large" weight="semibold">
                Update your KYC by 5th July
              </Heading>
              <Text size="medium" weight="regular" color="surface.text.gray.subtle">
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

export const InformationalModalWithImage = InformationalModalWithImageTemplate.bind({});
InformationalModalWithImage.storyName = 'Informational Modal';

## Component Name

Modal

## Description

Modal is a dialog component that appears in front of the app content to provide critical information or request user input. It's designed to focus user attention, disabling all other interactions until explicitly dismissed. Modals are accessible, can be dismissed via escape key, clicking outside, or a close button (when dismissible), and come in three sizes: small, medium, and large.

## TypeScript Types

These types represent the props that the Modal component and its subcomponents accept. When using the Modal component along with its subcomponents, you'll need these type definitions to understand the available props.

```typescript
// The main Modal component props
type ModalProps = {
  /**
   *  Children of Modal
   * Only ModalHeader, ModalBody and ModalFooter are allowed as children
   */
  children: React.ReactNode;
  /**
   Sets the modal to open or close
   * @default false
   */
  isOpen: boolean;
  /**
   *  Callback function when user clicks on close button or outside the modal or on pressing escape key.
   */
  onDismiss: () => void;
  /**
   * Whether the modal can be dismissed by clicking outside or pressing escape key
   * @default true
   * @note 
   * If isDismissible is false, the modal will not be dismissed when the user clicks outside the modal or presses the escape key and the close button will not be shown. you need to handle the closing of the modal from your own code. also onDismiss will not be called.
   */
  isDismissible?: boolean;
  /**
   *  Ref to the element to be focused on opening the modal.
   */
  initialFocusRef?: React.MutableRefObject<any>;
  /**
   *  Size of the modal
   * @default 'small'
   */
  size?: 'small' | 'medium' | 'large' | 'full';
  /**
   *  Accessibility label for the modal
   */
  accessibilityLabel?: string;
  /**
   * Sets the z-index of the modal
   * @default 1000
   */
  zIndex?: number;
} & DataAnalyticsAttribute;

// The ModalHeader component props
type ModalHeaderProps = {
  /**
   * Title of the header
   */
  title?: React.ReactNode;
  /**
   * Subtitle of the header
   */
  subtitle?: React.ReactNode;
  /**
   * Content to be displayed before the title
   */
  leading?: React.ReactNode;
  /**
   * Content to be displayed after the title
   */
  trailing?: React.ReactNode;
  /**
   * Content to be displayed as a suffix to the title
   */
  titleSuffix?: React.ReactNode;
} & DataAnalyticsAttribute;

// The ModalBody component props
type ModalBodyProps = {
  children: React.ReactNode;
  /**
   * Sets the padding equally on all sides. Only few `spacing` tokens are allowed deliberately
   * @default `spacing.6`
   */
  padding?: Extract<SpacingValueType, 'spacing.0' | 'spacing.6'>;
} & DataAnalyticsAttribute;

// The ModalFooter component props
type ModalFooterProps = {
  children: React.ReactNode;
} & DataAnalyticsAttribute;
```

## Example

Below is a comprehensive example showcasing the Modal component with various configurations:

```tsx
import React, { useState, useRef } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Box,
  Button,
  Radio,
  RadioGroup,
  Text,
  TextArea,
  Checkbox,
} from '@razorpay/blade/components';

const ModalExample = () => {
  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for form values
  const [selectedAddress, setSelectedAddress] = useState('home');
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [saveAsDefault, setSaveAsDefault] = useState(false);

  // Ref for initial focus when modal opens
  const addAddressButtonRef = useRef(null);

  // Handlers
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleSave = () => {
    // Handle save logic here
    closeModal();
  };

  return (
    <>
      {/* Buttons to demonstrate different modal sizes */}
      <Box display="flex" gap="spacing.5" flexWrap="wrap" marginBottom="spacing.5">
        <Button
          onClick={() => {
            setSelectedSize('small');
            openModal();
          }}
        >
          Open Small Modal
        </Button>
      </Box>

      {/* Modal component */}
      <Modal
        isOpen={isModalOpen}
        onDismiss={closeModal}
        size={selectedSize}
        initialFocusRef={addAddressButtonRef}
        accessibilityLabel="Address selection modal"
      >
        <ModalHeader
          title="Select Delivery Address"
          subtitle="Choose where you'd like your order delivered"
        />

        <ModalBody>
          <Box display="flex" flexDirection="column" gap="spacing.5">
            <Box marginTop="spacing.5">
              <Text size="small" color="surface.text.gray.subtle">
                Need to add a new address?
              </Text>

              <Box marginTop="spacing.4">
                <TextArea
                  label="Address Line 1"
                  placeholder="Enter street address"
                  marginBottom="spacing.4"
                />
                <TextArea
                  label="Address Line 2"
                  placeholder="Apt, Suite, Building (optional)"
                  marginBottom="spacing.4"
                />
              </Box>
            </Box>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
            <Button variant="tertiary" onClick={closeModal}>
              Cancel
            </Button>
            <Button ref={addAddressButtonRef} onClick={handleSave}>
              Save Address
            </Button>
          </Box>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ModalExample;
```

### OTP Modal Example

This example demonstrates a modal for OTP verification with input fields, timer, and resend functionality.

```tsx
import React from 'react';
import {
  Box,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  BottomSheet,
  BottomSheetHeader,
  BottomSheetBody,
  BottomSheetFooter,
  Text,
  OTPInput,
  Link,
  LockIcon,
} from '@razorpay/blade/components';
import { useBreakpoint, useTheme } from '@razorpay/blade/utils';

// Responsive wrapper component for handling mobile/desktop modal display
function ResponsiveModalWrapper({
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
  modalBodyPadding?: string;
  modalSize?: 'small' | 'medium' | 'large' | 'full';
  wrapInBottomSheetFooter?: boolean;
  customSnapPoints?: [number, number, number];
}): React.ReactNode {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  if (isMobile) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onDismiss={onDismiss}
        snapPoints={customSnapPoints}
      >
        <BottomSheetHeader />
        <BottomSheetBody padding={modalBodyPadding}>
          {children}
          {footer && !wrapInBottomSheetFooter && (
            <Box marginTop="spacing.6">{footer}</Box>
          )}
        </BottomSheetBody>
        {footer && wrapInBottomSheetFooter && (
          <BottomSheetFooter>{footer}</BottomSheetFooter>
        )}
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
}

function OTPModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [otp, setOtp] = React.useState('');
  const [timer, setTimer] = React.useState(30);
  const [error, setError] = React.useState<string | null>(null);
  const [isResendOtpTimerRunning, setIsResendOtpTimerRunning] =
    React.useState(false);
  const [resendOtpTimer, setResendOtpTimer] = React.useState(30);
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

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

  const handleVerify = (): void => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    // Verify OTP logic here
    setError(null);
    setIsOpen(false);
  };

  const handleResend = (): void => {
    setTimer(30);
    setOtp('');
    setError(null);
    // Resend OTP logic here
  };

  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Verify Phone Number</Button>
      <ResponsiveModalWrapper
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        footer={
          <Box
            display="flex"
            gap="spacing.5"
            justifyContent="flex-end"
            width="100%"
          >
            <Button
              variant="tertiary"
              isFullWidth={isMobile}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              isFullWidth={isMobile}
              onClick={handleVerify}
              isDisabled={otp.length !== 6}
            >
              Verify
            </Button>
          </Box>
        }
        customSnapPoints={[0.5, 0.6, 0.75]}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRadius="medium"
          padding="spacing.4"
          width="48px"
          height="48px"
          // backgroundColor="feedback.background.neutral.subtle"
        >
          <LockIcon color="surface.icon.gray.subtle" size="xlarge" />
        </Box>
        <Box
          marginTop="spacing.4"
          display="flex"
          flexDirection="column"
          gap="spacing.2"
        >
          <Text size="large" weight="semibold">
            2 Step Verification
          </Text>
          <Text size="medium" weight="regular" color="surface.text.gray.subtle">
            This action requires 2-step verification. A 6-digit OTP has been
            sent via SMS to 8757450923. The OTP will expire in 5 minutes.
          </Text>
        </Box>
        <Box marginY="spacing.5">
          <OTPInput
            label="Enter the code"
            otpLength={6}
            size="large"
            aria-label="Enter verification code"
          />
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
          {!isResendOtpTimerRunning && (
            <Link
              onClick={() => {}}
              size="medium"
              variant="button"
              aria-label="Resend verification code"
            >
              Resend OTP
            </Link>
          )}
        </Box>
      </ResponsiveModalWrapper>
    </Box>
  );
}

export default OTPModal;

```

### Share Modal Example

This example shows a modal for sharing content with social media options and copy link functionality.

```tsx
import React from 'react';
import {
  Box,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  BottomSheet,
  BottomSheetHeader,
  BottomSheetBody,
  BottomSheetFooter,
  Text,
  TextInput,
  ActionList,
  ActionListItem,
  Alert,
  TwitterIcon,
  FacebookIcon,
  LinkedInIcon,
  WhatsappIcon,
  CopyIcon,
} from '@razorpay/blade/components';
import { useBreakpoint, useTheme } from '@razorpay/blade/utils';

// [ResponsiveModalWrapper component code remains the same as above in otp modal example]

function ShareModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showCopiedAlert, setShowCopiedAlert] = React.useState(false);
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  const shareUrl = 'https://example.com/share-link';

  const shareOptions = [
    {
      icon: TwitterIcon,
      label: 'Twitter',
      url: `https://twitter.com/intent/tweet?url=${shareUrl}`,
    },
    {
      icon: FacebookIcon,
      label: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    },
    {
      icon: LinkedInIcon,
      label: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    },
    { icon: WhatsappIcon, label: 'WhatsApp', url: `https://wa.me/?text=${shareUrl}` },
  ];

  const handleShare = (url: string): void => {
    window.open(url, '_blank');
  };

  const handleCopy = async (): Promise<void> => {
    await navigator.clipboard.writeText(shareUrl);
    setShowCopiedAlert(true);
    setTimeout(() => setShowCopiedAlert(false), 3000);
  };

  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Share</Button>
      <ResponsiveModalWrapper
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        modalSize="small"
        footer={
          <Box display="flex" justifyContent="flex-end">
            <Button variant="tertiary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Box>
        }
      >
        <Box display="flex" flexDirection="column" gap="spacing.4">
          <Text size="large" weight="semibold">
            Share this content
          </Text>
          {showCopiedAlert && (
            <Alert
              color="positive"
              title="Link copied!"
              description="The link has been copied to your clipboard."
              isDismissible
              onDismiss={() => setShowCopiedAlert(false)}
            />
          )}
          <Box>
            <ActionList>
              {shareOptions.map((option) => (
                <ActionListItem
                  key={option.label}
                  icon={option.icon}
                  onClick={() => handleShare(option.url)}
                >
                  {option.label}
                </ActionListItem>
              ))}
            </ActionList>
          </Box>
          <Box display="flex" gap="spacing.3">
            <TextInput value={shareUrl} isReadOnly isFullWidth accessibilityLabel="Share URL" />
            <Button
              variant="secondary"
              icon={CopyIcon}
              onClick={handleCopy}
              accessibilityLabel="Copy link"
            />
          </Box>
        </Box>
      </ResponsiveModalWrapper>
    </Box>
  );
}

export default ShareModal;
```

### Informational Modal Example

This example demonstrates a modal for displaying important information or announcements with rich content.

```tsx
import React from 'react';
import {
  Box,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  BottomSheet,
  BottomSheetHeader,
  BottomSheetBody,
  BottomSheetFooter,
  Text,
  Heading,
  Badge,
  List,
  ListItem,
  InfoIcon,
  CheckIcon,
} from '@razorpay/blade/components';
import { useBreakpoint, useTheme } from '@razorpay/blade/utils';

// [ResponsiveModalWrapper component code remains the same as in otp modal example]

function InformationalModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  const features = [
    'Enhanced security with 2FA',
    'Improved dashboard performance',
    'New analytics features',
    'Better mobile responsiveness',
  ];

  return (
    <Box>
      <Button onClick={() => setIsOpen(true)} icon={InfoIcon}>
        What's New
      </Button>
      <ResponsiveModalWrapper
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        modalSize="medium"
        footer={
          <Box display="flex" gap="spacing.5" justifyContent="flex-end" width="100%">
            <Button variant="primary" isFullWidth={isMobile} onClick={() => setIsOpen(false)}>
              Got it
            </Button>
          </Box>
        }
      >
        <Box display="flex" flexDirection="column" gap="spacing.6">
          <Box display="flex" alignItems="center" gap="spacing.3">
            <Heading size="large">Platform Updates</Heading>
            <Badge color="notice">New</Badge>
          </Box>
          <Text size="medium" color="surface.text.gray.muted">
            We've made several improvements to enhance your experience. Here are the key updates:
          </Text>
          <List>
            {features.map((feature) => (
              <ListItem key={feature} icon={CheckIcon} iconColor="positive">
                {feature}
              </ListItem>
            ))}
          </List>
          <Box
            padding="spacing.4"
            backgroundColor="surface.background.gray.subtle"
            borderRadius="medium"
          >
            <Text size="small" color="surface.text.gray.muted">
              These updates are now live. For more details, please visit our documentation.
            </Text>
          </Box>
        </Box>
      </ResponsiveModalWrapper>
    </Box>
  );
}

export default InformationalModal;
```

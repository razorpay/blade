## Modal Patterns

## Description
Modal patterns provide a structured way to display content in a dialog that overlays the main application interface. These patterns are designed to be responsive, accessible, and adaptable to different use cases like confirmations, information display, multi-step flows, and data collection. The patterns automatically handle mobile responsiveness by transforming into bottom sheets on smaller screens, ensuring a consistent user experience across devices.

## Components Used
- Modal
- Box
- Button
- Card
- Badge
- TextInput
- OTPInput
- Link
- Divider

## Example

### Confirmation Modal
A confirmation modal is used to get user confirmation before proceeding with an action. It can be neutral, positive, or negative based on the action's impact.

```tsx
import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Box,
  Button,
  Heading,
  Text,
  useBreakpoint,
  useTheme,
  MapIcon,
} from '@razorpay/blade/components';
import type { ModalProps, ButtonProps } from '@razorpay/blade/components';

const ConfirmationModal = ({
  type = 'neutral',
  title,
  description,
  primaryButtonText,
  secondaryButtonText,
  onConfirm,
  onCancel,
  isOpen,
  onDismiss,
}: {
  type?: 'neutral' | 'negative' | 'positive';
  title: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isOpen: boolean;
  onDismiss: () => void;
}) => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  const getIconColor = () => {
    switch (type) {
      case 'negative':
        return 'feedback.icon.negative.intense';
      case 'positive':
        return 'feedback.icon.positive.intense';
      default:
        return 'surface.icon.gray.subtle';
    }
  };

  const getPrimaryButtonColor = (): ButtonProps['color'] => {
    switch (type) {
      case 'negative':
        return 'negative';
      case 'positive':
        return 'positive';
      default:
        return 'primary';
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onDismiss={onDismiss}
      size="small"
      aria-labelledby="confirmation-title"
      aria-describedby="confirmation-description"
    >
      <ModalHeader />
      <ModalBody>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <Box
            backgroundColor={type === 'neutral' ? 'interactive.background.gray.default' : `feedback.background.${type}.subtle`}
            padding="spacing.4"
            borderRadius="medium"
            width="fit-content"
          >
            <MapIcon color={getIconColor()} />
          </Box>
          <Box display="flex" flexDirection="column" gap="spacing.3">
            <Heading id="confirmation-title" size="large" weight="semibold">
              {title}
            </Heading>
            <Text id="confirmation-description">{description}</Text>
          </Box>
        </Box>
      </ModalBody>
      <ModalFooter>
        <Box display="flex" flexDirection="row" gap="spacing.3" justifyContent="space-between">
          {secondaryButtonText && (
            <Button 
              variant="tertiary" 
              isFullWidth 
              onClick={onCancel}
              aria-label={`Cancel ${title.toLowerCase()}`}
            >
              {secondaryButtonText}
            </Button>
          )}
          <Button 
            isFullWidth 
            color={getPrimaryButtonColor()} 
            onClick={onConfirm}
            aria-label={`Confirm ${title.toLowerCase()}`}
          >
            {primaryButtonText}
          </Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

// Usage Example
const App = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Confirmation</Button>
      <ConfirmationModal
        type="neutral"
        title="Restart the Tour?"
        description="This tour will give a quick guide on this product"
        primaryButtonText="Yes"
        secondaryButtonText="No"
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        onConfirm={() => {
          console.log('Confirmed');
          setIsOpen(false);
        }}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
};
```

### Information Modal
An information modal is used to display important information or alerts to users with a prominent visual and clear call to action.

```tsx
import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Box,
  Button,
  Badge,
  Heading,
  Text,
  useBreakpoint,
  useTheme,
} from '@razorpay/blade/components';

const InformationModal = ({
  image,
  badgeText,
  title,
  description,
  ctaText,
  onCtaClick,
  isOpen,
  onDismiss,
}: {
  image: string;
  badgeText: string;
  title: string;
  description: string;
  ctaText: string;
  onCtaClick: () => void;
  isOpen: boolean;
  onDismiss: () => void;
}) => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  return (
    <Modal 
      isOpen={isOpen} 
      onDismiss={onDismiss}
      size="small"
      aria-labelledby="info-title"
      aria-describedby="info-description"
    >
      <ModalHeader />
      <ModalBody padding="spacing.0">
        <img 
          src={image} 
          alt={title} 
          width={isMobile ? '100%' : '400px'} 
          height={200} 
        />
        <Box margin="spacing.6">
          <Badge color="negative">{badgeText}</Badge>
          <Box marginTop="spacing.4">
            <Heading id="info-title" size="large" weight="semibold">
              {title}
            </Heading>
            <Text id="info-description">{description}</Text>
          </Box>
        </Box>
        <Box marginX="spacing.6" marginBottom="spacing.6">
          <Button 
            isFullWidth 
            onClick={onCtaClick}
            aria-label={ctaText}
          >
            {ctaText}
          </Button>
        </Box>
      </ModalBody>
    </Modal>
  );
};

// Usage Example
const App = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Show Information</Button>
      <InformationModal
        image="/path/to/alert-image.png"
        badgeText="Action Required"
        title="Update your KYC by 5th July"
        description="Complete your KYC verification to continue using all services without interruption."
        ctaText="Update KYC"
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        onCtaClick={() => {
          console.log('CTA clicked');
          setIsOpen(false);
        }}
      />
    </>
  );
};
```

### OTP Verification Modal
A specialized modal for handling two-factor authentication with OTP input.

```tsx
import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Box,
  Button,
  Text,
  Link,
  OTPInput,
  LockIcon,
  useTheme,
} from '@razorpay/blade/components';

const OTPVerificationModal = ({
  phoneNumber,
  onVerify,
  onResend,
  isOpen,
  onDismiss,
}: {
  phoneNumber: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  isOpen: boolean;
  onDismiss: () => void;
}) => {
  const { theme } = useTheme();
  const [otp, setOtp] = React.useState('');

  return (
    <Modal 
      isOpen={isOpen} 
      onDismiss={onDismiss}
      size="small"
      aria-labelledby="otp-title"
      aria-describedby="otp-description"
    >
      <ModalHeader />
      <ModalBody>
        <Box
          backgroundColor="interactive.background.gray.default"
          padding="spacing.4"
          borderRadius="medium"
          width="fit-content"
        >
          <LockIcon color="surface.icon.gray.subtle" />
        </Box>
        <Box marginTop="spacing.4" display="flex" flexDirection="column" gap="spacing.2">
          <Text id="otp-title" size="large" weight="semibold">
            2 Step Verification
          </Text>
          <Text 
            id="otp-description"
            size="small" 
            weight="regular" 
            color="surface.text.gray.subtle"
          >
            A 6-digit OTP has been sent via SMS to {phoneNumber}. The OTP will expire in 5 minutes.
          </Text>
        </Box>
        <Box marginY="spacing.5">
          <OTPInput 
            label="Enter verification code" 
            otpLength={6}
            value={otp}
            onChange={setOtp}
            aria-label="Enter 6-digit verification code"
          />
        </Box>
        <Box
          marginTop="spacing.5"
          display="flex"
          flexDirection="row"
          gap="spacing.2"
          alignItems="center"
        >
          <Text size="small" color="surface.text.gray.subtle">
            Didn't receive OTP?
          </Text>
          <Button 
            variant="link" 
            size="small"
            onClick={onResend}
            aria-label="Resend verification code"
          >
            Resend OTP
          </Button>
        </Box>
      </ModalBody>
      <ModalFooter>
        <Button 
          isFullWidth 
          isDisabled={otp.length !== 6}
          onClick={() => onVerify(otp)}
          aria-label="Verify OTP"
        >
          Verify
        </Button>
      </ModalFooter>
    </Modal>
  );
};

// Usage Example
const App = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Start Verification</Button>
      <OTPVerificationModal
        phoneNumber="8757450923"
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        onVerify={(otp) => {
          console.log('Verifying OTP:', otp);
          setIsOpen(false);
        }}
        onResend={() => {
          console.log('Resending OTP');
        }}
      />
    </>
  );
};
``` 
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

### Share Modal
A modal for sharing content with social media options and direct link copying functionality.

```tsx
import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Box,
  Button,
  Text,
  TextInput,
  Divider,
  Tooltip,
  ShareIcon,
  CopyIcon,
  PhoneIcon,
  MailIcon,
  useTheme,
} from '@razorpay/blade/components';

const ShareModal = ({
  title,
  description,
  shareUrl,
  isOpen,
  onDismiss,
}: {
  title: string;
  description: string;
  shareUrl: string;
  isOpen: boolean;
  onDismiss: () => void;
}) => {
  const [isCopied, setIsCopied] = React.useState(false);
  const { theme } = useTheme();

  const socialIcons = [
    { name: 'Facebook', icon: '/assets/facebook.png' },
    { name: 'Twitter', icon: '/assets/twitter.png' },
    { name: 'WhatsApp', icon: '/assets/whatsapp.png' },
    { name: 'Instagram', icon: '/assets/instagram.png' },
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onDismiss={onDismiss}
      size="small"
      aria-labelledby="share-title"
      aria-describedby="share-description"
    >
      <ModalHeader />
      <ModalBody>
        <Box
          backgroundColor="interactive.background.gray.default"
          padding="spacing.4"
          borderRadius="medium"
          width="48px"
          height="48px"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <ShareIcon color="surface.icon.gray.subtle" size="xlarge" />
        </Box>
        <Box marginTop="spacing.5" display="flex" flexDirection="column" gap="spacing.3">
          <Text id="share-title" size="large" weight="semibold">
            {title}
          </Text>
          <Text id="share-description" size="medium" color="surface.text.gray.subtle">
            {description}
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
            <TextInput value={shareUrl} aria-label="Share URL" />
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
                  navigator.clipboard.writeText(shareUrl);
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 3000);
                }}
                aria-label="Copy link"
              >
                Copy
              </Button>
            )}
          </Box>
        </Box>
        <Box marginTop="spacing.5">
          <Box display="flex" flexDirection="row" gap="spacing.5" alignItems="center">
            <Text color="surface.text.gray.muted" size="small" weight="medium">
              Share Via
            </Text>
            <Box display="flex" flexDirection="row" gap="spacing.4">
              {socialIcons.map((social) => (
                <Box
                  key={social.name}
                  padding="spacing.2"
                  borderRadius="round"
                  borderColor="surface.border.gray.muted"
                  borderWidth="thin"
                  height="40px"
                  width="40px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  role="button"
                  aria-label={`Share on ${social.name}`}
                  tabIndex={0}
                >
                  <img src={social.icon} alt={social.name} width="24px" height="24px" />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          gap="spacing.5"
          alignItems="center"
          marginY="spacing.6"
        >
          <Divider />
          <Text color="surface.text.gray.muted" size="small" weight="medium">
            OR
          </Text>
          <Divider />
        </Box>
        <Box display="flex" flexDirection="column" gap="spacing.4">
          <Text size="small" weight="medium" color="surface.text.gray.muted">
            Share via SMS or email
          </Text>
          <TextInput
            leadingIcon={PhoneIcon}
            placeholder="Enter phone number"
            aria-label="Phone number"
          />
          <TextInput
            leadingIcon={MailIcon}
            placeholder="Enter email"
            aria-label="Email address"
          />
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
      <Button onClick={() => setIsOpen(true)}>Share</Button>
      <ShareModal
        title="Share Payment Link"
        description="Share this payment link with your customers to accept payments easily"
        shareUrl="https://rzp.io/test-payment"
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
      />
    </>
  );
};
```

### Single Step Form Modal
A modal for collecting form data with a side image and responsive layout.

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
  TextInput,
  Chip,
  ChipGroup,
  useBreakpoint,
  useTheme,
} from '@razorpay/blade/components';

const SingleStepFormModal = ({
  isOpen,
  onDismiss,
  onSubmit,
}: {
  isOpen: boolean;
  onDismiss: () => void;
  onSubmit: (data: {
    shippingTime: string;
    cancellationTime: string;
    refundTime: string;
    contactNumber: string;
    emailId: string;
  }) => void;
}) => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  const [formData, setFormData] = React.useState({
    shippingTime: '',
    cancellationTime: '',
    refundTime: '',
    contactNumber: '',
    emailId: '',
  });

  const timeOptions = [
    { value: '1-2 days', label: '1-2 days' },
    { value: '3-5 days', label: '3-5 days' },
    { value: '6-8 days', label: '6-8 days' },
    { value: '9-15 days', label: '9-15 days' },
    { value: 'not applicable', label: 'Not Applicable' },
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onDismiss={onDismiss}
      size="large"
      aria-labelledby="form-title"
      aria-describedby="form-description"
    >
      <ModalHeader />
      <ModalBody padding="spacing.0">
        <Box
          display="grid"
          gridTemplateColumns={isMobile ? '1fr' : 'auto 1fr'}
          gridTemplateRows="auto 1fr"
          width="100%"
          height="100%"
        >
          {!isMobile && (
            <Box
              backgroundColor="surface.background.gray.subtle"
              height="596px"
              width="400px"
              gridRow="span 2"
            >
              <img
                src="/assets/side-image.png"
                height="596px"
                width="100%"
                alt="Decorative"
                style={{ objectFit: 'cover' }}
              />
            </Box>
          )}
          <Box
            height="596px"
            paddingTop="spacing.6"
            width="100%"
            overflow="auto"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Box paddingX="spacing.6">
              <Heading id="form-title" size="medium" weight="semibold">
                Create policy pages with Razorpay
              </Heading>
              <Text id="form-description" size="medium" color="surface.text.gray.muted">
                We need a few details to create the missing policy pages for you
              </Text>
              <Box
                marginTop="spacing.6"
                display="flex"
                gap="spacing.7"
                flexDirection="column"
                width="100%"
              >
                <ChipGroup 
                  label="Shipping time"
                  value={formData.shippingTime}
                  onChange={(value) => setFormData({ ...formData, shippingTime: value })}
                >
                  {timeOptions.map((option) => (
                    <Chip key={option.value} value={option.value}>
                      {option.label}
                    </Chip>
                  ))}
                </ChipGroup>
                <ChipGroup 
                  label="Cancellation request time"
                  value={formData.cancellationTime}
                  onChange={(value) => setFormData({ ...formData, cancellationTime: value })}
                >
                  {timeOptions.map((option) => (
                    <Chip key={option.value} value={option.value}>
                      {option.label}
                    </Chip>
                  ))}
                </ChipGroup>
                <ChipGroup 
                  label="Refund processing time"
                  value={formData.refundTime}
                  onChange={(value) => setFormData({ ...formData, refundTime: value })}
                >
                  {timeOptions.map((option) => (
                    <Chip key={option.value} value={option.value}>
                      {option.label}
                    </Chip>
                  ))}
                </ChipGroup>
                <TextInput
                  label="Support contact number"
                  prefix="+91"
                  placeholder="9XXXXXXXXX"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                />
                <TextInput
                  label="Support Email ID"
                  placeholder="support@razorpay.com"
                  value={formData.emailId}
                  onChange={(e) => setFormData({ ...formData, emailId: e.target.value })}
                />
              </Box>
            </Box>
            <Box>
              <ModalFooter>
                <Box display="flex" justifyContent="flex-end" gap="spacing.5">
                  <Button variant="tertiary" onClick={onDismiss}>
                    Back
                  </Button>
                  <Button
                    onClick={() => onSubmit(formData)}
                    isDisabled={!Object.values(formData).every(Boolean)}
                  >
                    Continue
                  </Button>
                </Box>
              </ModalFooter>
            </Box>
          </Box>
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
      <Button onClick={() => setIsOpen(true)}>Create Policy</Button>
      <SingleStepFormModal
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        onSubmit={(data) => {
          console.log('Form submitted:', data);
          setIsOpen(false);
        }}
      />
    </>
  );
};
``` 
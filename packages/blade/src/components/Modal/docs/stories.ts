const Playground = `
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  RadioGroup,
  Radio,
  Box,
  Badge,
  Counter
} from "@razorpay/blade/components";
import React from "react";

function App() {
  const buttonRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        Open Modal
      </Button>
      <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="large">
        <ModalHeader
          title="Address Details"
        />
        <ModalBody>
          <RadioGroup label="Addresses">
            <Radio value="home">
              Home - 11850 Florida 24, Cedar Key, Florida
            </Radio>
            <Radio value="office-1">
              Office - 2033 Florida 21, Cedar Key, Florida
            </Radio>
            <Radio value="office-2">Work - 5938 New York, Main Street</Radio>
          </RadioGroup>
        </ModalBody>
        <ModalFooter>
          <Box
            display="flex"
            gap="spacing.3"
            justifyContent="flex-end"
            width="100%"
          >
            <Button variant="secondary">Remove address</Button>
            <Button>Add address</Button>
          </Box>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default App;
`;
const BasicModalStory = `
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from "@razorpay/blade/components";
import React from "react";

function App() {
  const buttonRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        Open Modal
      </Button>
      <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="medium">
        <ModalHeader title="Basic Modal" />
        <ModalBody>
          <Text>
            This is a basic Modal. Close the Modal by clicking on the backdrop,
            clicking on the close icon or pressing escape key.
          </Text>
        </ModalBody>
      </Modal>
    </>
  );
}

export default App;
`;

const ModalWithHeaderFooterStory = `
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  RadioGroup,
  Radio,
  Box,
  Badge,
  Counter
} from "@razorpay/blade/components";
import React from "react";

function App() {
  const buttonRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        Open Modal with Header & Footer
      </Button>
      <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="large">
        <ModalHeader
          title="Address Details"
          subtitle="Saving addresses will improve your checkout experience"
          trailing={<Badge variant="notice">Action Needed</Badge>}
          titleSuffix={<Counter variant="positive" value={2} />}
        />
        <ModalBody>
          <RadioGroup label="Addresses">
            <Radio value="home">
              Home - 11850 Florida 24, Cedar Key, Florida
            </Radio>
            <Radio value="office-1">
              Office - 2033 Florida 21, Cedar Key, Florida
            </Radio>
            <Radio value="office-2">Work - 5938 New York, Main Street</Radio>
          </RadioGroup>
        </ModalBody>
        <ModalFooter>
          <Box
            display="flex"
            gap="spacing.3"
            justifyContent="flex-end"
            width="100%"
          >
            <Button variant="secondary">Remove address</Button>
            <Button>Add address</Button>
          </Box>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default App;
`;

const ModalWithScrollableBackgroundStory = `
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from "@razorpay/blade/components";
import React from "react";

function App() {
  const buttonRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        marginBottom="spacing.4"
      >
        Open Modal
      </Button>
      <Text marginBottom="500px">
        This is an example for a modal with a scrollable background. The
        background contains content that is longer than the screen height. When
        the modal is opened, the background locked from scrolling but when the
        modal is closed, the background content can be scrolled again.
      </Text>
      <Text marginBottom="500px">
        This is an example for a modal with a scrollable background. The
        background contains content that is longer than the screen height. When
        the modal is opened, the background locked from scrolling but when the
        modal is closed, the background content can be scrolled again.
      </Text>
      <Text marginBottom="500px">
        This is an example for a modal with a scrollable background. The
        background contains content that is longer than the screen height. When
        the modal is opened, the background locked from scrolling but when the
        modal is closed, the background content can be scrolled again.
      </Text>
      <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="small">
        <ModalHeader title="Scroll Lock Demo" />
        <ModalBody>
          <Text>
            The background content is no longer scrollable. You can scroll the
            background content again once you close this Modal.
          </Text>
        </ModalBody>
      </Modal>
    </>
  );
}

export default App;
`;

const ModalWithScrollableContentStory = `
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Text,
  TextArea,
  TextInput
} from "@razorpay/blade/components";
import React from "react";

function App() {
  const buttonRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        marginBottom="spacing.4"
      >
        Open Scrollable Modal
      </Button>
      <Text>
        This is an example for a scrollable modal. The modal contains content
        that is longer than the Modal maximum height. When the modal is opened,
        the modal content is scrollable.
      </Text>
      <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="large">
        <ModalHeader title="Contact Details" subtitle="How can we reach you?" />
        <ModalBody>
          <Box>
            <TextInput
              label="First Name"
              placeholder="John"
              marginBottom="spacing.3"
            />
            <TextInput
              label="Last Name"
              placeholder="Doe"
              marginBottom="spacing.3"
            />
            <TextInput
              label="Email"
              placeholder="john.doe@gmail.com"
              marginBottom="spacing.3"
            />
            <TextInput
              label="Phone Number"
              placeholder="+1 234 567 890"
              marginBottom="spacing.3"
            />
            <TextArea
              label="Address"
              placeholder="11850 Florida 24, Cedar Key, Florida"
              marginBottom="spacing.3"
            />

            <RadioGroup label="Address Type">
              <Radio value="home">Home</Radio>
              <Radio value="office">Office</Radio>
              <Radio value="spacestation">Space Station</Radio>
            </RadioGroup>
          </Box>
          <Box>
            <TextInput
              label="First Name"
              placeholder="John"
              marginBottom="spacing.3"
            />
            <TextInput
              label="Last Name"
              placeholder="Doe"
              marginBottom="spacing.3"
            />
            <TextInput
              label="Email"
              placeholder="john.doe@gmail.com"
              marginBottom="spacing.3"
            />
            <TextInput
              label="Phone Number"
              placeholder="+1 234 567 890"
              marginBottom="spacing.3"
            />
            <TextArea
              label="Address"
              placeholder="11850 Florida 24, Cedar Key, Florida"
              marginBottom="spacing.3"
            />

            <RadioGroup label="Address Type">
              <Radio value="home">Home</Radio>
              <Radio value="office">Office</Radio>
              <Radio value="spacestation">Space Station</Radio>
            </RadioGroup>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Box
            display="flex"
            gap="spacing.3"
            justifyContent="flex-end"
            width="100%"
          >
            <Button variant="secondary">Remove address</Button>
            <Button>Add address</Button>
          </Box>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default App;
`;

const ModalStackingStory = `
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Text,
  TextArea,
  TextInput
} from "@razorpay/blade/components";
import React from "react";

function App() {
  const buttonRef = React.useRef(null);
  const [is1stOpen, set1stIsOpen] = React.useState(false);
  const [is2ndOpen, setIs2ndOpen] = React.useState(false);
  const [is3rdOpen, setIs3rdOpen] = React.useState(false);
  return (
    <>
      <Button ref={buttonRef} onClick={() => set1stIsOpen(true)}>
        Open First Modal
      </Button>
      {/* Modal 1 */}
      <Modal
        isOpen={is1stOpen}
        onDismiss={() => set1stIsOpen(false)}
        size="large"
      >
        <ModalHeader title="First Modal" />
        <ModalBody>
          <Box>
            <TextInput
              label="First Name"
              placeholder="John"
              marginBottom="spacing.3"
            />
            <TextInput
              label="Last Name"
              placeholder="Doe"
              marginBottom="spacing.3"
            />
            <TextInput
              label="Email"
              placeholder="john.doe@gmail.com"
              marginBottom="spacing.3"
            />
            <TextInput
              label="Phone Number"
              placeholder="+1 234 567 890"
              marginBottom="spacing.3"
            />
            <TextArea
              label="Address"
              placeholder="11850 Florida 24, Cedar Key, Florida"
              marginBottom="spacing.3"
            />

            <RadioGroup label="Address Type">
              <Radio value="home">Home</Radio>
              <Radio value="office">Office</Radio>
              <Radio value="spacestation">Space Station</Radio>
            </RadioGroup>
          </Box>
          <Box>
            <TextInput
              label="First Name"
              placeholder="John"
              marginBottom="spacing.3"
            />
            <TextInput
              label="Last Name"
              placeholder="Doe"
              marginBottom="spacing.3"
            />
            <TextInput
              label="Email"
              placeholder="john.doe@gmail.com"
              marginBottom="spacing.3"
            />
            <TextInput
              label="Phone Number"
              placeholder="+1 234 567 890"
              marginBottom="spacing.3"
            />
            <TextArea
              label="Address"
              placeholder="11850 Florida 24, Cedar Key, Florida"
              marginBottom="spacing.3"
            />

            <RadioGroup label="Address Type">
              <Radio value="home">Home</Radio>
              <Radio value="office">Office</Radio>
              <Radio value="spacestation">Space Station</Radio>
            </RadioGroup>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Box
            display="flex"
            gap="spacing.3"
            justifyContent="flex-end"
            width="100%"
          >
            <Button variant="secondary" onClick={() => set1stIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIs2ndOpen(true)}>
              Open Second Modal
            </Button>
          </Box>
        </ModalFooter>
      </Modal>
      {/* Modal 2 */}
      <Modal
        isOpen={is2ndOpen}
        onDismiss={() => setIs2ndOpen(false)}
        size="medium"
      >
        <ModalHeader title="Second Modal" />
        <ModalBody>
          <RadioGroup label="Addresses">
            <Radio value="home">
              Home - 11850 Florida 24, Cedar Key, Florida
            </Radio>
            <Radio value="office-1">
              Office - 2033 Florida 21, Cedar Key, Florida
            </Radio>
            <Radio value="office-2">Work - 5938 New York, Main Street</Radio>
          </RadioGroup>
        </ModalBody>
        <ModalFooter>
          <Box
            display="flex"
            gap="spacing.3"
            justifyContent="flex-end"
            width="100%"
          >
            <Button variant="secondary" onClick={() => setIs2ndOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIs3rdOpen(true)}>Open Third Modal</Button>
          </Box>
        </ModalFooter>
      </Modal>
      {/* Modal 3 */}
      <Modal
        isOpen={is3rdOpen}
        onDismiss={() => setIs3rdOpen(false)}
        size="small"
      >
        <ModalHeader title="Third Modal" />
        <ModalBody>
          <Text>This is the 3rd modal</Text>
        </ModalBody>
      </Modal>
    </>
  );
}

export default App;
`;

const ModalWithNoBodyPaddingStory = `
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text
} from "@razorpay/blade/components";
import React from "react";

function App() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="large">
        <ModalHeader title="First Modal" />
        <ModalBody padding="spacing.0">
          <Box display="flex" flexDirection="column">
            <img
              width="100%"
              height="300px"
              src="https://d6xcmfyh68wv8.cloudfront.net/assets/case-studies/common-card/pg_breathingroom.png"
              alt="Breathing Room"
            />
            <Box padding="spacing.7" display="flex" flexDirection="column">
              <Text marginTop="spacing.5">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s
              </Text>
            </Box>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Box
            display="flex"
            gap="spacing.3"
            justifyContent="flex-end"
            width="100%"
          >
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button>Save</Button>
          </Box>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default App;
`;

const OtpModalStory = `
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

const OTPModal = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';
  const [isResendOtpTimerRunning, setIsResendOtpTimerRunning] =
    React.useState(false);
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
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRadius="medium"
          padding="spacing.4"
          width="48px"
          height="48px"
          backgroundColor="feedback.background.neutral.subtle"
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
              ? \`Resend OTP in ${resendOtpTimer} seconds\`
              : "Didn't receive OTP?"}
          </Text>
          {isResendOtpTimerRunning ? null : (
            <Link
              isDisabled={isResendOtpTimerRunning}
              onClick={handleResendOtp}
              size="medium"
              variant="button"
            >
              {isResendOtpTimerRunning
                ? \`Resend OTP in ${resendOtpTimer}s\`
                : 'Resend OTP'}
            </Link>
          )}
        </Box>
      </ResponsiveModalWrapper>
    </Box>
  );
};

export default OTPModal;
`;

const ShareModalStory = `import React from 'react';
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
  ShareIcon,
  TextInput,
  Tooltip,
  CopyIcon,
  Divider,
  PhoneIcon,
  MailIcon,
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

const ShareModal = () => {
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
        <Box
          marginTop="spacing.5"
          display="flex"
          flexDirection="column"
          gap="spacing.3"
        >
          <Text size="large" weight="semibold" color="surface.text.gray.normal">
            Share Payment Link
          </Text>
          <Text size="medium" weight="regular" color="surface.text.gray.subtle">
            Subtitle go here, support details helps your customers to easily
            reach out to you when they face any
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
          <Box
            display="flex"
            flexDirection="row"
            gap="spacing.5"
            alignItems="center"
          >
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
                <img
                  src="https://raw.githubusercontent.com/tewarig/images_hosting/refs/heads/main/fb.png"
                  alt="Facebook"
                  width="28px"
                  height="28px"
                />
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
                <img
                  src="https://raw.githubusercontent.com/tewarig/images_hosting/refs/heads/main/x.png"
                  alt="Twitter"
                  width="32px"
                  height="20px"
                />
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
                <img
                  src="https://raw.githubusercontent.com/tewarig/images_hosting/refs/heads/main/wa.png"
                  alt="WhatsApp"
                  width="25.6px"
                  height="26px"
                />
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
                <img
                  src="https://raw.githubusercontent.com/tewarig/images_hosting/refs/heads/main/ig.png"
                  alt="Instagram"
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
          <TextInput
            leadingIcon={PhoneIcon}
            placeholder="Enter your phone number"
            label=""
          />
          <TextInput
            leadingIcon={MailIcon}
            placeholder="Enter Email"
            label=""
          />
        </Box>
      </ResponsiveModalWrapper>
    </Box>
  );
};
export default ShareModal;
`;

const InformationalModalStory = `
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
  Badge,
  Heading,
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

const InformationalModalWithImage: StoryFn<typeof Modal> = () => {
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
          <img
            src="https://raw.githubusercontent.com/tewarig/images_hosting/refs/heads/main/alert.png"
            alt="Alert"
            width={isMobile ? '100%' : '400px'}
            height={200}
          />
          <Box margin="spacing.6">
            <Badge color="negative">Action Required </Badge>
            <Box marginTop="spacing.4">
              <Heading size="large" weight="semibold">
                Update your KYC by 5th July
              </Heading>
              <Text
                size="medium"
                weight="regular"
                color="surface.text.gray.subtle"
              >
                Subtitle go here, support details helps your customers to easily
                reach out to you when they face any.
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
export default InformationalModalWithImage;
`;

export {
  Playground,
  BasicModalStory,
  ModalWithHeaderFooterStory,
  ModalWithScrollableBackgroundStory,
  ModalWithScrollableContentStory,
  ModalStackingStory,
  ModalWithNoBodyPaddingStory,
  OtpModalStory,
  ShareModalStory,
  InformationalModalStory,
};

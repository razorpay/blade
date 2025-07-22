## Informational

## Description
The Informational pattern is designed for displaying important information, alerts, or updates to users in a modal or bottom sheet format. It provides a consistent way to show critical information with optional imagery, ensuring the message is prominently displayed and easily accessible across different device types. This pattern is particularly useful for time-sensitive notifications, system updates, or important user action requirements.

## Components Used
- Modal
- BottomSheet
- Box
- Button
- Badge
- Typography (Heading, Text)

## Example

### Informational Modal with Image
This example demonstrates a responsive informational modal that adapts between a modal on desktop and a bottom sheet on mobile devices. It includes an image, badge for status, heading for the main message, descriptive text, and a call-to-action button.

```tsx
import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  BottomSheet,
  BottomSheetHeader,
  BottomSheetBody,
  BottomSheetFooter,
  Box,
  Button,
  Badge,
  Heading,
  Text,
  useBreakpoint,
  useTheme,
} from '@razorpay/blade/components';

interface ResponsiveModalWrapperProps {
  children: React.ReactElement | React.ReactElement[];
  footer?: React.ReactElement;
  isOpen: boolean;
  onDismiss: () => void;
  modalBodyPadding?: 'spacing.0' | 'spacing.2' | 'spacing.4' | 'spacing.6' | 'spacing.8';
  modalSize?: 'small' | 'medium' | 'large';
  wrapInBottomSheetFooter?: boolean;
  customSnapPoints?: [number, number, number];
}

const ResponsiveModalWrapper: React.FC<ResponsiveModalWrapperProps> = ({
  children,
  footer,
  isOpen,
  onDismiss,
  modalBodyPadding,
  modalSize = 'small',
  wrapInBottomSheetFooter = false,
  customSnapPoints = [0.35, 0.5, 0.85],
}) => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  if (isMobile) {
    return (
      <BottomSheet 
        isOpen={isOpen} 
        onDismiss={onDismiss} 
        snapPoints={customSnapPoints}
        aria-label="Important Information"
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
    <Modal 
      isOpen={isOpen} 
      onDismiss={onDismiss} 
      size={modalSize}
      aria-label="Important Information"
    >
      <ModalHeader />
      <ModalBody padding={modalBodyPadding}>{children}</ModalBody>
      {footer && <ModalFooter>{footer}</ModalFooter>}
    </Modal>
  );
};

const InformationalExample: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  return (
    <Box>
      <Button 
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
      >
        View Important Update
      </Button>
      <ResponsiveModalWrapper
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        modalBodyPadding="spacing.0"
        customSnapPoints={[0.6, 0.75, 0.95]}
      >
        <ModalBody padding="spacing.0">
          <Box 
            as="img"
            src="/path/to/alert-image.png" 
            alt="KYC Update Required" 
            width={isMobile ? '100%' : '400px'} 
            height={200}
          />
          <Box margin="spacing.6">
            <Badge color="negative">Action Required</Badge>
            <Box marginTop="spacing.4">
              <Heading 
                size="large" 
                weight="semibold"
                id="informational-heading"
              >
                Update your KYC by 5th July
              </Heading>
              <Text 
                size="medium" 
                weight="regular" 
                color="surface.text.gray.subtle"
                id="informational-description"
              >
                Your KYC documents need to be updated to comply with new regulations. 
                Please update them before the deadline to avoid any service interruptions.
              </Text>
            </Box>
          </Box>
          <Box marginX="spacing.6" marginBottom="spacing.6">
            <Button 
              isFullWidth 
              variant="primary"
              aria-describedby="informational-description"
            >
              Update KYC
            </Button>
          </Box>
        </ModalBody>
      </ResponsiveModalWrapper>
    </Box>
  );
};

export default InformationalExample;
```

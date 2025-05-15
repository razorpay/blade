## Component Name

Modal

## Description

Modal is a dialog component that appears in front of the app content to provide critical information or request user input. It's designed to focus user attention, disabling all other interactions until explicitly dismissed. Modals are accessible, can be dismissed via escape key, clicking outside, or a close button, and come in three sizes: small, medium, and large.

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
   *  Ref to the element to be focused on opening the modal.
   */
  initialFocusRef?: React.MutableRefObject<any>;
  /**
   *  Size of the modal
   * @default 'small'
   */
  size?: 'small' | 'medium' | 'large';
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
  Select,
  TextField,
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
        dataAnalyticsAction="address_selection"
      >
        <ModalHeader
          title="Select Delivery Address"
          subtitle="Choose where you'd like your order delivered"
          dataAnalyticsContext="address_header"
        />

        <ModalBody dataAnalyticsContext="address_body">
          <Box display="flex" flexDirection="column" gap="spacing.5">
            <Box marginTop="spacing.5">
              <Text variant="bodyMedium" color="surface.text.gray.subtle">
                Need to add a new address?
              </Text>

              <Box marginTop="spacing.4">
                <TextField
                  label="Address Line 1"
                  placeholder="Enter street address"
                  marginBottom="spacing.4"
                />
                <TextField
                  label="Address Line 2"
                  placeholder="Apt, Suite, Building (optional)"
                  marginBottom="spacing.4"
                />
              </Box>
            </Box>
          </Box>
        </ModalBody>

        <ModalFooter dataAnalyticsContext="address_footer">
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

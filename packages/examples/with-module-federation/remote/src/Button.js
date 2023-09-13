import {
  Button as BladeButton,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Box,
  Text,
} from '@razorpay/blade/components';
import React from 'react';

function Button() {
  const buttonRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Box>
      <BladeButton ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        Open Modal
      </BladeButton>
      <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="large">
        <ModalHeader title="Address Details" />
        <ModalBody>
          <Text>This is modal body content</Text>
        </ModalBody>
        <ModalFooter>
          <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
            <BladeButton variant="secondary">Remove address</BladeButton>
            <BladeButton>Add address</BladeButton>
          </Box>
        </ModalFooter>
      </Modal>
    </Box>
  );
}

export default Button;

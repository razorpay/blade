import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Box,
  Text,
  Title,
} from '@razorpay/blade/components';
import React from 'react';

const App = () => {
  const buttonRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Box gap="spacing.5" display="flex" flexDirection="column">
      <Title size="large">Basic Host-Remote</Title>
      <Title size="medium">Remote App</Title>
      <Box maxWidth="250px">
        <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
          Open Modal
        </Button>
      </Box>

      <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="large">
        <ModalHeader title="Address Details" />
        <ModalBody>
          <Text>This is modal body content</Text>
        </ModalBody>
        <ModalFooter>
          <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
            <Button variant="secondary">Remove address</Button>
            <Button>Add address</Button>
          </Box>
        </ModalFooter>
      </Modal>
    </Box>
  );
};

export default App;

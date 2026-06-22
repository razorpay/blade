import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@razorpay/blade/components';
import { Button, Text, Box } from '@razorpay/blade/components';

export const Basic = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="medium">
      <ModalHeader title="Confirm Payment" />
      <ModalBody>
        <Text>Are you sure you want to proceed with this payment?</Text>
      </ModalBody>
      <ModalFooter>
        <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>Confirm</Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export const WithSubtitle = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="medium">
      <ModalHeader
        title="Delete Account"
        subtitle="This action cannot be undone"
      />
      <ModalBody>
        <Text>
          Are you sure you want to delete your account? All your data will be permanently removed.
        </Text>
      </ModalBody>
      <ModalFooter>
        <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="negative" onClick={() => setIsOpen(false)}>
            Delete Account
          </Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export const Small = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="small">
      <ModalHeader title="Session Expired" />
      <ModalBody>
        <Text>Your session has expired. Please log in again to continue.</Text>
      </ModalBody>
      <ModalFooter>
        <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
          <Button onClick={() => setIsOpen(false)}>Log In</Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export const Large = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="large">
      <ModalHeader
        title="Address Details"
        subtitle="Saving addresses will improve your checkout experience"
      />
      <ModalBody>
        <Text>Select an existing address or add a new one for delivery.</Text>
      </ModalBody>
      <ModalFooter>
        <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Remove Address
          </Button>
          <Button onClick={() => setIsOpen(false)}>Add Address</Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export const NonDismissible = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <Modal isOpen={isOpen} onDismiss={() => {}} isDismissible={false} size="medium">
      <ModalHeader title="KYC Verification Required" />
      <ModalBody>
        <Text>
          Complete your KYC verification to continue using payment services. This is mandatory.
        </Text>
      </ModalBody>
      <ModalFooter>
        <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
          <Button onClick={() => setIsOpen(false)}>Complete KYC</Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

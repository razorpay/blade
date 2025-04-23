import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import type { ModalProps } from '../Modal';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../Modal';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Radio, RadioGroup } from '~components/Radio';
import { StepGroup, StepItem, StepItemIcon, StepItemIndicator } from '~components/StepGroup';
import { CheckIcon, LockIcon } from '~components/Icons';
import { Divider } from '~components/Divider';

export default {
  title: 'Components/Modal/FullScreenModal',
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

const ModalWithFullScreen: StoryFn<typeof Modal> = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <>
      <Button onClick={() => setIsOpen(!isOpen)}>Open Modal</Button>
      <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="full">
        <ModalHeader title="User Onboarding" />
        <ModalBody padding="spacing.0" height="100%">
          <Box display="flex" flexDirection="row" height="100%">
            <Box
              backgroundColor="surface.background.gray.moderate"
              height="100%"
              padding="spacing.6"
            >
              <StepGroup>
                <StepItem
                  title="Basic User Information"
                  marker={<StepItemIcon icon={CheckIcon} color="positive" />}
                />
                <StepItem
                  title="Shipping Address Selection"
                  marker={<StepItemIndicator color="primary" />}
                />
                <StepItem
                  title="e - KYC"
                  marker={<StepItemIcon icon={LockIcon} color="neutral" />}
                />
              </StepGroup>
            </Box>
            <Divider orientation="vertical" />
            <Box
              height="100%"
              width="100%"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Box padding="spacing.6">
                <RadioGroup label="Shipping Address Selection">
                  <Radio value="home">Home - 11850 Florida 24, Cedar Key, Florida</Radio>
                  <Radio value="office-1">Office - 2033 Florida 21, Cedar Key, Florida</Radio>
                  <Radio value="office-2">Work - 5938 New York, Main Street</Radio>
                </RadioGroup>
              </Box>
              <ModalFooter>
                <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
                  <Button variant="tertiary">Cancel</Button>
                  <Button>Add Shipping address</Button>
                </Box>
              </ModalFooter>
            </Box>
          </Box>
        </ModalBody>
      </Modal>
    </>
  );
};

export const ModalWithFullScreenTemplate = ModalWithFullScreen.bind({});
ModalWithFullScreenTemplate.storyName = 'Modal with Full Screen';

import React from 'react';
import type { ComponentStory, Meta } from '@storybook/react';
import type { ModalProps } from '../Modal';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../Modal';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import { Radio, RadioGroup } from '~components/Radio';
import { Box } from '~components/Box';
import { Button } from '~components/Button';

export default {
  title: 'Components/Modal/SimpleModal',
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

const ModalTemplate: ComponentStory<typeof Modal> = ({ size }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <>
      <Button onClick={() => setIsOpen(!isOpen)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false);
        }}
        size={size}
      >
        <ModalHeader
          title="Address Details"
          subtitle="This example is created for Modal snapshot testing"
        />
        <ModalBody>
          <RadioGroup label="Addresses">
            <Radio value="home">Home - 11850 Florida 24, Cedar Key, Florida</Radio>
            <Radio value="office-1">Office - 2033 Florida 21, Cedar Key, Florida</Radio>
            <Radio value="office-2">Work - 5938 New York, Main Street</Radio>
          </RadioGroup>
        </ModalBody>
        <ModalFooter>
          <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
            <Button variant="secondary">Remove address</Button>
            <Button>Add address</Button>
          </Box>
        </ModalFooter>
      </Modal>
    </>
  );
};

export const Default = ModalTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
Default.storyName = 'Default';

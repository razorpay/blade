import React from 'react';
import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import { Highlight } from '@storybook/design-system';
import { Modal, ModalBody, ModalFooter, ModalHeader } from './Modal';
import type { ModalProps } from './Modal';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';
import { Box } from '~components/Box';

export default {
  title: 'Components/Modal',
  component: Modal,
  args: {},
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper componentDescription="" componentName="">
          <Title>Usage</Title>
          <Highlight language="tsx">{`import { Modal } from '@razorpay/blade/components' \nimport type { ModalProps } from '@razorpay/blade/components'`}</Highlight>
        </StoryPageWrapper>
      ),
    },
  },
  argTypes: getStyledPropsArgTypes(),
} as Meta<ModalProps>;

const ModalTemplate: ComponentStory<typeof Modal> = (args) => {
  const buttonRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [is2ndModalOpen, setIs2ndModalOpen] = React.useState(false);
  return (
    <>
      <Button ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        Open Modal
      </Button>
      <Button marginLeft="spacing.3" variant="secondary">
        Dummy Button
      </Button>
      <Text marginBottom="200vh">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In efficitur porttitor ante sit
        amet tristique. Nam vel urna metus. Nam ac elit molestie, semper lorem eget, fringilla
        massa. Proin rutrum massa diam, id commodo nisi cursus ut. Vestibulum arcu enim, viverra sit
        amet mi vitae, varius semper justo. Fusce sodales quis elit ut condimentum. Nulla facilisi.
        Curabitur tincidunt est vitae neque pulvinar, at auctor tortor fringilla. Suspendisse
        tristique pretium lorem vitae hendrerit. Nulla facilisi.
      </Text>
      <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="large">
        <ModalHeader closeButtonRef={buttonRef} title="Modal Title" />
        <ModalBody>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In efficitur porttitor ante sit
            amet tristique. Nam vel urna metus. Nam ac elit molestie, semper lorem eget, fringilla
            massa. Proin rutrum massa diam, id commodo nisi cursus ut. Vestibulum arcu enim, viverra
            sit amet mi vitae, varius semper justo. Fusce sodales quis elit ut condimentum. Nulla
            facilisi. Curabitur tincidunt est vitae neque pulvinar, at auctor tortor fringilla.
            Suspendisse tristique pretium lorem vitae hendrerit. Nulla facilisi.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Box
            display="flex"
            flex={1}
            justifyContent="flex-end"
            alignItems="center"
            gap="spacing.4"
          >
            <Button variant="secondary">Cancel</Button>
            <Button onClick={() => setIs2ndModalOpen(true)}>Open 2nd Modal</Button>
          </Box>
        </ModalFooter>
      </Modal>
      <Modal isOpen={is2ndModalOpen} onDismiss={() => setIs2ndModalOpen(false)} size="small">
        <ModalHeader closeButtonRef={buttonRef} title="Modal Title" />
        <ModalBody>
          <Text>Another Modal</Text>
        </ModalBody>
        <ModalFooter>
          <Box
            display="flex"
            flex={1}
            justifyContent="flex-end"
            alignItems="center"
            gap="spacing.4"
          >
            <Button variant="secondary">Cancel</Button>
            <Button>Save</Button>
          </Box>
        </ModalFooter>
      </Modal>
    </>
  );
};

export const Default = ModalTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
Default.storyName = 'Modal';

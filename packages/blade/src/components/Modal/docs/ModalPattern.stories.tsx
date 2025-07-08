import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import isChromatic from 'chromatic/isChromatic';
import type { ModalProps } from '../Modal';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../Modal';
import AlertPng from './assets/alert.png';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Button, ButtonProps } from '~components/Button';
import { Radio, RadioGroup } from '~components/Radio';
import { Skeleton } from '~components/Skeleton';
import { CheckIcon, DownloadIcon, IconColors, IconComponent, MapIcon } from '~components/Icons';
import { Heading, Text } from '~components/Typography';
import { ButtonWithColors } from '../../Button/Button/Button.stories';
import { Badge } from '~components/Badge';

export default {
  title: 'Patterns/Modal',
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

const ConformationalModalBody = ({
  type = 'neutral',
  icon: Icon,
  title,
  description,
  primaryButtonText,
  secondaryButtonText,
}: {
  type: 'neutral' | 'negative' | 'positive';
  icon: IconComponent;
  title: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText?: string;
}): React.ReactNode => {
  const getIconColor = (): IconColors => {
    if (type === 'neutral') {
      return 'feedback.icon.neutral.subtle';
    } else if (type === 'negative') {
      return 'feedback.icon.negative.intense';
    }
    return 'feedback.icon.positive.intense';
  };
  const getPrimaryButtonColor = (): ButtonProps['color'] => {
    if (type === 'neutral') {
      return 'primary';
    } else if (type === 'negative') {
      return 'negative';
    }
    return 'positive';
  };

  return (
    <>
      {' '}
      <Box display="flex" flexDirection="column" gap="spacing.5">
        <Box
          borderColor="surface.border.gray.muted"
          backgroundColor="surface.background.gray.moderate"
          width="fit-content"
          padding="spacing.4"
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRadius="medium"
        >
          <Icon color={getIconColor()} />
        </Box>
        <Box display="flex" flexDirection="column" gap="spacing.3">
          <Heading size="large" weight="semibold">
            {title}
          </Heading>
          <Text>{description}</Text>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        gap="spacing.3"
        justifyContent="space-between"
        marginTop="spacing.6"
      >
        {secondaryButtonText && (
          <Button variant="tertiary" isFullWidth>
            {secondaryButtonText}
          </Button>
        )}

        <Button isFullWidth color={getPrimaryButtonColor()}>
          {primaryButtonText}
        </Button>
      </Box>
    </>
  );
};

const NeutralModalTemplate: StoryFn<typeof Modal> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false);
        }}
        size="small"
      >
        <ModalHeader />
        <ModalBody>
          <ConformationalModalBody
            type="neutral"
            icon={MapIcon}
            title="Restart the Tour?"
            description="This tour will give a quick guide on this product"
            primaryButtonText="Yes"
            secondaryButtonText="No"
          />
        </ModalBody>
      </Modal>
    </Box>
  );
};

export const NeutralModal = NeutralModalTemplate.bind({});
NeutralModal.storyName = 'Confirmation Modal - Neutral';

const NegativeModalTemplate: StoryFn<typeof Modal> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false);
        }}
        size="small"
      >
        <ModalHeader />
        <ModalBody>
          <ConformationalModalBody
            type="negative"
            icon={MapIcon}
            title="Restart the Tour?"
            description="This tour will give a quick guide on this product"
            primaryButtonText="Yes"
            secondaryButtonText="No"
          />
        </ModalBody>
      </Modal>
    </Box>
  );
};

export const NegativeModal = NegativeModalTemplate.bind({});
NegativeModal.storyName = 'Confirmation Modal - Negative';

const PositiveModalTemplate: StoryFn<typeof Modal> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false);
        }}
        size="small"
      >
        <ModalHeader />
        <ModalBody>
          <ConformationalModalBody
            type="positive"
            icon={CheckIcon}
            title="Success!"
            description="This tour will give a quick guide on this product"
            primaryButtonText="Done"
          />
        </ModalBody>
      </Modal>
    </Box>
  );
};

export const PositiveModal = PositiveModalTemplate.bind({});
PositiveModal.storyName = 'Confirmation Modal - Positive';

const InformationModalTemplate: StoryFn<typeof Modal> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false);
        }}
        size="small"
      >
        <ModalHeader />
        <ModalBody padding="spacing.0">
          <img src={AlertPng} alt="Alert" width={400} height={200} />
          <Box margin="spacing.6">
            <Badge color="negative">Action Required </Badge>
            <Box marginTop="spacing.4">
              <Heading size="large" weight="semibold">
                Update your KYC by 5th July
              </Heading>
              <Text>
                Subtitle go here, support details helps your customers to easily reach out to you
                when they face any.
              </Text>
            </Box>
          </Box>
          <Box marginX="spacing.6" marginBottom="spacing.6">
            <Button isFullWidth>Update KYC</Button>
          </Box>
        </ModalBody>
      </Modal>
    </Box>
  );
};

export const InformationModal = InformationModalTemplate.bind({});
InformationModal.storyName = 'Information Modal';

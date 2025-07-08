import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import type { ModalProps } from '../Modal';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../Modal';
import AlertPng from './assets/alert.png';
import DonateNow from './assets/donatenow.png';
import DonationsButton from './assets/donationButton.png';
import PayNow from './assets/paynow.png';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import type { ButtonProps } from '~components/Button';
import { Radio, RadioGroup } from '~components/Radio';
import { MapIcon, CheckIcon } from '~components/Icons';
import type { IconColors, IconComponent } from '~components/Icons';
import { Heading, Text } from '~components/Typography';
import { Badge } from '~components/Badge';
import { Card, CardBody, CardHeaderIcon } from '~components/Card';

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

const FlowSelectionModalTemplate: StoryFn<typeof Modal> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedMethod, setSelectedMethod] = React.useState('');

  const paymentMethods = [
    {
      value: 'quickpay',
      title: 'Quick Pay Button',
      subtitle:
        'Accepting fixed price payments?  Customers make quick payments of fixed price through this button',
      img: DonateNow,
    },
    {
      value: 'buynow',
      title: 'Buy Now Button',
      subtitle:
        'Selling products or event tickets?  Sell multiple items with support for quantity using this button.',
      img: DonationsButton,
    },
    {
      value: 'donations',
      title: 'Donations Button',
      subtitle:
        'Raising money for a good cause?  Supporters can pick from presets or donate amount of their choice',
      img: PayNow,
    },
  ];

  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false);
        }}
        size="large"
      >
        <ModalHeader>
          <Box padding="spacing.6">
            <Heading size="xlarge" weight="semibold">
              Select Payment Method
            </Heading>
            <Text color="surface.text.gray.muted">
              Choose your preferred payment method to proceed
            </Text>
          </Box>
        </ModalHeader>
        <ModalBody padding="spacing.0">
          <Box padding="spacing.6">
            <Box display="flex" flexDirection="row" gap="spacing.4">
              {paymentMethods.map((method) => (
                <Card
                  key={method.value}
                  isSelected={selectedMethod === method.value}
                  onClick={() => setSelectedMethod(method.value)}
                  padding="spacing.0"
                  accessibilityLabel={`Select ${method.title}`}
                  width="230px"
                  borderRadius="medium"
                >
                  <CardBody>
                    <Box overflow="none">
                      <img src={method.img} alt={method.title} width="230px" height="130px" />
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="row"
                      gap="spacing.4"
                      alignItems="center"
                      paddingX="spacing.5"
                      paddingY="spacing.4"
                    >
                      <Box>
                        <Heading size="medium" weight="semibold">
                          {method.title}
                        </Heading>
                        <Text size="small" color="surface.text.gray.muted">
                          {method.subtitle}
                        </Text>
                      </Box>
                    </Box>
                  </CardBody>
                </Card>
              ))}
            </Box>
          </Box>
          <ModalFooter>
            <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                isDisabled={!selectedMethod}
                onClick={() => {
                  console.log('Selected payment method:', selectedMethod);
                  setIsOpen(false);
                }}
              >
                Proceed
              </Button>
            </Box>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </Box>
  );
};

export const FlowSelectionModal = FlowSelectionModalTemplate.bind({});
FlowSelectionModal.storyName = 'Flow Selection Modal';

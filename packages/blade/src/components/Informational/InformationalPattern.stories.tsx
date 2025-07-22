import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import type { ModalProps, ModalBodyProps } from '../Modal';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../Modal';
import AlertPng from './assets/alert.png';
import { useBreakpoint, useTheme } from '~utils';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Badge } from '~components/Badge';
import type { BottomSheetBodyProps } from '~components/BottomSheet';
import { Heading, Text } from '~components/Typography';
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetFooter,
  BottomSheetHeader,
} from '~components/BottomSheet';

export default {
  title: 'Patterns/Informational',
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

const ResponsiveModalWrapper = ({
  children,
  footer,
  isOpen,
  onDismiss,
  modalBodyPadding,
  modalSize = 'small',
  wrapInBottomSheetFooter = false,
  customSnapPoints = [0.35, 0.5, 0.85],
}: {
  children: React.ReactElement | React.ReactElement[];
  footer?: React.ReactElement;
  isOpen: boolean;
  onDismiss: () => void;
  modalBodyPadding?: ModalBodyProps['padding'];
  modalSize?: ModalProps['size'];
  wrapInBottomSheetFooter?: boolean;
  customSnapPoints?: [number, number, number];
}): React.ReactNode => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  if (isMobile) {
    return (
      <BottomSheet isOpen={isOpen} onDismiss={onDismiss} snapPoints={customSnapPoints}>
        <BottomSheetHeader />
        <BottomSheetBody padding={modalBodyPadding as BottomSheetBodyProps['padding']}>
          {children}
          {footer && !wrapInBottomSheetFooter && <Box marginTop="spacing.6">{footer}</Box>}
        </BottomSheetBody>
        {footer && wrapInBottomSheetFooter && <BottomSheetFooter>{footer}</BottomSheetFooter>}
      </BottomSheet>
    );
  }

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} size={modalSize}>
      <ModalHeader />
      <ModalBody padding={modalBodyPadding}>{children}</ModalBody>
      {footer && <ModalFooter>{footer}</ModalFooter>}
    </Modal>
  );
};

const InformationalModalWithImageTemplate: StoryFn<typeof Modal> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <ResponsiveModalWrapper
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        modalBodyPadding="spacing.0"
        customSnapPoints={[0.6, 0.75, 0.95]}
      >
        <ModalBody padding="spacing.0">
          <img src={AlertPng} alt="Alert" width={isMobile ? '100%' : '400px'} height={200} />
          <Box margin="spacing.6">
            <Badge color="negative">Action Required </Badge>
            <Box marginTop="spacing.4">
              <Heading size="large" weight="semibold">
                Update your KYC by 5th July
              </Heading>
              <Text size="medium" weight="regular" color="surface.text.gray.subtle">
                Subtitle go here, support details helps your customers to easily reach out to you
                when they face any.
              </Text>
            </Box>
          </Box>
          <Box marginX="spacing.6" marginBottom="spacing.6">
            <Button isFullWidth>Update KYC</Button>
          </Box>
        </ModalBody>
      </ResponsiveModalWrapper>
    </Box>
  );
};

export const InformationalModalWithImage = InformationalModalWithImageTemplate.bind({});
InformationalModalWithImage.storyName = 'Informational Modal - With Image';

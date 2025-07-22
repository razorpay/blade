import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import type { ModalProps, ModalBodyProps } from '../Modal';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../Modal';
import { useBreakpoint, useTheme } from '~utils';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import type { ButtonProps } from '~components/Button';
import { MapIcon, TrashIcon } from '~components/Icons';
import type { IconColors, IconComponent } from '~components/Icons';
import type { BottomSheetBodyProps } from '~components/BottomSheet';
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetFooter,
  BottomSheetHeader,
} from '~components/BottomSheet';
import { Text } from '~components/Typography';

export default {
  title: 'Patterns/Confirmation',
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
  image,
  description,
}: {
  type: 'neutral' | 'negative' | 'positive';
  icon?: IconComponent;
  title: string;
  description: string;
  image?: string;
}): React.ReactNode => {
  const { theme } = useTheme();
  const getIconColor = (): IconColors => {
    if (type === 'neutral') {
      return 'surface.icon.gray.subtle';
    } else if (type === 'negative') {
      return 'feedback.icon.negative.intense';
    }
    return 'feedback.icon.positive.intense';
  };
  const getBackgroundColor = (): string => {
    if (type === 'neutral') {
      return theme.colors.interactive.background.gray.default;
    } else if (type === 'negative') {
      return theme.colors.feedback.background.negative.subtle;
    }
    return theme.colors.surface.background.primary.subtle;
  };

  return (
    <>
      {' '}
      <Box display="flex" flexDirection="column" gap="spacing.5">
        {image ? (
          <Box
            paddingX="spacing.1"
            paddingY="10px"
            borderColor="surface.border.gray.muted"
            borderRadius="medium"
            width="48px"
            height="48px"
          >
            <img src={image} width={42} height={28} alt="logo" />
          </Box>
        ) : Icon ? (
          <div
            style={{
              backgroundColor: getBackgroundColor(),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: theme.border.radius.medium,
              padding: theme.spacing[4],
              height: '48px',
              width: '48px',
            }}
          >
            <Icon color={getIconColor()} size="xlarge" />
          </div>
        ) : null}
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Text size="large" weight="semibold">
            {title}
          </Text>
          <Text size="medium" weight="regular" color="surface.text.gray.subtle">
            {description}
          </Text>
        </Box>
      </Box>
    </>
  );
};

const ConformationModalFooter = ({
  primaryButtonText,
  secondaryButtonText,
  type,
}: {
  primaryButtonText: string;
  secondaryButtonText?: string;
  type: 'neutral' | 'negative' | 'positive';
}): React.ReactNode => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  const getPrimaryButtonColor = (): ButtonProps['color'] => {
    if (type === 'neutral') {
      return 'primary';
    } else if (type === 'negative') {
      return 'negative';
    }
    return 'positive';
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      gap="spacing.5"
      justifyContent="flex-end"
      marginTop="spacing.6"
    >
      {secondaryButtonText && (
        <Button variant="tertiary" isFullWidth={isMobile}>
          {secondaryButtonText}
        </Button>
      )}

      <Button color={getPrimaryButtonColor()} isFullWidth={isMobile}>
        {primaryButtonText}
      </Button>
    </Box>
  );
};

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

const NeutralModalTemplate: StoryFn<typeof Modal> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <ResponsiveModalWrapper isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <ConformationalModalBody
          type="neutral"
          icon={MapIcon}
          title="Restart the Tour?"
          description="This tour will give a quick guide on this product"
        />
        <ConformationModalFooter type="neutral" primaryButtonText="Yes" secondaryButtonText="No" />
      </ResponsiveModalWrapper>
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
      <ResponsiveModalWrapper isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <ConformationalModalBody
          type="negative"
          icon={TrashIcon}
          title="Discard Import ?"
          description="We do not save the progress, you will need to upload the file again."
        />
        <ConformationModalFooter
          type="negative"
          secondaryButtonText="No, Go Back"
          primaryButtonText="Discard"
        />
      </ResponsiveModalWrapper>
    </Box>
  );
};

export const NegativeModal = NegativeModalTemplate.bind({});
NegativeModal.storyName = 'Confirmation Modal - Negative';

const ConfirmationModalWithImageTemplate: StoryFn<typeof Modal> = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <ResponsiveModalWrapper isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <ConformationalModalBody
          type="negative"
          image="https://logo.svgcdn.com/d/woocommerce-plain-wordmark.svg"
          title="Switch to WooCommerce"
          description="Are you sure you want to switch platform? We can allow one platform at a time. This will remove all your previous settings."
        />
        <ConformationModalFooter type="neutral" primaryButtonText="Yes" secondaryButtonText="No" />
      </ResponsiveModalWrapper>
    </Box>
  );
};

export const ConfirmationnModalWithImage = ConfirmationModalWithImageTemplate.bind({});
ConfirmationnModalWithImage.storyName = 'Confirmation Modal - with Image';

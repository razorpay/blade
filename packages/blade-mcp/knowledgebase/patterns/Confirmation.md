## Confirmation

## Description
The Confirmation pattern provides a standardized way to seek user confirmation before proceeding with important or irreversible actions. It supports different emotional states (neutral, negative, positive) to match the action's impact and includes visual indicators through icons or images. This pattern is essential for actions that need explicit user acknowledgment, ensuring users understand the consequences of their actions.

## Components Used
- Modal
- BottomSheet
- Box
- Button
- Icons
- Typography (Text)

## When to Use

Use the Confirmation pattern for any **irreversible or high-consequence action** that requires explicit acknowledgment:
- Deleting data (records, accounts, files)
- Discarding unsaved changes
- Revoking access or permissions
- Switching platforms or environments
- Any action where the user may not fully understand the consequences

**Do not use** for informational alerts, minor form errors, or any action that is easily reversible.

## Anatomy

The confirmation dialog is a **headerless modal** — content lives entirely in the body, with the dismiss `×` button floating outside the card.

```
                           [✕]    ← Dismiss Action (external, floating at top-right)
┌─────────────────────────────────┐
│  [🗑️]                           │  ← Icon badge (48×48px)
│                                 │
│  Action title?                  │  ← Body/LargeSemibold
│  Consequence description text   │  ← Body/MediumRegular
│  spanning multiple lines        │
│                                 │
│ ─────────────────────────────── │  ← Divider
│              [Cancel]  [Confirm]│  ← Footer (right-aligned, compact buttons)
└─────────────────────────────────┘
```

**Key structural rules:**
- No `ModalHeader` — the title/description live inside `ModalBody`
- Dismiss `×` is **external** — absolutely positioned at `top: 16px, right: 16px` with a circular `surface.background.gray.intense` background (28px diameter, housing a 20px `IconButton`)
- Footer buttons are **not** full-width — they size to their label and are right-aligned

## Icon Badge

Use a 48×48px `Box` with `borderRadius="medium"` and a semantic feedback background color to communicate severity:
- **Destructive**: `feedback.background.negative.subtle` background, `feedback.icon.negative.intense` icon color
- **Neutral**: `feedback.background.neutral.subtle` background, `surface.icon.gray.subtle` icon color

Use a relevant icon (e.g. `TrashIcon` for delete, `AlertIcon` for warnings).

## Button Color Semantics

| Scenario | Secondary button | Primary button |
|---|---|---|
| Neutral action (e.g. switch platform, start tour) | `variant="secondary" color="primary"` | `variant="primary" color="primary"` (blue) |
| Destructive / negative (e.g. delete, discard, revoke) | `variant="tertiary" color="primary"` | `variant="primary" color="negative"` (red) |

## Example

### Confirmation Dialog with Multiple States
This example demonstrates a comprehensive confirmation dialog that adapts between modal and bottom sheet based on device type. It uses the `ConformationalModalBody` component to maintain consistent layout and styling across different confirmation types.

```tsx 
import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  BottomSheet,
  BottomSheetHeader,
  BottomSheetBody,
  Box,
  Button,
  Text,
  MapIcon,
  TrashIcon,
} from '@razorpay/blade/components';
import { useBreakpoint, useTheme } from '@razorpay/blade/utils';
import type { IconColors, IconComponent, BoxProps } from '@razorpay/blade/components';

// Types for our confirmation components
type ConfirmationType = 'neutral' | 'negative' | 'positive';

// ConformationalModalBody component
const ConformationalModalBody = ({
  type = 'neutral',
  icon: Icon,
  title,
  description,
  image,
}: {
  type: ConfirmationType;
  icon?: IconComponent;
  title: string;
  description: string;
  image?: string;
}): React.ReactNode => {
  const getIconColor = (): IconColors => {
    if (type === 'neutral') {
      return 'surface.icon.gray.subtle';
    }
    return 'feedback.icon.negative.intense';
  };

  const getBackgroundColor = (): BoxProps['backgroundColor'] => {
    if (type === 'neutral') {
      return 'feedback.background.neutral.subtle';
    }
    return 'feedback.background.negative.subtle';
  };

  return (
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
        <Box
          backgroundColor={getBackgroundColor()}
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRadius="medium"
          padding="spacing.4"
          height="48px"
          width="48px"
        >
          <Icon color={getIconColor()} size="xlarge" />
        </Box>
      ) : null}
      <Box display="flex" flexDirection="column" gap="spacing.1">
        <Text size="large" weight="semibold">
          {title}
        </Text>
        <Text size="medium" weight="regular" color="surface.text.gray.muted">
          {description}
        </Text>
      </Box>
    </Box>
  );
};

// Reusable confirmation dialog component
const ConfirmationDialog: React.FC<{
  isOpen: boolean;
  onDismiss: () => void;
  type: ConfirmationType;
  icon?: IconComponent;
  image?: string;
  title: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText?: string;
  onConfirm: () => void;
  isLoading?: boolean;
}> = ({
  isOpen,
  onDismiss,
  type,
  icon,
  image,
  title,
  description,
  primaryButtonText,
  secondaryButtonText,
  onConfirm,
  isLoading,
}) => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  const DialogContent = (
    <>
      <ConformationalModalBody
        type={type}
        icon={icon}
        title={title}
        description={description}
        image={image}
      />
      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        gap="spacing.5"
        justifyContent="flex-end"
        marginTop="spacing.6"
      >
        {secondaryButtonText && (
          <Button
            variant="tertiary"
            isFullWidth={isMobile}
            onClick={onDismiss}
            aria-describedby="confirmation-description"
          >
            {secondaryButtonText}
          </Button>
        )}
        <Button
          color={type === 'neutral' ? 'primary' : 'negative'}
          isFullWidth={isMobile}
          onClick={onConfirm}
          isLoading={isLoading}
          aria-describedby="confirmation-description"
        >
          {primaryButtonText}
        </Button>
      </Box>
    </>
  );

  if (isMobile) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onDismiss={onDismiss}
        snapPoints={[0.4, 0.6, 0.8]}
        aria-labelledby="confirmation-title"
      >
        <BottomSheetHeader />
        <BottomSheetBody padding="spacing.5">{DialogContent}</BottomSheetBody>
      </BottomSheet>
    );
  }

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} size="small" aria-labelledby="confirmation-title">
      <ModalHeader />
      <ModalBody padding="spacing.6">{DialogContent}</ModalBody>
    </Modal>
  );
};

// Usage Example
const ConfirmationExample: React.FC = () => {
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);
  const [isSwitchOpen, setIsSwitchOpen] = React.useState(false);
  const [isTourOpen, setIsTourOpen] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsDeleteOpen(false);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      <Button
        color="negative"
        onClick={() => setIsDeleteOpen(true)}
        icon={TrashIcon}
        iconPosition="left"
      >
        Delete Account
      </Button>
      <ConfirmationDialog
        isOpen={isDeleteOpen}
        onDismiss={() => setIsDeleteOpen(false)}
        type="negative"
        icon={TrashIcon}
        title="Delete Account?"
        description="This action cannot be undone. All of your data will be permanently deleted. This includes your profile, settings, and all associated information."
        primaryButtonText="Delete Account"
        secondaryButtonText="Cancel"
        onConfirm={handleDelete}
        isLoading={isDeleteLoading}
      />

      <Button onClick={() => setIsSwitchOpen(true)}>Switch Platform</Button>
      <ConfirmationDialog
        isOpen={isSwitchOpen}
        onDismiss={() => setIsSwitchOpen(false)}
        type="neutral"
        image="https://logo.svgcdn.com/d/woocommerce-plain-wordmark.svg"
        title="Switch to WooCommerce?"
        description="Switching platforms will reset your current settings. Your existing data will be preserved but you'll need to reconfigure your platform-specific settings."
        primaryButtonText="Switch Platform"
        secondaryButtonText="Stay Here"
        onConfirm={() => setIsSwitchOpen(false)}
      />

      <Button onClick={() => setIsTourOpen(true)} icon={MapIcon} iconPosition="left">
        Start Product Tour
      </Button>
      <ConfirmationDialog
        isOpen={isTourOpen}
        onDismiss={() => setIsTourOpen(false)}
        type="positive"
        icon={MapIcon}
        title="Start Product Tour?"
        description="Take a guided tour of our platform's key features. Learn how to make the most of our tools and improve your workflow."
        primaryButtonText="Start Tour"
        secondaryButtonText="Maybe Later"
        onConfirm={() => setIsTourOpen(false)}
      />
    </Box>
  );
};

export default ConfirmationExample;
```

This example showcases:
- Usage of `ConformationalModalBody` component for consistent confirmation dialogs
- Support for different confirmation types (neutral, negative, positive) with appropriate styling
- Both icon and image-based confirmations
- Loading states for async operations
- Responsive design that adapts between modal and bottom sheet
- Proper accessibility implementation with ARIA labels
- Consistent button placement and styling
- Clear visual hierarchy with title and description 
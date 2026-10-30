import React from 'react';
import BaseBox from '~components/Box/BaseBox';

type ChatInputActionBarProps = {
  /**
   * The "+" button, on the left
   */
  leadingAction?: React.ReactNode;
  /**
   * Send, the loader, Stop or Retry, on the right
   */
  submitAction: React.ReactNode;
};

const ChatInputActionBar = ({
  leadingAction,
  submitAction,
}: ChatInputActionBarProps): React.ReactElement => {
  return (
    <BaseBox
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      gap="spacing.3"
      // Figma: 8 px above the toolbar (the text's bottom padding is 12 px) and 12 px on the
      // other sides, so an empty medium box is 96 px
      paddingTop="spacing.3"
      paddingBottom="spacing.4"
      paddingX="spacing.4"
    >
      <BaseBox display="flex" flexDirection="row" alignItems="center" gap="spacing.2">
        {leadingAction}
      </BaseBox>
      <BaseBox display="flex" flexDirection="row" alignItems="center">
        {submitAction}
      </BaseBox>
    </BaseBox>
  );
};

export { ChatInputActionBar };
export type { ChatInputActionBarProps };

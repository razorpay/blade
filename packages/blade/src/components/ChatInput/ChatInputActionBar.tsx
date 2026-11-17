import React from 'react';
import BaseBox from '~components/Box/BaseBox';

type ChatInputActionBarProps = {
  /**
   * The "+" button, on the left
   */
  leadingAction?: React.ReactNode;
  /**
   * The optional mic, just before Send
   */
  voiceAction?: React.ReactNode;
  /**
   * Send, the loader, Stop or Retry, on the right
   */
  submitAction: React.ReactNode;
};

const ChatInputActionBar = ({
  leadingAction,
  voiceAction,
  submitAction,
}: ChatInputActionBarProps): React.ReactElement => {
  return (
    <BaseBox
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      gap="spacing.3"
      // straight under the text, whose own 16 px bottom padding is the gap, and 12 px on the
      // other sides, so an empty medium box is 96 px (16 + 20 + 16 + 32 + 12)
      paddingTop="spacing.0"
      paddingBottom="spacing.4"
      paddingX="spacing.4"
    >
      <BaseBox display="flex" flexDirection="row" alignItems="center" gap="spacing.2">
        {leadingAction}
      </BaseBox>
      <BaseBox display="flex" flexDirection="row" alignItems="center" gap="spacing.3">
        {voiceAction}
        {submitAction}
      </BaseBox>
    </BaseBox>
  );
};

export { ChatInputActionBar };
export type { ChatInputActionBarProps };

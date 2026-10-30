import type React from 'react';

/**
 * Holds Send: it shows once there is something to send.
 */
const ChatInputSendSlot = ({
  isVisible,
  children,
}: {
  isVisible: boolean;
  children: React.ReactElement;
}): React.ReactElement | null => {
  return isVisible ? children : null;
};

export { ChatInputSendSlot };

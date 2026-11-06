import React from 'react';
import { View } from 'react-native';

/**
 * Holds Send: it shows once there is something to send. While hidden, the slot keeps its width,
 * so the text box never moves when Send appears (as on web). The hidden button can't be tapped
 * and screen readers skip it.
 */
const ChatInputSendSlot = ({
  isVisible,
  children,
}: {
  isVisible: boolean;
  children: React.ReactElement;
}): React.ReactElement => {
  return (
    <View
      style={{ opacity: isVisible ? 1 : 0 }}
      pointerEvents={isVisible ? 'auto' : 'none'}
      accessibilityElementsHidden={!isVisible}
      importantForAccessibility={isVisible ? 'auto' : 'no-hide-descendants'}
    >
      {children}
    </View>
  );
};

export { ChatInputSendSlot };

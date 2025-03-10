import React from 'react';
import type { ChatMessageProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const ChatMessage = (_prop: ChatMessageProps): React.ReactElement => {
  throwBladeError({
    message: 'ChatMessage is not yet implemented for native',
    moduleName: 'ChatMessage',
  });

  return <Text>ChatMessage is not available for Native mobile apps.</Text>;
};

export { ChatMessage };

import React from 'react';
import type { ChatInputProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const ChatInput = (_props: ChatInputProps): React.ReactElement => {
  throwBladeError({
    message: 'ChatInput is not yet implemented for native',
    moduleName: 'ChatInput',
  });

  return <Text>ChatInput is not available for Native mobile apps.</Text>;
};

export { ChatInput };

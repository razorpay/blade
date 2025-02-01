import React from 'react';
import type { ChatBubbleProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const ChatBubble = (_prop: ChatBubbleProps): React.ReactElement => {
  throwBladeError({
    message: 'Morph is not yet implemented for native',
    moduleName: 'ChatBubble',
  });

  return <Text>Morph Component is not available for Native mobile apps.</Text>;
};

export { ChatBubble };

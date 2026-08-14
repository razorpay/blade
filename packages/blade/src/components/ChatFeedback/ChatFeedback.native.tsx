import React from 'react';
import type { ChatFeedbackProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { MetaConstants } from '~utils/metaAttribute';

const _ChatFeedback = (_props: ChatFeedbackProps): React.ReactElement => {
  throwBladeError({
    message: 'ChatFeedback is not yet implemented for native.',
    moduleName: 'ChatFeedback',
  });

  return <Text>ChatFeedback is not available for Native mobile apps.</Text>;
};

const ChatFeedback = assignWithoutSideEffects(_ChatFeedback, {
  componentId: MetaConstants.ChatFeedback,
  displayName: 'ChatFeedback',
});

export { ChatFeedback };

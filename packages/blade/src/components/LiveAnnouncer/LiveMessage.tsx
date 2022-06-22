import React from 'react';
import { AccessibilityInfo } from 'react-native';
import getPlatformType from '../../utils/getPlatformType';
import type { AriaAttributes } from '../../utils/makeAccessible';
import makeAccessible from '../../utils/makeAccessible';
import { VisuallyHidden } from '../VisuallyHidden';

interface MessageBlockProps {
  message: string;
  assertiveness?: AriaAttributes['liveRegion'];
  relevant?: AriaAttributes['relevant'];
}

const LiveMessage = ({
  assertiveness = 'polite',
  relevant = 'all',
  message = '',
}: MessageBlockProps): React.ReactElement => {
  React.useEffect(() => {
    if (getPlatformType() === 'react-native') {
      AccessibilityInfo.announceForAccessibility(message);
    }
  }, [message]);

  return (
    <VisuallyHidden {...makeAccessible({ role: 'log', liveRegion: assertiveness, relevant })}>
      {message}
    </VisuallyHidden>
  );
};

export default LiveMessage;

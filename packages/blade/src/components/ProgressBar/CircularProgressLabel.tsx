import React from 'react';
import type { CircularProgressBarFilledProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';

const CircularProgressLabel = ({
  progressPercent,
  size = 'small',
  label,
  showPercentage = true,
}: Pick<
  CircularProgressBarFilledProps,
  'progressPercent' | 'size' | 'label' | 'showPercentage'
>): React.ReactElement => {
  const hasLabel = label && label.trim()?.length > 0;

  return (
    <BaseBox display="flex" flexDirection="column" alignItems="center">
      {hasLabel && (
        <Text marginTop="spacing.3" variant="body" weight="regular" size="small">
          {label}
        </Text>
      )}

      {showPercentage && size === 'small' && (
        <Text
          marginTop={hasLabel ? 'spacing.0' : 'spacing.3'}
          variant="body"
          weight="semibold"
          size="small"
        >
          {progressPercent}%
        </Text>
      )}
    </BaseBox>
  );
};

export { CircularProgressLabel };

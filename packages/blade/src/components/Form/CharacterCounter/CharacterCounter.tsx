import { Text } from '~components/Typography';

import { hintTextSize } from '../formTokens';

import type { ReactElement } from 'react';

type CharacterCounterProps = {
  currentCount: number;
  maxCount: number;
  size?: 'xsmall' | 'small' | 'medium' | 'large';
};

export const CharacterCounter = ({
  currentCount,
  maxCount,
  size = 'medium',
}: CharacterCounterProps): ReactElement => (
  <Text
    variant="caption"
    size={hintTextSize[size]}
    weight="regular"
    color="surface.text.gray.muted"
  >
    {currentCount}/{maxCount}
  </Text>
);

import type { ReactElement } from 'react';
import { hintTextSize } from '../formTokens';
import { Text } from '~components/Typography';

type CharacterCounterProps = {
  currentCount: number;
  maxCount: number;
  size?: 'medium' | 'large';
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

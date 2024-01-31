import type { ReactElement } from 'react';
import { Text } from '~components/Typography';

type CharacterCounterProps = {
  currentCount: number;
  maxCount: number;
};

export const CharacterCounter = ({
  currentCount,
  maxCount,
}: CharacterCounterProps): ReactElement => (
  <Text variant="caption" weight="regular" color="surface.text.gray.muted">
    {currentCount}/{maxCount}
  </Text>
);

import React from 'react';
import { chatInputSuggestionCycleInterval } from './chatInputTokens';
import { Badge } from '~components/Badge';
import { ArrowRightIcon } from '~components/Icons';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { RollingText } from '~components/BaseMotion';

type ChatInputGhostSuggestionProps = {
  suggestions: string[];
  isVisible: boolean;
  onIndexChange?: (index: number) => void;
};

const ChatInputGhostSuggestion = ({
  suggestions,
  isVisible,
  onIndexChange,
}: ChatInputGhostSuggestionProps): React.ReactElement | null => {
  if (!isVisible || suggestions.length === 0) return null;

  return (
    <BaseBox
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap="spacing.3"
      position="absolute"
      top="spacing.0"
      left="spacing.0"
      right="spacing.0"
      pointerEvents="none"
    >
      <RollingText
        texts={suggestions}
        onIndexChange={onIndexChange}
        cycleDuration={chatInputSuggestionCycleInterval}
        showShimmer={false}
      >
        {(text) => (
          <BaseBox display="flex" alignItems="center" gap="spacing.3">
            <Text color="surface.text.gray.muted" truncateAfterLines={1} size="medium">
              {text}
            </Text>
            <Badge color="neutral" size="small" icon={ArrowRightIcon}>
              Tab
            </Badge>
          </BaseBox>
        )}
      </RollingText>
    </BaseBox>
  );
};

export { ChatInputGhostSuggestion };
export type { ChatInputGhostSuggestionProps };

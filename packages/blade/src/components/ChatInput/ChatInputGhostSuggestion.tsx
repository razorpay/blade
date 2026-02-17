import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { makeMotionTime } from '~utils';
import { chatInputSuggestionCycleInterval } from './chatInputTokens';
import BaseBox from '~components/Box/BaseBox';
import { Badge } from '~components/Badge';
import { Text } from '~components/Typography';
import { ArrowRightIcon } from '~components/Icons';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const SuggestionText = styled(BaseBox)<{ $isFadingOut: boolean }>(({ theme, $isFadingOut }) => {
  return css`
    animation: ${$isFadingOut ? fadeOut : fadeIn} ${makeMotionTime(theme.motion.duration.gentle)}
      ${String(theme.motion.easing.standard)};
    animation-fill-mode: forwards;
  `;
});

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
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isFadingOut, setIsFadingOut] = React.useState(false);

  React.useEffect(() => {
    if (suggestions.length <= 1) return undefined;

    const interval = setInterval(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const nextIndex = (prev + 1) % suggestions.length;
          onIndexChange?.(nextIndex);
          return nextIndex;
        });
        setIsFadingOut(false);
      }, 300);
    }, chatInputSuggestionCycleInterval);

    return () => clearInterval(interval);
  }, [suggestions.length, onIndexChange]);

  React.useEffect(() => {
    setCurrentIndex(0);
    setIsFadingOut(false);
    onIndexChange?.(0);
  }, [suggestions, onIndexChange]);

  if (!isVisible || suggestions.length === 0) return null;

  const currentSuggestion = suggestions[currentIndex];

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
      <SuggestionText $isFadingOut={isFadingOut} display="flex" alignItems="center" gap="spacing.3">
        <Text color="surface.text.gray.disabled" truncateAfterLines={1}>
          {currentSuggestion}
        </Text>
        <Badge color="neutral" size="small" icon={ArrowRightIcon}>
          Tab
        </Badge>
      </SuggestionText>
    </BaseBox>
  );
};

export { ChatInputGhostSuggestion };
export type { ChatInputGhostSuggestionProps };

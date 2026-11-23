import React from 'react';
import styled from 'styled-components';
import type { ChatInputCommand } from './types';
import { chatInputCommandMenuWidth } from './chatInputTokens';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { makeAccessible } from '~utils/makeAccessible';
import { getPopupBoxShadowString, makeSize, makeSpace } from '~utils';
import type { ColorSchemeNames } from '~tokens/theme';

// the same surface as Blade's Menu and Dropdown overlays: a popup shadow that also draws a faint
// edge all round, so the top of the list doesn't melt into a white page, plus the backdrop blur
const StyledCommandList = styled(BaseBox)<{ $colorScheme: ColorSchemeNames }>(
  ({ theme, $colorScheme }) => ({
    backdropFilter: `blur(${theme.backdropBlur.medium}px)`,
    boxShadow: getPopupBoxShadowString(theme, $colorScheme),
  }),
);

const StyledCommandOption = styled.div<{ $isActive: boolean }>(({ theme, $isActive }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: makeSpace(theme.spacing[1]),
  paddingTop: makeSpace(theme.spacing[3]),
  paddingBottom: makeSpace(theme.spacing[3]),
  paddingLeft: makeSpace(theme.spacing[4]),
  paddingRight: makeSpace(theme.spacing[4]),
  borderRadius: makeSize(theme.border.radius.small),
  cursor: 'pointer',
  backgroundColor: $isActive ? theme.colors.interactive.background.gray.default : 'transparent',
}));

type ChatInputCommandMenuProps = {
  listboxId: string;
  commands: ChatInputCommand[];
  activeIndex: number;
  getOptionId: (index: number) => string;
  onSelect: (command: ChatInputCommand) => void;
  onActiveIndexChange: (index: number) => void;
};

/**
 * The slash command list, above the input. Focus stays in the text box: the list is tied to it
 * with `aria-controls` and `aria-activedescendant`, and pressing an option never moves focus.
 */
const ChatInputCommandMenu = ({
  listboxId,
  commands,
  activeIndex,
  getOptionId,
  onSelect,
  onActiveIndexChange,
}: ChatInputCommandMenuProps): React.ReactElement => {
  const listRef = React.useRef<HTMLDivElement>(null);
  const { colorScheme } = useTheme();

  // keep the highlighted command in view while arrow keys move through a long list
  React.useEffect(() => {
    const option = listRef.current?.querySelector<HTMLElement>(
      `#${CSS.escape(getOptionId(activeIndex))}`,
    );
    option?.scrollIntoView?.({ block: 'nearest' });
  }, [activeIndex, getOptionId]);

  return (
    <StyledCommandList
      ref={listRef}
      $colorScheme={colorScheme}
      id={listboxId}
      position="absolute"
      bottom="100%"
      left="spacing.0"
      marginBottom="spacing.3"
      width={chatInputCommandMenuWidth}
      maxWidth="100%"
      maxHeight="280px"
      overflowY="auto"
      zIndex={2}
      padding="spacing.2"
      backgroundColor="popup.background.gray.moderate"
      borderRadius="medium"
      {...makeAccessible({ role: 'listbox', label: 'Commands' })}
    >
      {commands.map((command, index) => (
        <StyledCommandOption
          key={command.value}
          id={getOptionId(index)}
          $isActive={index === activeIndex}
          role="option"
          aria-selected={index === activeIndex}
          // keep focus in the text box
          onMouseDown={(event) => event.preventDefault()}
          onMouseEnter={() => onActiveIndexChange(index)}
          onClick={() => onSelect(command)}
        >
          <Text size="medium" color="surface.text.gray.normal">
            {`/${command.title.replace(/^\//, '')}`}
          </Text>
          {command.description ? (
            <Text size="small" color="surface.text.gray.muted">
              {command.description}
            </Text>
          ) : null}
        </StyledCommandOption>
      ))}
    </StyledCommandList>
  );
};

export { ChatInputCommandMenu };
export type { ChatInputCommandMenuProps };

import React from 'react';
import styled from 'styled-components';
import type { ChatInputCommand } from './types';
import { chatInputCommandMenuWidth } from './chatInputTokens';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { makeAccessible } from '~utils/makeAccessible';
import { makeSize, makeSpace } from '~utils';

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
  return (
    <BaseBox
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
      elevation="midRaised"
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
            {command.label}
          </Text>
          {command.description ? (
            <Text size="small" color="surface.text.gray.muted">
              {command.description}
            </Text>
          ) : null}
        </StyledCommandOption>
      ))}
    </BaseBox>
  );
};

export { ChatInputCommandMenu };
export type { ChatInputCommandMenuProps };

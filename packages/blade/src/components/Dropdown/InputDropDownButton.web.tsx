/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */

import React from 'react';
import styled from 'styled-components';
import { useDropdown } from './useDropdown';
import { dropdownComponentIds } from './dropdownComponentIds';
import type { BaseButtonProps } from '~components/Button/BaseButton/BaseButton';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { IconButtonProps } from '~components/Button/IconButton';
import { makeSpace } from '~utils';
import { ChevronUpDownIcon } from '~components/Icons';
import { Box } from '~components/Box';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { Text } from '~components/Typography';
import { makeAccessible } from '~utils/makeAccessible';
import { getActionListContainerRole } from '~components/ActionList/getA11yRoles';

type InputDropDownButtonProps = {
  onBlur?: BaseButtonProps['onBlur'];
  onKeyDown?: BaseButtonProps['onKeyDown'];
  onClick?: BaseButtonProps['onClick'];
  title?: string;
  accessibilityLabel?: string;
  /**
   * @private
   */
  _isInsideSearchInput?: boolean;
};

const StyledSearchTrailingDropdown = styled.button<{ $isSelected?: boolean }>(({ theme }) => {
  const { spacing } = theme;
  return {
    backgroundColor: theme.colors.transparent,
    gap: makeSpace(spacing[2]),
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    border: 'none',
    cursor: 'pointer',
    color: 'currentcolor',
    '&:not([disabled]):hover': {
      backgroundColor: theme.colors.interactive.background.gray.faded,
    },
    '&[disabled]': {
      cursor: 'not-allowed',
    },
    '&:focus-visible': {
      ...getFocusRingStyles({ theme }),
      outlineOffset: makeSpace(theme.spacing[1]),
    },
  };
});

const _InputDropDownButton = ({
  onClick,
  onBlur,
  onKeyDown,
  title,
  accessibilityLabel,
  _isInsideSearchInput = false,
}: InputDropDownButtonProps): React.ReactElement => {
  const {
    onTriggerClick,
    onTriggerKeydown,
    dropdownBaseId,
    isOpen,
    activeIndex,
    hasFooterAction,
    triggererRef,
  } = useDropdown();

  return (
    <StyledSearchTrailingDropdown
      onClick={(e) => {
        onTriggerClick();
        // Setting it for web fails it on native typecheck and vice versa
        onClick?.(e as any);
        // Since this dropdown is inside another dropdown we should stop event stopPropagation.
        e?.stopPropagation();
      }}
      onBlur={(e) => {
        // With button trigger, there is no "value" as such. It's just clickable items
        // Setting it for web fails it on native typecheck and vice versa
        onBlur?.(e as any);
        e?.stopPropagation();
      }}
      onKeyDown={(e) => {
        onTriggerKeydown?.({ event: e as any });
        // Setting it for web fails it on native typecheck and vice versa
        onKeyDown?.(e as any);
        e?.stopPropagation();
      }}
      {...makeAccessible({
        label: accessibilityLabel,
        hasPopup: getActionListContainerRole(hasFooterAction, 'SearchTrailingDropdown'),
        expanded: isOpen,
        controls: `${dropdownBaseId}-actionlist`,
        activeDescendant: activeIndex >= 0 ? `${dropdownBaseId}-${activeIndex}` : undefined,
        role: 'button',
      })}
      ref={triggererRef}
    >
      <Box padding="spacing.2" display="flex" gap="spacing.2" alignItems="center">
        {_isInsideSearchInput && (
          <Text variant="body" size="medium" weight="regular" color="surface.text.gray.muted">
            {' '}
            in
          </Text>
        )}

        <Text variant="body" size="medium" weight="regular" color="surface.text.gray.subtle">
          {title}
        </Text>
        {_isInsideSearchInput && <ChevronUpDownIcon color="surface.icon.gray.muted" />}
      </Box>
    </StyledSearchTrailingDropdown>
  );
};

const InputDropDownButton = assignWithoutSideEffects(_InputDropDownButton, {
  componentId: dropdownComponentIds.triggers.SearchTrailingDropdown,
  displayName: 'SearchTrailingDropdown',
});

export { InputDropDownButton };

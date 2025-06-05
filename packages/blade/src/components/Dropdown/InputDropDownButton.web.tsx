/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDropdown } from './useDropdown';
import { dropdownComponentIds } from './dropdownComponentIds';
import type { BaseButtonProps } from '~components/Button/BaseButton/BaseButton';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeSpace } from '~utils';
import { ChevronUpDownIcon } from '~components/Icons';
import { Box } from '~components/Box';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { Text } from '~components/Typography';
import { makeAccessible } from '~utils/makeAccessible';
import { getActionListContainerRole } from '~components/ActionList/getA11yRoles';
import { useId } from '~utils/useId';
import type { DataAnalyticsAttribute } from '~utils/types';
import { useFirstRender } from '~utils/useFirstRender';
import type { IconComponent } from '~components/Icons';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute } from '~utils/metaAttribute';

type BaseInputDropDownButtonProps = {
  /**
   * isOpen is used to control the open state of the dropdown
   */
  isOpen?: boolean;
  /**
   * onBlur is the callback function that is called when the dropdown is blurred
   */
  onBlur?: BaseButtonProps['onBlur'];
  /**
   * onKeyDown is the callback function that is called when the dropdown is keyed down
   */
  onKeyDown?: BaseButtonProps['onKeyDown'];
  /**
   * onClick is the callback function that is called when the dropdown is clicked
   */
  onClick?: BaseButtonProps['onClick'];
  /**
   * accessibilityLabel is the label of the dropdown
   */
  accessibilityLabel?: string;
  /**
   * @private
   */
  _isInsideSearchInput?: boolean;
  /**
   * isDisabled is the disabled state of the dropdown
   */
  isDisabled?: boolean;
  /**
   * onChange is the callback function that is called when the dropdown is changed
   */
  onChange?: (props: { name: string; value: string }) => void;
  /**
   * name is the name of the dropdown
   */
  name?: string;
  /**
   * testID is the testID of the dropdown
   */
  testID?: string;
  /**
   * icon is the icon of the dropdown
   */
  icon?: IconComponent;
} & DataAnalyticsAttribute;

type ControlledInputDropDownButtonProps = BaseInputDropDownButtonProps & {
  /**
   * value is the value of the dropdown
   */
  value: string;
  defaultValue?: never;
};

type UncontrolledInputDropDownButtonProps = BaseInputDropDownButtonProps & {
  value?: never;
  /**
   * defaultValue is the default selected value of the dropdown
   */
  defaultValue: string;
};

type InputDropDownButtonProps =
  | ControlledInputDropDownButtonProps
  | UncontrolledInputDropDownButtonProps;

const StyledSearchTrailingDropdown = styled.button<{ $isSelected?: boolean; isDisabled?: boolean }>(
  ({ theme, isDisabled }) => {
    const { spacing } = theme;
    return {
      backgroundColor: theme.colors.transparent,
      gap: makeSpace(spacing[2]),
      display: 'flex',
      height: '100%',
      alignItems: 'center',
      border: 'none',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      '&[disabled]': {
        cursor: 'not-allowed',
        pointerEvents: 'none',
      },
      '&:focus-visible': {
        ...getFocusRingStyles({ theme }),
        outlineOffset: makeSpace(theme.spacing[0]),
      },
      borderRadius: theme.border.radius.small,
    };
  },
);

const _InputDropdownButton = ({
  onClick,
  onBlur,
  onKeyDown,
  accessibilityLabel,
  _isInsideSearchInput = false,
  isDisabled,
  onChange,
  name,
  testID,
  value,
  defaultValue,
  icon: Icon,
  ...rest
}: InputDropDownButtonProps): React.ReactElement | null => {
  const idBase = useId('input-drop-down-button');
  const isFirstRender = useFirstRender();
  const {
    options,
    selectedIndices,
    onTriggerClick,
    onTriggerKeydown,
    dropdownBaseId,
    isOpen,
    activeIndex,
    hasFooterAction,
    triggererRef,
    isControlled,
    setSelectedIndices,
    controlledValueIndices,
    changeCallbackTriggerer,
    displayValue,
  } = useDropdown();

  // Set initial selected index when defaultValue is provided
  useEffect(() => {
    const currentValueIndex = value ? options.findIndex((option) => option.value === value) : -1;
    if (defaultValue && options.length > 0 && !value) {
      const defaultIndex = options.findIndex((option) => option.value === defaultValue);
      if (defaultIndex !== -1) {
        setSelectedIndices([defaultIndex]);
      }
    } else if (value && options.length > 0 && selectedIndices.length === 0) {
      setSelectedIndices([currentValueIndex]);
      // since it will be always one selectedIndices in case of InputDropdownButton.
    } else if (value && selectedIndices.length > 0 && currentValueIndex !== selectedIndices[0]) {
      setSelectedIndices([currentValueIndex]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue, options, setSelectedIndices, value]);

  const getValueFromIndices = React.useMemo((): string => {
    let indices: number[] = [];
    if (isControlled) {
      indices = controlledValueIndices;
    } else {
      indices = selectedIndices;
    }

    return indices.length > 0 ? options[indices[0]].value : '';
  }, [isControlled, options, controlledValueIndices, selectedIndices]);

  useEffect(() => {
    if (!isFirstRender) {
      onChange?.({
        name: name || idBase,
        value: getValueFromIndices,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeCallbackTriggerer]);

  if (!displayValue) {
    return null;
  }

  return (
    <StyledSearchTrailingDropdown
      onClick={(e) => {
        if (isDisabled) return;
        onTriggerClick();
        // Setting it for web fails it on native typecheck and vice versa
        onClick?.(e as any);
        // Since this dropdown is inside another dropdown we should stop event stopPropagation.
        e?.stopPropagation();
      }}
      onBlur={(e) => {
        if (isDisabled) return;
        // With button trigger, there is no "value" as such. It's just clickable items
        // Setting it for web fails it on native typecheck and vice versa
        onBlur?.(e as any);
        e?.stopPropagation();
      }}
      onKeyDown={(e) => {
        if (isDisabled) return;
        onTriggerKeydown?.({ event: e as any });
        // Setting it for web fails it on native typecheck and vice versa
        onKeyDown?.(e as any);
        e?.stopPropagation();
      }}
      {...makeAccessible({
        label: accessibilityLabel,
        hasPopup: getActionListContainerRole(hasFooterAction, 'InputDropdownButton'),
        expanded: isOpen,
        controls: `${dropdownBaseId}-actionlist`,
        activeDescendant: activeIndex >= 0 ? `${dropdownBaseId}-${activeIndex}` : undefined,
        role: 'button',
      })}
      ref={triggererRef}
      isDisabled={isDisabled}
      {...makeAnalyticsAttribute(rest)}
      {...metaAttribute({ name: 'InputDropdownButton', testID })}
    >
      <Box padding="spacing.2" display="flex" gap="spacing.2" alignItems="center">
        {_isInsideSearchInput && (
          <Text
            variant="body"
            size="medium"
            weight="regular"
            color={isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.muted'}
          >
            {' '}
            in
          </Text>
        )}
        {Icon && (
          <Icon
            size="medium"
            color={isDisabled ? 'surface.icon.gray.disabled' : 'surface.icon.gray.muted'}
          />
        )}

        <Text
          variant="body"
          size="medium"
          weight="regular"
          color={isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.subtle'}
        >
          {displayValue}
        </Text>
        <ChevronUpDownIcon
          color={isDisabled ? 'surface.icon.gray.disabled' : 'surface.icon.gray.muted'}
        />
      </Box>
    </StyledSearchTrailingDropdown>
  );
};

const InputDropdownButton = assignWithoutSideEffects(_InputDropdownButton, {
  componentId: dropdownComponentIds.triggers.InputDropdownButton,
  displayName: 'InputDropDown',
});

export { InputDropdownButton };

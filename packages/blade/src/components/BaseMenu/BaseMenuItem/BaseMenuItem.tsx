import React from 'react';
import type { BaseMenuItemProps } from '../types';
import { StyledMenuItemContainer } from './StyledMenuItemContainer';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { Checkbox } from '~components/Checkbox';
import { Text } from '~components/Typography';
import { size } from '~tokens/global';
import { makeSize } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';
import type { BladeElementRef } from '~utils/types';

const menuItemTitleColor = {
  negative: {
    default: 'feedback.text.negative.intense',
    disabled: 'interactive.text.gray.disabled',
  },
  normal: { default: 'interactive.text.gray.normal', disabled: 'interactive.text.gray.disabled' },
} as const;

const menuItemDescriptionColor = {
  default: 'interactive.text.gray.muted',
  disabled: 'interactive.text.gray.disabled',
} as const;

const _BaseMenuItem: React.ForwardRefRenderFunction<BladeElementRef, BaseMenuItemProps> = (
  {
    title,
    description,
    as,
    leading,
    trailing,
    titleSuffix,
    isDisabled,
    selectionType = 'single',
    isSelected,
    isVisible = true,
    color,
    role = 'menuitem',
    ...props
  },
  ref,
): React.ReactElement => {
  return (
    <StyledMenuItemContainer
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      as={as}
      type="button"
      disabled={isDisabled}
      {...makeAccessible({
        role,
        current: role === 'menuitem' || role === 'menuitemcheckbox' ? isSelected : undefined,
        disabled: isDisabled,
        selected: isSelected,
      })}
      color={color}
      isVisible={isVisible}
      isSelected={isSelected}
      isDisabled={isDisabled}
      selectionType={selectionType}
      {...props}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        maxHeight={makeSize(size[20])}
        width="100%"
      >
        <Box display="flex" justifyContent="center" alignItems="center">
          {selectionType === 'multiple' ? (
            // Adding aria-hidden because the listbox item in multiselect in itself explains the behaviour so announcing checkbox is unneccesary and just a nice UI tweak for us
            <BaseBox
              pointerEvents="none"
              paddingRight="spacing.2"
              {...makeAccessible({
                hidden: true,
              })}
            >
              <Checkbox isChecked={isSelected} tabIndex={-1} isDisabled={isDisabled}>
                {/* 
                  Checkbox requires children. Didn't want to make it optional because its helpful for consumers
                  But for this case in particular, we just want to use Text separately so that we can control spacing and color and keep it consistent with non-multiselect dropdowns
                */}
                {null}
              </Checkbox>
            </BaseBox>
          ) : (
            leading
          )}
        </Box>
        <Box
          paddingLeft={selectionType === 'multiple' || !leading ? 'spacing.0' : 'spacing.3'}
          paddingRight="spacing.3"
          display="flex"
          alignItems="center"
          flexDirection="row"
        >
          <Text
            truncateAfterLines={1}
            color={
              menuItemTitleColor[color === 'negative' ? 'negative' : 'normal'][
                isDisabled ? 'disabled' : 'default'
              ]
            }
          >
            {title}
          </Text>
          {titleSuffix}
        </Box>
        <Box marginLeft="auto">{trailing}</Box>
      </Box>
      <Box paddingLeft={leading || selectionType === 'multiple' ? 'spacing.7' : undefined}>
        {description ? (
          <Text color={menuItemDescriptionColor[isDisabled ? 'disabled' : 'default']} size="small">
            {description}
          </Text>
        ) : null}
      </Box>
    </StyledMenuItemContainer>
  );
};

const BaseMenuItem = React.forwardRef(_BaseMenuItem);

export { BaseMenuItem };

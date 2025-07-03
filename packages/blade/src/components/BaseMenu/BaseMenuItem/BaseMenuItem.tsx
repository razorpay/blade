import React from 'react';
import type { BaseMenuItemProps } from '../types';
import { BaseMenuItemContext } from '../BaseMenuContext';
import { StyledMenuItemContainer } from './StyledMenuItemContainer';
import { itemFirstRowHeight } from './tokens';
import { Box } from '~components/Box';
import { getTextProps, Text } from '~components/Typography';
import { makeAccessible } from '~utils/makeAccessible';
import type { BladeElementRef } from '~utils/types';
import { BaseText } from '~components/Typography/BaseText';
import { useTruncationTitle } from '~utils/useTruncationTitle';
import { makeSize } from '~utils';

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

// This is the height of item excluding the description to make sure description comes at the bottom and other first row items are center aligned

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
    children,
    ...props
  },
  ref,
): React.ReactElement => {
  const { containerRef, textRef } = useTruncationTitle({ content: title });
  return (
    <BaseMenuItemContext.Provider value={{ color, isDisabled }}>
      <StyledMenuItemContainer
        ref={ref as never}
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
        {children ? (
          children
        ) : (
          <Box display="flex" alignItems="flex-start" width="100%" justifyContent="flex-start">
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height={makeSize(itemFirstRowHeight)}
            >
              {leading}
            </Box>
            <Box
              paddingLeft={leading ? 'spacing.3' : 'spacing.0'}
              paddingRight="spacing.3"
              display="flex"
              flexDirection="column"
            >
              <Box
                display="flex"
                alignItems="center"
                flexDirection="row"
                height={makeSize(itemFirstRowHeight)}
                ref={containerRef as never}
              >
                <BaseText
                  as="p"
                  ref={textRef as never}
                  truncateAfterLines={1}
                  wordBreak="break-all"
                  {...getTextProps({
                    size: 'medium',
                    color:
                      menuItemTitleColor[color === 'negative' ? 'negative' : 'normal'][
                        isDisabled ? 'disabled' : 'default'
                      ],
                    weight: 'regular',
                  })}
                >
                  {title}
                </BaseText>
                {titleSuffix}
              </Box>
              <Box>
                {description ? (
                  <Text
                    color={menuItemDescriptionColor[isDisabled ? 'disabled' : 'default']}
                    size="small"
                  >
                    {description}
                  </Text>
                ) : null}
              </Box>
            </Box>
            <Box marginLeft="auto">{trailing}</Box>
          </Box>
        )}
      </StyledMenuItemContainer>
    </BaseMenuItemContext.Provider>
  );
};

const BaseMenuItem = React.forwardRef(_BaseMenuItem);

export { BaseMenuItem };

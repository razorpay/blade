import React from 'react';
import styled from 'styled-components';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { Checkbox } from '~components/Checkbox';
import { Text } from '~components/Typography';
import { size } from '~tokens/global';
import { getMediaQuery, makeBorderSize, makeSize } from '~utils';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { makeAccessible } from '~utils/makeAccessible';
import type { BladeElementRef } from '~utils/types';

const StyledMenuItemContainer = styled.button<{ color?: 'negative' }>((props) => {
  return {
    borderWidth: makeBorderSize(props.theme.border.width.none),
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    backgroundColor: 'transparent',
    padding: makeSize(props.theme.spacing[2]),
    borderRadius: makeSize(props.theme.border.radius.medium),
    marginTop: makeSize(props.theme.spacing[1]),
    marginBottom: makeSize(props.theme.spacing[1]),
    textDecoration: 'none',
    cursor: 'pointer',
    width: '100%',
    [`@media ${getMediaQuery({ min: props.theme.breakpoints.m })}`]: {
      padding: makeSize(props.theme.spacing[3]),
    },
    '&:focus-visible': getFocusRingStyles({ theme: props.theme }),
    '&:hover:not([aria-disabled=true]), &.has-submenu-open': {
      backgroundColor:
        props.color === 'negative'
          ? props.theme.colors.interactive.background.negative.faded
          : props.theme.colors.interactive.background.gray.default,
    },
    '&[aria-selected=true]': {
      backgroundColor: props.theme.colors.interactive.background.primary.faded,
    },
    '&[aria-selected=true]:hover': {
      backgroundColor: props.theme.colors.interactive.background.primary.fadedHighlighted,
    },
  };
});

type BaseMenuItemProps = {
  as?: 'a' | 'button';
  title: string;
  description?: string;
  isDisabled?: boolean;
  isSelected?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  titleSuffix?: React.ReactNode;
  selectionType?: 'single' | 'multiple';
  color?: 'negative';
  className?: string;
  href?: string;
};

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
    selectionType,
    isSelected,
    color,
    ...props
  },
  ref,
): React.ReactElement => {
  return (
    <StyledMenuItemContainer
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      as={as}
      type={as === 'button' ? 'button' : undefined}
      disabled={isDisabled}
      {...makeAccessible({
        role: 'menuitem',
        disabled: isDisabled,
        selected: isSelected,
      })}
      color={color}
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

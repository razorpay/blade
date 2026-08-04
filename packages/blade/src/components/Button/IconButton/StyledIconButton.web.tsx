/* eslint-disable react/display-name */
import styled from 'styled-components';
import type { ReactElement } from 'react';
import React from 'react';
import type { StyledIconButtonProps } from './types';
import {
  highlightedButtonSizeMap,
  highlightedHoverColorMap,
  focusBackgroundColorMap,
  moderateBackgroundColorMap,
} from './tokens';
import { castWebType, makeSize } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { IconButtonEmphasis } from './IconButton';
import { makeAccessible } from '~utils/makeAccessible';
import { makeMotionTime } from '~utils/makeMotionTime';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { throwBladeError } from '~utils/logger';
import getIn from '~utils/lodashButBetter/get';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { useStyledProps } from '~components/Box/styledProps';

type StyledButtonProps = {
  emphasis: IconButtonEmphasis;
  $isHighlighted: StyledIconButtonProps['isHighlighted'];
  $size: StyledIconButtonProps['size'];
};

const StyledButton = styled.button<StyledButtonProps>((props) => {
  const { theme, emphasis } = props;
  const motionToken = theme.motion;
  const styledPropsCSSObject = useStyledProps(props);
  const isModerate = emphasis === 'moderate';
  const hasContainer = props.$isHighlighted || isModerate;
  const emphasisColor = emphasis === 'intense' ? 'gray' : 'staticWhite';
  const highlightedEmphasis = emphasis === 'intense' ? 'intense' : 'subtle';
  const restIconColor = emphasisColor === 'staticWhite' ? 'normal' : 'muted';

  if (__DEV__) {
    if (props.$size === 'large' && (props.$isHighlighted || isModerate)) {
      throwBladeError({
        moduleName: 'IconButton',
        message: 'size large is not allowed with isHighlighted true or emphasis moderate',
      });
      return null;
    }
  }

  return {
    border: 'none',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    padding: 0,
    height: hasContainer
      ? makeSize(highlightedButtonSizeMap[props.$size as 'small' | 'medium'])
      : undefined,
    width: hasContainer
      ? makeSize(highlightedButtonSizeMap[props.$size as 'small' | 'medium'])
      : undefined,
    borderRadius: hasContainer ? theme.border.radius.small : theme.border.radius['2xsmall'],
    background: isModerate ? getIn(theme.colors, moderateBackgroundColorMap.rest) : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: props.disabled
      ? theme.colors.interactive.icon[emphasisColor].disabled
      : theme.colors.interactive.icon[emphasisColor][restIconColor],
    transitionProperty: isModerate ? 'color, background-color' : 'color, box-shadow',
    transitionDuration: castWebType(makeMotionTime(motionToken.duration.xquick)),
    transitionTimingFunction: motionToken.easing.standard as string,

    '&:hover:not([disabled])': {
      color: theme.colors.interactive.icon[emphasisColor].subtle,
      backgroundColor: isModerate
        ? getIn(theme.colors, moderateBackgroundColorMap.hover)
        : props.$isHighlighted
        ? getIn(theme.colors, highlightedHoverColorMap[highlightedEmphasis])
        : 'transparent',
    },

    '&:focus-visible': {
      ...getFocusRingStyles({ theme }),
      color: theme.colors.interactive.icon[emphasisColor].subtle,
      backgroundColor: isModerate
        ? getIn(theme.colors, moderateBackgroundColorMap.hover)
        : props.$isHighlighted
        ? getIn(theme.colors, focusBackgroundColorMap[highlightedEmphasis])
        : 'transparent',
    },

    '&:active': {
      color: theme.colors.interactive.icon[emphasisColor].subtle,
    },
    ...styledPropsCSSObject,
  };
});

const StyledIconButton = React.forwardRef<HTMLButtonElement, StyledIconButtonProps>(
  (
    {
      icon: Icon,
      onClick,
      size,
      emphasis,
      accessibilityLabel,
      accessibilityProps,
      isDisabled,
      isHighlighted,
      testID,
      onBlur,
      onFocus,
      onMouseLeave,
      onMouseMove,
      onPointerDown,
      onPointerEnter,
      onTouchEnd,
      onTouchStart,
      onKeyDown,
      tabIndex,
      ...rest
    },
    ref,
  ): ReactElement => (
    <StyledButton
      ref={ref}
      onClick={castWebType(onClick)}
      emphasis={emphasis}
      type="button"
      onBlur={onBlur}
      onFocus={onFocus}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      onTouchEnd={onTouchEnd}
      onTouchStart={onTouchStart}
      onKeyDown={onKeyDown}
      disabled={isDisabled}
      $isHighlighted={isHighlighted}
      $size={size}
      tabIndex={tabIndex}
      {...makeAccessible({
        ...accessibilityProps,
        label: accessibilityLabel ?? accessibilityProps?.label,
      })}
      {...metaAttribute({ name: MetaConstants.IconButton, testID })}
      {...makeAnalyticsAttribute(rest)}
      {...rest}
    >
      <Icon size={size} color="currentColor" />
    </StyledButton>
  ),
);

export default StyledIconButton;

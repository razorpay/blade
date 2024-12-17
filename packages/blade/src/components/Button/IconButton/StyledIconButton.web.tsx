/* eslint-disable react/display-name */
import styled from 'styled-components';
import type { ReactElement } from 'react';
import React from 'react';
import type { StyledIconButtonProps } from './types';
import { highlightedButtonSizeMap, highlightedHoverColorMap } from './tokens';
import { castWebType, makeSize } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { SubtleOrIntense } from '~tokens/theme/theme';
import { makeAccessible } from '~utils/makeAccessible';
import { makeMotionTime } from '~utils/makeMotionTime';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { throwBladeError } from '~utils/logger';
import getIn from '~utils/lodashButBetter/get';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { useStyledProps } from '~components/Box/styledProps';

type StyledButtonProps = {
  emphasis: SubtleOrIntense;
  $isHighlighted: StyledIconButtonProps['isHighlighted'];
  $size: StyledIconButtonProps['size'];
};

const StyledButton = styled.button<StyledButtonProps>((props) => {
  const { theme, emphasis } = props;
  const motionToken = theme.motion;
  const styledPropsCSSObject = useStyledProps(props);
  const emphasisColor = emphasis === 'intense' ? 'gray' : 'staticWhite';

  if (__DEV__) {
    if (props.$size === 'large' && props.$isHighlighted) {
      throwBladeError({
        moduleName: 'IconButton',
        message: 'size large is not allowed with isHighlighted true',
      });
      return null;
    }
  }

  return {
    border: 'none',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    padding: 0,
    height: props.$isHighlighted
      ? // We throw error for size large on top
        makeSize(highlightedButtonSizeMap[props.$size as 'small' | 'medium'])
      : undefined,
    width: props.$isHighlighted
      ? makeSize(highlightedButtonSizeMap[props.$size as 'small' | 'medium'])
      : undefined,
    borderRadius: props.$isHighlighted ? theme.border.radius.round : theme.border.radius.small,
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: props.disabled
      ? theme.colors.interactive.icon[emphasisColor].disabled
      : theme.colors.interactive.icon[emphasisColor].muted,
    transitionProperty: 'color, box-shadow',
    transitionDuration: castWebType(makeMotionTime(motionToken.duration.xquick)),
    transitionTimingFunction: motionToken.easing.standard as string,

    '&:hover:not([disabled])': {
      color: theme.colors.interactive.icon[emphasisColor].subtle,
      backgroundColor: props.$isHighlighted
        ? getIn(theme.colors, highlightedHoverColorMap[emphasis])
        : 'transparent',
    },

    '&:focus-visible': {
      ...getFocusRingStyles({ theme }),
      color: theme.colors.interactive.icon[emphasisColor].subtle,
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
      disabled={isDisabled}
      $isHighlighted={isHighlighted}
      $size={size}
      tabIndex={tabIndex}
      {...makeAccessible({ label: accessibilityLabel })}
      {...metaAttribute({ name: MetaConstants.IconButton, testID })}
      {...makeAnalyticsAttribute(rest)}
      {...rest}
    >
      <Icon size={size} color={isDisabled ? 'interactive.icon.gray.disabled' : 'currentColor'} />
    </StyledButton>
  ),
);

export default StyledIconButton;

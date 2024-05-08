/* eslint-disable react/display-name */
import styled from 'styled-components';
import type { ReactElement } from 'react';
import React from 'react';
import type { StyledIconButtonProps } from './types';
import { castWebType } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { SubtleOrIntense } from '~tokens/theme/theme';
import { makeAccessible } from '~utils/makeAccessible';
import { makeMotionTime } from '~utils/makeMotionTime';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';

type StyledButtonProps = {
  emphasis: SubtleOrIntense;
};

const StyledButton = styled.button<StyledButtonProps>((props) => {
  const { theme, emphasis } = props;
  const motionToken = theme.motion;

  const emphasisColor = emphasis === 'intense' ? 'gray' : 'staticWhite';

  return {
    border: 'none',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    padding: 0,
    borderRadius: theme.border.radius.small,
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: props.disabled
      ? theme.colors.interactive.icon[emphasisColor].disabled
      : theme.colors.interactive.icon[emphasisColor].muted,
    transitionProperty: 'color, box-shadow',
    transitionDuration: castWebType(makeMotionTime(motionToken.duration.xquick)),
    transitionTimingFunction: motionToken.easing.standard.effective as string,

    '&:hover': {
      color: theme.colors.interactive.icon[emphasisColor].subtle,
    },

    '&:focus-visible': {
      ...getFocusRingStyles({ theme }),
      color: theme.colors.interactive.icon[emphasisColor].subtle,
    },

    '&:active': {
      color: theme.colors.interactive.icon[emphasisColor].subtle,
    },
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
      tabIndex={tabIndex}
      {...makeAccessible({ label: accessibilityLabel })}
      {...metaAttribute({ name: MetaConstants.IconButton, testID })}
    >
      <Icon size={size} color={isDisabled ? 'interactive.icon.gray.disabled' : 'currentColor'} />
    </StyledButton>
  ),
);

export default StyledIconButton;

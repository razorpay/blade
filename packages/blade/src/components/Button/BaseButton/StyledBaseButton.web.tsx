import styled from 'styled-components';
import getStyledBaseButtonStyles from './getStyledBaseButtonStyles';
import type { StyledBaseButtonProps } from './types';
import getIn from '~utils/lodashButBetter/get';
import { useStyledProps } from '~components/Box/styledProps';
import { makeMotionTime } from '~utils/makeMotionTime';
import { omitPropsFromHTML } from '~utils/omitPropsFromHTML';
import { castWebType } from '~utils';

const StyledBaseButton = styled.button
  .withConfig({
    shouldForwardProp: omitPropsFromHTML,
    displayName: 'StyledBaseButton',
  })
  .attrs((props: StyledBaseButtonProps) => ({
    ...props.accessibilityProps,
  }))<Omit<StyledBaseButtonProps, 'onClick'>>((props) => {
  const styledPropsCSSObject = useStyledProps(props);
  const gradientSizeMap = {
    large: 72,
    medium: 64,
    small: 56,
    xsmall: 48,
  } as const;
  const gradientSize = gradientSizeMap[props.size ?? 'medium'];
  const mouseGradient =
    props.variant === 'primary' && !props.disabled
      ? `radial-gradient(${gradientSize}px ${gradientSize}px at var(--mouse-x, 0%) var(--mouse-y, 0%), ${props.theme.colors.interactive.background.staticWhite.faded} 0%, transparent 100%)`
      : 'none';

  return {
    ...getStyledBaseButtonStyles(props),
    display: 'inline-flex',
    backgroundImage: mouseGradient,
    transitionProperty: 'background-color, background-image, box-shadow',
    transitionTimingFunction: getIn(props.theme.motion, props.motionEasing),
    transitionDuration: castWebType(
      makeMotionTime(getIn(props.theme.motion, props.motionDuration)),
    ),
    position: 'relative',
    '&:hover': {
      backgroundColor: props.hoverBackgroundColor,
      boxShadow: props.hoverBoxShadow,
      ...(props.variant === 'tertiary' &&
        props.color === 'transparent' && {
          '&& [data-blade-component="svg-path"]': {
            fill: props.hoverIconColor,
          },
        }),
    },
    '&:active': {
      backgroundColor: props.focusBackgroundColor,
      boxShadow: props.focusBoxShadow,
      ...(props.variant === 'tertiary' &&
        props.color === 'transparent' && {
          '&& [data-blade-component="svg-path"]': {
            fill: props.hoverIconColor,
          },
        }),
    },
    '&:focus-visible': {
      backgroundColor: props.focusBackgroundColor,
      outline: `1px solid ${props.theme.colors.surface.background.primary.subtle}`,
      boxShadow: props.focusBoxShadow
        ? `0px 0px 0px 4px ${props.focusRingColor}, ${props.focusBoxShadow}`
        : `0px 0px 0px 4px ${props.focusRingColor}`,
      ...(props.variant === 'tertiary' &&
        props.color === 'transparent' && {
          '&& [data-blade-component="svg-path"]': {
            fill: props.hoverIconColor,
          },
        }),
    },
    '*': {
      transitionProperty: 'color, fill, opacity',
      transitionDuration: castWebType(
        makeMotionTime(getIn(props.theme.motion, props.motionDuration)),
      ),
      transitionTimingFunction: getIn(props.theme.motion, props.motionEasing),
    },
    ...styledPropsCSSObject,
  };
});

export default StyledBaseButton;

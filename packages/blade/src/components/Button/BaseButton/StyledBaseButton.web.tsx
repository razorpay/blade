import styled, { keyframes, css } from 'styled-components';
import getStyledBaseButtonStyles from './getStyledBaseButtonStyles';
import type { StyledBaseButtonProps } from './types';
import getIn from '~utils/lodashButBetter/get';
import { useStyledProps } from '~components/Box/styledProps';
import { makeMotionTime } from '~utils/makeMotionTime';
import { omitPropsFromHTML } from '~utils/omitPropsFromHTML';
import { castWebType } from '~utils';

const shimmer = keyframes`
  0% {
    --mouse-x: -80%;
  }
  100% {
    --mouse-x: 180%;
  }
`;

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

  const isInteractive = !props.disabled && !props.isLoading;
  const isLoadingPrimary = props.isLoading && props.variant === 'primary';
  const isTransparentTertiary = props.variant === 'tertiary' && props.color === 'transparent';

  const mouseGradient =
    props.variant === 'primary'
      ? `radial-gradient(${gradientSize}px ${gradientSize}px at var(--mouse-x, 0%) var(--mouse-y, 50%), ${props.theme.colors.interactive.background.staticWhite.faded} 0%, transparent 100%)`
      : 'none';

  const transitionDuration = castWebType(
    makeMotionTime(getIn(props.theme.motion, props.motionDuration)),
  );
  const transitionEasing = getIn(props.theme.motion, props.motionEasing);

  const transparentTertiaryIconStyles = css`
    && [data-blade-component='svg-path'] {
      fill: ${props.hoverIconColor};
    }
  `;

  const shimmerAnimation = isLoadingPrimary
    ? css`
        @property --mouse-x {
          syntax: '<percentage>';
          inherits: false;
          initial-value: 0%;
        }
        animation: ${shimmer} 1.5s linear infinite;
      `
    : null;

  const interactiveStyles = isInteractive
    ? css`
        &:hover {
          background-color: ${props.hoverBackgroundColor};
          box-shadow: ${props.hoverBoxShadow};
          background-image: none;
          ${isTransparentTertiary && transparentTertiaryIconStyles}
        }

        &:active {
          background-color: ${props.focusBackgroundColor};
          box-shadow: ${props.focusBoxShadow};
          background-image: none;
          ${isTransparentTertiary && transparentTertiaryIconStyles}
        }

        &:focus-visible {
          background-color: ${props.focusBackgroundColor};
          outline: 1px solid ${props.theme.colors.surface.background.primary.subtle};
          background-image: none;
          box-shadow: ${props.focusBoxShadow
            ? `0px 0px 0px 4px ${props.focusRingColor}, ${props.focusBoxShadow}`
            : `0px 0px 0px 4px ${props.focusRingColor}`};
          ${isTransparentTertiary && transparentTertiaryIconStyles}
        }
      `
    : null;

  return css`
    ${getStyledBaseButtonStyles(props)};
    display: inline-flex;
    position: relative;
    background-image: ${mouseGradient};
    transition-property: background-color, background-image, box-shadow;
    transition-timing-function: ${transitionEasing};
    transition-duration: ${transitionDuration};

    ${shimmerAnimation}
    ${interactiveStyles}

    * {
      transition-property: color, fill, opacity;
      transition-duration: ${transitionDuration};
      transition-timing-function: ${transitionEasing};
    }

    ${styledPropsCSSObject};
  `;
});

export default StyledBaseButton;

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
  return {
    ...getStyledBaseButtonStyles(props),
    display: 'inline-flex',
    transitionProperty: 'background-color, border-color, box-shadow',
    transitionTimingFunction: getIn(props.theme.motion, props.motionEasing),
    transitionDuration: castWebType(
      makeMotionTime(getIn(props.theme.motion, props.motionDuration)),
    ),
    position: 'relative',
    '&:hover': {
      backgroundColor: props.hoverBackgroundColor,
      ...(props.variant !== 'tertiary' && {
        borderColor: props.hoverBorderColor,
      }),
    },
    '&:active': {
      backgroundColor: props.focusBackgroundColor,
      ...(props.variant !== 'tertiary' && {
        borderColor: props.focusBorderColor,
      }),
    },
    '&:focus-visible': {
      backgroundColor: props.focusBackgroundColor,
      ...(props.variant !== 'tertiary' && {
        borderColor: props.focusBorderColor,
      }),
      outline: `1px solid ${props.theme.colors.surface.background.primary.subtle}`,
      boxShadow: `0px 0px 0px 4px ${props.focusRingColor}`,
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

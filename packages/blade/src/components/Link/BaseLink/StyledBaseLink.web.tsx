import React from 'react';
import styled from 'styled-components';
import getStyledLinkStyles from './getStyledLinkStyles';
import type { StyledBaseLinkProps } from './types';
import { castWebType, getIn, getStyledProps, makeBorderSize, makeMotionTime } from '~utils';
import { getBaseBoxStyles, getDependencyProps } from '~components/Box/BaseBox/getBaseBoxStyles';

const StyledLink = styled.button.attrs<StyledBaseLinkProps>((props: StyledBaseLinkProps) => ({
  ...props.accessibilityProps,
}))<StyledBaseLinkProps>((props) => {
  // In other components, we wrap the component by div. But for link and text, we wanted to avoid that to not add unneccessary div around and cause layout any issues
  // So we build the styled-props specifically for link and text
  const styledPropsStyles = getStyledProps(props);
  const styledPropsMemoDependency = getDependencyProps(styledPropsStyles);
  const styledPropsCSSObject = React.useMemo(
    () => getBaseBoxStyles({ ...styledPropsStyles, theme: props.theme }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [styledPropsMemoDependency],
  );

  return {
    ...styledPropsCSSObject,
    ...getStyledLinkStyles(props),
    display: 'inline-block',
    borderRadius: makeBorderSize(props.theme.border.radius.small),
    transitionProperty: 'box-shadow',
    transitionTimingFunction: getIn(props.theme.motion, props.motionEasing),
    transitionDuration: castWebType(
      makeMotionTime(getIn(props.theme.motion, props.motionDuration)),
    ),
    '.content-container': {
      width: 'max-content',
      borderRadius: makeBorderSize(props.theme.border.radius.small),
    },
    '&:focus': {
      '.content-container': {
        boxShadow: `0px 0px 0px 4px ${props.focusRingColor}`,
      },
    },
    '*': {
      transitionProperty: 'color, fill',
      transitionTimingFunction: getIn(props.theme.motion, props.motionEasing),
      transitionDuration: castWebType(
        makeMotionTime(getIn(props.theme.motion, props.motionDuration)),
      ),
    },
  };
});

export default StyledLink;

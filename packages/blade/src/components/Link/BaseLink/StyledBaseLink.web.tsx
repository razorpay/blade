import styled from 'styled-components';
import getStyledLinkStyles from './getStyledLinkStyles';
import type { StyledBaseLinkProps } from './StyledBaseLink.d';
import { getIn, makeBorderSize, makeMotionTime } from '~utils';

const StyledLink = styled.button.attrs<StyledBaseLinkProps>((props: StyledBaseLinkProps) => ({
  ...props.accessibilityProps,
}))<StyledBaseLinkProps>((props) => ({
  ...getStyledLinkStyles(props),
  display: 'inline-block',
  borderRadius: makeBorderSize(props.theme.border.radius.small),
  transitionProperty: 'box-shadow',
  transitionTimingFunction: getIn(props.theme.motion, props.motionEasing),
  transitionDuration: makeMotionTime(getIn(props.theme.motion, props.motionDuration)),
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
    transitionDuration: makeMotionTime(getIn(props.theme.motion, props.motionDuration)),
  },
}));

export default StyledLink;

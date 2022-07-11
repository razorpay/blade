import styled from 'styled-components';
import getIn from '../../../utils/getIn';
import makeBorderSize from '../../../utils/makeBorderSize';
import makeMotionTime from '../../../utils/makeMotionTime';
import getStyledLinkStyles from './getStyledLinkStyles';
import type { StyledBaseLinkProps } from './StyledBaseLink.d';

const StyledLink = styled.button.attrs((props: StyledBaseLinkProps) => ({
  ...props.accessibilityProps,
}))<StyledBaseLinkProps>((props) => ({
  ...getStyledLinkStyles(props),
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

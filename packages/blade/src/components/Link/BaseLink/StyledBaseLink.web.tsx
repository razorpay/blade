import getIn from 'lodash/get';
import styled from 'styled-components';
import getStyledLinkStyles from './getStyledLinkStyles';
import type { StyledBaseLinkProps } from './types';
import { castWebType } from '~utils';
import { useStyledProps } from '~components/Box/styledProps';
import { makeBorderSize } from '~utils/makeBorderSize';
import { makeMotionTime } from '~utils/makeMotionTime';
import { omitPropsFromHTML } from '~utils/omitPropsFromHTML';

const StyledLink = styled.button
  .withConfig({
    shouldForwardProp: omitPropsFromHTML,
    displayName: 'StyledLink',
  })
  .attrs<StyledBaseLinkProps>((props: StyledBaseLinkProps) => ({
    ...props.accessibilityProps,
  }))<StyledBaseLinkProps>((props) => {
  const styledPropsCSSObject = useStyledProps(props);
  return {
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
    ...styledPropsCSSObject,
  };
});

export default StyledLink;

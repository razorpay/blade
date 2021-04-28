import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { makePxValue } from '../../_helpers/theme';
import isDefined from '../../_helpers/isDefined';

const Position = styled(
  ({ position, top, right, bottom, left, zIndex, children, style, ...props }) => {
    if (React.Children.toArray(children).length !== 1) {
      throw new Error('Expected a single child for Position component');
    }
    return React.cloneElement(children, {
      ...props,
      style: [style, children.props.style].filter(Boolean),
    });
  },
)`
  ${(props) => (isDefined(props.position) ? `position: ${props.position};` : '')};
  ${(props) => (isDefined(props.top) ? `top: ${makePxValue(props.top)};` : '')};
  ${(props) => (isDefined(props.right) ? `right: ${makePxValue(props.right)};` : '')};
  ${(props) => (isDefined(props.bottom) ? `bottom: ${makePxValue(props.bottom)};` : '')};
  ${(props) => (isDefined(props.left) ? `left: ${makePxValue(props.left)};` : '')};
  ${(props) => (isDefined(props.zIndex) ? `z-index: ${props.zIndex};` : '')};
`;

Position.propTypes = {
  position: PropTypes.oneOf(['relative', 'absolute']),
  top: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  right: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  bottom: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  left: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  zIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Position.defaultProps = {
  position: 'relative',
};

export default Position;

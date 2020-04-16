import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { makePxValue } from '../../_helpers/theme';

const Position = styled(({ children, style, ...props }) => {
  if (React.Children.toArray(children).length !== 1) {
    throw new Error('Expected a single child for Position component');
  }
  return React.cloneElement(children, {
    ...props,
    style: [style, children.props.style].filter(Boolean),
  });
})`
  ${(props) => (props.position ? `position: ${props.position};` : '')};
  ${(props) => (props.top ? `top: ${makePxValue(props.top)};` : '')};
  ${(props) => (props.right ? `right: ${makePxValue(props.right)};` : '')};
  ${(props) => (props.bottom ? `bottom: ${makePxValue(props.bottom)};` : '')};
  ${(props) => (props.left ? `left: ${makePxValue(props.left)};` : '')};
  ${(props) => (props.zIndex ? `z-index: ${props.zIndex};` : '')};
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
  top: undefined,
  right: undefined,
  bottom: undefined,
  left: undefined,
  zIndex: undefined,
};

export default Position;

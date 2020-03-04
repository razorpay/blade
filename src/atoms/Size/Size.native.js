import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

const Size = styled(
  ({ minWidth, width, maxWidth, minHeight, height, maxHeight, children, style, ...props }) => {
    if (React.Children.toArray(children).length !== 1) {
      throw new Error('Expected a single child for Size component');
    }

    return React.cloneElement(children, { ...props, style: [style, children.props.style] });
  },
)`
  ${(props) => (props.width ? `width: ${props.width}` : '')};
  ${(props) => (props.height ? `height: ${props.height}` : '')};
  ${(props) => (props.minWidth ? `min-width: ${props.minWidth}` : '')};
  ${(props) => (props.maxWidth ? `max-width: ${props.maxWidth}` : '')};
  ${(props) => (props.minHeight ? `min-height: ${props.minHeight}` : '')};
  ${(props) => (props.maxHeight ? `max-height: ${props.maxHeight}` : '')};
`;

Size.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  minWidth: PropTypes.string,
  maxWidth: PropTypes.string,
  minHeight: PropTypes.string,
  maxHeight: PropTypes.string,
};

export default Size;

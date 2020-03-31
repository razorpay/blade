import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { makePxValue } from '../../_helpers/theme';

const Size = styled(
  ({ minWidth, width, maxWidth, minHeight, height, maxHeight, children, ...props }) => {
    if (React.Children.toArray(children).length !== 1) {
      throw new Error('Expected a single child for Size component');
    }

    return React.cloneElement(children, props);
  },
)`
  ${(props) => (props.width ? `width: ${makePxValue(props.width)}` : '')};
  ${(props) => (props.height ? `height: ${makePxValue(props.height)}` : '')};
  ${(props) => (props.minWidth ? `min-width: ${makePxValue(props.minWidth)}` : '')};
  ${(props) => (props.maxWidth ? `max-width: ${makePxValue(props.maxWidth)}` : '')};
  ${(props) => (props.minHeight ? `min-height: ${makePxValue(props.minHeight)}` : '')};
  ${(props) => (props.maxHeight ? `max-height: ${makePxValue(props.maxHeight)}` : '')};
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

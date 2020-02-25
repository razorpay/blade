import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

import { makePxValue } from '../../_helpers/theme';

const Space = styled(({ margin, padding, children, ...props }) => {
  if (React.Children.toArray(children).length !== 1) {
    throw new Error('Expected a single child for Space component');
  }
  return React.cloneElement(children, props);
})`
  ${(props) => (props.margin ? `margin: ${makePxValue(props.margin)}` : '')};
  ${(props) => (props.padding ? `padding: ${makePxValue(props.padding)}` : '')};
`;

Space.propTypes = {
  margin: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  padding: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  children: PropTypes.element.isRequired,
};

export default Space;

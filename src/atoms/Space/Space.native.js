import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

import { makePxValues } from '../../_helpers/theme';

const SpaceEnhancer = styled(({ margin, padding, children, ...props }) =>
  React.cloneElement(children, props),
)`
  ${(props) => (props.margin ? `margin: ${makePxValues(props.margin)}` : '')};
  ${(props) => (props.padding ? `padding: ${makePxValues(props.padding)}` : '')};
`;

const Space = ({ margin, padding, children, ...props }) => {
  if (React.Children.toArray(children).length === 1) {
    return <SpaceEnhancer margin={margin} padding={padding} children={children} {...props} />;
  }
  throw new Error('Expected a single child for Space component');
};

Space.propTypes = {
  margin: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  padding: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  children: PropTypes.element.isRequired,
};

export default Space;

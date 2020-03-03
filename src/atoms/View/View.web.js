import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const View = styled(({ component, children, ...props }) =>
  React.createElement(component, props, children),
)`
  ${''}
`;

View.propTypes = {
  component: PropTypes.string.isRequired,
  children: PropTypes.node,
};

View.defaultProps = {
  component: 'div',
};

export default View;

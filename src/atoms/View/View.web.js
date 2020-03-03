import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const View = styled(({ as, children, ...props }) => React.createElement(as, props, children))`
  ${''}
`;

View.propTypes = {
  as: PropTypes.string.isRequired,
  children: PropTypes.node,
};

View.defaultProps = {
  as: 'div',
};

export default View;

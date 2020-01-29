import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ type, onClick, children, ...rest }) => (
  <button onClick={onClick} type={type} {...rest}>
    {children}
  </button>
);

Button.propTypes = {
  type: PropTypes.oneOf(['button', 'submit']),
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

Button.defaultProps = {
  type: 'button',
};

export default Button;

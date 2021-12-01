import React from 'react';
import Icon, { IconPropTypes } from '../../atoms/Icon';

function PaymentLink(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path d="M3.172 9.172A4 4 0 016 8h3a1 1 0 100-2H6a6 6 0 100 12h3a1 1 0 100-2H6a4 4 0 01-2.828-6.828zM15 6a1 1 0 100 2h3a4 4 0 110 8h-3a1 1 0 100 2h3a6 6 0 000-12h-3z" />
      <path d="M8 11a1 1 0 100 2h8a1 1 0 100-2H8z" />
    </Icon>
  );
}

PaymentLink.propTypes = IconPropTypes;

PaymentLink.defaultProps = {
  size: 'medium',
  fill: 'sapphire.800',
};

export default PaymentLink;

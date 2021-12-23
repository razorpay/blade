import React from 'react';
import { Path } from 'react-native-svg';
import Icon, { IconPropTypes } from '../../atoms/Icon';

function PaymentPage(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <Path d="M5 8a1 1 0 000 2h4a1 1 0 000-2H5zM5 11a1 1 0 100 2h3.2a1 1 0 100-2H5z" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 6a3 3 0 013-3h18a3 3 0 013 3v12a3 3 0 01-3 3H3a3 3 0 01-3-3V6zm3-1a1 1 0 00-1 1v12a1 1 0 001 1h10V5H3zm18 14h-6V5h6a1 1 0 011 1v12a1 1 0 01-1 1z"
      />
    </Icon>
  );
}

PaymentPage.propTypes = IconPropTypes;

PaymentPage.defaultProps = {
  size: 'medium',
  fill: 'sapphire.800',
};

export default PaymentPage;

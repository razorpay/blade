import React from 'react';
import PropTypes from 'prop-types';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function PaymentPage({ width, height, fill }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 18" fill="none">
      <path d="M5 5a1 1 0 000 2h4a1 1 0 000-2H5zM5 8a1 1 0 000 2h3.2a1 1 0 100-2H5z" fill={fill} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 3a3 3 0 013-3h18a3 3 0 013 3v12a3 3 0 01-3 3H3a3 3 0 01-3-3V3zm3-1a1 1 0 00-1 1v12a1 1 0 001 1h10V2H3zm18 14h-6V2h6a1 1 0 011 1v12a1 1 0 01-1 1z"
        fill={fill}
      />
    </svg>
  );
}

PaymentPage.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

PaymentPage.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default PaymentPage;

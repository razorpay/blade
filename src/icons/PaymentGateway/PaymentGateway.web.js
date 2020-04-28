import React from 'react';
import PropTypes from 'prop-types';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function PaymentGateway({ width, height, fill }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 18" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 3a3 3 0 013-3h18a3 3 0 013 3v12a3 3 0 01-3 3H3a3 3 0 01-3-3V3zm2 0a1 1 0 011-1h18a1 1 0 011 1v3H2V3zm20 5v7a1 1 0 01-1 1H3a1 1 0 01-1-1V8h20z"
        fill={fill}
      />
    </svg>
  );
}

PaymentGateway.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

PaymentGateway.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default PaymentGateway;

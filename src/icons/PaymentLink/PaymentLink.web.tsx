import React from 'react';
import PropTypes from 'prop-types';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function PaymentLink({ width, height, fill }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        d="M3.172 9.172A4 4 0 016 8h3a1 1 0 100-2H6a6 6 0 100 12h3a1 1 0 100-2H6a4 4 0 01-2.828-6.828zM15 6a1 1 0 100 2h3a4 4 0 110 8h-3a1 1 0 100 2h3a6 6 0 000-12h-3z"
        fill={fill}
      />
      <path d="M8 11a1 1 0 100 2h8a1 1 0 100-2H8z" fill={fill} />
    </svg>
  );
}

PaymentLink.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

PaymentLink.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default PaymentLink;

import React from 'react';
import PropTypes from 'prop-types';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function TaxPayments({ width, height, fill }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.0058 16L16.9183 7.78741C16.9807 7.22573 16.9465 6.65752 16.817 6.1074C15.62 1.02019 8.37933 1.02019 7.18234 6.1074C7.0529 6.65752 7.01864 7.22573 7.08105 7.78741L7.99356 16H3C2.44772 16 2 16.4477 2 17C2 17.5523 2.44772 18 3 18H5V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V18H21C21.5523 18 22 17.5523 22 17C22 16.4477 21.5523 16 21 16H16.0058ZM14.8702 6.56548C14.1569 3.53416 9.84242 3.53416 9.12917 6.56548C9.05204 6.89328 9.03163 7.23186 9.06882 7.56655L9.99357 15.8893C9.9977 15.9265 9.99974 15.9634 9.99977 16H13.9996C13.9996 15.9634 14.0017 15.9265 14.0058 15.8893L14.9306 7.56655C14.9677 7.23186 14.9473 6.89328 14.8702 6.56548ZM17 18H7V20H17V18Z"
        fill={fill}
      />
    </svg>
  );
}

TaxPayments.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

TaxPayments.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default TaxPayments;

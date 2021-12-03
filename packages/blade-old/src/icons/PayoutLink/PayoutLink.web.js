import * as React from 'react';
import PropTypes from 'prop-types';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

export default function PayoutLink({ width = 24, height = 24, fill = colors.sapphire[800] }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.7608 3.24003C20.9827 3.46228 21.0578 3.79193 20.954 4.08837L15.2268 20.4521C15.116 20.7687 14.8231 20.9856 14.4879 20.9993C14.1527 21.013 13.8431 20.8207 13.7069 20.5141L10.562 13.438L3.48589 10.2931C3.17933 10.1568 2.98701 9.84723 3.00068 9.51204C3.01436 9.17684 3.23126 8.88396 3.5479 8.77314L19.8935 3.05215C20.1848 2.94269 20.5265 3.00566 20.7608 3.24003ZM17.068 5.77477L6.03633 9.63588L11.0006 11.8422L17.068 5.77477Z"
        fill={fill}
      />
    </svg>
  );
}

PayoutLink.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

import React from 'react';
import PropTypes from 'prop-types';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Failure({ width, height, fill }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 5.5c.461 0 .834.373.834.834v3.333a.833.833 0 11-1.666 0V6.334c0-.46.373-.834.833-.834zM10 13.834a.833.833 0 10.001-1.667.833.833 0 000 1.667z"
        fill={fill}
      />
      <path
        d="M7.863 1.618a2.5 2.5 0 014.276 0l.002.004 7.058 11.783.007.012a2.5 2.5 0 01-2.138 3.75H2.933a2.5 2.5 0 01-2.137-3.75l.007-.012 7.06-11.787zm1.426.863L2.237 14.255a.833.833 0 00.711 1.245h14.106a.833.833 0 00.711-1.245L10.713 2.482v-.001a.833.833 0 00-1.424 0z"
        fill={fill}
      />
    </svg>
  );
}

Failure.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Failure.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Failure;

import React from 'react';
import PropTypes from 'prop-types';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function HelpCircle({ width, height, fill }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        d="M11.258 7.024a2 2 0 00-2.225 1.308 1 1 0 01-1.886-.664 4 4 0 017.773 1.333c0 1.53-1.135 2.54-1.945 3.081a8.049 8.049 0 01-1.686.848l-.035.013-.011.004h-.004l-.002.001L10.92 12l.316.949a1 1 0 01-.633-1.897l.016-.006.074-.027a6.05 6.05 0 001.172-.6c.69-.46 1.055-.95 1.055-1.419v-.001a2 2 0 00-1.662-1.975zM11 17a1 1 0 100-2 1 1 0 000 2z"
        fill={fill}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 11C0 4.925 4.925 0 11 0s11 4.925 11 11-4.925 11-11 11S0 17.075 0 11zm11-9a9 9 0 100 18 9 9 0 000-18z"
        fill={fill}
      />
    </svg>
  );
}

HelpCircle.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

HelpCircle.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default HelpCircle;

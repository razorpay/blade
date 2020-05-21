import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Briefcase({ width, height, fill }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2a3 3 0 00-3 3v1H4a3 3 0 00-3 3v10a3 3 0 003 3h16a3 3 0 003-3V9a3 3 0 00-3-3h-3V5a3 3 0 00-3-3h-4zm5 4V5a1 1 0 00-1-1h-4a1 1 0 00-1 1v1h6zM9 8h6v12H9V8zM7 8H4a1 1 0 00-1 1v10a1 1 0 001 1h3V8zm10 12V8h3a1 1 0 011 1v10a1 1 0 01-1 1h-3z"
        fill={fill}
      />
    </Svg>
  );
}

Briefcase.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Briefcase.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Briefcase;

import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Trash({ width, height, fill }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 5V4a3 3 0 013-3h4a3 3 0 013 3v1h4a1 1 0 110 2h-1v13a3 3 0 01-3 3H7a3 3 0 01-3-3V7H3a1 1 0 010-2h4zm2-1a1 1 0 011-1h4a1 1 0 011 1v1H9V4zM6 7h12v13a1 1 0 01-1 1H7a1 1 0 01-1-1V7z"
        fill={fill}
      />
    </Svg>
  );
}

Trash.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Trash.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Trash;

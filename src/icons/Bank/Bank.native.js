import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Bank({ width, height, fill }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.407 1.195a1 1 0 011.186 0l9.5 7A1 1 0 0121.5 10h-19a1 1 0 01-.593-1.805l9.5-7zM18.457 8L12 3.242 5.543 8h12.914z"
        fill={fill}
      />
      <Path
        d="M2 21a1 1 0 011-1h18a1 1 0 110 2H3a1 1 0 01-1-1zM7 12.5a1 1 0 10-2 0v5a1 1 0 102 0v-5zM18.026 11.5a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zM13.014 12.5a1 1 0 10-2 0v5a1 1 0 002 0v-5z"
        fill={fill}
      />
    </Svg>
  );
}

Bank.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Bank.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Bank;

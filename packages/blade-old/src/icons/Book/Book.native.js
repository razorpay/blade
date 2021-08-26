import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Book({ width, height, fill }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21 2a1 1 0 00-1-1H6.5A3.5 3.5 0 003 4.5v15A3.5 3.5 0 006.5 23H20a1 1 0 001-1V2zM5 4.5A1.5 1.5 0 016.5 3H19v13H6.5c-.537 0-1.045.12-1.5.337V4.5zm0 15A1.5 1.5 0 006.5 21H19v-3H6.5A1.5 1.5 0 005 19.5z"
        fill={fill}
      />
    </Svg>
  );
}

Book.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Book.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Book;

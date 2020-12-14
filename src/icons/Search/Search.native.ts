import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Search({ width, height, fill }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.618 18.032a9 9 0 111.414-1.414l3.675 3.675a1 1 0 01-1.414 1.414l-3.675-3.675zM4 11a7 7 0 1112.041 4.857 1.009 1.009 0 00-.185.184A7 7 0 014 11z"
        fill={fill}
      />
    </Svg>
  );
}

Search.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Search.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Search;

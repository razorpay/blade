import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function UserClose({ width, height, fill }) {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.5 2a5 5 0 100 10 5 5 0 000-10zm-3 5a3 3 0 116 0 3 3 0 01-6 0z"
        fill={fill}
      />
      <Path
        d="M5 14a5 5 0 00-5 5v2a1 1 0 102 0v-2a3 3 0 013-3h7a3 3 0 013 3v2a1 1 0 102 0v-2a5 5 0 00-5-5H5zM17.293 7.293a1 1 0 011.414 0L20.5 9.086l1.793-1.793a1 1 0 111.414 1.414L21.914 10.5l1.793 1.793a1 1 0 01-1.414 1.414L20.5 11.914l-1.793 1.793a1 1 0 01-1.414-1.414l1.793-1.793-1.793-1.793a1 1 0 010-1.414z"
        fill={fill}
      />
    </Svg>
  );
}

UserClose.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

UserClose.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default UserClose;

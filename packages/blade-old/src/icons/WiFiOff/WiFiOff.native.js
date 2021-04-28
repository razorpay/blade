import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

const WiFiOff = ({ width, height, fill }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M.293.293a1 1 0 011.414 0l5.104 5.104.033.033 3.944 3.944c.063.049.12.106.17.17l12.75 12.749a1 1 0 01-1.415 1.414l-6.617-6.617a.997.997 0 01-.775-.165 5 5 0 00-5.792 0 1 1 0 01-1.158-1.63 6.994 6.994 0 014.662-1.267l-2.781-2.782a9.94 9.94 0 00-4.19 2.071 1 1 0 11-1.283-1.534A11.94 11.94 0 018.21 9.626L5.888 7.302a14.91 14.91 0 00-3.806 2.447A1 1 0 01.758 8.251 16.91 16.91 0 014.386 5.8L.293 1.706a1 1 0 010-1.414z"
        fill={fill}
      />
      <Path
        d="M13 20a1 1 0 11-2 0 1 1 0 012 0zM17.159 10.161a1 1 0 10-.878 1.798c.745.363 1.44.818 2.072 1.354a1 1 0 101.294-1.525 11.933 11.933 0 00-2.488-1.627zM10.79 6.047A15 15 0 0121.92 9.75a1 1 0 101.323-1.5A17 17 0 0010.63 4.053a1 1 0 00.16 1.994z"
        fill={fill}
      />
    </Svg>
  );
};

WiFiOff.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

WiFiOff.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default WiFiOff;

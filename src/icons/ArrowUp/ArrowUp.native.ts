import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function ArrowUp({ width, height, fill }) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M12.7071 3.29289C12.3166 2.90237 11.6834 2.90237 11.2929 3.29289L5.29289 9.29289C4.90237 9.68342 4.90237 10.3166 5.29289 10.7071C5.68342 11.0976 6.31658 11.0976 6.70711 10.7071L11 6.41421V20C11 20.5523 11.4477 21 12 21C12.5523 21 13 20.5523 13 20V6.41421L17.2929 10.7071C17.6834 11.0976 18.3166 11.0976 18.7071 10.7071C19.0976 10.3166 19.0976 9.68342 18.7071 9.29289L12.7071 3.29289Z"
        fill={fill}
      />
    </Svg>
  );
}

ArrowUp.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

ArrowUp.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default ArrowUp;

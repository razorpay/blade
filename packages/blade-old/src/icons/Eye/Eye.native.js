import * as React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Eye({ width, height, fill }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 8a4 4 0 100 8 4 4 0 000-8zm-2 4a2 2 0 114 0 2 2 0 01-4 0z"
        fill={fill}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3C8.871 3 6.228 4.49 4.237 6.251 2.247 8.013.822 10.12.106 11.553a1 1 0 000 .894c.716 1.434 2.14 3.54 4.131 5.302C6.228 19.51 8.871 21 12 21c3.129 0 5.772-1.49 7.763-3.251 1.99-1.762 3.415-3.868 4.131-5.302a1 1 0 000-.894c-.716-1.434-2.14-3.54-4.131-5.302C17.772 4.49 15.129 3 12 3zM5.563 16.251A16.953 16.953 0 012.13 12a16.953 16.953 0 013.432-4.251C7.339 6.177 9.529 5 12 5s4.661 1.177 6.437 2.749A16.952 16.952 0 0121.87 12a16.952 16.952 0 01-3.432 4.251C16.661 17.823 14.471 19 12 19s-4.661-1.177-6.437-2.749z"
        fill={fill}
      />
    </Svg>
  );
}

Eye.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Eye.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Eye;

import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Home({ width, height, fill }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.6139 1.21065C12.2528 0.929784 11.7472 0.929784 11.3861 1.21065L2.38606 8.21065C2.14247 8.4001 2 8.69141 2 9V20C2 21.6569 3.34315 23 5 23H19C20.6569 23 22 21.6569 22 20V9C22 8.69141 21.8575 8.4001 21.6139 8.21065L12.6139 1.21065ZM16 21H19C19.5523 21 20 20.5523 20 20V9.48908L12 3.26686L4 9.48908V20C4 20.5523 4.44772 21 5 21H8V12C8 11.4477 8.44772 11 9 11H15C15.5523 11 16 11.4477 16 12V21ZM10 21V13H14V21H10Z"
        fill={fill}
      />
    </Svg>
  );
}

Home.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Home.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Home;

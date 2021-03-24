import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Upi({ width, height, fill }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.174 1.563l7.353 9.678a.853.853 0 01-.123 1.166l-11.03 9.678c-.649.57-1.682.024-1.525-.806l.799-4.202-5.706 5.008c-.65.57-1.683.024-1.526-.806L6.093 1.923c.145-.761 1.172-.986 1.648-.36l3.882 5.113.904-4.753c.144-.761 1.17-.985 1.647-.36zm-1.056 7.08l.833-4.382 5.607 7.38-8.41 7.38.742-3.912 3.079-2.702a.853.853 0 00.122-1.166l-1.973-2.597zm-5.6-4.382l-2.804 14.76 8.407-7.38-5.604-7.38z"
        fill={fill}
      />
    </Svg>
  );
}

Upi.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Upi.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Upi;

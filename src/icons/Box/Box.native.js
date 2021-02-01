import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Box({ width, height, fill }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.665 0.554469C11.5059 0.136591 12.494 0.136591 13.335 0.554469L13.3372 0.555569L21.335 4.55447L21.3364 4.55515C22.3551 5.062 22.9994 6.10156 23 7.23947V16.77C22.9994 17.908 22.3549 18.9483 21.336 19.455L21.335 19.4555L13.3375 23.4543C12.4924 23.8771 11.4975 23.8771 10.6525 23.4543L2.65277 19.4544L2.65001 19.453C1.63264 18.9404 0.993506 17.8959 0.999988 16.7569V7.24001C0.999978 5.76042 1.97162 4.88828 2.55877 4.60258L10.665 0.554469ZM11.555 2.34553L4.23655 6.00025L12 9.88197L19.7589 6.0025L12.445 2.34553L12.4441 2.34508C12.1642 2.20636 11.8348 2.20676 11.555 2.34553ZM2.99999 16.767V7.61804L11 11.618V21.392L3.54914 17.6665C3.21012 17.4953 2.99734 17.1468 2.99999 16.767ZM13 21.387L20.4428 17.6656L20.445 17.6645C20.7848 17.4956 20.9998 17.1489 21 16.7695V7.61803L13 11.618V21.387Z"
        fill={fill}
      />
    </Svg>
  );
}

Box.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Box.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Box;

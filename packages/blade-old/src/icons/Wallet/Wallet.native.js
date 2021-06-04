import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Wallet({ width, height, fill }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
      <Path
        d="M3.42986 7.71429V19.7143H19.7156L19.706 17.14H21.4299L21.4394 10.2857H19.7156V7.71429H3.42986ZM3.42986 6H19.7156C20.6623 6 21.4299 6.76751 21.4299 7.71429V10.2708V15.4286V19.7143C21.4299 20.6611 20.6623 21.4286 19.7156 21.4286H3.42986C2.48309 21.4286 1.71558 20.6611 1.71558 19.7143L1.71558 7.71429C1.71558 6.76751 2.48309 6 3.42986 6Z"
        fill={fill}
      />
      <Path
        d="M16.2882 14.5721C16.7616 14.5721 17.1453 14.1883 17.1453 13.715C17.1453 13.2416 16.7616 12.8578 16.2882 12.8578C15.8148 12.8578 15.431 13.2416 15.431 13.715C15.431 14.1883 15.8148 14.5721 16.2882 14.5721Z"
        fill={fill}
      />
      <Path
        d="M7.99069 6.00088L15.4259 3.52295V6.00088H17.1402V3.52295C17.1402 3.33873 17.1105 3.15571 17.0522 2.98093C16.7529 2.08273 15.7821 1.59726 14.8839 1.8966L2.56873 6.00088H7.99069Z"
        fill={fill}
      />
      <Path
        d="M14.5701 11.9988V15.4273H21.4273V11.9988H14.5701ZM14.5701 10.2845H21.4273C22.374 10.2845 23.1415 11.052 23.1415 11.9988V15.4273C23.1415 16.3741 22.374 17.1416 21.4273 17.1416H14.5701C13.6233 17.1416 12.8558 16.3741 12.8558 15.4273V11.9988C12.8558 11.052 13.6233 10.2845 14.5701 10.2845Z"
        fill={fill}
      />
    </Svg>
  );
}

Wallet.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Wallet.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Wallet;

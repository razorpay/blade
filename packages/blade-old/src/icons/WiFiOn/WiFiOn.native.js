import React from 'react';
import { Path, G, Defs, ClipPath } from 'react-native-svg';
import { useTheme } from 'styled-components/native';
import Icon, { IconPropTypes } from '../../atoms/Icon';
import { getColor } from '../../_helpers/theme';

const WiFiOn = ({ ...props }) => {
  const theme = useTheme();

  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <G clipPath="url(#prefix__clip0)" fill={getColor(theme, props.fill)}>
        <Path d="M1.661 10.748a15 15 0 0119.838 0 1 1 0 101.322-1.5C16.397 3.583 6.763 3.583.34 9.247a1 1 0 101.322 1.5z" />
        <Path d="M5.22 14.316a10 10 0 0112.8 0 1 1 0 001.28-1.537 12 12 0 00-15.36 0 1 1 0 001.28 1.537z" />
        <Path d="M14.48 17.922a5 5 0 00-5.79 0 1 1 0 11-1.16-1.63 7 7 0 018.11 0 1 1 0 11-1.16 1.63zM12 22a1 1 0 100-2 1 1 0 000 2z" />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0">
          <Path d="M0 0h24v24H0z" />
        </ClipPath>
      </Defs>
    </Icon>
  );
};

WiFiOn.propTypes = IconPropTypes;

WiFiOn.defaultProps = {
  size: 'medium',
  fill: 'sapphire.800',
};

export default WiFiOn;

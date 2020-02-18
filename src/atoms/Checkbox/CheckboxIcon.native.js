import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { ThemeContext } from 'styled-components/native';

const Unchecked = ({ size, fill }) => {
  return (
    <Svg
      width={size.width}
      height={size.height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.8 6.00005H7.20005C6.53731 6.00005 6.00005 6.53731 6.00005 7.20005V16.8C6.00005 17.4628 6.53731 18 7.20005 18H16.8C17.4628 18 18 17.4628 18 16.8V7.20005C18 6.53731 17.4628 6.00005 16.8 6.00005ZM7.20005 4.80005C5.87457 4.80005 4.80005 5.87457 4.80005 7.20005V16.8C4.80005 18.1255 5.87457 19.2 7.20005 19.2H16.8C18.1255 19.2 19.2 18.1255 19.2 16.8V7.20005C19.2 5.87457 18.1255 4.80005 16.8 4.80005H7.20005Z"
        fill={fill}
        fillOpacity="0.38"
      />
    </Svg>
  );
};

const Checked = ({ size, fill }) => (
  <Svg
    width={size.width}
    height={size.height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.80005 7.20005C4.80005 5.87457 5.87457 4.80005 7.20005 4.80005H16.8C18.1255 4.80005 19.2 5.87457 19.2 7.20005V16.8C19.2 18.1255 18.1255 19.2 16.8 19.2H7.20005C5.87457 19.2 4.80005 18.1255 4.80005 16.8V7.20005ZM15.1699 10.6846C15.4376 10.4251 15.4442 9.99778 15.1846 9.73015C14.9251 9.46252 14.4978 9.45595 14.2302 9.71547L10.9875 12.8598L9.76995 11.6791C9.50232 11.4196 9.07498 11.4262 8.81547 11.6938C8.55595 11.9614 8.56252 12.3888 8.83015 12.6483L10.5177 14.2846C10.7795 14.5385 11.1956 14.5385 11.4574 14.2846L15.1699 10.6846Z"
      fill={fill}
      fillOpacity="0.87"
    />
  </Svg>
);

const mapSizeToSvgProps = (checkboxSize) => {
  switch (checkboxSize) {
    case 'l':
      return {
        width: 24,
        height: 24,
      };
    case 'm':
      return {
        width: 20,
        height: 20,
      };
    case 's':
      return {
        width: 16,
        height: 16,
      };

    default:
      return { width: 16, height: 16 };
  }
};

const IconComponent = (props) => {
  const { checked, size, disabled } = props;

  const theme = useContext(ThemeContext);
  if (checked) {
    return (
      <Checked
        size={size}
        name="checkedSquare"
        fill={disabled ? theme.colors.shade['300'] : theme.colors.primary['800']}
      />
    );
  }
  return (
    <Unchecked
      size={size}
      name="uncheckedSquare"
      fill={disabled ? theme.colors.shade['300'] : theme.colors.shade['500']}
    />
  );
};

function CheckboxIcon(props) {
  const { size } = props;
  return <IconComponent {...props} size={mapSizeToSvgProps(size)} />;
}

CheckboxIcon.propTypes = {
  size: PropTypes.oneOf(['l', 'm', 's']),
  checked: PropTypes.bool,
};

Checked.propTypes = {
  size: PropTypes.oneOf(['l', 'm', 's']),
  fill: PropTypes.string,
};

Unchecked.propTypes = {
  size: PropTypes.oneOf(['l', 'm', 's']),
  fill: PropTypes.string,
};

IconComponent.propTypes = {
  checked: PropTypes.bool,
  size: PropTypes.oneOf(['l', 'm', 's']),
  disabled: PropTypes.bool,
};
export default CheckboxIcon;

import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import styled, { ThemeContext } from 'styled-components';
import CheckBoxIcon from './CheckboxIcon';
import Text from '../Text';
import Flex from '../Flex';
import { isEmpty } from '../../_helpers/utils';

const Backdrop = styled(View)(
  (props) => `
  width: ${props.width}px;
  height: ${props.height}px;
  border-radius: ${props.borderRadius}px;
  background-color: ${props.backgroundColor ? props.backgroundColor : 'transparent'};
`,
);

const TextContainer = styled.View`
  margin-left: 4px;
`;

const mapSizeToBackdropProps = (checkBoxSize) => {
  switch (checkBoxSize) {
    case 'large':
      return 24;
    case 'medium':
      return 20;
    case 'small':
      return 16;
    case 'xsmall':
      return 12;
    default:
      return 20;
  }
};

const mapSizeToHelpTextSizeProp = (checkboxSize) => {
  switch (checkboxSize) {
    case 'large':
      return 'medium';
    case 'medium':
      return 'xsmall';
    default:
      return 'small';
  }
};

const Checkbox = ({ onChange, defaultChecked, disabled, size, title, helpText, testID }) => {
  const [checked, setBoxState] = useState(defaultChecked);
  const [underlayColor, setUnderlayColor] = useState('');

  const theme = useContext(ThemeContext);

  const onPress = () => {
    setBoxState((prevState) => {
      if (onChange) onChange(!prevState);
      return !prevState;
    });
  };

  const onPressIn = () => {
    const newUnderlayColor = checked ? theme.colors.primary['300'] : theme.colors.tone['400'];
    setUnderlayColor(newUnderlayColor);
  };

  const onPressOut = () => {
    setUnderlayColor('');
  };
  let titleTextColor = 'shade.700';
  let helpTextColor = 'shade.500';

  if (disabled) {
    titleTextColor = 'shade.500';
    helpTextColor = 'shade.300';
  }
  const backdropSize = mapSizeToBackdropProps(size);
  return (
    <Flex flexDirection="row">
      <TouchableOpacity
        activeOpacity={1}
        accessibilityRole="checkbox"
        onPress={onPress}
        underlayColor="transparent"
        disabled={disabled}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        testID={testID}
      >
        <Backdrop
          backgroundColor={underlayColor}
          width={backdropSize}
          height={backdropSize}
          borderRadius={backdropSize / 2}
        >
          <CheckBoxIcon checked={checked} size={size} disabled={disabled} />
        </Backdrop>

        <TextContainer>
          <Text color={titleTextColor} size={size}>
            {title}
          </Text>
          {!isEmpty(helpText) && size !== 'small' && (
            <Text size={mapSizeToHelpTextSizeProp(size)} color={helpTextColor}>
              {helpText}
            </Text>
          )}
        </TextContainer>
      </TouchableOpacity>
    </Flex>
  );
};

Checkbox.propTypes = {
  onChange: PropTypes.func,
  defaultChecked: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  title: PropTypes.string.isRequired,
  helpText: PropTypes.string,
  disabled: PropTypes.bool,
  testID: PropTypes.string,
};

Checkbox.defaultProps = {
  onChange: () => {},
  defaultChecked: false,
  size: 'medium',
  helpText: '',
  disabled: false,
  testID: 'ds-checkbox',
};

export default Checkbox;

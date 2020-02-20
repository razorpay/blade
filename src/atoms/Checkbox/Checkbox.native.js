import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import CheckBoxIcon from './CheckboxIcon';
import Text from '../Text';
import Flex from '../Flex';
import { isEmpty } from '../../_helpers/utils';
import automation from '../../_helpers/automation-attributes';

const styles = {
  backdrop: {
    width({ width }) {
      return width;
    },
    height({ height }) {
      return height;
    },
    borderRadius({ borderRadius }) {
      return borderRadius;
    },
    backgroundColor({ backgroundColor }) {
      return backgroundColor ? backgroundColor : 'transparent';
    },
  },
};

const Backdrop = styled.View`
  width: ${styles.backdrop.width}px;
  height: ${styles.backdrop.height}px;
  border-radius: ${styles.backdrop.borderRadius}px;
  background-color: ${styles.backdrop.backgroundColor};
`;

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

const Checkbox = ({ onChange, checked, disabled, size, title, helpText, testID }) => {
  const [underlayColor, setUnderlayColor] = useState('');
  const theme = useContext(ThemeContext);

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
    <Flex flexDirection="row" alignSelf="flex-start">
      <TouchableOpacity
        activeOpacity={1}
        accessibilityRole="checkbox"
        onPress={onChange}
        underlayColor="transparent"
        disabled={disabled}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        {...automation(testID)}
      >
        <Backdrop
          width={backdropSize}
          height={backdropSize}
          borderRadius={backdropSize / 2}
          backgroundColor={underlayColor}
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
  checked: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  title: PropTypes.string.isRequired,
  helpText: PropTypes.string,
  disabled: PropTypes.bool,
  testID: PropTypes.string,
};

Checkbox.defaultProps = {
  onChange: () => {},
  checked: false,
  size: 'medium',
  helpText: '',
  disabled: false,
  testID: 'ds-checkbox',
};

export default Checkbox;

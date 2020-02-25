import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import CheckBoxIcon from './CheckboxIcon';
import Text from '../Text';
import Flex from '../Flex';
import isEmpty from '../../_helpers/isEmpty';
import automation from '../../_helpers/automation-attributes';
import Space from '../Space';
import spacings from '../../tokens/spacings';

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
      return backgroundColor;
    },
  },
};

const Backdrop = styled.View`
  width: ${styles.backdrop.width}px;
  height: ${styles.backdrop.height}px;
  border-radius: ${styles.backdrop.borderRadius}px;
  background-color: ${styles.backdrop.backgroundColor};
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
  const [underlayColor, setUnderlayColor] = useState('transparent');
  const theme = useContext(ThemeContext);

  const onPressIn = () => {
    const newUnderlayColor = checked ? theme.colors.primary['300'] : theme.colors.tone['400'];
    setUnderlayColor(newUnderlayColor);
  };

  const onPressOut = () => {
    setUnderlayColor('transparent');
  };

  let titleTextColor = 'shade.700';

  let helpTextColor = 'shade.500';

  if (disabled) {
    titleTextColor = 'shade.500';
    helpTextColor = 'shade.300';
  }

  const backdropSize = mapSizeToBackdropProps(size);

  return (
    <Flex alignSelf="flex-start">
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
        <Flex flexDirection="row">
          <View>
            <Backdrop
              width={backdropSize}
              height={backdropSize}
              borderRadius={backdropSize / 2}
              backgroundColor={underlayColor}
            >
              <CheckBoxIcon checked={checked} size={size} disabled={disabled} />
            </Backdrop>
            <Flex alignSelf="center">
              <Space margin={[0, 0, 0, 0.5]}>
                <View>
                  <Text color={titleTextColor} size={size}>
                    {title}
                  </Text>
                </View>
              </Space>
            </Flex>
          </View>
        </Flex>

        {!isEmpty(helpText) && size !== 'small' && (
          <Space margin={[0, 0, 0, backdropSize / spacings.unit + 0.5]}>
            <View>
              <Text size={mapSizeToHelpTextSizeProp(size)} color={helpTextColor}>
                {helpText}
              </Text>
            </View>
          </Space>
        )}
      </TouchableOpacity>
    </Flex>
  );
};

Checkbox.propTypes = {
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  title: PropTypes.string.isRequired,
  helpText: PropTypes.string,
  disabled: PropTypes.bool,
  testID: PropTypes.string,
};

Checkbox.defaultProps = {
  checked: false,
  size: 'medium',
  helpText: '',
  disabled: false,
  testID: 'ds-checkbox',
};

export default Checkbox;

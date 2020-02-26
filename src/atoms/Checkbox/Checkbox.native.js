import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import Text from '../Text';
import Flex from '../Flex';
import isEmpty from '../../_helpers/isEmpty';
import automation from '../../_helpers/automation-attributes';
import Space from '../Space';
import { getPxValue, getColorKey, getVariantColorKeys, getColor } from '../../_helpers/theme';
import Icon from '../Icon';
import View from '../View';

const styles = {
  backdrop: {
    width({ width }) {
      return getPxValue(width);
    },
    height({ height }) {
      return getPxValue(height);
    },
    borderRadius({ borderRadius }) {
      return getPxValue(borderRadius);
    },
    backgroundColor({ backgroundColor }) {
      return backgroundColor;
    },
  },
  icon: {
    fill({ disabled, checked, variantColor }) {
      if (disabled) {
        return getColorKey('shade', 300);
      }
      if (checked) {
        return getColorKey(variantColor || 'primary', 800);
      }

      return getColorKey('shade', 500);
    },
  },
  helpText: {
    containerMargin(size) {
      switch (size) {
        case 'large':
          return [0, 0, 0, 3.5];
        case 'medium':
          return [0, 0, 0, 3];
        case 'small':
          return [0, 0, 0, 2.5];
        case 'xsmall':
          return [0, 0, 0, 2];
        default:
          return [0, 0, 0, 3];
      }
    },
    scale(checkboxSize) {
      switch (checkboxSize) {
        case 'large':
          return 'medium';
        case 'medium':
          return 'xsmall';
        default:
          return 'small';
      }
    },
  },
  titleContainer: {
    margin() {
      return [0, 0, 0, 0.5];
    },
  },
};

const Backdrop = styled.View`
  width: ${styles.backdrop.width};
  height: ${styles.backdrop.height};
  border-radius: ${styles.backdrop.borderRadius};
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

const Checkbox = ({
  onChange,
  checked,
  disabled,
  size,
  title,
  helpText,
  testID,
  variantColor,
  error,
}) => {
  let titleTextColor = 'shade.700';

  let helpTextColor = 'shade.500';

  const [underlayColor, setUnderlayColor] = useState('transparent');
  const theme = useContext(ThemeContext);

  const onPressIn = () => {
    let colorKey = getColorKey('tone', 400);
    if (checked) {
      colorKey = getColorKey(variantColor || 'primary', 300);
    }
    const newUnderlayColor = getColor(theme, colorKey);
    setUnderlayColor(newUnderlayColor);
  };

  const onPressOut = () => {
    setUnderlayColor('transparent');
  };

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
              size={size}
              width={backdropSize}
              height={backdropSize}
              borderRadius={backdropSize / 2}
              backgroundColor={underlayColor}
            >
              <Icon
                size={size}
                name={checked ? 'checkboxFilled' : 'checkboxOutlined'}
                fill={styles.icon.fill({ checked, disabled, variantColor })}
              />
            </Backdrop>
            <Flex alignSelf="center">
              <Space margin={styles.titleContainer.margin()}>
                <View>
                  <Text color={titleTextColor} size={size}>
                    {title}
                  </Text>
                </View>
              </Space>
            </Flex>
          </View>
        </Flex>

        {(!isEmpty(helpText) || !isEmpty(error)) && size !== 'small' && (
          <Space margin={styles.helpText.containerMargin(size)}>
            <View>
              <Text
                size={styles.helpText.scale(size)}
                color={error ? 'negative.900' : helpTextColor}
              >
                {error || helpText}
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
  variantColor: PropTypes.oneOf(getVariantColorKeys()),
  error: PropTypes.string,
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

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
  icon: {
    fill({ disabled, isChecked, variantColor }) {
      if (disabled) {
        return getColorKey('shade', 300);
      }
      if (isChecked) {
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
  backdropDimensions(size) {
    switch (size) {
      case 'large':
        return {
          width: 24,
          height: 24,
          borderRadius: 12,
        };
      case 'medium':
        return {
          width: 20,
          height: 20,
          borderRadius: 10,
        };
      case 'small':
        return {
          width: 16,
          height: 16,
          borderRadius: 8,
        };
      case 'xsmall':
        return {
          width: 12,
          height: 12,
          borderRadius: 6,
        };
      default:
        return {
          width: 20,
          height: 20,
          borderRadius: 10,
        };
    }
  },
  backdropBackground({ backgroundColor }) {
    return backgroundColor;
  },
};

const Backdrop = styled(View)(
  (props) => `width: ${getPxValue(styles.backdropDimensions(props.size).width)};
height: ${getPxValue(styles.backdropDimensions(props.size).height)};
border-radius: ${getPxValue(styles.backdropDimensions(props.size).borderRadius)};
background-color: ${styles.backdropBackground};`,
);

const Checkbox = ({
  onChange,
  disabled,
  size,
  title,
  helpText,
  testID,
  variantColor,
  errorText,
  checked,
}) => {
  let titleTextColor = 'shade.700';

  let helpTextColor = 'shade.500';

  const [isChecked, setCheckboxState] = useState(checked);
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

  const onPress = () => {
    setCheckboxState((prevCheckboxState) => {
      onChange(!prevCheckboxState);
      return !prevCheckboxState;
    });
  };

  if (disabled) {
    titleTextColor = 'shade.500';
    helpTextColor = 'shade.300';
  }

  return (
    <Flex alignSelf="flex-start">
      <TouchableOpacity
        activeOpacity={1}
        accessibilityRole="checkbox"
        onPress={onPress}
        underlayColor="transparent"
        disabled={disabled}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        {...automation(testID)}
      >
        <Flex flexDirection="row">
          <View>
            <Backdrop size={size} backgroundColor={underlayColor}>
              <Icon
                size={size}
                name={isChecked ? 'checkboxFilled' : 'checkboxOutlined'}
                fill={styles.icon.fill({ isChecked, disabled, variantColor })}
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

        {(!isEmpty(helpText) || !isEmpty(errorText)) && size !== 'small' && (
          <Space margin={styles.helpText.containerMargin(size)}>
            <View>
              <Text
                size={styles.helpText.scale(size)}
                color={errorText ? 'negative.900' : helpTextColor}
              >
                {errorText || helpText}
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
  errorText: PropTypes.string,
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

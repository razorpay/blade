import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import Text from '../Text';
import Flex from '../Flex';
import isEmpty from '../../_helpers/isEmpty';
import automation from '../../_helpers/automation-attributes';
import Space from '../Space';
import { getVariantColorKeys, getColor } from '../../_helpers/theme';
import Icon from '../Icon';
import View from '../View';
import Backdrop from './Backdrop';

const styles = {
  icon: {
    fill({ disabled, isChecked, variantColor }) {
      if (disabled) {
        return 'shade.930';
      }
      if (isChecked) {
        return `${variantColor || 'primary'}.800`;
      }

      return 'shade.950';
    },
  },
  helpText: {
    margin(size) {
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
    size(checkboxSize) {
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
  title: {
    margin() {
      return [0, 0, 0, 0.5];
    },
  },
  backdrop: {
    dimensions(size) {
      switch (size) {
        case 'large':
          return {
            width: '24px',
            height: '24px',
            borderRadius: '12px',
          };
        case 'medium':
          return {
            width: '20px',
            height: '20px',
            borderRadius: '10px',
          };
        case 'small':
          return {
            width: '16px',
            height: '16px',
            borderRadius: '8px',
          };
        case 'xsmall':
          return {
            width: '12px',
            height: '12px',
            borderRadius: '6px',
          };
        default:
          return {
            width: '20px',
            height: '20px',
            borderRadius: '10px',
          };
      }
    },
  },
};

const isPropDefined = (prop) => {
  return typeof prop !== 'undefined';
};

const Checkbox = ({
  defaultChecked,
  checked,
  onChange,
  disabled,
  title,
  size,
  variantColor,
  helpText,
  errorText,
  testID,
}) => {
  let titleTextColor = 'shade.970';
  let helpTextColor = 'shade.950';

  let checkboxInitialState = false;

  if (isPropDefined(defaultChecked)) {
    checkboxInitialState = defaultChecked;
  }

  if (isPropDefined(checked)) {
    checkboxInitialState = checked;
  }

  const [isChecked, setCheckboxState] = useState(checkboxInitialState);
  const [underlayColor, setUnderlayColor] = useState('transparent');
  const theme = useContext(ThemeContext);

  const onPressIn = () => {
    let colorKey = 'tone.940';
    if (isChecked) {
      colorKey = `${variantColor || 'primary'}.930`;
    }
    const newUnderlayColor = getColor(theme, colorKey);
    setUnderlayColor(newUnderlayColor);
  };

  const onPressOut = () => {
    setUnderlayColor('transparent');
  };

  const onPress = () => {
    if (isPropDefined(checked)) {
      onChange();
      return;
    }
    setCheckboxState((prevCheckboxState) => {
      onChange(!prevCheckboxState);
      return !prevCheckboxState;
    });
  };

  if (disabled) {
    titleTextColor = 'shade.950';
    helpTextColor = 'shade.930';
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
        <Flex flexDirection="row" alignItems="center">
          <View>
            <Backdrop
              width={styles.backdrop.dimensions(size).width}
              height={styles.backdrop.dimensions(size).height}
              borderRadius={styles.backdrop.dimensions(size).borderRadius}
              backgroundColor={underlayColor}
            >
              <Icon
                size={size}
                name={isChecked ? 'checkboxFilled' : 'checkboxOutlined'}
                fill={styles.icon.fill({ isChecked, disabled, variantColor })}
              />
            </Backdrop>
            <Flex alignSelf="center">
              <Space margin={styles.title.margin()}>
                <View>
                  <Text color={titleTextColor} size={size}>
                    {title}
                  </Text>
                </View>
              </Space>
            </Flex>
          </View>
        </Flex>

        {(!isEmpty(helpText) || !isEmpty(errorText)) && size !== 'small' ? (
          <Space margin={styles.helpText.margin(size)}>
            <View>
              <Text
                size={styles.helpText.size(size)}
                color={errorText ? 'negative.900' : helpTextColor}
              >
                {errorText || helpText}
              </Text>
            </View>
          </Space>
        ) : null}
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
  defaultChecked: PropTypes.bool,
};

Checkbox.defaultProps = {
  defaultChecked: undefined,
  checked: undefined,
  size: 'medium',
  helpText: '',
  disabled: false,
  errorText: '',
  variantColor: 'primary',
  testID: 'ds-checkbox',
};

export default Checkbox;

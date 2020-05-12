import React, { useState, useContext, useCallback } from 'react';
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
import isDefined from '../../_helpers/isDefined';
import Backdrop from './Backdrop';

const styles = {
  icon: {
    fill({ disabled, isChecked, variantColor, externalChecked }) {
      if (disabled) {
        return 'shade.930';
      }
      if (isChecked || externalChecked) {
        return `${variantColor || 'primary'}.800`;
      }

      return 'shade.950';
    },
    size({ size }) {
      switch (size) {
        case 'large':
          return 'xlarge';
        case 'medium':
          return 'large';
        case 'small':
          return 'medium';
        default:
          return 'medium';
      }
    },
  },
  helpText: {
    margin(size) {
      switch (size) {
        case 'large':
          return [0, 0, 0, 4];
        case 'medium':
          return [0, 0, 0, 3.5];
        case 'small':
          return [0, 0, 0, 3];
        case 'xsmall':
          return [0, 0, 0, 2.5];
        default:
          return [0, 0, 0, 3.5];
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
            width: '28px',
            height: '28px',
            borderRadius: '14px',
          };
        case 'medium':
          return {
            width: '24px',
            height: '24px',
            borderRadius: '12px',
          };
        case 'small':
          return {
            width: '20px',
            height: '20px',
            borderRadius: '10px',
          };
        case 'xsmall':
          return {
            width: '16px',
            height: '16px',
            borderRadius: '8px',
          };
        default:
          return {
            width: '24px',
            height: '24px',
            borderRadius: '12px',
          };
      }
    },
  },
};

const Checkbox = ({
  defaultChecked,
  checked: externalChecked,
  onChange,
  disabled,
  title,
  size,
  variantColor,
  helpText,
  errorText,
  testID,
}) => {
  let titleTextColor = 'shade.980';
  let helpTextColor = 'shade.950';

  let checkboxInitialState = false;

  if (isDefined(defaultChecked) && isDefined(externalChecked)) {
    throw Error('One of defaultChecked or checked should be supplied.');
  }

  if (isDefined(defaultChecked)) {
    checkboxInitialState = defaultChecked;
  }

  if (isDefined(externalChecked)) {
    checkboxInitialState = externalChecked;
  }

  const [isChecked, setIsChecked] = useState(checkboxInitialState);
  const [underlayColor, setUnderlayColor] = useState('transparent');
  const theme = useContext(ThemeContext);

  const onPressIn = useCallback(() => {
    let colorKey = 'tone.940';
    if (isChecked || externalChecked) {
      colorKey = `${variantColor || 'primary'}.930`;
    }
    const newUnderlayColor = getColor(theme, colorKey);
    setUnderlayColor(newUnderlayColor);
  }, [isChecked, theme, variantColor, externalChecked]);

  const onPressOut = useCallback(() => {
    setUnderlayColor('transparent');
  }, []);

  const onPress = useCallback(() => {
    if (isDefined(externalChecked)) {
      onChange(!isChecked);
      return;
    }
    setIsChecked((prevState) => {
      onChange(!prevState);
      return !prevState;
    });
  }, [externalChecked, isChecked, onChange]);

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
            <Backdrop backgroundColor={underlayColor} {...styles.backdrop.dimensions(size)}>
              <Icon
                size={styles.icon.size({ size })}
                name={isChecked || externalChecked ? 'checkboxFilled' : 'checkboxOutlined'}
                fill={styles.icon.fill({ isChecked, disabled, variantColor, externalChecked })}
              />
            </Backdrop>
            {title ? (
              <Flex alignSelf="center">
                <Space margin={styles.title.margin()}>
                  <View>
                    <Text color={titleTextColor} size={size}>
                      {title}
                    </Text>
                  </View>
                </Space>
              </Flex>
            ) : null}
          </View>
        </Flex>

        {title && (!isEmpty(helpText) || !isEmpty(errorText)) && size !== 'small' ? (
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
  defaultChecked: PropTypes.bool,
  checked: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  title: PropTypes.string,
  disabled: PropTypes.bool,
  variantColor: PropTypes.oneOf(getVariantColorKeys()),
  onChange: PropTypes.func.isRequired,
  testID: PropTypes.string,
  helpText: (props, propName, componentName) => {
    if (props.size === 'small') {
      return new Error(
        `[${propName}]. ${propName} is ignored as it is not supported when size is small in ${componentName}`,
      );
    }

    if (typeof props.propName !== 'undefined' && typeof props.propName !== 'string') {
      return new Error(
        `Invalid prop \`${propName}\` of type \`${typeof props.propName}\` supplied to \`${componentName}\`, expected \`string\``,
      );
    }

    return null;
  },
  errorText: (props, propName, componentName) => {
    if (props.size === 'small') {
      return new Error(
        `[${propName}]. ${propName} is ignored as it is not supported when size is small in ${componentName}`,
      );
    }

    if (typeof props.propName !== 'undefined' && typeof props.propName !== 'string') {
      return new Error(
        `Invalid prop \`${propName}\` of type \`${typeof props.propName}\` supplied to \`${componentName}\`, expected \`string\``,
      );
    }

    return null;
  },
};

Checkbox.defaultProps = {
  size: 'medium',
  helpText: '',
  disabled: false,
  errorText: '',
  variantColor: 'primary',
  testID: 'ds-checkbox',
};

export default Checkbox;

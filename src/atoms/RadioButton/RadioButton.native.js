import React, { useState, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import Text from '../Text';
import Flex from '../Flex';
import isEmpty from '../../_helpers/isEmpty';
import automation from '../../_helpers/automation-attributes';
import Space from '../Space';
import { getVariantColorKeys, getColor } from '../../_helpers/theme';
import View from '../View';
import Backdrop from './Backdrop';
import isDefined from '../../_helpers/isDefined';
import Size from '../Size';

const styles = {
  radio: {
    color({ theme, disabled, isChecked, variantColor }) {
      if (disabled) {
        return getColor(theme, 'shade.930');
      }
      if (isChecked) {
        return getColor(theme, `${variantColor || 'primary'}.800`);
      }

      return getColor(theme, 'shade.950');
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

        default:
          return {
            width: '24px',
            height: '24px',
            borderRadius: '12px',
          };
      }
    },
  },
  circle: {
    dimensions(size) {
      switch (size) {
        case 'large':
          return {
            width: '14px',
            height: '14px',
            borderRadius: '7px',
            borderWidth: '1.4px',
          };
        case 'medium':
          return {
            width: '12px',
            height: '12px',
            borderRadius: '6px',
            borderWidth: '1.2px',
          };
        case 'small':
          return {
            width: '10px',
            height: '10px',
            borderRadius: '5px',
            borderWidth: '1px',
          };
        default:
          return {
            width: '12px',
            height: '12px',
            borderRadius: '6px',
            borderWidth: '1.2px',
          };
      }
    },
  },
  dot: {
    dimensions(size) {
      switch (size) {
        case 'large':
          return {
            width: '7px',
            height: '7px',
            borderRadius: '3.5px',
          };
        case 'medium':
          return {
            width: '6px',
            height: '6px',
            borderRadius: '3px',
          };
        case 'small':
          return {
            width: '5px',
            height: '5px',
            borderRadius: '2.5px',
          };
        default:
          return {
            width: '6px',
            height: '6px',
            borderRadius: '3px',
          };
      }
    },
  },
};

const Dot = styled(View)(
  (props) =>
    `
    border-radius: ${props.borderRadius};
    background-color: ${props.backgroundColor};
  `,
);

const Circle = styled(View)(
  (props) =>
    `
    border-radius: ${props.borderRadius}; 
    border-color: ${props.color};
    border-width: ${props.borderWidth}; 
  `,
);

const RadioButton = ({
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
  let titleTextColor = 'shade.980';
  let helpTextColor = 'shade.950';

  let radioButtonInitialState = false;

  if (isDefined(defaultChecked) && isDefined(checked)) {
    throw Error('One of defaultChecked or checked should be supplied.');
  }

  if (isDefined(defaultChecked)) {
    radioButtonInitialState = defaultChecked;
  }

  if (isDefined(checked)) {
    radioButtonInitialState = checked;
  }

  const [isChecked, setRadioButtonState] = useState(radioButtonInitialState);
  const [underlayColor, setUnderlayColor] = useState('transparent');
  const theme = useContext(ThemeContext);

  const radioColor = styles.radio.color({ theme, disabled, isChecked, variantColor });

  const onPressIn = useCallback(() => {
    let colorKey = 'tone.940';
    if (isChecked) {
      colorKey = `${variantColor || 'primary'}.930`;
    }
    const newUnderlayColor = getColor(theme, colorKey);
    setUnderlayColor(newUnderlayColor);
  }, [isChecked, theme, variantColor]);

  const onPressOut = useCallback(() => {
    setUnderlayColor('transparent');
  }, []);

  const onPress = useCallback(() => {
    if (isDefined(checked)) {
      onChange(!isChecked);
      return;
    }
    setRadioButtonState((prevState) => {
      onChange(!prevState);
      return !prevState;
    });
  }, [checked, isChecked, onChange]);

  if (disabled) {
    titleTextColor = 'shade.950';
    helpTextColor = 'shade.930';
  }

  return (
    <Flex alignSelf="flex-start">
      <TouchableOpacity
        activeOpacity={1}
        accessibilityRole="radio"
        onPress={onPress}
        underlayColor="transparent"
        disabled={disabled}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        {...automation(testID)}
      >
        <Flex flexDirection="row" alignItems="center">
          <View>
            <Flex justifyContent="center" alignItems="center">
              <Size {...styles.backdrop.dimensions(size)}>
                <Backdrop backgroundColor={underlayColor}>
                  <Flex justifyContent="center" alignItems="center">
                    <Size {...styles.circle.dimensions(size)}>
                      <Circle color={radioColor}>
                        {isChecked ? (
                          <Size {...styles.dot.dimensions(size)}>
                            <Dot backgroundColor={radioColor} />
                          </Size>
                        ) : null}
                      </Circle>
                    </Size>
                  </Flex>
                </Backdrop>
              </Size>
            </Flex>
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

RadioButton.propTypes = {
  defaultChecked: PropTypes.bool,
  checked: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  title: PropTypes.string.isRequired,
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

RadioButton.defaultProps = {
  defaultChecked: undefined,
  checked: undefined,
  size: 'medium',
  helpText: '',
  disabled: false,
  errorText: '',
  variantColor: 'primary',
  testID: 'ds-radio-button',
};

export default RadioButton;

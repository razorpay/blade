import React, { useState, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import View from '../View';
import Text from '../Text';
import isDefined from '../../_helpers/isDefined';
import { getVariantColorKeys, getColor, makePxValue } from '../../_helpers/theme';
import Flex from '../Flex';
import Size from '../Size';
import Space from '../Space';
import isEmpty from '../../_helpers/isEmpty';
import automation from '../../_helpers/automation-attributes';
import Backdrop from './Backdrop';
import { useRadioButtonContext } from './RadioContext';

const styles = {
  radio: {
    color({ theme, disabled, checked, variantColor }) {
      if (disabled) {
        return getColor(theme, 'shade.930');
      }
      if (checked) {
        const color = variantColor || 'primary';
        return getColor(theme, `${color}.800`);
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
            width: makePxValue(3.5),
            height: makePxValue(3.5),
            borderRadius: makePxValue(1.75),
          };
        case 'medium':
          return {
            width: makePxValue(3),
            height: makePxValue(3),
            borderRadius: makePxValue(1.5),
          };
        case 'small':
          return {
            width: makePxValue(2.5),
            height: makePxValue(2.5),
            borderRadius: makePxValue(1.25),
          };

        default:
          return {
            width: makePxValue(3),
            height: makePxValue(3),
            borderRadius: makePxValue(1.5),
          };
      }
    },
  },
  circle: {
    dimensions(size) {
      switch (size) {
        case 'large':
          return {
            width: makePxValue(1.75),
            height: makePxValue(1.75),
            borderRadius: makePxValue(0.875),
            borderWidth: makePxValue(0.175),
          };
        case 'medium':
          return {
            width: makePxValue(1.5),
            height: makePxValue(1.5),
            borderRadius: makePxValue(0.75),
            borderWidth: makePxValue(0.15),
          };
        case 'small':
          return {
            width: makePxValue(1.25),
            height: makePxValue(1.25),
            borderRadius: makePxValue(0.625),
            borderWidth: makePxValue(0.125),
          };
        default:
          return {
            width: makePxValue(1.5),
            height: makePxValue(1.5),
            borderRadius: makePxValue(0.75),
            borderWidth: makePxValue(0.15),
          };
      }
    },
  },
  dot: {
    dimensions(size) {
      switch (size) {
        case 'large':
          return {
            width: makePxValue(0.875),
            height: makePxValue(0.875),
            borderRadius: makePxValue(0.4375),
          };
        case 'medium':
          return {
            width: makePxValue(0.75),
            height: makePxValue(0.75),
            borderRadius: makePxValue(0.375),
          };
        case 'small':
          return {
            width: makePxValue(0.625),
            height: makePxValue(0.625),
            borderRadius: makePxValue(0.3125),
          };
        default:
          return {
            width: makePxValue(0.75),
            height: makePxValue(0.75),
            borderRadius: makePxValue(0.375),
          };
      }
    },
  },
};

const Dot = styled(View)<any>(
  (props) =>
    `
    border-radius: ${props.borderRadius};
    background-color: ${props.backgroundColor};
  `,
);

const Circle = styled(View)<any>(
  (props) =>
    `
    border-radius: ${props.borderRadius}; 
    border-color: ${props.color};
    border-width: ${props.borderWidth}; 
  `,
);

const isChecked = ({ context, value }) => {
  return context && isDefined(context.value) && context.value === value;
};

const RadioOption = ({
  size,
  value,
  disabled,
  title,
  helpText,
  errorText,
  variantColor,
  testID,
}) => {
  const titleTextColor = disabled ? 'shade.950' : 'shade.980';
  const helpTextColor = disabled ? 'shade.930' : 'shade.950';
  const [underlayColor, setUnderlayColor] = useState('transparent');
  const context = useRadioButtonContext();

  const theme = useTheme();
  const checked = isChecked({ context, value });

  const radioColor = styles.radio.color({ theme, disabled, checked, variantColor });

  const onPressIn = useCallback(() => {
    let color = 'tone.940';
    if (checked) {
      color = `${variantColor || 'primary'}.930`;
    }
    const newUnderlayColor = getColor(theme, color);
    setUnderlayColor(newUnderlayColor);
  }, [checked, theme, variantColor]);

  const onPressOut = useCallback(() => {
    if (isDefined(context.onChange)) {
      context.onChange(value);
    }

    setUnderlayColor('transparent');
  }, [context, value]);

  return (
    <Flex alignSelf="flex-start">
      <TouchableOpacity
        activeOpacity={1}
        accessibilityRole="radio"
        underlayColor="transparent"
        disabled={disabled}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        delayPressIn={0}
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
                        {checked ? (
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

RadioOption.propTypes = {
  value: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  title: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  variantColor: PropTypes.oneOf(getVariantColorKeys()),
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

RadioOption.defaultProps = {
  size: 'medium',
  helpText: '',
  disabled: false,
  errorText: '',
  variantColor: 'primary',
  testID: 'ds-radio-button',
};

export default RadioOption;

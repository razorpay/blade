import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from 'styled-components';
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
import Label from './Label';
import Input from './Input';
import Circle from './Circle';
import Dot from './Dot';
import { useRadioButtonContext } from './RadioContext';

const styles = {
  title: {
    color({ disabled }) {
      if (disabled) {
        return 'shade.950';
      }
      return 'shade.980';
    },
  },
  descriptionText: {
    margin(size) {
      switch (size) {
        case 'large':
          return [0.5, 0, 0, 4];
        case 'medium':
          return [0.5, 0, 0, 3.5];
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
    color({ disabled, errorText }) {
      if (errorText) {
        return 'negative.900';
      }
      if (disabled) {
        return 'shade.930';
      }
      return 'shade.950';
    },
  },
  radio: {
    color({ theme, disabled, checked, variantColor }) {
      if (disabled) {
        return getColor(theme, 'shade.930');
      }
      if (checked) {
        return getColor(theme, `${variantColor}.800`);
      }
      return getColor(theme, 'shade.950');
    },
  },
  backdrop: {
    backgroundColor({ theme, checked, disabled, state }) {
      if (disabled) {
        return 'transparent';
      }

      switch (state) {
        case 'hover':
          if (checked) {
            return getColor(theme, 'primary.920');
          }
          return getColor(theme, 'tone.930');
        case 'focus':
          if (checked) {
            return getColor(theme, 'primary.930');
          }
          return getColor(theme, 'tone.940');
        case 'active':
          if (checked) {
            return getColor(theme, 'primary.940');
          }
          return getColor(theme, 'shade.940');
        default:
          return 'transparent';
      }
    },
    width: {
      small: makePxValue(2.5),
      medium: makePxValue(3),
      large: makePxValue(3.5),
    },
    height: {
      small: makePxValue(2.5),
      medium: makePxValue(3),
      large: makePxValue(3.5),
    },
  },
  circle: {
    width: {
      small: makePxValue(1.25),
      medium: makePxValue(1.5),
      large: makePxValue(1.75),
    },
    height: {
      small: makePxValue(1.25),
      medium: makePxValue(1.5),
      large: makePxValue(1.75),
    },
    borderWidth: {
      small: makePxValue(0.125),
      medium: makePxValue(0.15),
      large: makePxValue(0.175),
    },
  },
  dot: {
    width: {
      small: makePxValue(0.625),
      medium: makePxValue(0.75),
      large: makePxValue(0.875),
    },
    height: {
      small: makePxValue(0.625),
      medium: makePxValue(0.75),
      large: makePxValue(0.875),
    },
  },
};

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
  name,
}) => {
  const context = useRadioButtonContext();
  const theme = useContext(ThemeContext);

  const checked = isChecked({ context, value });
  const radioColor = styles.radio.color({ theme, disabled, checked, variantColor });

  const onClick = (event) => {
    event.preventDefault();
    if (isDefined(context.onChange) && !disabled) {
      context.onChange(value);
    }
  };

  return (
    <Flex alignSelf="flex-start" flexDirection="column">
      <View>
        <Flex flexDirection="row" alignItems="center">
          <Label onClick={onClick}>
            <Input
              name={name}
              value={value}
              disabled={disabled}
              checked={checked}
              size={size}
              backdropStyles={styles.backdrop}
              {...automation(testID)}
            />
            <Flex flexDirection="column" justifyContent="center" alignItems="center">
              <Size width={styles.backdrop.width[size]} height={styles.backdrop.height[size]}>
                <Backdrop>
                  <Size width={styles.circle.width[size]} height={styles.circle.height[size]}>
                    <Circle borderWidth={styles.circle.borderWidth[size]} color={radioColor}>
                      {checked ? (
                        <Size width={styles.dot.width[size]} height={styles.dot.height[size]}>
                          <Dot backgroundColor={radioColor} />
                        </Size>
                      ) : null}
                    </Circle>
                  </Size>
                </Backdrop>
              </Size>
            </Flex>
            <Flex alignSelf="center">
              <Space margin={[0, 0, 0, 0.5]}>
                <View>
                  <Text color={styles.title.color({ disabled })} size={size}>
                    {title}
                  </Text>
                </View>
              </Space>
            </Flex>
          </Label>
        </Flex>

        {(!isEmpty(helpText) || !isEmpty(errorText)) && size !== 'small' ? (
          <Space margin={styles.descriptionText.margin(size)}>
            <View>
              <Text
                size={styles.descriptionText.size(size)}
                color={styles.descriptionText.color({ disabled, errorText })}
              >
                {errorText || helpText}
              </Text>
            </View>
          </Space>
        ) : null}
      </View>
    </Flex>
  );
};

RadioOption.propTypes = {
  name: PropTypes.string,
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

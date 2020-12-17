import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from 'styled-components';
import automation from '../../_helpers/automation-attributes';
import isDefined from '../../_helpers/isDefined';
import isEmpty from '../../_helpers/isEmpty';
import { getColor, makePxValue } from '../../_helpers/theme';
import Flex from '../Flex';
import Size from '../Size';
import Space from '../Space';
import Text from '../Text';
import View from '../View';
import Backdrop from './Backdrop';
import Circle from './Circle';
import Dot from './Dot';
import Input from './Input';
import Label from './Label';
import { useRadioButtonContext } from './RadioContext';

const styles = {
  title: {
    color({ disabled }) {
      if (disabled) {
        return 'shade.950';
      }
      return 'shade.980';
    },
    margin() {
      return [0, 0, 0, 0.5];
    },
  },
  descriptionText: {
    margin({ size }) {
      switch (size) {
        case 'large':
          return [0.5, 0, 0, 4];
        case 'medium':
          return [0.5, 0, 0, 3.5];
        default:
          return [0.5, 0, 0, 3.5];
      }
    },
    textSize({ size }) {
      switch (size) {
        case 'large':
          return 'medium';
        case 'medium':
          return 'xsmall';
        default:
          return 'xsmall';
      }
    },
    color({ disabled, errorText }) {
      if (disabled) {
        return 'shade.930';
      } else if (errorText) {
        return 'negative.900';
      }
      return 'shade.950';
    },
  },
  radio: {
    color({ theme, disabled, checked, variantColor }) {
      if (disabled) {
        return getColor(theme, 'shade.930');
      } else if (checked) {
        return getColor(theme, `${variantColor}.800`);
      }
      return getColor(theme, 'shade.950');
    },
  },
  backdrop: {
    backgroundColor({ theme, checked, disabled, variantColor, state }) {
      if (disabled) {
        return 'transparent';
      }

      switch (state) {
        case 'hover':
          if (checked) {
            return getColor(theme, `${variantColor}.920`);
          }
          return getColor(theme, 'tone.930');
        case 'focus':
          if (checked) {
            return getColor(theme, `${variantColor}.930`);
          }
          return getColor(theme, 'tone.940');
        case 'active':
          if (checked) {
            return getColor(theme, `${variantColor}.940`);
          }
          return getColor(theme, 'shade.940');
        default:
          return 'transparent';
      }
    },
    dimensions({ size }) {
      switch (size) {
        case 'large':
          return {
            width: makePxValue(3.5),
            height: makePxValue(3.5),
          };
        case 'medium':
          return {
            width: makePxValue(3),
            height: makePxValue(3),
          };
        case 'small':
          return {
            width: makePxValue(2.5),
            height: makePxValue(2.5),
          };
        default:
          return {
            width: makePxValue(3),
            height: makePxValue(3),
          };
      }
    },
  },
  circle: {
    dimensions({ size }) {
      switch (size) {
        case 'large':
          return {
            width: makePxValue(1.75),
            height: makePxValue(1.75),
            borderWidth: makePxValue(0.175),
          };
        case 'medium':
          return {
            width: makePxValue(1.5),
            height: makePxValue(1.5),
            borderWidth: makePxValue(0.15),
          };
        case 'small':
          return {
            width: makePxValue(1.25),
            height: makePxValue(1.25),
            borderWidth: makePxValue(0.125),
          };
        default:
          return {
            width: makePxValue(1.5),
            height: makePxValue(1.5),
            borderwidth: makePxValue(0.15),
          };
      }
    },
  },
  dot: {
    dimensions({ size }) {
      switch (size) {
        case 'large':
          return {
            width: makePxValue(0.875),
            height: makePxValue(0.875),
          };
        case 'medium':
          return {
            width: makePxValue(0.75),
            height: makePxValue(0.75),
          };
        case 'small':
          return {
            width: makePxValue(0.625),
            height: makePxValue(0.625),
          };
        default:
          return {
            width: makePxValue(0.75),
            height: makePxValue(0.75),
          };
      }
    },
  },
};

const isChecked = ({ context, value }) => {
  return context && isDefined(context.value) && context.value === value;
};

const RadioOption = ({ value, disabled, title, helpText, errorText, testID, name, id }) => {
  const context = useRadioButtonContext();
  const theme = useTheme();

  const checked = isChecked({ context, value });
  const variantColor = context.variantColor;
  const size = context.size;
  const radioColor = styles.radio.color({ theme, disabled, checked, variantColor });

  const onClick = (event) => {
    /* prevent default behaviour of label firing click event on the associated input */
    event.preventDefault();
    if (isDefined(context.onChange) && !disabled) {
      context.onChange(value);
    }
  };

  const descriptionText = errorText || helpText;
  const shouldShowDescriptionText = (!isEmpty(helpText) || !isEmpty(errorText)) && size !== 'small';

  return (
    <Flex flexDirection="column" alignSelf="flex-start">
      <View>
        <Flex alignItems="center">
          <Label as="label" onClick={onClick} htmlFor={id} disabled={disabled}>
            <Input
              id={id}
              name={name}
              value={value}
              disabled={disabled}
              checked={checked}
              size={size}
              backdropStyles={styles.backdrop}
              variantColor={variantColor}
              {...automation(testID)}
            />
            <Flex flexDirection="column" justifyContent="center" alignItems="center">
              <Size
                width={styles.backdrop.dimensions({ size }).width}
                height={styles.backdrop.dimensions({ size }).height}
              >
                <Backdrop>
                  <Size
                    width={styles.circle.dimensions({ size }).width}
                    height={styles.circle.dimensions({ size }).height}
                  >
                    <Circle
                      borderWidth={styles.circle.dimensions({ size }).borderWidth}
                      color={radioColor}
                    >
                      {checked ? (
                        <Size
                          width={styles.dot.dimensions({ size }).width}
                          height={styles.dot.dimensions({ size }).height}
                        >
                          <Dot backgroundColor={radioColor} />
                        </Size>
                      ) : null}
                    </Circle>
                  </Size>
                </Backdrop>
              </Size>
            </Flex>
            <Space margin={styles.title.margin()}>
              <Text color={styles.title.color({ disabled })} size={size}>
                {title}
              </Text>
            </Space>
          </Label>
        </Flex>

        {shouldShowDescriptionText ? (
          <Space margin={styles.descriptionText.margin({ size })}>
            <Text
              size={styles.descriptionText.textSize({ size })}
              color={styles.descriptionText.color({ disabled, errorText })}
            >
              {descriptionText}
            </Text>
          </Space>
        ) : null}
      </View>
    </Flex>
  );
};

RadioOption.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
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
  helpText: '',
  disabled: false,
  errorText: '',
  testID: 'ds-radio-button',
};

export default RadioOption;

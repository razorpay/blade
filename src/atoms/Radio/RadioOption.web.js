import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeContext } from 'styled-components';
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
        return getColor(theme, `${variantColor}.800`);
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
    border: ${props.borderWidth} solid ${props.color};'
  `,
);

const isChecked = ({ context, value }) => {
  return context && isDefined(context.value) && context.value === value;
};

const Input = styled.input.attrs({
  type: 'radio',
})`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  padding: 0;
  clip-path: inset(2px 2px 2px 0);
  outline: none;
  + ${Backdrop} {
    background-color: transparent;
    border-radius: ${(props) => styles.backdrop.dimensions(props.size).borderRadius};
  }
  &:hover {
    + ${Backdrop} {
      background-color: ${(props) => styles.backdrop.backgroundColor({ ...props, state: 'hover' })};
    }
  }
  &:focus {
    + ${Backdrop} {
      background-color: ${(props) => styles.backdrop.backgroundColor({ ...props, state: 'focus' })};
    }
  }
  &:active {
    + ${Backdrop} {
      background-color: ${(props) =>
        styles.backdrop.backgroundColor({ ...props, state: 'active' })};
    }
  }
`;

const Label = styled.label`
  position: relative;
`;

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
  const titleTextColor = disabled ? 'shade.950' : 'shade.980';
  const helpTextColor = disabled ? 'shade.930' : 'shade.950';
  const context = useRadioButtonContext();

  const theme = useContext(ThemeContext);
  const checked = isChecked({ context, value });

  const radioColor = styles.radio.color({ theme, disabled, checked, variantColor });

  const onClick = () => {
    if (isDefined(context.onChange)) {
      context.onChange(value);
    }
  };

  return (
    <Flex alignSelf="flex-start" flexDirection="column">
      <View>
        <Flex flexDirection="row" alignItems="center">
          <Label>
            <Input
              name={name}
              onClick={onClick}
              value={value}
              disabled={disabled}
              checked={checked}
              {...automation(testID)}
            />
            <Flex flexDirection="column" justifyContent="center" alignItems="center">
              <Size
                width={`${styles.backdrop.dimensions(size).width}`}
                height={`${styles.backdrop.dimensions(size).height}`}
              >
                <Backdrop>
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
          </Label>
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

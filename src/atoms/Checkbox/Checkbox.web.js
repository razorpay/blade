import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import automation from '../../_helpers/automation-attributes';
import isDefined from '../../_helpers/isDefined';
import isEmpty from '../../_helpers/isEmpty';
import { getColor, getVariantColorKeys } from '../../_helpers/theme';
import Flex from '../Flex';
import Icon from '../Icon';
import Size from '../Size';
import Space from '../Space';
import Text from '../Text';
import View from '../View';
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
          return [0.5, 0, 0, 4];
        case 'medium':
          return [0.5, 0, 0, 3.5];
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
    backgroundColor({ theme, state, isChecked, disabled, variantColor }) {
      if (disabled) {
        return 'transparent';
      }

      const colorKey = variantColor || 'primary';
      switch (state) {
        case 'hover':
          if (!isChecked) {
            return theme.colors.tone[930];
          }
          return getColor(theme, `${colorKey}.920`);
        case 'focus':
          if (!isChecked) {
            return theme.colors.tone[940];
          }
          return getColor(theme, `${colorKey}.930`);
        case 'active':
          if (!isChecked) {
            return theme.colors.tone[940];
          }
          return getColor(theme, `${colorKey}.940`);
        default:
          return 'transparent';
      }
    },
    width: {
      large: '28px',
      medium: '24px',
      small: '20px',
      xsmall: '16px',
    },
    height: {
      large: '28px',
      medium: '24px',
      small: '20px',
      xsmall: '16px',
    },
    borderRadius: {
      large: '14px',
      medium: '12px',
      small: '10px',
      xsmall: '8px',
    },
  },
};

const Input = styled.input.attrs({
  type: 'checkbox',
})`
  position: absolute;
  width: 0px;
  height: 0px;
  padding: 0;
  margin: 0;
  overflow: hidden;
  border: 0;
  clip: rect(0, 0, 0, 0);
  clip-path: inset(1px 0 0 0);

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
  display: flex;
  cursor: pointer;
  overflow: hidden;
`;

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
  id,
}) => {
  let titleTextColor = 'shade.980';
  let helpTextColor = 'shade.950';

  if (isDefined(defaultChecked) && isDefined(externalChecked)) {
    throw Error('One of defaultChecked or checked should be supplied.');
  }

  const [isChecked, setIsChecked] = useState(defaultChecked || false);

  const onCheckChange = useCallback(() => {
    if (isDefined(externalChecked)) {
      if (onChange) {
        onChange(!externalChecked);
      }
      return;
    }
    setIsChecked((prevState) => {
      if (onChange) {
        onChange(!prevState);
      }
      return !prevState;
    });
  }, [externalChecked, onChange]);

  if (disabled) {
    titleTextColor = 'shade.950';
    helpTextColor = 'shade.930';
  }

  return (
    <Flex alignSelf="flex-start" flexDirection="column">
      <View>
        <Flex flexDirection="row" alignItems="center">
          <Label htmlFor={id}>
            <Input
              id={id}
              checked={externalChecked || isChecked}
              onClick={onCheckChange}
              isChecked={isChecked}
              disabled={disabled}
              variantColor={variantColor}
              {...automation(testID)}
            />
            <Size width={styles.backdrop.width[size]} height={styles.backdrop.height[size]}>
              <Backdrop borderRadius={styles.backdrop.borderRadius[size]}>
                <Icon
                  size={styles.icon.size({ size })}
                  name={externalChecked ?? isChecked ? 'checkboxFilled' : 'checkboxOutlined'}
                  fill={styles.icon.fill({ isChecked, disabled, variantColor, externalChecked })}
                />
              </Backdrop>
            </Size>
            <View>
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
          </Label>
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
      </View>
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
  id: PropTypes.string,
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

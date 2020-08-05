import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import automation from '../../_helpers/automation-attributes';
import isDefined from '../../_helpers/isDefined';
import isEmpty from '../../_helpers/isEmpty';
import { makePxValue, getColor, getVariantColorKeys } from '../../_helpers/theme';
import Flex from '../Flex';
import Icon from '../Icon';
import Size from '../Size';
import Space from '../Space';
import Text from '../Text';
import View from '../View';
import Backdrop from './Backdrop';
import Label from './Label';
import Input from './Input';

const styles = {
  icon: {
    fill({ disabled, isChecked, variantColor, externalChecked }) {
      if (disabled) {
        return 'shade.930';
      }
      if (isChecked || externalChecked) {
        return `${variantColor}.800`;
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
  descriptionText: {
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
  backdrop: {
    backgroundColor({ theme, state, isChecked, externalChecked, disabled, variantColor }) {
      if (disabled) {
        return 'transparent';
      }

      switch (state) {
        case 'hover':
          if (!(isChecked || externalChecked)) {
            return theme.colors.tone[930];
          }
          return getColor(theme, `${variantColor}.920`);
        case 'focus':
          if (!(isChecked || externalChecked)) {
            return theme.colors.tone[940];
          }
          return getColor(theme, `${variantColor}.930`);
        case 'active':
          if (!(isChecked || externalChecked)) {
            return theme.colors.tone[940];
          }
          return getColor(theme, `${variantColor}.940`);
        default:
          return 'transparent';
      }
    },
    width: {
      large: makePxValue(3.5),
      medium: makePxValue(3),
      small: makePxValue(2.5),
      xsmall: makePxValue(2),
    },
    height: {
      large: makePxValue(3.5),
      medium: makePxValue(3),
      small: makePxValue(2.5),
      xsmall: makePxValue(2),
    },
    borderRadius: {
      large: makePxValue(1.75),
      medium: makePxValue(1.5),
      small: makePxValue(1.25),
      xsmall: makePxValue(1),
    },
  },
  title: {
    color({ disabled }) {
      if (disabled) {
        return 'shade.950';
      }
      return 'shade.980';
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
  name,
  id,
}) => {
  if (isDefined(defaultChecked) && isDefined(externalChecked)) {
    throw Error('One of defaultChecked or checked should be supplied.');
  }

  const [isChecked, setIsChecked] = useState(defaultChecked || false);

  const onCheckChange = useCallback(
    (event) => {
      /* prevent default behaviour of label firing click event on the associated input */
      event.preventDefault();
      if (!disabled) {
        if (isDefined(externalChecked)) {
          onChange(!externalChecked);
          return;
        }
        setIsChecked((prevState) => {
          onChange(!prevState);
          return !prevState;
        });
      }
    },
    [externalChecked, onChange],
  );

  const descriptionText = errorText || helpText;

  return (
    <Flex alignSelf="flex-start" flexDirection="column">
      <View>
        <Flex flexDirection="row" alignItems="center">
          <Label as="label" onClick={onCheckChange} htmlFor={id}>
            <Input
              id={id}
              name={name}
              defaultChecked={isChecked || externalChecked}
              isChecked={isChecked}
              externalChecked={externalChecked}
              disabled={disabled}
              variantColor={variantColor}
              backdropStyles={styles.backdrop}
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
                <Flex>
                  <Space margin={[0, 0, 0, 0.5]}>
                    <View>
                      <Text color={styles.title.color({ disabled })} size={size}>
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
          <Space margin={styles.descriptionText.margin(size)}>
            <View>
              <Text
                size={styles.descriptionText.size(size)}
                color={styles.descriptionText.color({ disabled, errorText, helpText })}
              >
                {descriptionText}
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
  onChange: PropTypes.func,
  testID: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
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
  onChange: () => {},
};

export default Checkbox;

import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import automation from '../../_helpers/automation-attributes';
import isDefined from '../../_helpers/isDefined';
import isEmpty from '../../_helpers/isEmpty';
import { getColor, getVariantColorKeys, makePxValue } from '../../_helpers/theme';
import Flex from '../Flex';
import Icon from '../Icon';
import Size from '../Size';
import Space from '../Space';
import Text from '../Text';
import View from '../View';
import Backdrop from './Backdrop';
import Input from './Input';
import Label from './Label';

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
        case 'small':
          return 'large';
        default:
          return 'large';
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
        default:
          return [0.5, 0, 0, 3.5];
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
      if (disabled) {
        return 'shade.930';
      }
      if (errorText) {
        return 'negative.900';
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
          if (isChecked || externalChecked) {
            return getColor(theme, `${variantColor}.920`);
          }
          return theme.bladeOld.colors.tone[930];
        case 'focus':
          if (isChecked || externalChecked) {
            return getColor(theme, `${variantColor}.930`);
          }
          return theme.bladeOld.colors.tone[940];
        case 'active':
          if (isChecked || externalChecked) {
            return getColor(theme, `${variantColor}.940`);
          }
          return theme.bladeOld.colors.tone[940];
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
            borderRadius: makePxValue(1.75),
          };
        case 'medium':
        case 'small':
          return {
            width: makePxValue(3),
            height: makePxValue(3),
            borderRadius: makePxValue(1.5),
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
    throw Error('Only one of defaultChecked or checked should be supplied.');
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
    [externalChecked, onChange, disabled],
  );

  const descriptionText = errorText || helpText;
  const shouldShowDescriptionText =
    title && (!isEmpty(helpText) || !isEmpty(errorText)) && size !== 'small';

  return (
    <Flex flexDirection="column" alignSelf="flex-start">
      <View>
        <Flex alignItems="center">
          <Label as="label" onClick={onCheckChange} htmlFor={id} disabled={disabled}>
            <Input
              id={id}
              name={name}
              isChecked={isChecked}
              externalChecked={externalChecked}
              disabled={disabled}
              variantColor={variantColor}
              backdropStyles={styles.backdrop}
              checked={isDefined(externalChecked) ? externalChecked : isChecked}
              {...automation(testID)}
            />
            <Size
              width={
                styles.backdrop.dimensions({
                  size,
                }).width
              }
              height={
                styles.backdrop.dimensions({
                  size,
                }).height
              }
            >
              <Backdrop
                borderRadius={
                  styles.backdrop.dimensions({
                    size,
                  }).borderRadius
                }
              >
                <Icon
                  size={styles.icon.size({
                    size,
                  })}
                  name={externalChecked ?? isChecked ? 'checkboxFilled' : 'checkboxOutlined'}
                  fill={styles.icon.fill({
                    isChecked,
                    disabled,
                    variantColor,
                    externalChecked,
                  })}
                  testID="checkbox-icon"
                />
              </Backdrop>
            </Size>
            {title ? (
              <Space margin={styles.title.margin()}>
                <Text
                  color={styles.title.color({
                    disabled,
                  })}
                  size={size}
                >
                  {title}
                </Text>
              </Space>
            ) : null}
          </Label>
        </Flex>

        {shouldShowDescriptionText ? (
          <Space margin={styles.descriptionText.margin(size)}>
            <Text
              size={styles.descriptionText.size(size)}
              color={styles.descriptionText.color({
                disabled,
                errorText,
              })}
            >
              {descriptionText}
            </Text>
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

import React from 'react';
import PropTypes from 'prop-types';
import styled, { useTheme } from 'styled-components/native';
import { TouchableHighlight } from 'react-native';

import Flex from '../Flex';
import Size from '../Size';
import Space from '../Space';
import Icon from '../Icon';
import Text from '../Text';
import View from '../View';
import automation from '../../_helpers/automation-attributes';
import { getColor, makePxValue, getVariantColorKeys } from '../../_helpers/theme';

const styles = {
  fontColor({ variant, variantColor, disabled }) {
    switch (variant) {
      case 'primary':
        if (disabled) {
          return 'light.950';
        }
        return 'light.900';
      case 'secondary':
        if (disabled) {
          return 'shade.940';
        }
        if (variantColor) {
          return `${variantColor}.800`;
        }
        return 'primary.800';
      case 'tertiary':
        if (disabled) {
          return 'shade.940';
        }
        if (variantColor) {
          return `${variantColor}.800`;
        }
        return 'primary.800';
      default:
        if (disabled) {
          return 'light.950';
        }
        return 'light.900';
    }
  },
  backgroundColor({ variant, color, disabled, theme }) {
    switch (variant) {
      case 'primary':
        if (disabled) {
          return getColor(theme, `${color}.500`);
        }
        return getColor(theme, `${color}.800`);
      case 'secondary':
        if (disabled) {
          return getColor(theme, 'shade.910');
        }
        return getColor(theme, `${color}.920`);
      case 'tertiary':
        return 'transparent';
      default:
        if (disabled) {
          return getColor(theme, `${color}.500`);
        }
        return getColor(theme, `${color}.800`);
    }
  },
  border({ variant, color, disabled, theme }) {
    switch (variant) {
      case 'primary':
        return '0px';
      case 'secondary':
        if (disabled) {
          return `${makePxValue(0.125)} solid ${getColor(theme, 'shade.930')}`;
        }
        return `${makePxValue(0.125)} solid ${getColor(theme, `${color}.970`)}`;
      case 'tertiary':
        return '0px';
      default:
        return '0px';
    }
  },
  underlayColor({ variant, color, theme }) {
    switch (variant) {
      case 'primary':
        return getColor(theme, `${color}.600`);
      case 'secondary':
        return getColor(theme, `${color}.950`);
      case 'tertiary':
        return getColor(theme, `${color}.950`);
      default:
        return getColor(theme, `${color}.600`);
    }
  },
  height({ size, theme }) {
    switch (size) {
      case 'xsmall':
        return theme.bladeOld.spacings.xlarge;
      case 'small':
        return makePxValue(3.5); //TODO: not on scale of 8
      case 'medium':
        return makePxValue(4.5); //TODO: not on scale of 8
      case 'large':
        return makePxValue(5);
      default:
        return makePxValue(4.5); //TODO: not on scale of 8
    }
  },
  padding({ size, theme, children }) {
    switch (size) {
      case 'xsmall':
        if (children) {
          return [0, theme.bladeOld.spacings.small];
        }
        return [0, theme.bladeOld.spacings.xxsmall];
      case 'small':
        if (children) {
          return [0, theme.bladeOld.spacings.large];
        }
        return [0, theme.bladeOld.spacings.xsmall];
      case 'medium':
        if (children) {
          return [0, theme.bladeOld.spacings.xxlarge];
        }
        return [0, 0.75]; //TODO: horizontal padding not on scale of 8
      case 'large':
        if (children) {
          return [0, theme.bladeOld.spacings.xxlarge];
        }
        return [0, theme.bladeOld.spacings.small];
      default:
        if (children) {
          return [0, theme.bladeOld.spacings.xxlarge];
        }
        return [0, 0.75]; //TODO: horizontal padding not on scale of 8
    }
  },
  iconSize({ size, children }) {
    switch (size) {
      case 'xsmall':
        if (children) {
          return 'xsmall';
        }
        return 'small';
      case 'small':
        if (children) {
          return 'small';
        }
        return 'medium';
      case 'medium':
        if (children) {
          return 'medium';
        }
        return 'large';
      case 'large':
        if (children) {
          return 'medium';
        }
        return 'large';
      default:
        if (children) {
          return 'medium';
        }
        return 'large';
    }
  },
  fontSize({ size }) {
    switch (size) {
      case 'xsmall':
        return 'xxsmall';
      case 'small':
        return 'xsmall';
      case 'medium':
        return 'medium';
      case 'large':
        return 'medium';
      default:
        return 'medium';
    }
  },
  letterSpacing({ size }) {
    switch (size) {
      case 'xsmall':
        return 'medium';
      default:
        return 'small';
    }
  },
  spaceBetween({ size, iconAlign }) {
    switch (size) {
      case 'xsmall':
        if (iconAlign === 'left') {
          return [0, 0.5, 0, 0];
        }
        return [0, 0, 0, 0.5];
      case 'small':
        if (iconAlign === 'left') {
          return [0, 0.5, 0, 0];
        }
        return [0, 0, 0, 0.5];
      case 'medium':
        if (iconAlign === 'left') {
          return [0, 1, 0, 0];
        }
        return [0, 0, 0, 1];
      case 'large':
        if (iconAlign === 'left') {
          return [0, 1, 0, 0];
        }
        return [0, 0, 0, 1];
      default:
        if (iconAlign === 'left') {
          return [0, 1, 0, 0];
        }
        return [0, 0, 0, 1];
    }
  },
  lineHeight({ size }) {
    switch (size) {
      case 'xsmall':
        return 'xsmall';
      case 'small':
        return 'small';
      case 'medium':
        return 'medium';
      case 'large':
        return 'medium';
      default:
        return 'medium';
    }
  },
};

const StyledButton = styled(TouchableHighlight)`
  background-color: ${styles.backgroundColor};
  border-radius: ${(props) => props.theme.bladeOld.spacings.xxsmall};
  border: ${styles.border};
`;

const Button = ({
  onClick,
  children,
  variant,
  size,
  disabled,
  variantColor,
  icon,
  iconAlign,
  block,
  testID,
}) => {
  const theme = useTheme();

  const color = `${variantColor || 'primary'}`;

  if (typeof children !== 'string' && typeof children !== 'undefined') {
    throw new Error(
      `Error in Button: expected \`children\` of type \`string\` but found ${typeof children}`,
    );
  }

  return (
    <Flex flex={block ? 1 : 0} flexDirection="row" alignItems="center" justifyContent="center">
      <Size
        height={styles.height({
          size,
          theme,
        })}
      >
        <Space
          padding={styles.padding({
            size,
            children,
            theme,
          })}
        >
          <StyledButton
            color={color}
            onPress={onClick}
            variantColor={variantColor}
            disabled={disabled}
            size={size}
            block={block}
            variant={variant}
            activeOpacity={1}
            underlayColor={styles.underlayColor({
              variant,
              color,
              theme,
            })}
            {...automation(testID)}
          >
            <React.Fragment>
              {icon && iconAlign === 'left' && (
                <Icon
                  name={icon}
                  size={styles.iconSize({
                    size,
                    children,
                  })}
                  fill={styles.fontColor({
                    variant,
                    variantColor,
                    disabled,
                  })}
                  testID="button-left-icon"
                />
              )}
              {icon && iconAlign === 'left' && children && (
                <Space
                  margin={styles.spaceBetween({
                    size,
                    iconAlign,
                  })}
                >
                  <View />
                </Space>
              )}
              {children ? (
                <Text
                  color={styles.fontColor({
                    variant,
                    variantColor,
                    disabled,
                  })}
                  size={styles.fontSize({
                    size,
                  })}
                  align="center"
                  weight="bold"
                  _letterSpacing={styles.letterSpacing({
                    size,
                  })}
                  _lineHeight={styles.lineHeight({
                    size,
                  })}
                >
                  {size === 'xsmall' ? children.toUpperCase() : children}
                </Text>
              ) : null}
              {icon && iconAlign === 'right' && children && (
                <Space
                  margin={styles.spaceBetween({
                    size,
                    iconAlign,
                  })}
                >
                  <View />
                </Space>
              )}
              {icon && iconAlign === 'right' && (
                <Icon
                  name={icon}
                  size={styles.iconSize({
                    size,
                    children,
                  })}
                  fill={styles.fontColor({
                    variant,
                    variantColor,
                    disabled,
                  })}
                  testID="button-right-icon"
                />
              )}
            </React.Fragment>
          </StyledButton>
        </Space>
      </Size>
    </Flex>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'tertiary']),
  variantColor: PropTypes.oneOf(getVariantColorKeys()),
  block: PropTypes.bool,
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large']),
  disabled: PropTypes.bool,
  icon: PropTypes.string,
  iconAlign: PropTypes.oneOf(['left', 'right']),
  testID: PropTypes.string,
};

Button.defaultProps = {
  testID: 'ds-button',
  variant: 'primary',
  block: false,
  size: 'medium',
  disabled: false,
  iconAlign: 'left',
  onClick: () => {},
};

export default Button;

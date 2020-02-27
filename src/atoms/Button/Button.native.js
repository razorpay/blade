import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeContext } from 'styled-components/native';
import { TouchableHighlight } from 'react-native';

import Icon from '../Icon';
import Space from '../Space';
import Text from '../Text';
import View from '../View';
import Flex from '../Flex';
import automation from '../../_helpers/automation-attributes';
import { getColor, makePxValue, getVariantColorKeys } from '../../_helpers/theme';

const styles = {
  fontColor({ variant, variantColor, disabled }) {
    switch (variant) {
      case 'primary':
      default:
        if (disabled) {
          return 'white.950'; //TODO: mapping not present(EX/white 500) for figma in sheet.
        }
        return 'white.900';
      case 'secondary':
        if (disabled) {
          return 'shade.940';
        }
        return `${variantColor || 'primary'}.800`;
      case 'tertiary':
        if (disabled) {
          return 'shade.940';
        }
        return `${variantColor || 'primary'}.800`;
    }
  },
  backgroundColor({ variant, variantColor, disabled, theme }) {
    switch (variant) {
      case 'primary':
      default:
        if (disabled) {
          return getColor(theme, `${variantColor || 'primary'}.500`);
        }
        return getColor(theme, `${variantColor || 'primary'}.800`);
      case 'secondary':
        if (disabled) {
          return getColor(theme, 'shade.910');
        }
        return getColor(theme, `${variantColor || 'primary'}.920`);
      case 'tertiary':
        return 'transparent';
    }
  },
  border({ variant, variantColor, disabled, theme }) {
    switch (variant) {
      case 'primary':
      case 'tertiary':
      default:
        return null;
      case 'secondary':
        if (disabled) {
          return `${makePxValue(0.125)} solid ${getColor(theme, 'shade.930')}`;
        }
        return `${makePxValue(0.125)} solid ${getColor(theme, `${variantColor || 'primary'}.970`)}`;
    }
  },
  underlayColor({ variant, variantColor, theme }) {
    switch (variant) {
      case 'primary':
      default:
        return getColor(theme, `${variantColor || 'primary'}.600`); //in design, "Exception" white is used.
      case 'secondary':
        return getColor(theme, `${variantColor || 'primary'}.950`);
      case 'tertiary':
        return getColor(theme, `${variantColor || 'primary'}.950`);
    }
  },
  padding({ size, theme, children }) {
    switch (size) {
      case 'xsmall':
        if (!children) {
          return [theme.spacings.xxsmall];
        }
        return [theme.spacings.xxsmall, theme.spacings.small];
      case 'small':
        if (!children) {
          return [makePxValue(0.75)];
        }
        return [makePxValue(0.625), theme.spacings.large];
      case 'medium':
      default:
        if (!children) {
          return [theme.spacings.small];
        }
        return [theme.spacings.small, theme.spacings.xxlarge];
      case 'large':
        if (!children) {
          return [makePxValue(1.25)];
        }
        return [makePxValue(1.25), theme.spacings.xxlarge];
    }
  },
  iconSize({ size, children }) {
    switch (size) {
      case 'xsmall':
        if (!children) {
          return 'small';
        }
        return 'xsmall';
      case 'small':
        if (!children) {
          return 'medium';
        }
        return 'small';
      case 'medium':
      case 'large':
      default:
        if (!children) {
          return 'large';
        }
        return 'medium';
    }
  },
  fontSize({ size }) {
    switch (size) {
      case 'xsmall':
        return 'xxsmall';
      case 'small':
        return 'xsmall';
      case 'medium':
      case 'large':
      default:
        return 'medium';
    }
  },
  alignSelf({ align }) {
    switch (align) {
      case 'left':
      default:
        return 'flex-start';
      case 'center':
        return 'center';
      case 'right':
        return 'flex-end';
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
  spaceBetween({ size, iconPosition }) {
    switch (size) {
      case 'xsmall':
      case 'small':
        return iconPosition === 'left' ? [0, 0.5, 0, 0] : [0, 0, 0, 0.5];
      case 'medium':
      case 'large':
      default:
        return iconPosition === 'left' ? [0, 1, 0, 0] : [0, 0, 0, 1];
    }
  },
  lineHeight({ size }) {
    switch (size) {
      case 'xsmall':
        return 'xsmall';
      case 'small':
        return 'small';
      case 'medium':
      case 'large':
      default:
        return 'medium';
    }
  },
};

const StyledButton = styled(TouchableHighlight)(
  (props) => `
    background-color: ${styles.backgroundColor(props)};
    border-radius: ${props.theme.spacings.xxsmall};
    ${styles.border(props) && `border: ${styles.border(props)}`};
  `,
);

const Button = (props) => {
  const {
    onClick,
    children,
    variant,
    size,
    disabled,
    variantColor,
    icon,
    iconPosition,
    align,
    testID,
  } = props;
  const theme = useContext(ThemeContext);
  return (
    <Flex flexDirection="row" alignItems="center" alignSelf={styles.alignSelf(props)}>
      <Space padding={styles.padding({ ...props, theme })}>
        <StyledButton
          onPress={onClick}
          variantColor={variantColor}
          disabled={disabled}
          size={size}
          variant={variant}
          activeOpacity={1}
          underlayColor={styles.underlayColor({ ...props, theme })}
          align={align}
          {...automation(testID)}
        >
          <>
            {icon && iconPosition === 'left' && (
              <Icon
                name={icon}
                size={styles.iconSize(props)}
                fill={styles.fontColor({ ...props, theme })}
              />
            )}
            {icon && iconPosition === 'left' && children && (
              <Space margin={styles.spaceBetween(props)}>
                <View />
              </Space>
            )}
            <Text
              color={styles.fontColor(props)}
              size={styles.fontSize(props)}
              align="center"
              _weight="bold"
              _letterSpacing={styles.letterSpacing(props)}
              _lineHeight={styles.lineHeight(props)}
            >
              {size === 'xsmall' ? children && children.toUpperCase() : children}
            </Text>
            {icon && iconPosition === 'right' && children && (
              <Space margin={styles.spaceBetween(props)}>
                <View />
              </Space>
            )}
            {icon && iconPosition === 'right' && (
              <Icon
                name={icon}
                size={styles.iconSize(props)}
                fill={styles.fontColor({ ...props, theme })}
              />
            )}
          </>
        </StyledButton>
      </Space>
    </Flex>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'tertiary']),
  variantColor: PropTypes.oneOf(getVariantColorKeys()),
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large']),
  align: PropTypes.oneOf(['left', 'center', 'right']),
  disabled: PropTypes.bool,
  icon: PropTypes.string,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  testID: PropTypes.string,
};

Button.defaultProps = {
  testID: 'ds-button',
  variant: 'primary',
  align: 'left',
  size: 'medium',
  disabled: false,
  iconPosition: 'left',
  onClick: () => {},
};

export default Button;

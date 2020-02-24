import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeContext } from 'styled-components/native';
import { TouchableHighlight } from 'react-native';

import Icon from '../Icon';
import Space from '../Space';
import Text from '../Text';
import { getColorKey, getColor, getPxScale, getVariantColorKeys } from '../../_helpers/theme';

const styles = {
  fontColor({ variant, variantColor, disabled }) {
    switch (variant) {
      case 'primary':
      default:
        if (disabled) {
          return getColorKey(`${variantColor || 'background'}`, 200); //TODO: exception color used in design
        }
        return getColorKey(`${variantColor || 'background'}`, 100); //in design, "Exception" white is used.
      case 'secondary':
        if (disabled) {
          return getColorKey(`${variantColor || 'shade'}`, 400);
        }
        return getColorKey(`${variantColor || 'primary'}`, 800);
      case 'tertiary':
        if (disabled) {
          return getColorKey(`${variantColor || 'shade'}`, 400);
        }
        return getColorKey(`${variantColor || 'primary'}`, 800);
    }
  },
  backgroundColor({ variant, variantColor, disabled, theme }) {
    switch (variant) {
      case 'primary':
      default:
        if (disabled) {
          return getColor(theme, `${variantColor || 'primary'}.200`); //TODO: exception color used in design
        }
        return getColor(theme, `${variantColor || 'primary'}.800`); //in design, "Exception" white is used.
      case 'secondary':
        if (disabled) {
          return getColor(theme, `${variantColor || 'shade'}.100`);
        }
        return getColor(theme, `${variantColor || 'primary'}.200`);
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
          return `${getPxScale(0.125)} solid ${getColor(theme, `${variantColor || 'shade'}.300`)}`;
        }
        return `${getPxScale(0.125)} solid ${getColor(theme, `${variantColor || 'primary'}.600`)}`;
    }
  },
  underlayColor({ variant, variantColor, theme }) {
    switch (variant) {
      case 'primary':
      default:
        return getColor(theme, `${variantColor || 'primary'}.900`); //in design, "Exception" white is used.
      case 'secondary':
        return getColor(theme, `${variantColor || 'primary'}.500`);
      case 'tertiary':
        return getColor(theme, `${variantColor || 'primary'}.500`);
    }
  },
  padding({ size, theme, text }) {
    switch (size) {
      case 'xsmall':
        if (!text) {
          return `${theme.spacings.xxsmall}`;
        }
        return `${theme.spacings.xxsmall} ${theme.spacings.small}`;
      case 'small':
        if (!text) {
          return `${getPxScale(0.75)}`;
        }
        return `${getPxScale(0.625)} ${theme.spacings.large}`;
      case 'medium':
      default:
        if (!text) {
          return `${theme.spacings.small}`;
        }
        return `${theme.spacings.small} ${theme.spacings.xxlarge}`;
      case 'large':
        if (!text) {
          return `${getPxScale(1.25)}`;
        }
        return `${getPxScale(1.25)} ${theme.spacings.xxlarge} `;
    }
  },
  iconSize({ size }) {
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
};

const StyledButton = styled(TouchableHighlight)(
  (props) => `
    flex-direction: row;
    align-items: center;
    align-self: ${styles.alignSelf(props)};
    background-color: ${styles.backgroundColor(props)};
    padding: ${styles.padding(props)};
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
    <StyledButton
      onPress={onClick}
      variantColor={variantColor}
      disabled={disabled}
      size={size}
      variant={variant}
      activeOpacity={1}
      text={children}
      underlayColor={styles.underlayColor({ variantColor, variant, theme })}
      align={align}
      testID={testID}
    >
      <>
        {icon && iconPosition === 'left' && (
          <Icon
            name={icon}
            size={styles.iconSize(props)}
            fill={styles.fontColor({ ...props, theme })}
          />
        )}
        {icon && iconPosition === 'left' && children && <Space margin={[0, 0.5]} />}
        <Text
          color={styles.fontColor(props)}
          size={styles.fontSize(props)}
          _weight="bold"
          align="center"
          _letterSpacing={styles.letterSpacing(props)}
        >
          {size === 'xsmall' ? children && children.toUpperCase() : children}
        </Text>
        {icon && iconPosition === 'right' && children && <Space margin={[0, 0.5]} />}
        {icon && iconPosition === 'right' && (
          <Icon
            name={icon}
            size={styles.iconSize(props)}
            fill={styles.fontColor({ ...props, theme })}
          />
        )}
      </>
    </StyledButton>
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

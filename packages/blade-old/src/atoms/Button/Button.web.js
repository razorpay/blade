import React from 'react';
import PropTypes from 'prop-types';
import styled, { useTheme } from 'styled-components';

import Flex from '../Flex';
import Size from '../Size';
import Space from '../Space';
import Icon from '../Icon';
import Text from '../Text';
import automation from '../../_helpers/automation-attributes';
import { getColor, makePxValue, getVariantColorKeys } from '../../_helpers/theme';
import isEmpty from '../../_helpers/isEmpty';

const BORDER_WIDTH = makePxValue(0.125);

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
        return `${variantColor}.800`;
      case 'tertiary':
        if (disabled) {
          return 'shade.940';
        }
        return `${variantColor}.800`;
      default:
        if (disabled) {
          return 'light.950';
        }
        return 'light.900';
    }
  },
  backgroundColor({ variant, variantColor, disabled, theme }) {
    switch (variant) {
      case 'primary':
        if (disabled) {
          return getColor(theme, `${variantColor}.500`);
        }
        return getColor(theme, `${variantColor}.800`);
      case 'secondary':
        if (disabled) {
          return getColor(theme, 'shade.910');
        }
        return getColor(theme, `${variantColor}.920`);
      case 'tertiary':
        return 'transparent';
      default:
        if (disabled) {
          return getColor(theme, `${variantColor}.500`);
        }
        return getColor(theme, `${variantColor}.800`);
    }
  },
  focusBorder({ theme, variant, disabled, variantColor }) {
    if (disabled) {
      return '';
    }
    switch (variant) {
      case 'primary':
        return `${BORDER_WIDTH} solid ${getColor(theme, 'shade.960')}`;
      case 'secondary':
        return `${BORDER_WIDTH} solid ${getColor(theme, `${variantColor}.900`)}`;
      case 'tertiary':
        return '0px';
      default:
        return `${BORDER_WIDTH} solid ${getColor(theme, 'shade.960')}`;
    }
  },
  focusBackgroundColor({ theme, variant, variantColor, disabled }) {
    if (disabled) {
      return '';
    }
    switch (variant) {
      case 'primary':
        return getColor(theme, `${variantColor}.800`);
      case 'secondary':
        return getColor(theme, `${variantColor}.930`);
      case 'tertiary':
        return getColor(theme, `${variantColor}.930`);
      default:
        return getColor(theme, `${variantColor}.800`);
    }
  },
  activeBorder({ theme, variant, disabled, variantColor }) {
    if (disabled) {
      return '';
    }
    switch (variant) {
      case 'primary':
        return `${BORDER_WIDTH} solid ${getColor(theme, `${variantColor}.600`)}`;
      case 'secondary':
        return `${BORDER_WIDTH} solid ${getColor(theme, `${variantColor}.970`)}`;
      case 'tertiary':
        return '0px';
      default:
        return `${BORDER_WIDTH} solid ${getColor(theme, `${variantColor}.600`)}`;
    }
  },
  activeBackgroundColor({ theme, variant, variantColor, disabled }) {
    if (disabled) {
      return '';
    }
    switch (variant) {
      case 'primary':
        return getColor(theme, `${variantColor}.600`);
      case 'secondary':
        return getColor(theme, `${variantColor}.950`);
      case 'tertiary':
        return getColor(theme, `${variantColor}.950`);
      default:
        return getColor(theme, `${variantColor}.600`);
    }
  },
  hoverBorder({ theme, variant, disabled, variantColor }) {
    if (disabled) {
      return '';
    }
    switch (variant) {
      case 'primary':
        return `${BORDER_WIDTH} solid ${getColor(theme, `${variantColor}.700`)}`;
      case 'secondary':
        return `${BORDER_WIDTH} solid ${getColor(theme, `${variantColor}.970`)}`;
      case 'tertiary':
        return '0px';
      default:
        return `${BORDER_WIDTH} solid ${getColor(theme, `${variantColor}.700`)}`;
    }
  },
  hoverBackgroundColor({ theme, variant, variantColor, disabled }) {
    if (disabled) {
      return '';
    }
    switch (variant) {
      case 'primary':
        return getColor(theme, `${variantColor}.700`);
      case 'secondary':
        return getColor(theme, `${variantColor}.930`);
      case 'tertiary':
        return getColor(theme, `${variantColor}.920`);
      default:
        return getColor(theme, `${variantColor}.700`);
    }
  },
  border({ variant, variantColor, disabled, theme }) {
    switch (variant) {
      case 'primary':
        if (disabled) {
          return `${BORDER_WIDTH} solid ${getColor(theme, `${variantColor}.500`)}`;
        }
        return `${BORDER_WIDTH} solid ${getColor(theme, `${variantColor}.800`)}`;
      case 'secondary':
        if (disabled) {
          return `${BORDER_WIDTH} solid ${getColor(theme, 'shade.930')}`;
        }
        return `${BORDER_WIDTH} solid ${getColor(theme, `${variantColor}.970`)}`;
      case 'tertiary':
        return '0px';
      default:
        if (disabled) {
          return `${BORDER_WIDTH} solid ${getColor(theme, `${variantColor}.500`)}`;
        }
        return `${BORDER_WIDTH} solid ${getColor(theme, `${variantColor}.800`)}`;
    }
  },
  height({ size, theme }) {
    switch (size) {
      case 'xsmall':
        return theme.bladeOld.spacings.xlarge;
      case 'small':
        return makePxValue(3.5);
      case 'medium':
        return makePxValue(4.5);
      case 'large':
        return makePxValue(5);
      default:
        return makePxValue(4.5);
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
        return [0, makePxValue(0.75)];
      case 'large':
        if (children) {
          return [0, theme.bladeOld.spacings.xxlarge];
        }
        return [0, theme.bladeOld.spacings.small];
      default:
        if (children) {
          return [0, theme.bladeOld.spacings.xxlarge];
        }
        return [0, makePxValue(0.75)];
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
  align({ align }) {
    switch (align) {
      case 'left':
        return 'flex-start';
      case 'center':
        return 'center';
      case 'right':
        return 'flex-end';
      default:
        return 'flex-start';
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
  spaceBetween({ size, iconAlign, children }) {
    if (isEmpty(children)) {
      return null;
    }

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
  pointerEvents({ disabled }) {
    if (disabled) {
      return 'none';
    }
    return '';
  },
};

const StyledButton = styled.button`
  box-sizing: border-box; /* TODO: remove after box-sizing: border-box added globally */
  background-color: ${styles.backgroundColor};
  border-radius: ${(props) => props.theme.bladeOld.spacings.xxsmall};
  border: ${styles.border};
  width: ${(props) => (props.block ? '100%' : '')};
  cursor: pointer;
  pointer-events: ${styles.pointerEvents};
  outline: none;
  &:hover {
    border: ${styles.hoverBorder};
    background-color: ${styles.hoverBackgroundColor};
  }
  &:focus {
    border: ${styles.focusBorder};
    background-color: ${styles.focusBackgroundColor};
  }
  &:active {
    border: ${styles.activeBorder};
    background-color: ${styles.activeBackgroundColor};
  }
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
  align,
  block,
  type,
  testID,
  id,
  name,
}) => {
  const theme = useTheme();

  /* children can only be string or undefined (icon only button) */
  if (typeof children !== 'string' && typeof children !== 'undefined') {
    throw new Error(
      `Error in Button: expected \`children\` of type \`string\` but found ${typeof children}.`,
    );
  }

  /* Button remains focused on Chrome after click until focused on any other element.
   * This causes the focus styles to be present on the button.
   * Manually call blur on the button when user click and releases the mouse button. */
  const onMouseUp = ({ currentTarget }) => {
    currentTarget.blur();
  };

  return (
    <Flex
      flex={block ? 1 : 0}
      flexDirection="row"
      alignItems="center"
      alignSelf={styles.align({
        align,
      })}
      justifyContent="center"
    >
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
            variantColor={variantColor}
            onClick={onClick}
            onMouseUp={onMouseUp}
            disabled={disabled}
            size={size}
            block={block}
            variant={variant}
            type={type}
            id={id}
            name={name}
            {...automation(testID)}
          >
            <React.Fragment>
              {icon && iconAlign === 'left' ? (
                <Space
                  margin={styles.spaceBetween({
                    size,
                    iconAlign,
                    children,
                  })}
                >
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
                </Space>
              ) : null}
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
              {icon && iconAlign === 'right' ? (
                <Space
                  margin={styles.spaceBetween({
                    size,
                    iconAlign,
                    children,
                  })}
                >
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
                </Space>
              ) : null}
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
  align: PropTypes.oneOf(['left', 'center', 'right']),
  disabled: PropTypes.bool,
  icon: PropTypes.string,
  iconAlign: PropTypes.oneOf(['left', 'right']),
  type: PropTypes.oneOf(['submit', 'reset', 'button']),
  testID: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
};

Button.defaultProps = {
  variant: 'primary',
  variantColor: 'primary',
  block: false,
  align: 'left',
  size: 'medium',
  disabled: false,
  iconAlign: 'left',
  type: 'button',
  onClick: () => {},
  testID: 'ds-button',
};

export default Button;

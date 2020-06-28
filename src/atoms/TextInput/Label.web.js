import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import Text from '../Text';
import Space from '../Space';
import View from '../View';
import { getColor } from '../../_helpers/theme';
import isDefined from '../../_helpers/isDefined';

const styles = {
  container: {
    height({ variant }) {
      if (variant === 'outlined') {
        return '10px';
      } else {
        return '20px';
      }
    },
  },
  text: {
    color({ theme, isFocused, hasError, disabled, variant, value }) {
      if (variant === 'outlined') {
        if (isFocused && !hasError) {
          return getColor(theme, 'primary.800');
        } else if (isDefined(value)) {
          return getColor(theme, 'shade.950');
        }
      }
      if (disabled) {
        return getColor(theme, 'shade.940');
      }
      return getColor(theme, 'shade.960');
    },
    fontSize({ theme }) {
      return theme.fonts.size.xsmall;
    },
    lineHeight({ theme }) {
      return theme.fonts.lineHeight.small;
    },
    fontFamily({ theme }) {
      return theme.fonts.family.lato.regular;
    },
  },
  label: {
    padding({ iconLeft, prefix, position, variant, isFocused, value }) {
      if (variant !== 'filled' && (iconLeft || prefix) && !isFocused && !isDefined(value)) {
        return [0, 0, 0, 3];
      } else if (position === 'left') {
        return [1, 0.75, 1, 0.75];
      }
      return [0, 0, 0, 0];
    },
    top({ isFocused, variant, value }) {
      if (isDefined(value) || isFocused || variant === 'filled') {
        return '-4px';
      }
      return '14px';
    },
  },
};

const FloatView = styled(View)`
  will-change: transform;
  transition: transform 0.1s ease-in;
  transform: translateY(35px);
  pointer-events: none;
  ${(props) =>
    props.isFocused &&
    css`
      transform: translateY(10px);
    `}
`;

const StyledText = styled(Text)`
  font-family: ${styles.text.fontFamily};
  font-size: ${styles.text.fontSize};
  line-height: ${styles.text.lineHeight};
  color: ${styles.text.color};
`;

const Label = ({
  children,
  position,
  disabled,
  iconLeft,
  prefix,
  animated,
  isFocused,
  hasError,
  variant,
  value,
}) => {
  return (
    <Space
      padding={styles.label.padding({
        position,
        isFocused,
        iconLeft,
        prefix,
        variant,
        value,
      })}
    >
      {animated ? (
        <FloatView isFocused={isFocused}>
          <StyledText
            as="label"
            htmlFor={children}
            size="medium"
            isFocused={isFocused}
            hasError={hasError}
            disabled={disabled}
            variant={variant}
            value={value}
          >
            {children}
          </StyledText>
        </FloatView>
      ) : (
        <StyledText
          as="label"
          size="medium"
          hasError={hasError}
          disabled={disabled}
          variant={variant}
          value={value}
        >
          {children}
        </StyledText>
      )}
    </Space>
  );
};

Label.propTypes = {
  children: PropTypes.string,
  position: PropTypes.oneOf(['top', 'left']).isRequired,
  disabled: PropTypes.bool,
  animated: PropTypes.bool,
  isFocused: PropTypes.bool,
  variant: PropTypes.oneOf(['outlined', 'filled']).isRequired,
  iconLeft: PropTypes.string,
  prefix: PropTypes.string,
  hasError: PropTypes.bool,
  value: PropTypes.string,
};

Label.defaultProps = {
  children: 'Label',
  disabled: false,
  animated: false,
  value: undefined,
};

export default Label;
